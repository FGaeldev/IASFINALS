<?php

class LogModel
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function logAttempt($userId, $email, $success)
    {
        $ip = $_SERVER["REMOTE_ADDR"] ?? "unknown";
        $stmt = $this->conn->prepare("
            INSERT INTO login_logs (l_user_id, l_email_attempted, l_success, l_ip_address)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param("isis", $userId, $email, $success, $ip);
        $stmt->execute();
    }

    public function getLoginLogs()
    {
        $result = $this->conn->query("
            SELECT l_id, l_user_id, l_email_attempted, l_success, l_ip_address, l_created_at
            FROM login_logs ORDER BY l_created_at DESC LIMIT 50
        ");
        $logs = [];
        while ($row = $result->fetch_assoc())
            $logs[] = $row;
        return $logs;
    }

    public function getSessionLogs()
    {
        $result = $this->conn->query("
            SELECT s.s_id, u.u_email, s.s_session_id, s.s_login_time, s.s_logout_time
            FROM session_logs s
            JOIN users u ON s.s_user_id = u.u_id
            ORDER BY s.s_login_time DESC LIMIT 50
        ");
        $logs = [];
        while ($row = $result->fetch_assoc())
            $logs[] = $row;
        return $logs;
    }
}