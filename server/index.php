<?php

/**
 * @file index.php
 * @description Application entry point and HTTP router.
 *
 * All frontend API requests target this file via query parameter:
 *   GET/POST /server/index.php?action=<action>
 *
 * Responsibilities:
 *   - Start and configure the PHP session with secure cookie flags
 *   - Set CORS and response headers
 *   - Handle OPTIONS preflight requests (required for credentialed cross-origin requests)
 *   - Instantiate controllers with the shared DB connection
 *   - Dispatch the incoming action to the appropriate controller method
 *
 * Session cookie security flags:
 *   - cookie_secure:   Cookie only sent over HTTPS
 *   - cookie_httponly: Cookie inaccessible to JavaScript (prevents XSS token theft)
 *   - cookie_samesite: Strict — cookie not sent on cross-site requests (prevents CSRF)
 *
 * @note Update Access-Control-Allow-Origin to the production domain before deploying.
 */

ini_set('session.cookie_secure', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Strict');

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://ventura.augusta2026.online"); // TODO: always update for production
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle CORS preflight — browsers send OPTIONS before credentialed POST requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/config/db.php";
require_once __DIR__ . "/controllers/AuthController.php";
require_once __DIR__ . "/controllers/UserController.php";
require_once __DIR__ . "/controllers/AdminController.php";

// Instantiate controllers — each receives the shared MySQLi connection
$auth = new AuthController($conn);
$user = new UserController($conn);
$admin = new AdminController($conn);

$action = $_GET["action"] ?? "";

/**
 * Route map:
 *
 * AUTH (public + pending session)
 *   login                → AuthController::login()
 *   signup               → AuthController::signup()
 *   verify2fa            → AuthController::verify2fa()
 *   me                   → AuthController::me()
 *   logout               → AuthController::logout()
 *
 * USER (requires active session)
 *   profile              → UserController::getProfile()
 *   getSecurityQuestion  → UserController::getSecurityQuestion()
 *   update2fa            → UserController::update2fa()
 *   changePassword       → UserController::changePassword()
 *
 * ADMIN (requires admin role)
 *   users                → AdminController::getUsers()
 *   loginLogs            → AdminController::getLoginLogs()
 *   sessionLogs          → AdminController::getSessionLogs()
 *   updateRole           → AdminController::updateRole()
 *   deleteUser           → AdminController::deleteUser()
 */
switch ($action) {
    // ── Auth ──────────────────────────────────────────────────
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

    // ── User / Profile ────────────────────────────────────────
    case "profile":
        $user->getProfile();
        break;
    case "getSecurityQuestion":
        $user->getSecurityQuestion();
        break;
    case "update2fa":
        $user->update2fa();
        break;
    case "changePassword":
        $user->changePassword();
        break;

    // ── Admin ─────────────────────────────────────────────────
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