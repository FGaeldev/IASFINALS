<?php

/**
 * @file utils/session_logger.php
 * @description Session lifecycle logging utilities.
 *
 * Records session start and end events in the `session_logs` table,
 * providing an audit trail of all user authentication sessions.
 *
 * Called by AuthController after successful 2FA completion (start)
 * and on logout (end).
 *
 * Database table: session_logs
 *   s_user_id    — Foreign key to users.u_id
 *   s_session_id — PHP session ID (regenerated on login for security)
 *   s_login_time — Timestamp when session was created
 *   s_logout_time — Timestamp when session ended (NULL if still active)
 */

require_once __DIR__ . "/../config/db.php";

/**
 * Records a new session start in session_logs and regenerates the session ID.
 *
 * session_regenerate_id(true) is called here to prevent session fixation attacks —
 * the old session ID is destroyed and a new one is issued after successful login.
 * This must be called after $_SESSION["user_id"] and $_SESSION["role"] are set.
 *
 * @param  int    $userId  The authenticated user's ID.
 * @return string          The new session ID after regeneration.
 */
function logSessionStart($userId)
{
    global $conn;

    // Regenerate session ID to prevent session fixation
    session_regenerate_id(true);
    $sessionId = session_id();

    $stmt = $conn->prepare("
        INSERT INTO session_logs (s_user_id, s_session_id, s_login_time)
        VALUES (?, ?, NOW())
    ");
    $stmt->bind_param("is", $userId, $sessionId);
    $stmt->execute();

    return $sessionId;
}

/**
 * Records the session end time for the current session in session_logs.
 * Matches on both user ID and session ID to ensure only the current
 * active session is closed — not all sessions for the user.
 *
 * Called by AuthController::logout() before session_destroy().
 *
 * @param  int  $userId  The authenticated user's ID.
 * @return void
 */
function logSessionEnd($userId)
{
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