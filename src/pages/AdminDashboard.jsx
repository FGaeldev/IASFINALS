import { useEffect, useState } from "react";
import {
  getUsers,
  getLoginLogs,
  getSessionLogs,
} from "../services/authService";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("users");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUsers().then((res) => res.success && setUsers(res.data));
    getLoginLogs().then((res) => res.success && setLogs(res.data));
    getSessionLogs().then((res) => res.success && setSessions(res.data));
  }, []);

  const glass =
    "bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-lg";

  const tabStyle = (active) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white/10 text-gray-200 hover:bg-white/20"
    }`;

  const tableHeader =
    "sticky top-0 z-10 bg-black/60 backdrop-blur-lg border-b border-white/10";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col p-6"
      style={{
        backgroundImage: "url('./public/background.jpg')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-6xl mx-auto w-full flex flex-col h-[90vh]">

        <h1 className="text-3xl font-bold text-white mb-6">
          Admin Dashboard
        </h1>

        {/* TABS */}
        <div className="hidden md:flex gap-3 mb-4">
          <button
            onClick={() => setTab("users")}
            className={tabStyle(tab === "users")}
          >
            Users
          </button>

          <button
            onClick={() => setTab("logs")}
            className={tabStyle(tab === "logs")}
          >
            Login Logs
          </button>

          <button
            onClick={() => setTab("sessions")}
            className={tabStyle(tab === "sessions")}
          >
            Sessions
          </button>
        </div>

        {/* CONTENT */}
        <div className={`flex-1 overflow-y-auto rounded-2xl ${glass}`}>

          {/* USERS TABLE */}
          {tab === "users" && (
            <table className="w-full text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.u_id} className="border-t border-white/10">

                    <td className="p-3">{u.u_id}</td>

                    <td className="p-3">{u.u_email}</td>

                    {/* ROLE SELECT (UI ONLY) */}
                    <td className="p-3">
                      <select
                        value={u.u_role}
                        disabled
                        className="bg-white/10 text-white px-2 py-1 rounded border border-white/20 opacity-70"
                      >
                        <option value="user" className="text-black">
                          user
                        </option>
                        <option value="admin" className="text-black">
                          admin
                        </option>
                      </select>
                    </td>

                    {/* ACTION BUTTONS (UI ONLY) */}
                    <td className="p-3 flex gap-2">

                      <button
                        className="px-3 py-1 text-sm rounded bg-blue-500/60 hover:bg-blue-500/80 transition"
                      >
                        Edit Role
                      </button>

                      <button
                        className="px-3 py-1 text-sm rounded bg-red-500/60 hover:bg-red-500/80 transition"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* LOGIN LOGS */}
          {tab === "logs" && (
            <table className="w-full text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Success</th>
                  <th className="p-3 text-left">IP</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.l_id} className="border-t border-white/10">
                    <td className="p-3">{l.l_email_attempted}</td>
                    <td className="p-3">{l.l_success ? "Yes" : "No"}</td>
                    <td className="p-3">{l.l_ip_address}</td>
                    <td className="p-3">{l.l_created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* SESSIONS */}
          {tab === "sessions" && (
            <table className="w-full text-sm">
              <thead className={tableHeader}>
                <tr>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Session ID</th>
                  <th className="p-3 text-left">Login Time</th>
                  <th className="p-3 text-left">Logout Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.s_session_id} className="border-t border-white/10">
                    <td className="p-3">{s.u_email}</td>
                    <td className="p-3">{s.s_session_id}</td>
                    <td className="p-3">{s.s_login_time}</td>
                    <td className="p-3">{s.s_logout_time ?? "Active"}</td>
                    <td className="p-3">
                      {s.s_logout_time ? "Logged out" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}