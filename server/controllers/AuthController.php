<?php

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../models/LogModel.php";
require_once __DIR__ . "/../utils/password.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../utils/session_logger.php";
require_once __DIR__ . "/../middleware/auth.php";

class AuthController
{
    private $users;
    private $logs;

    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
        $this->logs = new LogModel($conn);
    }

    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data["email"] ?? "";
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
            $failed = $user["u_failed_attempts"] + 1;
            $lockUntil = null;
            if ($failed >= 3) {
                $lockUntil = date("Y-m-d H:i:s", time() + 60);
                $failed = 0;
            }
            $this->users->incrementFailedAttempts($user["u_id"], $failed, $lockUntil);
            $this->logs->logAttempt($user["u_id"], $email, 0);
            return json_response(false, "Incorrect email or password");
        }

        $this->users->resetFailedAttempts($user["u_id"]);
        $_SESSION["pending_user"] = $user["u_id"];
        $this->logs->logAttempt($user["u_id"], $email, 0);

        return json_response(true, "Password verified. Proceed to security question.");
    }

    public function signup()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data["email"] ?? "";
        $password = $data["password"] ?? "";
        $question = $data["security_question"] ?? "";
        $answer = $data["security_answer"] ?? "";
        $hint = $data["security_hint"] ?? "";

        if (!$email || !$password || !$question || !$answer) {
            return json_response(false, "Missing fields");
        }

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

    public function verify2fa()
    {
        require_pending_auth();

        $data = json_decode(file_get_contents("php://input"), true);
        $answer = $data["answer"] ?? "";

        $user = $this->users->findById($_SESSION["pending_user"]);

        if (!$user)
            return json_response(false, "User not found");

        if (!verify_password($answer, $user["u_security_answer"])) {
            return json_response(false, "Incorrect security answer");
        }

        $this->users->closeActiveSessions($user["u_id"]);

        $_SESSION["user_id"] = $user["u_id"];
        $_SESSION["role"] = $user["u_role"];

        logSessionStart($user["u_id"]);
        unset($_SESSION["pending_user"]);

        return json_response(true, "2FA success", ["role" => $user["u_role"]]);
    }

    public function me()
    {
        require_auth();
        $user = $this->users->findById($_SESSION["user_id"]);
        json_response(true, "OK", [
            "id" => $_SESSION["user_id"],
            "role" => $user["u_role"]
        ]);
    }

    public function logout()
    {
        require_auth();
        logSessionEnd($_SESSION["user_id"]);
        session_destroy();
        json_response(true, "Logged out");
    }
}