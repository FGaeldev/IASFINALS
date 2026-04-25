<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/config/db.php";
require_once __DIR__ . "/controllers/AuthController.php";
require_once __DIR__ . "/controllers/UserController.php";
require_once __DIR__ . "/controllers/AdminController.php";

$auth = new AuthController($conn);
$user = new UserController($conn);
$admin = new AdminController($conn);

$action = $_GET["action"] ?? "";

switch ($action) {
    case "login":
        $auth->login();
        break;
    case "signup":
        $auth->signup();
        break;
    case "verify2fa":
        $auth->verify2fa();
        break;
    case "me":
        $auth->me();
        break;
    case "logout":
        $auth->logout();
        break;

    case "profile":
        $user->getProfile();
        break;
    case "getSecurityQuestion":
        $user->getSecurityQuestion();
        break;
    case "update2fa":
        $user->update2fa();
        break;

    case "users":
        $admin->getUsers();
        break;
    case "loginLogs":
        $admin->getLoginLogs();
        break;
    case "sessionLogs":
        $admin->getSessionLogs();
        break;
    case "updateRole":
        $admin->updateRole();
        break;
    case "deleteUser":
        $admin->deleteUser();
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid route"]);
}