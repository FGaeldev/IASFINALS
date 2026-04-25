# IAS FINALS

A full-stack web application designed to manage users, authentication, and administrative controls using a structured and scalable system.

---

## 🚀 Overview

IAS FINALS is a web-based system built to demonstrate core full-stack development principles such as authentication, session handling, and role-based access control.

The system separates frontend and backend responsibilities, allowing for a modular and maintainable architecture.

---

## ✨ Features

* 🔐 User Authentication (Login & Signup)
* 👤 Role-Based Access Control (Admin / User)
* 📊 Admin Dashboard Interface
* 🧾 Login & Session Tracking System
* 🎛 Dynamic Navigation Bar based on user role
* 📋 Scrollable and responsive data tables
* ⚙️ Structured database design with clear naming conventions

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS

### Backend

* PHP (PDO)
* MySQL

### Tools

* Git & GitHub

---

## 📁 Project Structure

```id="f83k29"
IASFINALS/
├── frontend/        # React (Vite) application
├── backend/         # PHP API & server logic
├── database/        # SQL files / schema
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash id="k29dk3"
git clone https://github.com/FGaeldev/IASFINALS.git
cd IASFINALS
```

### 2. Setup Frontend

```bash id="a91ks0"
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

* Place backend in a local server (e.g., XAMPP)
* Configure database connection
* Import SQL schema into MySQL

---

## 🔑 Usage

1. Register a new account
2. Login using your credentials
3. Access features based on role:

   * **User**: Basic dashboard access
   * **Admin**:

     * View user list
     * Manage user roles (UI ready)
     * Delete users (UI ready)

---

## 📌 Database Design

Field naming conventions:

* `u_` → Users table
* `l_` → Login logs
* `s_` → Session logs

This ensures clarity and consistency across database operations.

---

## 🔗 System Architecture

* React frontend communicates with PHP backend via API requests
* Backend handles:

  * Authentication
  * Database operations
  * Session tracking
* MySQL stores user, login, and session data

---

## 🧠 Future Improvements

* Implement backend functionality for role updates and deletion
* Add pagination, filtering, and search
* Improve security (password hashing, token-based auth)
* UI/UX enhancements
* Deploy system (Netlify + hosted backend)

---

## 🤝 Contributing

Contributions are welcome. Fork the repository and submit a pull request.

---

## 📄 License

This project is intended for educational purposes.
