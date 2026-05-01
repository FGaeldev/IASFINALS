import { useEffect, useState } from "react";
import {
  getUsers,
  getLoginLogs,
  getSessionLogs,
  updateUserRole,
  deleteUser,
} from "../services/authService";

/*
  AdminDashboard.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical
  Layout  : Sidebar (left rail) + main content
  Mobile  : Sidebar hidden by default — slide-in drawer on toggle
            Overlay closes drawer on tap-outside
  Palette : --gz-* tokens from index.css
*/

const TABS = [
  { value: "users", label: "Registry", icon: "⬡" },
  { value: "logs", label: "Entry Logs", icon: "⊟" },
  { value: "sessions", label: "Watch", icon: "◎" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tab, setTab] = useState("users");
  const [pendingRoles, setPendingRoles] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getUsers().then((res) => res.success && setUsers(res.data));
    getLoginLogs().then((res) => res.success && setLogs(res.data));
    getSessionLogs().then((res) => res.success && setSessions(res.data));
  }, []);

  const activeSessions = sessions.filter((s) => !s.s_logout_time).length;
  const failedLogins = logs.filter((l) => !l.l_success).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      accent: "var(--gz-emerald-lt)",
    },
    {
      label: "Active Sessions",
      value: activeSessions,
      accent: "var(--gz-olive-lt)",
    },
    { label: "Failed Logins", value: failedLogins, accent: "var(--gz-danger)" },
  ];

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

  /* ⚠️ Irreversible — native confirm intentional */
  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.u_email}? This cannot be undone.`)) return;
    const res = await deleteUser(u.u_id);
    if (res.success) setUsers((prev) => prev.filter((x) => x.u_id !== u.u_id));
    else alert(res.message);
  };

  const handleTabChange = (value) => {
    setTab(value);
    setDrawerOpen(false); /* auto-close drawer on nav */
  };

  /* Shared sidebar content — used in both desktop rail and mobile drawer */
  const SidebarContent = () => (
    <>
      {/* Brand strip */}
      <div
        className="px-5 py-6 border-b"
        style={{ borderColor: "var(--gz-driftwood)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--gz-olive-lt)",
            marginBottom: "0.3rem",
          }}
        >
          Command Center
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gz-cream)",
          }}
        >
          Registry
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {TABS.map((t) => {
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => handleTabChange(t.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.9rem",
                borderRadius: "0.6rem",
                background: active ? "var(--gz-emerald-dim)" : "none",
                border: active
                  ? "1px solid var(--gz-border)"
                  : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "rgba(45,106,79,0.08)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "none";
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: active
                    ? "var(--gz-emerald-lt)"
                    : "var(--gz-driftwood)",
                }}
              >
                {t.icon}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: active
                    ? "var(--gz-emerald-lt)"
                    : "rgba(201,185,154,0.5)",
                }}
              >
                {t.label}
              </span>
              {active && (
                <span
                  className="ml-auto"
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "9999px",
                    background: "var(--gz-emerald-lt)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "var(--gz-driftwood)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gz-driftwood)",
            opacity: 0.5,
          }}
        >
          GroundZero UMS
        </p>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--gz-bark)", paddingTop: "3.5rem" }}
    >
      {/* ══════════════════════════════════════════
          DESKTOP SIDEBAR — hidden on mobile
      ══════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] flex-shrink-0"
        style={{
          width: "220px",
          background: "var(--gz-soil)",
          borderRight: "1px solid var(--gz-driftwood)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ══════════════════════════════════════════
          MOBILE DRAWER — slide in from left
      ══════════════════════════════════════════ */}

      {/* Overlay — tap to close */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(26,26,20,0.7)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className="md:hidden fixed top-14 left-0 z-50 flex flex-col h-[calc(100vh-3.5rem)]"
        style={{
          width: "240px",
          background: "var(--gz-soil)",
          borderRight: "1px solid var(--gz-driftwood)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          boxShadow: drawerOpen ? "4px 0 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8">
        {/* ── MOBILE TOPBAR — tab label + drawer toggle ── */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--gz-olive-lt)",
              }}
            >
              Command Center
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gz-cream)",
              }}
            >
              {TABS.find((t) => t.value === tab)?.label}
            </p>
          </div>
          {/* Drawer toggle button */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "var(--gz-soil)",
              border: "1px solid var(--gz-driftwood)",
              borderRadius: "0.6rem",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "14px",
                    height: "1.5px",
                    background: "rgba(240,230,211,0.65)",
                    borderRadius: "9999px",
                  }}
                />
              ))}
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gz-sand)",
              }}
            >
              Menu
            </span>
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl px-6 py-5 flex flex-col gap-1"
              style={{
                background: "var(--gz-soil)",
                border: "1px solid var(--gz-driftwood)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gz-driftwood)",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "2.4rem",
                  color: s.accent,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="hidden md:flex items-center gap-3 mb-4">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.3rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--gz-cream)",
            }}
          >
            {TABS.find((t) => t.value === tab)?.label}
          </h2>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-border)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: "var(--gz-emerald-dim)",
              color: "var(--gz-emerald-lt)",
              border: "1px solid var(--gz-border)",
            }}
          >
            {tab === "users"
              ? users.length
              : tab === "logs"
                ? logs.length
                : sessions.length}{" "}
            records
          </span>
        </div>

        {/* ── TABLE CARD ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--gz-soil)",
            border: "1px solid var(--gz-driftwood)",
          }}
        >
          <div className="overflow-auto" style={{ maxHeight: "55vh" }}>
            {/* USERS */}
            {tab === "users" && (
              <table className="w-full">
                <thead>
                  <tr>
                    {["ID", "Email", "Joined", "Role", "Actions"].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const currentRole = pendingRoles[u.u_id] ?? u.u_role;
                    const dirty =
                      pendingRoles[u.u_id] && pendingRoles[u.u_id] !== u.u_role;
                    return (
                      <tr
                        key={u.u_id}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(64,145,108,0.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                        style={{ transition: "background 0.15s" }}
                      >
                        <td style={tdStyle}>{u.u_id}</td>
                        <td style={tdStyle}>{u.u_email}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color: "var(--gz-driftwood)",
                            fontSize: "0.8rem",
                          }}
                        >
                          {u.u_created_at ?? "—"}
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={currentRole}
                            onChange={(e) =>
                              handleRoleChange(u.u_id, e.target.value)
                            }
                            style={{
                              fontFamily: "var(--font-ui)",
                              fontSize: "0.6rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              background: "var(--gz-bark)",
                              border: "1px solid var(--gz-driftwood)",
                              borderRadius: "0.25rem",
                              padding: "0.3rem 0.6rem",
                              color:
                                currentRole === "admin"
                                  ? "var(--gz-emerald-lt)"
                                  : "var(--gz-sand)",
                              outline: "none",
                              cursor: "pointer",
                            }}
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <div className="flex gap-2">
                            <ActionBtn
                              onClick={() => handleSaveRole(u)}
                              disabled={!dirty}
                              variant="primary"
                            >
                              Save
                            </ActionBtn>
                            <ActionBtn
                              onClick={() => handleDelete(u)}
                              variant="danger"
                            >
                              Delete
                            </ActionBtn>
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
                    {["Email", "Status", "IP Address", "Time"].map((h) => (
                      <th key={h} style={thStyle}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr
                      key={l.l_id}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(64,145,108,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                      style={{ transition: "background 0.15s" }}
                    >
                      <td style={tdStyle}>{l.l_email_attempted}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "0.58rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "9999px",
                            background: l.l_success
                              ? "rgba(45,106,79,0.15)"
                              : "rgba(193,68,14,0.12)",
                            color: l.l_success
                              ? "var(--gz-emerald-lt)"
                              : "var(--gz-danger)",
                            border: `1px solid ${l.l_success ? "rgba(64,145,108,0.3)" : "rgba(193,68,14,0.3)"}`,
                          }}
                        >
                          {l.l_success ? "Granted" : "Denied"}
                        </span>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          color: "var(--gz-driftwood)",
                        }}
                      >
                        {l.l_ip_address}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: "var(--gz-driftwood)",
                          fontSize: "0.8rem",
                        }}
                      >
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
                    {["Email", "Session ID", "Login", "Logout", "Status"].map(
                      (h) => (
                        <th key={h} style={thStyle}>
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr
                      key={s.s_session_id}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(64,145,108,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                      style={{ transition: "background 0.15s" }}
                    >
                      <td style={tdStyle}>{s.u_email}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "monospace",
                          fontSize: "0.72rem",
                          color: "var(--gz-driftwood)",
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.s_session_id}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontSize: "0.8rem",
                          color: "var(--gz-driftwood)",
                        }}
                      >
                        {s.s_login_time}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontSize: "0.8rem",
                          color: "var(--gz-driftwood)",
                        }}
                      >
                        {s.s_logout_time ?? "—"}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "0.58rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "9999px",
                            background: s.s_logout_time
                              ? "rgba(74,74,56,0.3)"
                              : "rgba(45,106,79,0.15)",
                            color: s.s_logout_time
                              ? "var(--gz-driftwood)"
                              : "var(--gz-emerald-lt)",
                            border: `1px solid ${s.s_logout_time ? "rgba(74,74,56,0.4)" : "rgba(64,145,108,0.3)"}`,
                          }}
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
      </main>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function ActionBtn({ onClick, disabled, variant, children }) {
  const base = {
    fontFamily: "var(--font-ui)",
    fontSize: "0.58rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0.3rem 0.7rem",
    borderRadius: "0.25rem",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "background 0.15s, color 0.15s",
  };
  const styles = {
    primary: {
      background: disabled ? "var(--gz-driftwood)" : "var(--gz-emerald)",
      color: disabled ? "rgba(201,185,154,0.3)" : "var(--gz-cream)",
    },
    danger: {
      background: "none",
      color: "rgba(193,68,14,0.6)",
      border: "1px solid rgba(193,68,14,0.35)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...styles[variant] }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary")
          e.currentTarget.style.background = "var(--gz-emerald-lt)";
        if (variant === "danger") {
          e.currentTarget.style.background = "rgba(193,68,14,0.1)";
          e.currentTarget.style.color = "var(--gz-danger)";
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (variant === "primary")
          e.currentTarget.style.background = "var(--gz-emerald)";
        if (variant === "danger") {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.color = "rgba(193,68,14,0.6)";
        }
      }}
    >
      {children}
    </button>
  );
}

const thStyle = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontFamily: "var(--font-ui)",
  fontSize: "0.58rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--gz-olive-lt)",
  borderBottom: "1px solid var(--gz-driftwood)",
  background: "var(--gz-bark)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};
const tdStyle = {
  padding: "0.75rem 1rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  color: "var(--gz-sand)",
  borderBottom: "1px solid rgba(74,74,56,0.25)",
};
