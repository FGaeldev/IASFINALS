/**
 * AdminDashboard.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Administrative control panel. Displays user registry,
 *               login logs, and session watch across three tabs.
 *               Supports inline role changes and user deletion.
 * Theme       : Edo-period government office (奉行所, bugyōsho) aesthetic.
 *               The sidebar is styled as a wooden screen partition (衝立,
 *               tsuitate) — warm silk panel, gold hairline border, ink
 *               brush nav labels. The main content area is the writing
 *               desk surface — aged paper, data rendered as ledger
 *               entries on a hand-ruled register (帳面, chōmen).
 *               Stat cards = official seals / government stamps.
 *               Tables = ink-ruled columns in a census record.
 * Layout      : Sidebar (220px) + main content, desktop.
 *               Mobile: sidebar hidden behind a slide-in drawer.
 * Dependencies: react (useEffect, useState),
 *               ../services/authService (getUsers, getLoginLogs,
 *               getSessionLogs, updateUserRole, deleteUser)
 * Tokens      : --sc-* CSS variables. Classes: .sc-panel, .sc-gold-rule,
 *               .sc-ink-rule, .sc-hanko-seal from index.css.
 *
 * Security note: deleteUser triggers a native confirm() dialog.
 * This is intentional — the irreversible action requires explicit
 * acknowledgment before the API call is made.
 */

import { useEffect, useState } from "react";
import {
  getUsers,
  getLoginLogs,
  getSessionLogs,
  updateUserRole,
  deleteUser,
} from "../services/authService";

