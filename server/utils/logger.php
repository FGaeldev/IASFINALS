<?php

/**
 * @file utils/logger.php
 * @description Login attempt audit logging utility.
 *
 * Records every login attempt — successful or failed — in the `login_logs` table.
 * Used by AuthController to maintain a full audit trail of authentication events,
 * including failed attempts that contribute to brute-force lockout.
 *
 * Database table: login_logs
 *   l_user_id         — Foreign key to users.u_id (NULL if email not found)
 *   l_email_attempted — The email submitted in the login attempt
 *   l_success         — 1 for success, 0 for failure
 *   l_ip_address      — Client IP address from REMOTE_ADDR
 *   l_created_at      — Auto-set timestamp
 *
 * @note l_user_id may be NULL when the submitted email does not match any account.
 *       This is intentional — the attempt is still logged for security monitoring.
 *
 * @deprecated Direct usage of this function is superseded by LogModel::logAttempt()
 *             in the MVC-lite architecture. This file is retained for compatibility.
 */

/**
 * Inserts a login attempt record into login_logs.
 *
 * @param  mysqli   $conn     Active database connection.
 * @param  int|null $user_id  ID of the matched user, or NULL if email not found.
 * @param  string   $email    Email address that was submitted.
 * @param  int      $success  1 if login succeeded, 0 if it failed.
 * @return void
 */
function log_attempt($conn, $user_id, $email, $success)
{
    $ip = $_SERVER['REMOTE_ADDR'];

    $stmt = $conn->prepare("
        INSERT INTO login_logs (l_user_id, l_email_attempted, l_success, l_ip_address)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("isis", $user_id, $email, $success, $ip);
    $stmt->execute();
}