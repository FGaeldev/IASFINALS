<?php

/**
 * @file models/LogModel.php
 * @description Data access layer for audit log tables.
 *
 * Encapsulates all database queries related to login attempt logs
 * and session logs. Provides both write (logAttempt) and read
 * (getLoginLogs, getSessionLogs) operations for the admin panel.
 *
 * Database tables:
 *
 *   login_logs
 *     l_id               — Primary key
 *     l_user_id          — Foreign key to users.u_id (nullable)
 *     l_email_attempted  — Email submitted in the attempt
 *     l_success          — 1 = success, 0 = failure
 *     l_ip_address       — Client IP address
 *     l_created_at       — Auto-set timestamp
 *
 *   session_logs
 *     s_id               — Primary key
 *     s_user_id          — Foreign key to users.u_id
 *     s_session_id       — PHP session ID
 *     s_login_time       — Session start timestamp
 *     s_logout_time      — Session end timestamp (NULL if still active)
 */
class LogModel
{
    /** @var mysqli Active database connection */
    private $conn;

    /**
     * @param mysqli $conn  Active MySQLi connection passed from index.php.
     */
    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    /**
     * Records a login attempt in login_logs.
     * Called on every login attempt — both successful and failed.
     * When the submitted email does not match any user, $userId should be null.
     *
     * @param  int|null $userId   Matched user's ID, or null if email not found.
     * @param  string   $email    Email address submitted in the attempt.
     * @param  int      $success  1 if attempt succeeded, 0 if it failed.
     * @return void
     */
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

    /**
     * Retrieves the 50 most recent login attempts, ordered by timestamp descending.
     * Used by AdminController to populate the login logs panel.
     *
     * @return array[] Array of login_logs rows.
     */
    public function getLoginLogs()
    {
        $result = $this->conn->query("
            SELECT l_id, l_user_id, l_email_attempted, l_success, l_ip_address, l_created_at
            FROM login_logs
            ORDER BY l_created_at DESC
            LIMIT 50
        ");
        $logs = [];
        while ($row = $result->fetch_assoc())
            $logs[] = $row;
        return $logs;
    }

    /**
     * Retrieves the 50 most recent sessions with the associated user email,
     * ordered by login time descending. Joins session_logs with users.
     * Used by AdminController to populate the session logs panel.
     *
     * @return array[] Array of session rows including u_email from the users join.
     */
    public function getSessionLogs()
    {
        $result = $this->conn->query("
            SELECT s.s_id, u.u_email, s.s_session_id, s.s_login_time, s.s_logout_time
            FROM session_logs s
            JOIN users u ON s.s_user_id = u.u_id
            ORDER BY s.s_login_time DESC
            LIMIT 50
        ");
        $logs = [];
        while ($row = $result->fetch_assoc())
            $logs[] = $row;
        return $logs;
    }
}