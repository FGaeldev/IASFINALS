<?php

/**
 * @file controllers/AuthController.php
 * @description Handles all authentication-related HTTP actions.
 *
 * Manages the two-step login flow, user registration, session lifecycle,
 * and identity verification. Coordinates between UserModel, LogModel,
 * password utilities, and session logger.
 *
 * Two-step login flow:
 *   Step 1: login()     — verify email + password → set $_SESSION["pending_user"]
 *   Step 2: verify2fa() — verify security answer  → promote to full session
 *
 * Actions handled:
 *   login, signup, verify2fa, me, logout
 */

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../models/LogModel.php";
require_once __DIR__ . "/../utils/password.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../utils/session_logger.php";
require_once __DIR__ . "/../middleware/auth.php";

class AuthController
{
    /** @var UserModel */
    private $users;

    /** @var LogModel */
    private $logs;

    /**
     * @param mysqli $conn  Active MySQLi connection from index.php.
     */
    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
        $this->logs  = new LogModel($conn);
    }

    /**
     * Step 1 of login — verifies email and password.
     *
     * On success: resets failed attempts, sets $_SESSION["pending_user"],
     * logs the attempt, and returns success. Does NOT fully authenticate.
     *
     * On failure:
     *   - User not found  → logs null attempt, returns generic error
     *   - Account locked  → returns lockout message
     *   - Wrong password  → increments failed attempts, locks if threshold reached,
     *                        logs failed attempt, returns generic error
     *
     * Generic error message ("Incorrect email or password") is intentional —
     * prevents user enumeration by not distinguishing between wrong email vs wrong password.
     *
     * Lockout threshold: 3 consecutive failures → 60-second lock.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function login()
    {
        $data     = json_decode(file_get_contents("php://input"), true);
        $email    = $data["email"]    ?? "";
        $password = $data["password"] ?? "";

        if (!$email || !$password) {
            return json_response(false, "Missing credentials");
        }

        $user = $this->users->findByEmail($email);

        if (!$user) {
            $this->logs->logAttempt(null, $email, 0);
            return json_response(false, "Incorrect email or password");
        }

        if ($user["u_lock_until"] && strtotime($user["u_lock_until"]) > time()) {
            return json_response(false, "Account locked. Try again later.");
        }

        if (!verify_password($password, $user["u_password"])) {
            $failed    = $user["u_failed_attempts"] + 1;
            $lockUntil = null;

            // Lock account for 60 seconds after 3 consecutive failures
            if ($failed >= 3) {
                $lockUntil = date("Y-m-d H:i:s", time() + 60);
                $failed    = 0; // Reset counter — next cycle starts fresh after lockout
            }

            $this->users->incrementFailedAttempts($user["u_id"], $failed, $lockUntil);
            $this->logs->logAttempt($user["u_id"], $email, 0);
            return json_response(false, "Incorrect email or password");
        }

        // Password verified — reset lockout state and advance to 2FA step
        $this->users->resetFailedAttempts($user["u_id"]);
        $_SESSION["pending_user"] = $user["u_id"];
        $this->logs->logAttempt($user["u_id"], $email, 0);

        return json_response(true, "Password verified. Proceed to security question.");
    }

    /**
     * Registers a new user account.
     *
     * Validates required fields, enforces password strength policy,
     * hashes password and security answer, then inserts the user.
     * New accounts are assigned the "user" role by default (enforced at DB level).
     *
     * @return void  Outputs JSON response and exits.
     */
    public function signup()
    {
        $data     = json_decode(file_get_contents("php://input"), true);
        $email    = $data["email"]             ?? "";
        $password = $data["password"]          ?? "";
        $question = $data["security_question"] ?? "";
        $answer   = $data["security_answer"]   ?? "";
        $hint     = $data["security_hint"]     ?? "";

        if (!$email || !$password || !$question || !$answer) {
            return json_response(false, "Missing fields");
        }

        // Backend password validation — enforced independently of frontend strength meter
        $pw_errors = password_errors($password);
        if (!empty($pw_errors)) {
            return json_response(false, implode(" ", $pw_errors));
        }

        $created = $this->users->create(
            $email,
            hash_password($password),
            $question,
            hash_password($answer),
            $hint
        );

        return $created
            ? json_response(true, "User created")
            : json_response(false, "Signup failed");
    }

    /**
     * Step 2 of login — verifies the security question answer.
     *
     * Requires an active pending_user session (set by login()).
     * On success:
     *   - Closes all prior active sessions (concurrent session enforcement)
     *   - Promotes session to fully authenticated
     *   - Logs the new session via logSessionStart()
     *   - Clears pending_user from session
     *   - Returns the user's role for client-side redirect
     *
     * @return void  Outputs JSON response and exits.
     */
    public function verify2fa()
    {
        require_pending_auth();

        $data   = json_decode(file_get_contents("php://input"), true);
        $answer = $data["answer"] ?? "";

        $user = $this->users->findById($_SESSION["pending_user"]);
        if (!$user) return json_response(false, "User not found");

        if (!verify_password($answer, $user["u_security_answer"])) {
            return json_response(false, "Incorrect security answer");
        }

        // Enforce one-active-session-per-user policy before creating new session
        $this->users->closeActiveSessions($user["u_id"]);

        // Promote session to fully authenticated
        $_SESSION["user_id"] = $user["u_id"];
        $_SESSION["role"]    = $user["u_role"];

        logSessionStart($user["u_id"]); // Regenerates session ID (prevents session fixation)
        unset($_SESSION["pending_user"]);

        return json_response(true, "2FA success", ["role" => $user["u_role"]]);
    }

    /**
     * Returns the current user's ID and role from the active session.
     * Used by the frontend useAuth hook to verify session state and
     * determine which routes to render.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function me()
    {
        require_auth();
        $user = $this->users->findById($_SESSION["user_id"]);
        json_response(true, "OK", [
            "id"   => $_SESSION["user_id"],
            "role" => $user["u_role"],
        ]);
    }

    /**
     * Logs out the current user.
     * Records session end time in session_logs, then destroys the session.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function logout()
    {
        require_auth();
        logSessionEnd($_SESSION["user_id"]);
        session_destroy();
        json_response(true, "Logged out");
    }
}