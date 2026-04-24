<?php

// Must be included after session_start()

require_once "./utils/response.php";

// -----------------------------
// AUTH CHECK (logged in user)
// -----------------------------
function require_auth() {
    if (!isset($_SESSION["user_id"])) {
        json_response(false, "Unauthorized access");
    }
}

// -----------------------------
// ROLE CHECK (RBAC)
// -----------------------------
function require_role($role) {
    require_auth();

    if (!isset($_SESSION["role"]) || $_SESSION["role"] !== $role) {
        json_response(false, "Forbidden: insufficient permissions");
    }
}

// -----------------------------
// 2FA PENDING CHECK
// -----------------------------
function require_pending_auth() {
    if (!isset($_SESSION["pending_user"])) {
        json_response(false, "No pending authentication step");
    }
}