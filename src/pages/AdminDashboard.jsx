import { useEffect, useState } from "react";
import {
  getUsers,
  getLoginLogs,
  getSessionLogs,
  updateUserRole,
  deleteUser,
} from "../services/authService";

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const thClass =
  "px-4 py-3 text-left text-xs tracking-widest uppercase text-amber-500/70 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10";
const tdClass =
  "px-4 py-3 text-amber-100/80 border-b border-zinc-800/60 text-sm";
const trClass = "hover:bg-zinc-800/40 transition-colors";

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
    { value: "users", label: "Registry" },
    { value: "logs", label: "Entry Logs" },
    { value: "sessions", label: "Active Watch" },
  ];

  const tabStyle = (active) =>
    `px-5 py-2 text-xs tracking-widest uppercase transition-colors ${
      active
        ? "text-amber-400 border-b-2 border-amber-600"
        : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
    }`;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/85 via-zinc-950/70 to-zinc-950/95" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-amber-500/70 text-xs tracking-[0.4em] uppercase mb-1"
            style={cinzel}
          >
            Command Center
          </p>
          <h1
            className="text-amber-200 text-4xl tracking-[0.15em] uppercase"
            style={{ ...cinzel, fontWeight: 700 }}
          >
            The Registry
          </h1>
        </div>

        {/* DESKTOP TABS */}
        <div className="hidden md:flex border-b border-zinc-800 mb-6">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={tabStyle(tab === t.value)}
              style={cinzel}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MOBILE DROPDOWN */}
        <div className="relative md:hidden mb-6">
          <button
            onClick={() => setOpen(!open)}
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 text-amber-200 text-xs tracking-widest uppercase flex justify-between items-center"
            style={cinzel}
          >
            <span>{tabs.find((t) => t.value === tab)?.label}</span>
            <span
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          {open && (
            <div className="absolute top-full w-full bg-zinc-900 border border-zinc-700 border-t-0 z-20">
              {tabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTab(t.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-xs tracking-widest uppercase text-left transition-colors ${
                    tab === t.value
                      ? "text-amber-400 bg-zinc-800"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                  style={cinzel}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TABLE CONTAINER */}
        <div className="flex-1 overflow-hidden border border-zinc-800 bg-zinc-950/80">
          <div className="overflow-y-auto h-full max-h-[60vh]">
            {/* USERS */}
            {tab === "users" && (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thClass} style={cinzel}>
                      ID
                    </th>
                    <th className={thClass} style={cinzel}>
                      Email
                    </th>
                    <th className={thClass} style={cinzel}>
                      Role
                    </th>
                    <th className={thClass} style={cinzel}>
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
                        <td className={tdClass} style={garamond}>
                          {u.u_id}
                        </td>
                        <td className={tdClass} style={garamond}>
                          {u.u_email}
                        </td>
                        <td className={tdClass}>
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              handleRoleChange(u.u_id, e.target.value)
                            }
                            className="bg-zinc-800 text-amber-100 px-2 py-1 border border-zinc-700 text-xs focus:outline-none focus:border-amber-700"
                            style={cinzel}
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
                              className={`px-3 py-1 text-xs tracking-widest uppercase transition-colors ${
                                dirty
                                  ? "bg-amber-700 hover:bg-amber-600 text-zinc-950 cursor-pointer"
                                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                              }`}
                              style={cinzel}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDelete(u)}
                              className="px-3 py-1 text-xs tracking-widest uppercase border border-red-900/60 text-red-500/70 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                              style={cinzel}
                            >
                              Exile
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
                    <th className={thClass} style={cinzel}>
                      Email
                    </th>
                    <th className={thClass} style={cinzel}>
                      Status
                    </th>
                    <th className={thClass} style={cinzel}>
                      IP
                    </th>
                    <th className={thClass} style={cinzel}>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.l_id} className={trClass}>
                      <td className={tdClass} style={garamond}>
                        {l.l_email_attempted}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                            l.l_success
                              ? "text-amber-500/80 bg-amber-900/20 border border-amber-900/40"
                              : "text-red-400/70 bg-red-900/20 border border-red-900/40"
                          }`}
                          style={cinzel}
                        >
                          {l.l_success ? "Granted" : "Denied"}
                        </span>
                      </td>
                      <td className={tdClass} style={garamond}>
                        {l.l_ip_address}
                      </td>
                      <td className={tdClass} style={garamond}>
                        {l.l_created_at}
                      </td>
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
                    <th className={thClass} style={cinzel}>
                      Email
                    </th>
                    <th className={thClass} style={cinzel}>
                      Session ID
                    </th>
                    <th className={thClass} style={cinzel}>
                      Login
                    </th>
                    <th className={thClass} style={cinzel}>
                      Logout
                    </th>
                    <th className={thClass} style={cinzel}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.s_session_id} className={trClass}>
                      <td className={tdClass} style={garamond}>
                        {s.u_email}
                      </td>
                      <td
                        className={`${tdClass} font-mono text-xs text-zinc-500`}
                      >
                        {s.s_session_id}
                      </td>
                      <td className={tdClass} style={garamond}>
                        {s.s_login_time}
                      </td>
                      <td className={tdClass} style={garamond}>
                        {s.s_logout_time ?? "—"}
                      </td>
                      <td className={tdClass}>
                        <span
                          className={`text-xs tracking-widest uppercase px-2 py-0.5 ${
                            s.s_logout_time
                              ? "text-zinc-500 bg-zinc-800/60 border border-zinc-700"
                              : "text-amber-500/80 bg-amber-900/20 border border-amber-900/40"
                          }`}
                          style={cinzel}
                        >
                          {s.s_logout_time ? "Departed" : "Present"}
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
