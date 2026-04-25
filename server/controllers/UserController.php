<?php

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../utils/password.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../middleware/auth.php";

class UserController
{
    private $users;

    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
    }

    public function getProfile()
    {
        require_auth();
        $user = $this->users->findById($_SESSION["user_id"]);
        json_response(true, "OK", [
            "u_email"             => $user["u_email"],
            "u_security_question" => $user["u_security_question"],
            "u_security_hint"     => $user["u_security_hint"],
        ]);
    }

    public function getSecurityQuestion()
    {
        require_pending_auth();
        $user = $this->users->findById($_SESSION["pending_user"]);
        if (!$user) return json_response(false, "User not found");
        json_response(true, "OK", [
            "question" => $user["u_security_question"],
            "hint"     => $user["u_security_hint"],
        ]);
    }

    public function update2fa()
    {
        require_auth();
        $data     = json_decode(file_get_contents("php://input"), true);
        $question = $data["security_question"] ?? "";
        $answer   = $data["security_answer"]   ?? "";
        $hint     = $data["security_hint"]     ?? "";

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
}