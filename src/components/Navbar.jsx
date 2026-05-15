/**
 * Navbar.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Site-wide navigation bar. Floating pill, fixed top.
 *               Adapts content to auth state via useAuth().
 * Theme       : Shoji screen pill — frosted translucent warm silk,
 *               gold inset hairline border echoing Edo folding screens.
 *               Desktop: horizontal pill with inline links.
 *               Mobile : hamburger toggles a dropdown panel.
 * Tokens      : --sc-* CSS variables from index.css.
 * Classes     : .sc-* utility classes from index.css where reusable.
 * Dependencies: react (useState), react-router-dom (NavLink),
 *               ../hooks/useAuth, ../services/authService (logout)
 */

import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

export default function Navbar() {
  const user = useAuth();
  const [open, setOpen] = useState(false);

  /**
   * handleLogout
   * Calls auth service logout, then hard-navigates to /login on success.
   * Hard navigation clears all in-memory React auth state.
   *
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    const res = await logout();
    if (res.success) window.location.href = "/login";
  };

  return (
    /*
     * Outer wrapper: fixed positioning only — no pointer-events blocking.
     * The pill and dropdown manage their own interactivity.
     */
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4">
      {/* ── PILL NAV ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between gap-6 px-5 w-full"
        style={{
          pointerEvents: "auto",
          /*
           * Shoji screen surface: silk white at high opacity, blurred.
           * Mimics frosted paper panels in a traditional room divider.
           */
          background: "rgba(250,247,242,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid var(--sc-border-ink)",
          /*
           * Gold inset hairline — gilded screen border reference.
           * Ambient drop shadows keep the pill lifted off the page.
           */
          boxShadow: `
            0 1px 0 rgba(184,134,11,0.30) inset,
            0 8px 32px rgba(26,16,8,0.10),
            0 2px  8px rgba(26,16,8,0.06)
          `,
          borderRadius: "9999px",
          height: "3rem",
          maxWidth: "720px",
        }}
      >
        {/* ── LOGO ─────────────────────────────────────────────── */}
        <NavLink
          to="/"
          style={{ textDecoration: "none", flexShrink: 0 }}
          className="flex items-baseline gap-2"
        >
          {/*
           * Cinzel logotype: Roman-carved weight reads as prestigious
           * and slightly fantastical — fitting for an Eastern cosplay brand.
           */}
          <span
            style={{
              fontFamily: "var(--font-logo)",
              fontWeight: 700,
              fontSize: "0.88rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sc-ink)",
            }}
          >
            Schaden
            <span style={{ color: "var(--sc-purple)" }}>'s</span>
          </span>

          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--sc-ash-light)",
              opacity: 0.75,
            }}
          >
            Cosplay
          </span>
        </NavLink>

        {/* ── DESKTOP LINKS ────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-5">
          {/* Auth check in flight */}
          {user === undefined && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.6rem",
                color: "var(--sc-ash-light)",
                letterSpacing: "0.2em",
                opacity: 0.5,
              }}
            >
              ···
            </span>
          )}

          {/* Unauthenticated */}
          {user === null && (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ghostLink(isActive)}
              >
                Login
              </NavLink>

              {/* Primary acquisition CTA — filled purple pill */}
              <NavLink
                to="/signup"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "0.35rem 1rem",
                  background: "var(--sc-purple)",
                  color: "#fff",
                  borderRadius: "9999px",
                  transition: "background 0.15s, box-shadow 0.15s",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px var(--sc-purple-glow)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--sc-purple-lt)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px var(--sc-purple-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--sc-purple)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px var(--sc-purple-glow)";
                }}
              >
                Join the Shop
              </NavLink>
            </>
          )}

          {/* Authenticated */}
          {user && (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  style={({ isActive }) => ghostLink(isActive)}
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                style={({ isActive }) => ghostLink(isActive)}
              >
                Profile
              </NavLink>

              {/* Separator dot */}
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "9999px",
                  background: "var(--sc-border-ink)",
                  opacity: 0.4,
                }}
              />

              <button
                onClick={handleLogout}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(192,57,43,0.45)",
                  transition: "color 0.15s",
                  padding: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--sc-danger)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(192,57,43,0.45)")
                }
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ── MOBILE HAMBURGER ─────────────────────────────────── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1.5"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            flexShrink: 0,
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "1.1rem",
                height: "1.5px",
                background: "var(--sc-ink-soft)",
                borderRadius: "2px",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform:
                  open && i === 0
                    ? "rotate(45deg) translateY(5px)"
                    : open && i === 2
                      ? "rotate(-45deg) translateY(-5px)"
                      : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── MOBILE DROPDOWN ──────────────────────────────────────── */}
      {/*
       * Outside the pill — avoids overflow/pointer-events constraints.
       * Uses sc-panel class for the aged-silk paper surface + gold inset.
       */}
      {open && (
        <div
          className="md:hidden w-full mt-2 sc-panel"
          style={{
            maxWidth: "720px",
            pointerEvents: "auto",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "1.25rem",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {user === null && (
            <>
              <MobileLink to="/login" onClick={() => setOpen(false)}>
                Login
              </MobileLink>
              <MobileLink to="/signup" onClick={() => setOpen(false)}>
                Join the Shop
              </MobileLink>
            </>
          )}

          {user && (
            <>
              {user.role === "admin" && (
                <MobileLink to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </MobileLink>
              )}
              <MobileLink to="/profile" onClick={() => setOpen(false)}>
                Profile
              </MobileLink>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  borderTop: "1px solid var(--sc-border-ink)",
                  cursor: "pointer",
                  color: "rgba(192,57,43,0.55)",
                  textAlign: "left",
                  paddingTop: "0.85rem",
                  marginTop: "0.5rem",
                  width: "100%",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--sc-danger)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(192,57,43,0.55)")
                }
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HELPER: ghostLink
   ─────────────────────────────────────────────────────────────────
   Desktop ghost nav link style. Active = purple; inactive = muted ash.

   @param  {boolean} isActive - From NavLink style callback
   @returns {object}  React inline style object
   ═══════════════════════════════════════════════════════════════════ */
function ghostLink(isActive) {
  return {
    fontFamily: "var(--font-ui)",
    fontSize: "0.62rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: isActive ? "var(--sc-purple)" : "var(--sc-ash-light)",
    fontWeight: isActive ? 500 : 400,
    transition: "color 0.15s",
    whiteSpace: "nowrap",
  };
}

/* ═══════════════════════════════════════════════════════════════════
   HELPER: MobileLink
   ─────────────────────────────────────────────────────────────────
   Full-width tappable row for mobile dropdown. Ink-stroke bottom border.

   @param  {string}    to       - Route path
   @param  {function}  onClick  - Closes dropdown on tap
   @param  {ReactNode} children - Link label
   @returns {JSX.Element}
   ═══════════════════════════════════════════════════════════════════ */
function MobileLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        fontFamily: "var(--font-ui)",
        fontSize: "0.68rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        textDecoration: "none",
        display: "block",
        padding: "0.55rem 0",
        borderBottom: "1px solid var(--sc-border-ink)",
        color: isActive ? "var(--sc-purple)" : "var(--sc-ash)",
        fontWeight: isActive ? 500 : 400,
        transition: "color 0.15s",
      })}
    >
      {children}
    </NavLink>
  );
}
