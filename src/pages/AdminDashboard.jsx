import { useEffect, useState } from "react";
import {
  getUsers,
  getLoginLogs,
  getSessionLogs,
  updateUserRole,
  deleteUser,
} from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const thClass =
  "px-4 py-3 text-left text-xs tracking-widest uppercase text-neutral-600 border-b border-neutral-900 bg-black sticky top-0 z-10";
const tdClass =
  "px-4 py-3 text-sm text-neutral-300 border-b border-neutral-900";
const trClass = "hover:bg-neutral-950 transition-colors";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("users");
  const [pendingRoles, setPendingRoles] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUsers().then((res) => res.success && setUsers(res.data));
    getLoginLogs().then((res) => res.success && setLogs(res.data));
    getSessionLogs().then((res) => res.success && setSessions(res.data));
  }, []);

  const handleRoleChange = (id, role) =>
    setPendingRoles((prev) => ({ ...prev, [id]: role }));

  const handleSaveRole = async (u) => {
    const newRole = pendingRoles[u.u_id] ?? u.u_role;
    const res = await updateUserRole(u.u_id, newRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((x) => (x.u_id === u.u_id ? { ...x, u_role: newRole } : x)),
      );
      setPendingRoles((prev) => {
        const p = { ...prev };
        delete p[u.u_id];
        return p;
      });
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.u_email}? This cannot be undone.`)) return;
    const res = await deleteUser(u.u_id);
    if (res.success) setUsers((prev) => prev.filter((x) => x.u_id !== u.u_id));
    else alert(res.message);
  };

  const tabs = [
    { value: "users", label: "Users" },
    { value: "logs", label: "Login Logs" },
    { value: "sessions", label: "Sessions" },
  ];

  const tabStyle = (active) =>
    `px-5 py-2.5 text-xs tracking-widest uppercase transition-colors border-b-2 ${
      active
        ? "text-white border-yellow-600"
        : "text-neutral-600 border-transparent hover:text-neutral-400"
    }`;

  return (
    <div className="min-h-screen bg-black pt-16" style={inter}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-yellow-600/70 text-xs tracking-[0.5em] uppercase mb-2"
            style={inter}
          >
            Lockheart
          </p>
          <h1
            className="text-white text-3xl md:text-4xl"
            style={{ ...playfair, fontWeight: 700 }}
          >
            Admin Panel.
          </h1>
        </div>

        {/* DESKTOP TABS */}
        <div className="hidden md:flex border-b border-neutral-900 mb-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={tabStyle(tab === t.value)}
              style={inter}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MOBILE DROPDOWN */}
        <div className="relative md:hidden mb-6">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white text-xs tracking-widest uppercase flex justify-between items-center"
            style={inter}
          >
            <span>{tabs.find((t) => t.value === tab)?.label}</span>
            <span
              className={`transition-transform duration-200 text-neutral-600 ${open ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          {open && (
            <div className="absolute top-full w-full bg-neutral-950 border border-neutral-800 border-t-0 z-20">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTab(t.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-xs tracking-widest uppercase text-left transition-colors ${
                    tab === t.value
                      ? "text-yellow-600 bg-neutral-900"
                      : "text-neutral-500 hover:text-white hover:bg-neutral-900"
                  }`}
                  style={inter}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="border border-neutral-900 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[65vh]">
            {/* USERS */}
            {tab === "users" && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thClass} style={inter}>
                      ID
                    </th>
                    <th className={thClass} style={inter}>
                      Email
                    </th>
                    <th className={thClass} style={inter}>
                      Role
                    </th>
                    <th className={thClass} style={inter}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const currentRole = pendingRoles[u.u_id] ?? u.u_role;
                    const dirty =
                      pendingRoles[u.u_id] && pendingRoles[u.u_id] !== u.u_role;
                    return (
                      <tr key={u.u_id} className={trClass}>
                        <td className={tdClass}>{u.u_id}</td>
                        <td className={tdClass}>{u.u_email}</td>
                        <td className={tdClass}>
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              handleRoleChange(u.u_id, e.target.value)
                            }
                            className="bg-neutral-900 text-neutral-300 px-2 py-1.5 border border-neutral-800 text-xs focus:outline-none focus:border-yellow-700"
                            style={inter}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className={tdClass}>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveRole(u)}
                              disabled={!dirty}
                              className={`px-3 py-1.5 text-xs tracking-widest uppercase transition-colors ${
                                dirty
                                  ? "bg-yellow-600 hover:bg-yellow-500 text-black cursor-pointer"
                                  : "bg-neutral-900 text-neutral-700 cursor-not-allowed"
                              }`}
                              style={inter}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              className="px-3 py-1.5 text-xs tracking-widest uppercase border border-neutral-800 text-neutral-600 hover:border-red-900 hover:text-red-400 transition-colors"
                              style={inter}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* LOGIN LOGS */}
            {tab === "logs" && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thClass} style={inter}>
                      Email
                    </th>
                    <th className={thClass} style={inter}>
                      Status
                    </th>
                    <th className={thClass} style={inter}>
                      IP
                    </th>
                    <th className={thClass} style={inter}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.l_id} className={trClass}>
                      <td className={tdClass}>{l.l_email_attempted}</td>
                      <td className={tdClass}>
                        <span
                          className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                            l.l_success
                              ? "text-yellow-600/80 bg-yellow-950/40 border border-yellow-900/40"
                              : "text-red-400/70 bg-red-950/40 border border-red-900/40"
                          }`}
                          style={inter}
                        >
                          {l.l_success ? "Granted" : "Denied"}
                        </span>
                      </td>
                      <td className={tdClass}>{l.l_ip_address}</td>
                      <td className={tdClass}>{l.l_created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* SESSIONS */}
            {tab === "sessions" && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thClass} style={inter}>
                      Email
                    </th>
                    <th className={thClass} style={inter}>
                      Session ID
                    </th>
                    <th className={thClass} style={inter}>
                      Login
                    </th>
                    <th className={thClass} style={inter}>
                      Logout
                    </th>
                    <th className={thClass} style={inter}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.s_session_id} className={trClass}>
                      <td className={tdClass}>{s.u_email}</td>
                      <td
                        className={`${tdClass} font-mono text-xs text-neutral-700`}
                      >
                        {s.s_session_id}
                      </td>
                      <td className={tdClass}>{s.s_login_time}</td>
                      <td className={tdClass}>{s.s_logout_time ?? "—"}</td>
                      <td className={tdClass}>
                        <span
                          className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                            s.s_logout_time
                              ? "text-neutral-600 bg-neutral-900 border border-neutral-800"
                              : "text-yellow-600/80 bg-yellow-950/40 border border-yellow-900/40"
                          }`}
                          style={inter}
                        >
                          {s.s_logout_time ? "Offline" : "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
