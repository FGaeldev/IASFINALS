<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "./routes/auth.php";
require_once "./routes/admin.php";

$action = $_GET['action'] ?? '';

switch ($action) {
    case "login":
        login();
        break;
    case "verify2fa":
        verify_security_question();
        break;
    case "signup":
        signup();
        break;
    case "getSecurityQuestion":
        get_security_question();
        break;
    case "me":
        me();
        break;
    case "logout":
        logout();
        break;
    case "users":
        get_users();
        break;
    case "loginLogs":
        get_login_logs();
        break;
    case "sessionLogs":
        get_session_logs();
        break;
    case "updateRole":
        update_role();
        break;
    case "deleteUser":
        delete_user();
        break;
    default:
        echo json_encode(["success" => false, "message" => "Invalid route"]);
}