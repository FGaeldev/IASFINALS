# IAS Security Web App

A full-stack web application built for Information Assurance & Security (IAS), featuring secure authentication, role-based access control, and session management.

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7
- **Backend:** PHP 8, MySQL (via MySQLi)
- **Server:** Apache (XAMPP locally, Hostinger on production)

## Features

### Authentication
- Email + password login with brute-force lockout
- Two-factor authentication via security question
- Strong password enforcement (uppercase, lowercase, number, special char, 8+ chars)
- Session regeneration on login (prevents session fixation)
- Concurrent session enforcement — new login closes previous active session

### Role-Based Access Control (RBAC)
- `user` role — access to personal dashboard + profile
- `admin` role — access to admin dashboard + profile
- Protected routes enforce role on both frontend and backend

### Admin Dashboard
- View all users
- Edit user roles (with self-demotion protection)
- Delete users (with self-deletion protection)
- View login attempt logs
- View session logs

### Profile Page
- View account email
- Edit security question, answer, and hint
- Accessible by both `user` and `admin` roles

### Security
- Passwords hashed with `PASSWORD_BCRYPT`
- Security answers hashed with `PASSWORD_BCRYPT`
- Sessions secured with `httponly`, `secure`, `samesite=Strict` flags
- IP address logged on every login attempt
- Admin-only endpoints protected server-side with `require_role()`

## Project Structure

```
IASFINALS/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── SecurityQuestion.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── authService.js
│   └── App.jsx
└── server/
    ├── config/
    │   └── db.php
    ├── middleware/
    │   └── auth.php
    ├── routes/
    │   ├── auth.php
    │   └── admin.php
    ├── utils/
    │   ├── password.php
    │   ├── response.php
    │   └── session_logger.php
    ├── index.php
    └── .env
```

## Setup (Local)

### Prerequisites
- Node.js 18+
- XAMPP (PHP 8+, MySQL)
- Composer

### Frontend
```bash
npm install
npm run dev
```

### Backend
1. Start Apache + MySQL in XAMPP
2. Import DB schema into phpMyAdmin
3. Copy `.env.example` to `.env` and fill in credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=your_db_name
```

4. Install PHP dependencies:
```bash
cd server
composer install
```

## Deployment (Hostinger)

1. Build frontend:
```bash
npm run build
```

2. Upload `/dist` contents to `public_html/`

3. Add `.htaccess` to `public_html/` for SPA routing:
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

4. Upload `server/` folder alongside `public_html/`

5. Set `.env` on server with production DB credentials (hPanel → Databases for values)

6. Set PHP version to 8.x in hPanel → PHP Configuration

## Environment Variables

| Key | Description |
|-----|-------------|
| `DB_HOST` | Database host (usually `localhost`) |
| `DB_USER` | Database username |
| `DB_PASS` | Database password |
| `DB_NAME` | Database name |

## Security Notes

- Never commit `.env` — it is gitignored
- Disable `display_errors` in production
- DB user should have minimal permissions (SELECT, INSERT, UPDATE, DELETE only)
- HTTPS required for secure session cookies
