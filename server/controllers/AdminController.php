<?php

/**
 * @file controllers/AdminController.php
 * @description Handles administrative actions. All methods require the "admin" role.
 *
 * Provides user management (list, role update, delete) and audit log
 * retrieval (login logs, session logs) for the admin panel.
 *
 * All endpoints call require_role("admin") before any logic runs —
 * non-admin sessions are rejected at the middleware level.
 *
 * Actions handled:
 *   users, loginLogs, sessionLogs, updateRole, deleteUser
 */

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../models/LogModel.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../middleware/auth.php";

class AdminController
{
    /** @var UserModel */
    private $users;

    /** @var LogModel */
    private $logs;

    /**
     * @param mysqli $conn  Active MySQLi connection from index.php.
     */
    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
        $this->logs = new LogModel($conn);
    }

    /**
     * Returns all registered users with safe fields only.
     * Password and security answer hashes are excluded by UserModel::getAll().
     *
     * @return void  Outputs JSON response and exits.
     */
    public function getUsers()
    {
        require_role("admin");
        json_response(true, "Users fetched", $this->users->getAll());
    }

    /**
     * Returns the 50 most recent login attempts ordered by timestamp descending.
     * Includes both successful and failed attempts with IP address.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function getLoginLogs()
    {
        require_role("admin");
        json_response(true, "Logs fetched", $this->logs->getLoginLogs());
    }

    /**
     * Returns the 50 most recent sessions ordered by login time descending.
     * Joins session_logs with users to include the email address.
     *
     * @return void  Outputs JSON response and exits.
     */
    public function getSessionLogs()
    {
        require_role("admin");
        json_response(true, "Session logs fetched", $this->logs->getSessionLogs());
    }

    /**
     * Updates the role of a target user.
     *
     * Safeguards:
     *   - Role value must be in whitelist ["user", "admin"]
     *   - Admin cannot change their own role (prevents self-demotion)
     *
     * @return void  Outputs JSON response and exits.
     */
    public function updateRole()
    {
        require_role("admin");
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"] ?? null;
        $role = $data["role"] ?? null;

        if (!$id || !in_array($role, ["user", "admin"])) {
            return json_response(false, "Invalid input");
        }
        if ($id == $_SESSION["user_id"]) {
            return json_response(false, "Cannot change own role");
        }

        $this->users->updateRole($id, $role);
        json_response(true, "Role updated");
    }

    /**
     * Permanently deletes a user account. This action is irreversible.
     *
     * Safeguards:
     *   - Admin cannot delete their own account
     *
     * @return void  Outputs JSON response and exits.
     */
    public function deleteUser()
    {
        require_role("admin");
        $data = json_decode(file_get_contents("php://input"), true);
        $id = $data["id"] ?? null;

        if (!$id)
            return json_response(false, "Missing ID");
        if ($id == $_SESSION["user_id"]) {
            return json_response(false, "Cannot delete own account");
        }

        $this->users->delete($id);
        json_response(true, "User deleted");
    }
}