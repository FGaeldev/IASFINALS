<?php
function log_attempt($conn, $user_id, $email, $success) {
    $ip = $_SERVER['REMOTE_ADDR'];

    $stmt = $conn->prepare("
        INSERT INTO login_logs (l_user_id, l_email_attempted, l_success, l_ip_address)
        VALUES (?, ?, ?, ?)
    ");

    $stmt->bind_param("isis", $user_id, $email, $success, $ip);
    $stmt->execute();
}