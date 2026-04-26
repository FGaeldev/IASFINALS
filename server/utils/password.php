<?php

/**
 * @file utils/password.php
 * @description Password hashing, verification, and strength validation utilities.
 *
 * All password storage uses bcrypt (PASSWORD_BCRYPT) via PHP's native
 * password_hash(). bcrypt is slow and salted by design — resistant to
 * brute-force and rainbow table attacks. The same functions are used
 * for both login passwords and security question answers.
 */

/**
 * Hashes a plaintext password using bcrypt.
 * Generates a unique salt automatically — identical inputs produce different hashes.
 *
 * @param  string $password  Plaintext password to hash.
 * @return string            Bcrypt hash string (includes algorithm, cost, and salt).
 */
function hash_password($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 *
 * @param  string $password  Plaintext password to verify.
 * @param  string $hash      Stored bcrypt hash from the database.
 * @return bool              True if the password matches the hash, false otherwise.
 */
function verify_password($password, $hash)
{
    return password_verify($password, $hash);
}

/**
 * Checks whether a password meets all strength requirements.
 * Returns true only if all rules pass.
 *
 * Rules: min 8 chars, uppercase, lowercase, digit, special character.
 *
 * @param  string $password  Plaintext password to check.
 * @return bool              True if password meets all requirements.
 */
function is_strong_password($password)
{
    return strlen($password) >= 8
        && preg_match('/[A-Z]/', $password)
        && preg_match('/[a-z]/', $password)
        && preg_match('/[0-9]/', $password)
        && preg_match('/[\W_]/', $password);
}

/**
 * Validates a password and returns an array of specific failure messages.
 * Returns an empty array if all rules pass.
 *
 * Used to provide granular feedback to the client on signup and password change.
 * Backend always validates independently of frontend strength meter.
 *
 * @param  string   $password  Plaintext password to validate.
 * @return string[]            Array of human-readable error messages (empty if valid).
 */
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