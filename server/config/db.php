<?php

$envFile = __DIR__ . "/../../.env";
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
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
    die(json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]));
}