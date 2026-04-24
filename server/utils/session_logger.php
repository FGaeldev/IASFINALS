<?php
require_once __DIR__ . "/../config/db.php";

function logSessionStart($userId) {
    global $conn;

    session_regenerate_id(true); // IMPORTANT security step
    $sessionId = session_id();

    $stmt = $conn->prepare("
        INSERT INTO session_logs (s_user_id, s_session_id, s_login_time)
        VALUES (?, ?, NOW())
    ");

    $stmt->bind_param("is", $userId, $sessionId);
    $stmt->execute();

    return $sessionId;
}

function logSessionEnd($userId) {
    global $conn;

    $sessionId = session_id();

    $stmt = $conn->prepare("
        UPDATE session_logs
        SET s_logout_time = NOW()
        WHERE s_user_id = ?
        AND s_session_id = ?
        AND s_logout_time IS NULL
    ");

    $stmt->bind_param("is", $userId, $sessionId);
    $stmt->execute();
}