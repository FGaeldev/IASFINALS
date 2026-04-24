<?php
require_once "./config/db.php";
require_once "./utils/password.php";
require_once "./utils/response.php";
require_once "./utils/logger.php";
require_once "./middleware/auth.php";
require_once "./utils/session_logger.php";
/*
IMPORTANT:
fieldname naming convention:
u_* users
l_* login_logs
s_* sessions
*/

// ---------------- LOGIN ----------------
function login()
{
    global $conn;

    $data = json_decode(file_get_contents("php://input"), true);

    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    if (!$email || !$password) {
        return json_response(false, "Missing credentials");
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE u_email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // LOG: user not found
    if (!$user) {
        log_attempt($conn, null, $email, 0);  // null, not $user["u_id"]
        return json_response(false, "Incorrect email or password");
    }

    // CHECK LOCKOUT
    if ($user["u_lock_until"] && strtotime($user["u_lock_until"]) > time()) {
        return json_response(false, "Account locked. Try again later.");
    }

    // PASSWORD CHECK
    if (!verify_password($password, $user["u_password"])) {

        $failed = $user["u_failed_attempts"] + 1;
        $lockUntil = null;

        // if 3 or more attempts → lock 1 minute
        if ($failed >= 3) {
            $lockUntil = date("Y-m-d H:i:s", time() + 60);
            $failed = 0; // reset after lock
        }

        $update = $conn->prepare("
            UPDATE users 
            SET u_failed_attempts = ?, u_lock_until = ? 
            WHERE u_id = ?
        ");
        $update->bind_param("isi", $failed, $lockUntil, $user["u_id"]);
        $update->execute();

        log_attempt($conn, $user["u_id"], $email, 0);
        return json_response(false, "Incorrect email or password");
    }

    // SUCCESS LOGIN → reset security counters
    $reset = $conn->prepare("
        UPDATE users 
        SET u_failed_attempts = 0, u_lock_until = NULL 
        WHERE u_id = ?
    ");
    $reset->bind_param("i", $user["u_id"]);
    $reset->execute();

    // STEP 1 DONE → move to security question step
    $_SESSION["pending_user"] = $user["u_id"];

    log_attempt($conn, $user["u_id"], $email, 0);

    return json_response(true, "Password verified. Proceed to security question.");
}

// ---------------- SIGNUP ----------------
function signup()
{
    global $conn;

    $data = json_decode(file_get_contents("php://input"), true);

    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";
    $question = $data["security_question"] ?? "";
    $answer = $data["security_answer"] ?? "";
    $hint = $data["security_hint"] ?? "";

    if (!$email || !$password || !$question || !$answer) {
        return json_response(false, "Missing fields");
    }

    // ---- PASSWORD STRENGTH CHECK ----
    $pw_errors = password_errors($password);
    if (!empty($pw_errors)) {
        return json_response(false, implode(" ", $pw_errors));
    }
    // ---------------------------------

    $hashedPassword = hash_password($password);
    $hashedAnswer = hash_password($answer);

    $stmt = $conn->prepare("
        INSERT INTO users (u_email, u_password, u_role, u_security_question, u_security_answer, u_security_hint)
        VALUES (?, ?, 'user', ?, ?, ?)
    ");
    $stmt->bind_param("sssss", $email, $hashedPassword, $question, $hashedAnswer, $hint);

    if ($stmt->execute()) {
        return json_response(true, "User created");
    }

    return json_response(false, "Signup failed");
}

// ---------------- ME ----------------
function me()
{
    require_auth();
    global $conn;

    $user_id = $_SESSION["user_id"];

    $stmt = $conn->prepare("SELECT u_role FROM users WHERE u_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $user = $stmt->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $user_id,
            "role" => $user["u_role"]
        ]
    ]);
    exit();
}

// ---------------- LOGOUT ----------------
function logout()
{
    require_auth();

    if ($_SESSION["user_id"]) {
        logSessionEnd($_SESSION["user_id"]);
    }

    session_destroy();

    json_response(true, "Logged out");
}

// ---------------- 2FA VERIFY ----------------
function verify_security_question()
{
    require_pending_auth();

    global $conn;

    $data = json_decode(file_get_contents("php://input"), true);
    $answer = $data["answer"] ?? "";

    if (!isset($_SESSION["pending_user"])) {
        return json_response(false, "No pending authentication");
    }

    $user_id = $_SESSION["pending_user"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE u_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        return json_response(false, "User not found");
    }

    // verify security answer
    if (!verify_password($answer, $user["u_security_answer"])) {
        return json_response(false, "Incorrect security answer");
    }

    // FINAL LOGIN SUCCESS
    $_SESSION["user_id"] = $user["u_id"];
    $_SESSION["role"] = $user["u_role"];
    logSessionStart($user['u_id']);

    unset($_SESSION["pending_user"]);

    return json_response(true, "2FA success", [
        "role" => $user["u_role"]
    ]);
}

// ---------------- GET SECURITY QUESTION ----------------

function get_security_question()
{
    if (!isset($_SESSION["pending_user"])) {
        return json_response(false, "No pending authentication");
    }

    global $conn;
    $stmt = $conn->prepare("SELECT u_security_question, u_security_hint FROM users WHERE u_id = ?");
    $stmt->bind_param("i", $_SESSION["pending_user"]);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();

    if (!$user) {
        return json_response(false, "User not found");
    }

    return json_response(true, "OK", [
        "question" => $user["u_security_question"],
        "hint" => $user["u_security_hint"],
    ]);
}