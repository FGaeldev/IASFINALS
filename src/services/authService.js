const API_URL = "https://esmeralda.augusta2026.online/server/index.php"; // Server Access Point

export async function login(email, password) {
  const res = await fetch(`${API_URL}?action=login`, {
    method: "POST",
    credentials: "include", // IMPORTANT for PHP sessions
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${API_URL}?action=signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function verify2fa(answer) {
  const res = await fetch(`${API_URL}?action=verify2fa`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });
  return res.json();
}

export async function getSecurityQuestion() {
  const res = await fetch(`${API_URL}?action=getSecurityQuestion`, {
    credentials: "include",
  });
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_URL}?action=me`, {
    credentials: "include",
  });

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}?action=logout`, {
    credentials: "include",
  });

  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API_URL}?action=users`, {
    credentials: "include",
  });
  return res.json();
}

export async function getLoginLogs() {
  const res = await fetch(`${API_URL}?action=loginLogs`, {
    credentials: "include",
  });
  return res.json();
}

export async function getSessionLogs() {
  const res = await fetch(`${API_URL}?action=sessionLogs`, {
    credentials: "include",
  });
  return res.json();
}

export async function updateUserRole(userId, role) {
  const res = await fetch(`${API_URL}?action=updateRole`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId, role }),
  });
  return res.json();
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}?action=deleteUser`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userId }),
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${API_URL}?action=profile`, {
    credentials: "include",
  });
  return res.json();
}

export async function update2fa(data) {
  const res = await fetch(`${API_URL}?action=update2fa`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
