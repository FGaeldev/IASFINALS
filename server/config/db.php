<?php

/**
 * @file config/db.php
 * @description Database connection bootstrap.
 *
 * Loads environment variables from server/.env and establishes
 * a MySQLi connection. The $conn variable is made available globally
 * and injected into all controllers via index.php.
 *
 * Environment variables (defined in server/.env):
 *   DB_HOST  — Database hostname (usually "localhost")
 *   DB_USER  — Database username
 *   DB_PASS  — Database password
 *   DB_NAME  — Database name
 *
 * @note Never commit server/.env to version control.
 *       Use server/.env.example as a safe template.
 * @note Fallback values default to local XAMPP defaults for development only.
 */

$envFile = __DIR__ . "/../.env";

if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        // Skip comment lines
        if (str_starts_with(trim($line), '#'))
            continue;
        [$key, $value] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
    }
}

$conn = new mysqli(
    $_ENV["DB_HOST"] ?? "localhost",
    $_ENV["DB_USER"] ?? "root",
    $_ENV["DB_PASS"] ?? "",
    $_ENV["DB_NAME"] ?? ""
);

if ($conn->connect_error) {
    // Return JSON error instead of HTML to keep API response format consistent
    die(json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]));
}