/*
 * TABS — navigation items for sidebar and mobile drawer.
 * Icon characters: traditional Japanese geometric motifs.
 *   ⬡ = hexagon (census grid)
 *   ⊟ = ruled box (log entry)
 *   ◎ = concentric rings (surveillance / watchful eye)
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

  /* Fetch all three data sets on mount — fire in parallel */
  useEffect(() => {
    getUsers().then((res) => res.success && setUsers(res.data));
    getLoginLogs().then((res) => res.success && setLogs(res.data));
    getSessionLogs().then((res) => res.success && setSessions(res.data));
  }, []);

  /* Derived stat values — computed from raw data */
  const activeSessions = sessions.filter((s) => !s.s_logout_time).length;
  const failedLogins = logs.filter((l) => !l.l_success).length;

  const stats = [
    { label: "Total Users", value: users.length, accent: "var(--sc-purple)" },
    {
      label: "Active Sessions",
      value: activeSessions,
      accent: "var(--sc-jade)",
    },
    {
      label: "Failed Logins",
      value: failedLogins,
      accent: "var(--sc-vermillion)",
    },
  ];

  /**
   * handleRoleChange
   * Stores a pending role update in local state without hitting the API.
   * The "Save" button in the row commits the change via handleSaveRole.
   *
   * @param {number|string} id   - User ID
   * @param {string}        role - New role value ("user" | "admin")
   */
  const handleRoleChange = (id, role) =>
    setPendingRoles((prev) => ({ ...prev, [id]: role }));

  /**
   * handleSaveRole
   * Commits the pending role change for a user to the API.
   * On success: updates users state and clears the pending entry.
   * On failure: alerts the error message.
   *
   * @param {object} u - User object from state
   * @returns {Promise<void>}
   */
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

  /**
   * handleDelete
   * Permanently removes a user after native confirm() gate.
   * Native confirm is intentional — irreversible destructive action.
   *
   * @param {object} u - User object from state
   * @returns {Promise<void>}
   */
  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.u_email}? This cannot be undone.`)) return;
    const res = await deleteUser(u.u_id);
    if (res.success) setUsers((prev) => prev.filter((x) => x.u_id !== u.u_id));
    else alert(res.message);
  };

  /**
   * handleTabChange
   * Updates the active tab and auto-closes the mobile drawer.
   *
   * @param {string} value - Tab value ("users" | "logs" | "sessions")
   */
  const handleTabChange = (value) => {
    setTab(value);
    setDrawerOpen(false);
  };

  /*
   * SidebarContent — rendered in both desktop rail and mobile drawer.
   * Extracted as an inner component to avoid duplication.
   * Uses the tsuitate (衝立) screen partition visual language:
   * warm silk bg, gold hairline, ink-brush nav labels.
   */
  const SidebarContent = () => (
    <>
      {/* ── Brand strip ────────────────────────────────────── */}
      <div
        className="px-5 py-6"
        style={{ borderBottom: "1px solid var(--sc-border-ink)" }}
      >
        {/* Gold rule above brand — screen partition crown */}
        <div className="sc-gold-rule" style={{ marginBottom: "0.75rem" }} />

        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.52rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--sc-gold)",
            marginBottom: "0.3rem",
            opacity: 0.8,
          }}
        >
          Command Center
        </p>

        <p
          style={{
            fontFamily: "var(--font-logo)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.12em",
            color: "var(--sc-ink)",
          }}
        >
          Schaden
          <span style={{ color: "var(--sc-purple)" }}>'s</span>
        </p>
      </div>

      {/* ── Tab navigation ─────────────────────────────────── */}
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
                borderRadius: "0",
                /*
                 * Active state: left vermillion accent bar + pale paper tint.
                 * Mimics the ink tab markers on traditional ledger books.
                 */
                background: active ? "rgba(109,40,217,0.06)" : "none",
                borderLeft: active
                  ? "3px solid var(--sc-purple)"
                  : "3px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "rgba(26,16,8,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "none";
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: active ? "var(--sc-purple)" : "var(--sc-ash-light)",
                  transition: "color 0.15s",
                }}
              >
                {t.icon}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active ? "var(--sc-purple)" : "var(--sc-ash-light)",
                  fontWeight: active ? 500 : 400,
                  transition: "color 0.15s",
                }}
              >
                {t.label}
              </span>

              {/* Active indicator dot — right-aligned */}
              {active && (
                <span
                  className="ml-auto"
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: "var(--sc-purple)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Sidebar footer ─────────────────────────────────── */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid var(--sc-border-ink)" }}
      >
        <div className="sc-ink-rule" style={{ marginBottom: "0.6rem" }} />
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.52rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--sc-ash-light)",
            opacity: 0.5,
          }}
        >
          Schaden's UMS
        </p>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--sc-paper)", paddingTop: "3.5rem" }}
    >
      {/* ══════════════════════════════════════════════════════════
          DESKTOP SIDEBAR — tsuitate screen partition
          Hidden on mobile — drawer handles mobile navigation.
          ══════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col sticky top-14 h-[calc(100vh-3.5rem)] shrink-0"
        style={{
          width: "220px",
          background: "var(--sc-silk)",
          borderRight: "1px solid var(--sc-border-ink)",
          boxShadow: "2px 0 12px rgba(26,16,8,0.05)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MOBILE DRAWER — slide-in from left
          ══════════════════════════════════════════════════════════ */}

      {/* Tap-outside overlay — warm paper scrim */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{
            background: "rgba(245,240,232,0.75)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className="md:hidden fixed top-14 left-0 z-50 flex flex-col h-[calc(100vh-3.5rem)]"
        style={{
          width: "240px",
          background: "var(--sc-silk)",
          borderRight: "1px solid var(--sc-border-ink)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
          boxShadow: drawerOpen ? "4px 0 24px rgba(26,16,8,0.12)" : "none",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT — the writing desk (書き机, kakimitsuke)
          ══════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8">
        {/* ── MOBILE TOPBAR — tab label + drawer toggle ──────── */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.52rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--sc-gold)",
                opacity: 0.8,
              }}
            >
              Command Center
            </p>
            <p
              style={{
                fontFamily: "var(--font-logo)",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                color: "var(--sc-ink)",
              }}
            >
              {TABS.find((t) => t.value === tab)?.label}
            </p>
          </div>

          {/* Drawer toggle — hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="sc-panel"
            style={{
              borderRadius: "0.5rem",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid var(--sc-border-ink)",
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
                    background: "var(--sc-ink-soft)",
                    borderRadius: "9999px",
                  }}
                />
              ))}
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--sc-ash)",
              }}
            >
              Menu
            </span>
          </button>
        </div>

        {/* ── STAT CARDS — official government seal stamps ─────── */}
        {/*
         * Three stat tiles styled as stamped seals on the desk surface.
         * Each uses a distinct accent color (purple/jade/vermillion)
         * to encode meaning at a glance — same color language as
         * traditional Japanese bureaucratic ink color conventions.
         */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="sc-panel"
              style={{ borderRadius: "0.5rem", padding: "1.25rem 1.5rem" }}
            >
              {/* Gold rule crown on each stat card */}
              <div
                className="sc-gold-rule"
                style={{ marginBottom: "0.75rem" }}
              />

              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--sc-ash-light)",
                  marginBottom: "0.4rem",
                }}
              >
                {s.label}
              </p>

              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "2.6rem",
                  color: s.accent,
                  lineHeight: 1.1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── SECTION HEADER — ledger chapter title ──────────── */}
        <div className="hidden md:flex items-center gap-3 mb-5">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "0.06em",
              color: "var(--sc-ink)",
              margin: 0,
              flexShrink: 0,
            }}
          >
            {TABS.find((t) => t.value === tab)?.label}
          </h2>

          {/* Ink rule extending to the right */}
          <div className="flex-1 sc-ink-rule" />

          {/* Record count badge — official tally mark style */}
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              padding: "0.2rem 0.7rem",
              borderRadius: "9999px",
              background: "var(--sc-purple-dim)",
              color: "var(--sc-purple)",
              border: "1px solid var(--sc-border)",
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

        {/* ── TABLE CARD — chōmen ledger (帳面) ─────────────────── */}
        {/*
         * The data table is styled as a hand-ruled register page:
         * silk paper bg, ink-stroke header row, gold inset crown,
         * warm paper hover states on rows.
         */}
        <div
          className="sc-panel overflow-hidden"
          style={{ borderRadius: "0.5rem" }}
        >
          {/* Gold rule crown above the ledger table */}
          <div className="sc-gold-rule" />

          <div className="overflow-auto" style={{ maxHeight: "55vh" }}>
            {/* ── USERS TAB ─────────────────────────────────── */}
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
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(109,40,217,0.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        <td style={tdStyle}>{u.u_id}</td>
                        <td style={tdStyle}>{u.u_email}</td>
                        <td
                          style={{
                            ...tdStyle,
                            color: "var(--sc-ash-light)",
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
                              fontSize: "0.58rem",
                              letterSpacing: "0.12em",
                              textTransform: "uppercase",
                              background: "var(--sc-paper)",
                              border: "1px solid var(--sc-border-ink)",
                              borderRadius: "0",
                              padding: "0.3rem 0.6rem",
                              color:
                                currentRole === "admin"
                                  ? "var(--sc-vermillion)"
                                  : "var(--sc-ash)",
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
                            <LedgerBtn
                              onClick={() => handleSaveRole(u)}
                              disabled={!dirty}
                              variant="primary"
                            >
                              Save
                            </LedgerBtn>
                            <LedgerBtn
                              onClick={() => handleDelete(u)}
                              variant="danger"
                            >
                              Delete
                            </LedgerBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* ── LOGIN LOGS TAB ────────────────────────────── */}
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
                      style={{ transition: "background 0.15s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(109,40,217,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <td style={tdStyle}>{l.l_email_attempted}</td>
                      <td style={tdStyle}>
                        {/*
                         * Status badge: granted = jade seal, denied = vermillion.
                         * Color encodes the bureaucratic approval / rejection.
                         */}
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "0.55rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.7rem",
                            borderRadius: "9999px",
                            background: l.l_success
                              ? "rgba(74,124,89,0.10)"
                              : "rgba(192,57,43,0.08)",
                            color: l.l_success
                              ? "var(--sc-jade)"
                              : "var(--sc-vermillion)",
                            border: `1px solid ${
                              l.l_success
                                ? "rgba(74,124,89,0.25)"
                                : "rgba(192,57,43,0.25)"
                            }`,
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
                          color: "var(--sc-ash-light)",
                        }}
                      >
                        {l.l_ip_address}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontSize: "0.8rem",
                          color: "var(--sc-ash-light)",
                        }}
                      >
                        {l.l_created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ── SESSIONS TAB ──────────────────────────────── */}
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
                      style={{ transition: "background 0.15s" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(109,40,217,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <td style={tdStyle}>{s.u_email}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontFamily: "monospace",
                          fontSize: "0.72rem",
                          color: "var(--sc-ash-light)",
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
                          color: "var(--sc-ash-light)",
                        }}
                      >
                        {s.s_login_time}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          fontSize: "0.8rem",
                          color: "var(--sc-ash-light)",
                        }}
                      >
                        {s.s_logout_time ?? "—"}
                      </td>
                      <td style={tdStyle}>
                        {/* Present = jade, Departed = muted ash */}
                        <span
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: "0.55rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            padding: "0.2rem 0.7rem",
                            borderRadius: "9999px",
                            background: s.s_logout_time
                              ? "rgba(26,16,8,0.05)"
                              : "rgba(74,124,89,0.10)",
                            color: s.s_logout_time
                              ? "var(--sc-ash-light)"
                              : "var(--sc-jade)",
                            border: `1px solid ${
                              s.s_logout_time
                                ? "rgba(26,16,8,0.10)"
                                : "rgba(74,124,89,0.25)"
                            }`,
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

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/**
 * LedgerBtn — action button for table rows.
 * "primary" variant = purple save; "danger" variant = vermillion delete.
 * Disabled state: greyed out, non-interactive.
 *
 * @param {function} onClick  - Click handler
 * @param {boolean}  disabled - Prevents interaction when true
 * @param {"primary"|"danger"} variant - Visual style
 * @param {ReactNode} children - Button label
 */
function LedgerBtn({ onClick, disabled, variant, children }) {
  const base = {
    fontFamily: "var(--font-ui)",
    fontSize: "0.55rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    padding: "0.28rem 0.65rem",
    borderRadius: "0",
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    transition: "background 0.15s, color 0.15s, border-color 0.15s",
  };

  const variants = {
    primary: {
      background: disabled ? "var(--sc-paper-shadow)" : "var(--sc-purple)",
      color: disabled ? "var(--sc-ash-light)" : "#fff",
      boxShadow: disabled ? "none" : "0 2px 6px var(--sc-purple-glow)",
    },
    danger: {
      background: "none",
      color: "rgba(192,57,43,0.55)",
      border: "1px solid rgba(192,57,43,0.28)",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "var(--sc-purple-lt)";
          e.currentTarget.style.boxShadow = "0 3px 10px var(--sc-purple-glow)";
        }
        if (variant === "danger") {
          e.currentTarget.style.background = "rgba(192,57,43,0.06)";
          e.currentTarget.style.color = "var(--sc-vermillion)";
          e.currentTarget.style.borderColor = "rgba(192,57,43,0.45)";
        }
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "var(--sc-purple)";
          e.currentTarget.style.boxShadow = "0 2px 6px var(--sc-purple-glow)";
        }
        if (variant === "danger") {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.color = "rgba(192,57,43,0.55)";
          e.currentTarget.style.borderColor = "rgba(192,57,43,0.28)";
        }
      }}
    >
      {children}
    </button>
  );
}

/*
 * thStyle — sticky table header cell.
 * Gold inset bottom border = ink-ruled column header in a ledger.
 * Silk bg + sticky ensures headers remain visible while scrolling.
 */
const thStyle = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontFamily: "var(--font-ui)",
  fontSize: "0.55rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "var(--sc-ash-light)",
  borderBottom: "1px solid var(--sc-border-ink)",
  boxShadow: "0 1px 0 rgba(184,134,11,0.15)",
  background: "var(--sc-silk)",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

/*
 * tdStyle — standard table data cell.
 * Ink-ruled bottom border at reduced opacity = faint ledger column line.
 */
const tdStyle = {
  padding: "0.75rem 1rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  color: "var(--sc-ash)",
  borderBottom: "1px solid rgba(26,16,8,0.07)",
};
