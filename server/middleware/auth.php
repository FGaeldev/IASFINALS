<?php

/**
 * @file middleware/auth.php
 * @description Session-based authentication and authorization middleware.
 *
 * Provides guard functions that must be called at the top of any protected
 * controller method. Each function terminates the response immediately
 * (via json_response + exit) if the check fails — no further code runs.
 *
 * Session keys used:
 *   $_SESSION["user_id"]      — Set after full login (both steps complete)
 *   $_SESSION["role"]         — User role: "user" or "admin"
 *   $_SESSION["pending_user"] — Set after Step 1 (password verified, 2FA pending)
 *
 * @note Must be included after session_start() has been called (handled by index.php).
 */

require_once "./utils/response.php";

/**
 * Verifies that a fully authenticated session exists.
 * Terminates with 401-equivalent JSON response if no session found.
 *
 * Call at the top of any endpoint that requires the user to be logged in.
 *
 * @return void
 */
function require_auth()
{
    if (!isset($_SESSION["user_id"])) {
        json_response(false, "Unauthorized access");
    }
}

/**
 * Verifies that the authenticated user holds the required role.
 * Calls require_auth() first — unauthenticated requests are rejected before role check.
 * Terminates with 403-equivalent JSON response if role does not match.
 *
 * Call at the top of any admin-only endpoint.
 *
 * @param string $role  Required role (e.g. "admin")
 * @return void
 */
function require_role($role)
{
    require_auth();

    if (!isset($_SESSION["role"]) || $_SESSION["role"] !== $role) {
        json_response(false, "Forbidden: insufficient permissions");
    }
}

/**
 * Verifies that a pending 2FA session exists.
 * Used to guard the security question verification endpoint —
 * ensures the user has completed Step 1 (password) before accessing Step 2.
 *
 * Terminates with JSON error if no pending session is found.
 *
 * @return void
 */
function require_pending_auth()
{
    if (!isset($_SESSION["pending_user"])) {
        json_response(false, "No pending authentication step");
    }
}