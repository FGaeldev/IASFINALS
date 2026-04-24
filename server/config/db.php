<?php

$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_ias_esmeralda";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]));
}