<?php

function hash_password($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}

function verify_password($password, $hash)
{
    return password_verify($password, $hash);
}

function is_strong_password($password)
{
    return strlen($password) >= 8
        && preg_match('/[A-Z]/', $password)
        && preg_match('/[a-z]/', $password)
        && preg_match('/[0-9]/', $password)
        && preg_match('/[\W_]/', $password);
}

function password_errors($password)
{
    $errors = [];
    if (strlen($password) < 8)
        $errors[] = "Min 8 characters.";
    if (!preg_match('/[A-Z]/', $password))
        $errors[] = "Need uppercase letter.";
    if (!preg_match('/[a-z]/', $password))
        $errors[] = "Need lowercase letter.";
    if (!preg_match('/[0-9]/', $password))
        $errors[] = "Need number.";
    if (!preg_match('/[\W_]/', $password))
        $errors[] = "Need special character (!@#$...).";
    return $errors;
}