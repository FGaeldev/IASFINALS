<?php

class UserModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function findByEmail($email)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE u_email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function findById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE u_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function create($email, $hashedPassword, $question, $hashedAnswer, $hint)
    {
        $stmt = $this->conn->prepare("
            INSERT INTO users (u_email, u_password, u_role, u_security_question, u_security_answer, u_security_hint)
            VALUES (?, ?, 'user', ?, ?, ?)
        ");
        $stmt->bind_param("sssss", $email, $hashedPassword, $question, $hashedAnswer, $hint);
        return $stmt->execute();
    }

    public function resetFailedAttempts($id)
    {
        $stmt = $this->conn->prepare("
            UPDATE users SET u_failed_attempts = 0, u_lock_until = NULL WHERE u_id = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }

    public function incrementFailedAttempts($id, $failed, $lockUntil)
    {
        $stmt = $this->conn->prepare("
            UPDATE users SET u_failed_attempts = ?, u_lock_until = ? WHERE u_id = ?
        ");
        $stmt->bind_param("isi", $failed, $lockUntil, $id);
        $stmt->execute();
    }

    public function updateSecurityQuestion($id, $question, $hashedAnswer, $hint)
    {
        $stmt = $this->conn->prepare("
            UPDATE users SET u_security_question = ?, u_security_answer = ?, u_security_hint = ?
            WHERE u_id = ?
        ");
        $stmt->bind_param("sssi", $question, $hashedAnswer, $hint, $id);
        $stmt->execute();
    }

    public function updateRole($id, $role)
    {
        $stmt = $this->conn->prepare("UPDATE users SET u_role = ? WHERE u_id = ?");
        $stmt->bind_param("si", $role, $id);
        $stmt->execute();
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM users WHERE u_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }

    public function getAll()
    {
        $result = $this->conn->query("SELECT u_id, u_email, u_role, u_created_at FROM users");
        $users = [];
        while ($row = $result->fetch_assoc())
            $users[] = $row;
        return $users;
    }

    public function closeActiveSessions($id)
    {
        $stmt = $this->conn->prepare("
            UPDATE session_logs SET s_logout_time = NOW()
            WHERE s_user_id = ? AND s_logout_time IS NULL
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }

    public function updatePassword($id, $hashedPassword)
    {
        $stmt = $this->conn->prepare("UPDATE users SET u_password = ? WHERE u_id = ?");
        $stmt->bind_param("si", $hashedPassword, $id);
        $stmt->execute();
    }
}