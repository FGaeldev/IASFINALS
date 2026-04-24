<?php

$host = "localhost";
$user = "u945996889_esmeralda";
$pass = "AugustaEsmeralda123!";
$db   = "u945996889_ias_esmeralda";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "DB connection failed"
    ]));
}