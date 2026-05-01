/**
 * @file services/authService.js
 * @description API service layer for authentication and user management.
 *
 * All requests target the PHP backend via a single entry point (index.php).
 * Sessions are maintained server-side via HTTP-only cookies.
 * Every fetch includes `credentials: "include"` to send the session cookie
 * across the cross-origin boundary between Vite (5173) and XAMPP/Apache.
 *
 * @note Update API_URL before deploying to production.
 */

const API_URL = "https://ventura.augusta2026.online/server/index.php"; // TODO: always update for production

// ============================================================
// AUTH
// ============================================================

/**
 * Authenticates a user with email and password (Step 1 of 2FA flow).
 * On success, server sets a `pending_user` session — does NOT fully log in.
 * Client must call `verify2fa()` to complete authentication.
 *
 * @param {string} email    - User's email address.
 * @param {string} password - User's plaintext password.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function login(email, password) {
  const res = await fetch(`${API_URL}?action=login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

/**
 * Registers a new user account with role defaulting to `user`.
 * Password is validated server-side for strength requirements.
 * Security answer is hashed before storage.
 *
 * @param {Object} data
 * @param {string} data.email             - User's email address.
 * @param {string} data.password          - Plaintext password (min 8 chars, upper, lower, number, special).
 * @param {string} data.security_question - Custom security question for 2FA.
 * @param {string} data.security_answer   - Answer to the security question.
 * @param {string} [data.security_hint]   - Optional hint shown during 2FA.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function signup(data) {
  const res = await fetch(`${API_URL}?action=signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Verifies the security question answer (Step 2 of 2FA flow).
 * Requires an active `pending_user` session from a successful `login()` call.
 * On success, promotes session to fully authenticated and returns user role.
 * Also closes any previously active sessions (concurrent session enforcement).
 *
 * @param {string} answer - User's plaintext answer to their security question.
 * @returns {Promise<{success: boolean, message: string, data: {role: string}}>}
 */
export async function verify2fa(answer) {
  const res = await fetch(`${API_URL}?action=verify2fa`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  return res.json();
}

/**
 * Fetches the security question and hint for the currently pending user.
 * Requires an active `pending_user` session (i.e. after successful `login()`).
 * Used to display the question on the 2FA page before the user submits their answer.
 *
 * @returns {Promise<{success: boolean, data: {question: string, hint: string}}>}
 */
export async function getSecurityQuestion() {
  const res = await fetch(`${API_URL}?action=getSecurityQuestion`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Returns the authenticated user's ID and role from the active session.
 * Used by `useAuth` hook to determine access level and protect routes.
 * Returns `success: false` if no valid session exists.
 *
 * @returns {Promise<{success: boolean, data: {id: number, role: string}}>}
 */
export async function getMe() {
  const res = await fetch(`${API_URL}?action=me`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Logs out the authenticated user.
 * Records session end time in `session_logs`, then destroys the server-side session.
 *
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function logout() {
  const res = await fetch(`${API_URL}?action=logout`, {
    credentials: "include",
  });
  return res.json();
}

// ============================================================
// USER / PROFILE
// ============================================================

/**
 * Fetches the authenticated user's profile data.
 * Returns email, security question, and hint (answer is never returned).
 * Accessible by both `user` and `admin` roles.
 *
 * @returns {Promise<{success: boolean, data: {u_email: string, u_security_question: string, u_security_hint: string}}>}
 */
export async function getProfile() {
  const res = await fetch(`${API_URL}?action=profile`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Updates the authenticated user's 2FA security question and answer.
 * Answer is re-hashed server-side before storage.
 * Accessible by both `user` and `admin` roles.
 *
 * @param {Object} data
 * @param {string} data.security_question - New security question.
 * @param {string} data.security_answer   - New plaintext answer (will be hashed server-side).
 * @param {string} [data.security_hint]   - Optional updated hint.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function update2fa(data) {
  const res = await fetch(`${API_URL}?action=update2fa`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Changes the authenticated user's password.
 * Server verifies the current password before applying the change.
 * New password is validated against the strength policy server-side.
 *
 * @param {Object} data
 * @param {string} data.current_password  - User's existing plaintext password.
 * @param {string} data.new_password      - New plaintext password (must meet strength policy).
 * @param {string} data.confirm_password  - Must match new_password exactly.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function changePassword(data) {
  const res = await fetch(`${API_URL}?action=changePassword`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ============================================================
// ADMIN
// ============================================================

/**
 * Fetches all registered users. Admin only.
 * Returns id, email, role, and created_at per user.
 * Password and security answer hashes are never included.
 *
 * @returns {Promise<{success: boolean, data: Array<{u_id: number, u_email: string, u_role: string, u_created_at: string}>}>}
 */
export async function getUsers() {
  const res = await fetch(`${API_URL}?action=users`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Fetches the 50 most recent login attempts. Admin only.
 * Includes both successful and failed attempts with IP address.
 *
 * @returns {Promise<{success: boolean, data: Array<{l_id: number, l_email_attempted: string, l_success: number, l_ip_address: string, l_created_at: string}>}>}
 */
export async function getLoginLogs() {
  const res = await fetch(`${API_URL}?action=loginLogs`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Fetches the 50 most recent user sessions. Admin only.
 * Includes login/logout times and session ID per user.
 *
 * @returns {Promise<{success: boolean, data: Array<{u_email: string, s_session_id: string, s_login_time: string, s_logout_time: string|null}>}>}
 */
export async function getSessionLogs() {
  const res = await fetch(`${API_URL}?action=sessionLogs`, {
    credentials: "include",
  });
  return res.json();
}

/**
 * Updates the role of a target user. Admin only.
 * Cannot be used to change the requesting admin's own role.
 * Valid roles: `user`, `admin`.
 *
 * @param {number} userId - ID of the user to update.
 * @param {string} role   - New role ("user" or "admin").
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_URL}?action=updateRole`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId, role }),
  });
  return res.json();
}

/**
 * Permanently deletes a user account. Admin only.
 * Cannot be used to delete the requesting admin's own account.
 * This action is irreversible.
 *
 * @param {number} userId - ID of the user to delete.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}?action=deleteUser`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId }),
  });
  return res.json();
}
