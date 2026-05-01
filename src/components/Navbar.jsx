import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

/*
  Navbar.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — floating pill
  Fix     : Mobile dropdown moved OUTSIDE pointerEvents:none wrapper
            so clicks register correctly
  Fonts   : Playfair Display (logo) · Josefin Sans (links)
*/
export default function Navbar() {
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) window.location.href = "/login";
  };

  return (
    /* Outer — purely for fixed positioning, no pointer blocking */
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4">
      {/* ── PILL ── */}
      <nav
        className="flex items-center justify-between gap-6 px-5 backdrop-blur-md w-full"
        style={{
          pointerEvents: "auto",
          background: "rgba(30,32,24,0.88)",
          border: "1px solid var(--gz-driftwood)",
          borderRadius: "9999px",
          height: "3rem",
          maxWidth: "680px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(96,108,56,0.15) inset",
        }}
      >
        {/* ── LOGO ── */}
        <NavLink
          to="/"
          style={{ textDecoration: "none", flexShrink: 0 }}
          className="flex items-baseline gap-1.5"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.95rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gz-cream)",
            }}
          >
            Ground<span style={{ color: "var(--gz-emerald-lt)" }}>Zero</span>
          </span>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 300,
              fontSize: "0.52rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gz-olive-lt)",
              opacity: 0.6,
            }}
          >
            UMS
          </span>
        </NavLink>

        {/* ── DESKTOP LINKS ── */}
        <div className="hidden md:flex items-center gap-5">
          {user === undefined && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.6rem",
                color: "var(--gz-driftwood)",
                letterSpacing: "0.2em",
              }}
            >
              ···
            </span>
          )}
          {user === null && (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ghostLink(isActive)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "0.35rem 0.9rem",
                  background: "var(--gz-emerald)",
                  color: "var(--gz-cream)",
                  borderRadius: "9999px",
                  transition: "background 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--gz-emerald-lt)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--gz-emerald)")
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
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
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "9999px",
                  background: "var(--gz-driftwood)",
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
                  color: "rgba(193,68,14,0.55)",
                  transition: "color 0.15s",
                  padding: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--gz-danger)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(193,68,14,0.55)")
                }
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1.25"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem",
            flexShrink: 0,
          }}
          aria-label="Toggle navigation menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "1.1rem",
                height: "1px",
                background: "rgba(240,230,211,0.65)",
                transition: "transform 0.2s, opacity 0.2s",
                transform:
                  open && i === 0
                    ? "rotate(45deg) translateY(6px)"
                    : open && i === 2
                      ? "rotate(-45deg) translateY(-6px)"
                      : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* ── MOBILE DROPDOWN — outside pointerEvents:none, directly below pill ── */}
      {open && (
        <div
          className="md:hidden w-full mt-2"
          style={{
            maxWidth: "680px",
            pointerEvents: "auto" /* explicit — ensure clicks work */,
            background: "rgba(30,32,24,0.96)",
            border: "1px solid var(--gz-driftwood)",
            borderRadius: "1.25rem",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
          }}
        >
          {user === null && (
            <>
              <MobileLink to="/login" onClick={() => setOpen(false)}>
                Login
              </MobileLink>
              <MobileLink to="/signup" onClick={() => setOpen(false)}>
                Sign Up
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
                  borderTop: "1px solid var(--gz-driftwood)",
                  cursor: "pointer",
                  color: "rgba(193,68,14,0.6)",
                  textAlign: "left",
                  paddingTop: "0.75rem",
                  marginTop: "0.25rem",
                }}
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

/* ── Helpers ─────────────────────────────────────────────────────── */

function ghostLink(isActive) {
  return {
    fontFamily: "var(--font-ui)",
    fontSize: "0.62rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: isActive ? "var(--gz-emerald-lt)" : "rgba(201,185,154,0.5)",
    transition: "color 0.15s",
    whiteSpace: "nowrap",
  };
}

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
        padding: "0.4rem 0",
        borderBottom: "1px solid rgba(74,74,56,0.4)",
        color: isActive ? "var(--gz-emerald-lt)" : "rgba(201,185,154,0.55)",
        transition: "color 0.15s",
      })}
    >
      {children}
    </NavLink>
  );
}
