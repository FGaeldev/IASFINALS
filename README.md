# Lockheart — User Management System

> _Crafted for those who wear their confidence._

**Author:** Vince Timothy Esmeralda
**Course:** Information Assurance & Security 1

---

## 1. How the System Works

Lockheart is a full-stack user management system built for the **Lockheart** luxury e-commerce brand. The frontend is built with **React + Vite** and communicates with a **PHP + MySQL** backend through a single entry point (`server/index.php`), which routes requests to the appropriate handler based on an `action` query parameter.

### Login Flow (Two-Factor Authentication)

```
[1] User submits email + password
        ↓
[2] Backend verifies credentials against database
        ↓
[3] $_SESSION["pending_user"] set — NOT fully logged in yet
        ↓
[4] Frontend redirects to security question page
        ↓
[5] User answers their personal security question
        ↓
[6] Backend verifies answer
        ↓
[7] Session promoted — user_id + role written to session
        ↓
[8] Redirected to dashboard based on role
```

### Architecture

```
server/
├── index.php          → Router — maps action → handler function
├── routes/
│   ├── auth.php       → login, signup, logout, me, 2FA, profile
│   └── admin.php      → users, logs, sessions, role/delete
├── middleware/
│   └── auth.php       → require_auth(), require_role(), require_pending_auth()
├── utils/
│   ├── password.php   → hash_password(), verify_password(), password_errors()
│   ├── response.php   → json_response()
│   ├── logger.php     → log_attempt()
│   └── session_logger.php → logSessionStart(), logSessionEnd()
└── config/
    └── db.php         → MySQL connection
```

### Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router 7 |
| Backend  | PHP 8, MySQL (MySQLi)                        |
| Fonts    | Playfair Display, Inter                      |
| Server   | Apache (XAMPP local / Hostinger production)  |

### Pages

| Page                  | Route                | Access               |
| --------------------- | -------------------- | -------------------- |
| Landing               | `/`                  | Public               |
| Sign In               | `/login`             | Public               |
| Register              | `/signup`            | Public               |
| Security Verification | `/security-question` | Pending session only |
| Account               | `/user`              | `user` role          |
| Admin Panel           | `/admin`             | `admin` role         |
| Profile               | `/profile`           | Both roles           |

### Database Naming Convention

| Prefix | Table        |
| ------ | ------------ |
| `u_`   | users        |
| `l_`   | login_logs   |
| `s_`   | session_logs |

---

## 2. Security Features Implemented

### Password Hashing — bcrypt

- All passwords hashed using **bcrypt** (`PASSWORD_BCRYPT`) via PHP's native `password_hash()`
- bcrypt is slow and salted by design — resistant to brute-force and rainbow table attacks
- Security question answers also hashed with bcrypt — never stored in plaintext

### Strong Password Policy

Enforced on **both frontend and backend** — backend rejects weak passwords even if frontend is bypassed:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Frontend shows a live **password strength meter** (Weak → Poor → Fair → Good → Strong).

### Two-Factor Authentication (2FA)

- Login requires **two separate steps** — passing Step 1 does not grant access
- Step 2 requires answering a personal security question set during registration
- A `pending_user` session variable separates the steps — partial auth cannot access protected resources
- Security question and hint fetched live from the server — not stored client-side

### Session Security

- `session_regenerate_id(true)` on every successful login — prevents **session fixation**
- Session cookies configured with:
  - `httponly` — JavaScript cannot read the cookie
  - `secure` — Cookie only sent over HTTPS
  - `samesite=Strict` — Prevents CSRF attacks
- **Concurrent session enforcement** — new login automatically closes all prior active sessions. One active session per user maximum.

### Brute-Force Protection

- Failed login attempts tracked per user in the database
- After **3 consecutive failures** → account locked for **60 seconds**
- Counter resets on successful login
- Lockout checked before password verification — locked accounts rejected immediately

### Audit Logging

Every login attempt logged in `login_logs`:

- Email attempted, IP address, timestamp, success/failure

Every session logged in `session_logs`:

- User, session ID, login time, logout time (null if still active)

### SQL Injection Prevention

- All database queries use **prepared statements** with parameter binding
- User input is never interpolated directly into SQL strings

### Credential Security

- Database credentials stored in `server/config/db.php` — not committed with plaintext values in production
- Passwords and security answers never returned in any API response

---

## 3. How Access Control is Enforced

The system uses **Role-Based Access Control (RBAC)** with two roles: `user` and `admin`.

### Permissions

