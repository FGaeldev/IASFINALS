<?php

function hash_password($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

function is_strong_password($password) {
    // Basic policy (you can expand later)
    return strlen($password) >= 8;
}