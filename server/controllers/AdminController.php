<?php

require_once __DIR__ . "/../models/UserModel.php";
require_once __DIR__ . "/../models/LogModel.php";
require_once __DIR__ . "/../utils/response.php";
require_once __DIR__ . "/../middleware/auth.php";

class AdminController
{
    private $users;
    private $logs;

    public function __construct($conn)
    {
        $this->users = new UserModel($conn);
        $this->logs = new LogModel($conn);
    }

    public function getUsers()
    {
        require_role("admin");
        json_response(true, "Users fetched", $this->users->getAll());
    }

    public function getLoginLogs()
    {
        require_role("admin");
        json_response(true, "Logs fetched", $this->logs->getLoginLogs());
    }

    public function getSessionLogs()
    {
        require_role("admin");
        json_response(true, "Session logs fetched", $this->logs->getSessionLogs());
    }

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