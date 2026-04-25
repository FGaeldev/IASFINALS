# Nomads — User Management System

> _We do not conquer territories. We haunt them._

**Author:** Isaac Psalm Inamac
**Course:** Information Assurance & Security 1

---

## 1. How the System Works

Nomads is a full-stack user management system built with **React** on the frontend and **PHP + MySQL** on the backend. All communication flows through a single PHP entry point (`server/index.php`) which routes requests to the appropriate controller based on an `action` query parameter.

### Login Flow (Two-Factor Authentication)

The system uses a **two-step login process**:

```
[1] User submits email + password
        ↓
[2] Backend verifies credentials
        ↓
[3] $_SESSION["pending_user"] set — NOT fully logged in yet
        ↓
[4] User answers their security question (2FA)
        ↓
[5] Backend verifies answer
        ↓
[6] Session promoted — user_id + role written to session
        ↓
[7] Redirected to dashboard based on role
```

### Architecture

The backend follows an **MVC-lite pattern**:

```
index.php         → Router — receives action, dispatches to controller
controllers/      → Business logic (AuthController, UserController, AdminController)
models/           → Database queries only (UserModel, LogModel)
middleware/       → Session and role guards (require_auth, require_role)
utils/            → Password hashing, response formatting, session logging
```

The frontend uses **React Router** with protected routes that verify the user's session and role before rendering any page.

### Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Frontend     | React 19, Vite, Tailwind CSS, React Router 7 |
| Backend      | PHP 8, MySQL (MySQLi)                        |
| Architecture | MVC-lite (Controllers + Models)              |
| Server       | Apache (XAMPP local / Hostinger production)  |

---

## 2. Security Features Implemented

### Password Security

- All passwords hashed using **bcrypt** (`PASSWORD_BCRYPT`) via PHP's `password_hash()`
- bcrypt is a slow, salted hashing algorithm — resistant to brute-force and rainbow table attacks
- **Strong password policy enforced on both frontend and backend:**
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Frontend shows a live strength meter; backend rejects weak passwords even if frontend is bypassed

### Two-Factor Authentication (2FA)

- Login is a **two-step process** — passing Step 1 (password) does not grant access
- Step 2 requires answering a personal security question set during signup
- Security answers are also hashed with bcrypt before storage
- A `pending_user` session separates the two steps — prevents partial auth from granting access

### Session Security

- `session_regenerate_id(true)` called on every successful login — prevents **session fixation attacks**
- Session cookies configured with:
  - `httponly` — JavaScript cannot access the cookie
  - `secure` — Cookie only sent over HTTPS
  - `samesite=Strict` — Prevents cross-site request forgery (CSRF)
- **Concurrent session enforcement** — when a user logs in, all their previous active sessions are automatically closed. Only one active session per user at any time.

### Brute-Force Protection

- Failed login attempts are tracked per user in the database
- After **3 consecutive failed attempts**, the account is **locked for 60 seconds**
- Failed attempts counter resets on successful login

### Audit Logging

- Every login attempt (success or failure) is recorded in `login_logs` with:
  - Email attempted
  - IP address
  - Timestamp
  - Success/failure status
- Every session is recorded in `session_logs` with login time and logout time

### Input & Data Security

- All database queries use **prepared statements** with parameter binding — prevents SQL injection
- Passwords and security answers are never returned in API responses
- `.env` file stores database credentials — never committed to version control

---

## 3. How Access Control is Enforced

The system implements **Role-Based Access Control (RBAC)** with two roles: `user` and `admin`.

### Roles & Permissions

| Feature                | `user` | `admin` |
| ---------------------- | ------ | ------- |
| Profile / Account page | ✓      | ✓       |
| Edit security question | ✓      | ✓       |
| View all users         | ✗      | ✓       |
| Edit user roles        | ✗      | ✓       |
| Delete users           | ✗      | ✓       |
| View login logs        | ✗      | ✓       |
| View session logs      | ✗      | ✓       |

### Frontend Enforcement

Protected routes in React check the user's session via the `useAuth` hook before rendering:

```
User visits /admin
        ↓
ProtectedRoute calls getMe() → checks session
        ↓
If no session → redirect to /login
If wrong role → redirect to /
If correct role → render page
```

### Backend Enforcement