| Feature                | `user` | `admin` |
| ---------------------- | ------ | ------- |
| Account / Profile page | ✓      | ✓       |
| Edit security question | ✓      | ✓       |
| View all users         | ✗      | ✓       |
| Edit user roles        | ✗      | ✓       |
| Delete users           | ✗      | ✓       |
| View login logs        | ✗      | ✓       |
| View session logs      | ✗      | ✓       |

### Frontend Enforcement

`ProtectedRoute` wraps every protected page — checks session via `useAuth` hook before rendering:

```
User visits /admin
        ↓
ProtectedRoute calls getMe() → checks session
        ↓
No session       → redirect to /login
Wrong role       → redirect to /
Correct role     → render page
```

Supports single role and role arrays:

```jsx
<ProtectedRoute role="admin">          // admin only
<ProtectedRoute role={["user","admin"]} // both roles
```

### Backend Enforcement

Every protected endpoint calls middleware before any logic runs:

```php
function require_auth() {
    if (!isset($_SESSION["user_id"])) {
        json_response(false, "Unauthorized");
        exit;
    }
}

function require_role($role) {
    require_auth();
    if ($_SESSION["role"] !== $role) {
        json_response(false, "Forbidden");
        exit;
    }
}
```

**Frontend protection is UI-only.** All sensitive operations are independently verified server-side — bypassing React still hits the middleware wall.

### Admin Safeguards

- Admin cannot change their own role
- Admin cannot delete their own account
- Role values validated against whitelist (`user`, `admin` only)

---

## 4. Challenges Encountered

### Two-Step Session State

Designing a "pending" authentication state required care. After Step 1, the user needed to be held in limbo — past password check but blocked from protected resources until the security question was answered. Solved by storing only `pending_user` after Step 1, then writing `user_id` and `role` only after Step 2 succeeds.

### Concurrent Session Enforcement

Closing prior sessions before starting a new one required precise timing — after 2FA verification but before `logSessionStart()` — to avoid a window where both sessions coexisted. An `UPDATE session_logs SET s_logout_time = NOW() WHERE s_user_id = ? AND s_logout_time IS NULL` query runs immediately before session promotion.

### Cross-Origin Sessions (CORS + Cookies)

Vite (`localhost:5173`) and XAMPP (`localhost/path`) are different origins. Cookies wouldn't persist across them without `credentials: "include"` on every fetch, and `Access-Control-Allow-Credentials: true` + a non-wildcard `Access-Control-Allow-Origin` on the backend. A wildcard origin breaks credentialed requests entirely.

### SPA Routing on Deployment

Refreshing any page on Hostinger returned 404 because Apache looked for a physical file at the URL path. Since React Router handles routing client-side, an `.htaccess` rewrite rule was needed to always serve `index.html` and let React take over.

### Null User on Login Attempt Log

When a user enters an email that doesn't exist, `$user` is null — passing `$user["u_id"]` to `log_attempt()` caused a PHP warning. Fixed by passing `null` explicitly when the user is not found.

---

## 5. Why the System is Secure

### Defense in Depth

Security is enforced at every layer — not just one:

| Layer    | Protection                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | Password strength meter, input validation, protected routes  |
| Network  | HTTPS, HttpOnly + SameSite cookies, CORS headers             |
| Backend  | Role middleware on every endpoint, prepared statements       |
| Database | bcrypt-hashed passwords and answers, no plaintext secrets    |
| Audit    | Every login attempt and session logged with IP and timestamp |

### Why bcrypt

bcrypt is computationally expensive by design. Even if the database is stolen and hashes extracted, brute-forcing them is impractical. Each hash includes a unique random salt — identical passwords produce different hashes, making rainbow tables useless.

### Why Two Factors

A password alone can be stolen through phishing, credential stuffing, or breaches of other services. Requiring a security question means an attacker needs both the password and private personal knowledge. Neither alone is sufficient.

### Why Server-Side Sessions

Session state lives on the server — the browser only holds an opaque session ID. This means revoking a session (logout, lockout, concurrent session enforcement) is immediate with no expiry window to exploit.

### Why Prepared Statements

User input is passed as a bound parameter — never concatenated into SQL. The database engine treats it purely as data, making SQL injection structurally impossible regardless of input content.

### Principle of Least Privilege

Users only access what their role permits. The `user` role is blocked from admin endpoints not by hidden UI but by server-side middleware that actively rejects requests with the wrong session role.

---

## Setup

### Local

```bash
npm install
npm run dev
```

Configure `server/config/db.php` with your local MySQL credentials and update `src/services/authService.js`:

```js
const API_URL = "http://localhost/your-path/server/index.php";
```

### Production (Hostinger)

```bash
npm run build
# Upload /dist to public_html/
# Upload server/ alongside public_html/
```

Add to `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Set PHP to **8.x** in hPanel → PHP Configuration.
