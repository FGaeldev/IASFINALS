<?php

require_once "./config/db.php";
require_once "./utils/response.php";
require_once "./middleware/auth.php";

// ---------------- USERS ----------------
function get_users()
{
    require_role("admin");
    global $conn;

    $result = $conn->query("
        SELECT u_id, u_email, u_role, u_created_at
        FROM users
    ");

    $users = [];

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    json_response(true, "Users fetched", $users);
}

// ---------------- LOGIN LOGS ----------------
function get_login_logs()
{
    require_role("admin");
    global $conn;

    $result = $conn->query("
        SELECT l_id, l_user_id, l_email_attempted, l_success, l_ip_address, l_created_at
        FROM login_logs
        ORDER BY l_created_at DESC
        LIMIT 50
    ");

    $logs = [];

    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    json_response(true, "Logs fetched", $logs);
}

// ---------------- SESSION LOGS ----------------
function get_session_logs()
{
    require_role("admin");
    global $conn;

    $result = $conn->query("
    SELECT 
        s.s_id,
        u.u_email,
        s.s_session_id,
        s.s_login_time,
        s.s_logout_time
    FROM session_logs s
    JOIN users u ON s.s_user_id = u.u_id
    ORDER BY s.s_login_time DESC
    LIMIT 50
");

    $logs = [];

    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }

    json_response(true, "Session logs fetched", $logs);
}