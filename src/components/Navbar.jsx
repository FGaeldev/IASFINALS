import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

export default function Navbar() {
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) window.location.href = "/login";
  };

  const linkStyle = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition font-normal ${
      isActive ? "text-amber-400" : "text-amber-100/60 hover:text-amber-200"
    }`;

  const mobileLink = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition block py-1 border-b border-zinc-800 ${
      isActive ? "text-amber-400" : "text-amber-100/60 hover:text-amber-200"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* LOGO */}
        <NavLink
          to="/"
          className="text-amber-400 text-lg tracking-[0.3em] uppercase"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
        >
          NOMAD|UMS
        </NavLink>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {user === undefined && (
            <span className="text-xs text-zinc-600 tracking-widest uppercase">
              ···
            </span>
          )}

          {user === null && (
            <>
              <NavLink to="/login" className={linkStyle}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkStyle}>
                Sign Up
              </NavLink>
            </>
          )}

          {user && (
            <>
              {user.role === "admin" && (
                <NavLink to="/admin" className={linkStyle}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/profile" className={linkStyle}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-1"
        >
          <span
            className={`block w-5 h-px bg-amber-200/60 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-amber-200/60 transition-all ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-amber-200/60 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-4 flex flex-col gap-3">
          {user === null && (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setOpen(false)}
                className={mobileLink}
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
                  onClick={() => setOpen(false)}
                  className={mobileLink}
                >
                  Admin
                </NavLink>
              )}
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                Profile
              </NavLink>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-xs tracking-widest uppercase text-red-400/60 hover:text-red-400 transition text-left py-1"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
