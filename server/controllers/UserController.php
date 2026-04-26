<?php

/**
 * @file controllers/UserController.php
 * @description Handles profile and account management actions for authenticated users.
 *
 * All methods require an active session. Accessible by both "user" and "admin" roles
 * unless otherwise noted.
 *
 * Actions handled:
 *   profile, getSecurityQuestion, update2fa, changePassword
 */

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../utils/password.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../middleware/auth.php";

class UserController
{
    /** @var UserModel */
    private $users;

    /**
     * @param mysqli $conn  Active MySQLi connection from index.php.
     */
    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
    }

    /**
     * Returns the current user's profile data.
     * Sensitive fields (password hash, security answer hash) are intentionally excluded.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function getProfile()
    {
        require_auth();
        $user = $this->users->findById($_SESSION["user_id"]);
        json_response(true, "OK", [
            "u_email" => $user["u_email"],
            "u_security_question" => $user["u_security_question"],
            "u_security_hint" => $user["u_security_hint"],
        ]);
    }

    /**
     * Returns the security question and hint for the currently pending user.
     * Requires a pending_user session (set after Step 1 of login).
     * Used to populate the 2FA page before the user submits their answer.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function getSecurityQuestion()
    {
        require_pending_auth();
        $user = $this->users->findById($_SESSION["pending_user"]);
        if (!$user)
            return json_response(false, "User not found");
        json_response(true, "OK", [
            "question" => $user["u_security_question"],
            "hint" => $user["u_security_hint"],
        ]);
    }

    /**
     * Updates the current user's security question, answer, and hint.
     * The new answer is hashed before storage.
     * Both question and answer are required — hint is optional.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function update2fa()
    {
        require_auth();
        $data = json_decode(file_get_contents("php://input"), true);
        $question = $data["security_question"] ?? "";
        $answer = $data["security_answer"] ?? "";
        $hint = $data["security_hint"] ?? "";

        if (!$question || !$answer) {
            return json_response(false, "Question and answer required");
        }

        $this->users->updateSecurityQuestion(
            $_SESSION["user_id"],
            $question,
            hash_password($answer),
            $hint
        );

        json_response(true, "Security question updated");
    }

    /**
     * Changes the current user's password.
     *
     * Validation steps (in order):
     *   1. All three fields required (current, new, confirm)
     *   2. New password and confirmation must match
     *   3. New password must meet strength requirements (same policy as signup)
     *   4. Current password must verify against the stored hash
     *
     * The new password is hashed before storage.
     * Current password verification prevents unauthorized changes
     * if a session is somehow compromised.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function changePassword()
    {
        require_auth();
        $data = json_decode(file_get_contents("php://input"), true);
        $current = $data["current_password"] ?? "";
        $newPassword = $data["new_password"] ?? "";
        $confirm = $data["confirm_password"] ?? "";

        if (!$current || !$newPassword || !$confirm) {
            return json_response(false, "All fields required");
        }

        if ($newPassword !== $confirm) {
            return json_response(false, "Passwords do not match");
        }

        // Enforce strength policy — backend validates independently of frontend meter
        $pw_errors = password_errors($newPassword);
        if (!empty($pw_errors)) {
            return json_response(false, implode(" ", $pw_errors));
        }

        // Verify current password before allowing the change
        $user = $this->users->findById($_SESSION["user_id"]);
        if (!verify_password($current, $user["u_password"])) {
            return json_response(false, "Current password is incorrect");
        }

        $this->users->updatePassword($_SESSION["user_id"], hash_password($newPassword));
        json_response(true, "Password changed successfully");
    }
}