Every protected endpoint calls middleware before executing any logic:

```php
// Blocks unauthenticated access
function require_auth() {
    if (!isset($_SESSION["user_id"])) {
        json_response(false, "Unauthorized");
    }
}

// Blocks wrong role access
function require_role($role) {
    require_auth();
    if ($_SESSION["role"] !== $role) {
        json_response(false, "Forbidden");
    }
}
```

**Frontend protection is UI-only.** All sensitive operations are re-verified server-side. An attacker bypassing the frontend would still be blocked at the API level.

### Additional Admin Safeguards

- Admin cannot change their own role (prevents accidental self-demotion)
- Admin cannot delete their own account
- Role changes are validated against a whitelist (`user`, `admin` only)

---

## 4. Challenges Encountered

### Session Persistence Across Steps

The two-step login required careful session management. After Step 1, the user needed to be in a "pending" state — authenticated enough to proceed to Step 2, but not enough to access protected resources. This was solved by storing only `pending_user` in the session after Step 1, and only writing `user_id` and `role` after Step 2 succeeds.

### Concurrent Session Enforcement

Ensuring only one active session per user required closing existing sessions before creating a new one. The challenge was timing — this had to happen after the security question was verified but before the new session was recorded, to avoid a race condition where both sessions briefly coexisted.

### Cross-Origin Sessions (CORS + Cookies)

Running the React frontend on `localhost:5173` (Vite) and the PHP backend on `localhost/path` (XAMPP) are treated as different origins by the browser. Getting session cookies to persist across these required setting `credentials: "include"` on every fetch request and correctly configuring `Access-Control-Allow-Credentials` and `Access-Control-Allow-Origin` headers on the backend.

### Separation of Concerns Refactor

The original codebase had all logic in route files (`auth.php`, `admin.php`). As the project grew, this became difficult to maintain. Refactoring to an MVC-lite structure (Controllers + Models) required carefully extracting database logic into Models without breaking any existing functionality.

### SPA Routing on Deployment

After deploying to Hostinger, refreshing any page other than `/` returned a 404 because the server tried to find a physical file at that path. React Router handles routing client-side, so the server needed an `.htaccess` rewrite rule to always serve `index.html` and let React handle the rest.

---

## 5. Why the System is Secure

### Defense in Depth

Security is applied at **multiple layers** — not just one. Even if one layer is bypassed, others remain:

| Layer    | Protection                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | Password strength meter, input validation, protected routes |
| Network  | HTTPS, SameSite cookies, CORS headers                       |
| Backend  | Role middleware on every endpoint, prepared statements      |
| Database | Bcrypt hashed passwords and answers, no plaintext secrets   |
| Audit    | Every login and session logged with IP and timestamp        |

### Why bcrypt

bcrypt is deliberately slow — it is designed to take computational effort to compute. This means even if the database is compromised and password hashes are stolen, an attacker cannot quickly reverse them through brute force. Each hash also includes a unique salt, so identical passwords produce different hashes — rainbow tables are ineffective.

### Why Two Factors

A password alone can be stolen through phishing, data breaches, or guessing. Requiring a second factor (security question) means an attacker needs both the password **and** knowledge of the answer. Neither factor alone is sufficient to gain access.

### Why Sessions and Not Just JWTs

PHP sessions store authentication state **server-side**. The browser only holds a session ID cookie — it cannot be decoded to extract user information. This means revoking a session (on logout or concurrent session enforcement) takes effect immediately with no token expiry window.

### Why Prepared Statements

Every database query uses parameterized prepared statements. User input is never directly interpolated into SQL strings, making SQL injection attacks structurally impossible regardless of what input is submitted.

### Principle of Least Privilege

Users only have access to what their role requires. The `user` role cannot reach admin endpoints — not because the frontend hides the buttons, but because the backend actively rejects any request that lacks admin role in the session.

---

## Setup

### Local

```bash
# Frontend
npm install
npm run dev

# Backend — copy and fill credentials
cp server/.env.example server/.env
```

### Production (Hostinger)

```bash
npm run build
# Upload /dist to public_html/
# Upload server/ alongside public_html/
# Add .htaccess to public_html/ for SPA routing
```

### `.htaccess` (SPA routing fix)

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

### Environment Variables

```env
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=
```