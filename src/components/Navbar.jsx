import { useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter    = { fontFamily: "'Inter', sans-serif" };

export default function Navbar() {
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) window.location.href = "/login";
  };

  const linkStyle = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition-colors ${
      isActive ? "text-yellow-500" : "text-neutral-400 hover:text-white"
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `text-xs tracking-widest uppercase transition-colors block py-2 border-b border-neutral-900 ${
      isActive ? "text-yellow-500" : "text-neutral-400 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <NavLink
          to="/"
          className="text-white text-xl tracking-[0.25em] uppercase"
          style={{ ...playfair, fontWeight: 700 }}
        >
          Lockheart
        </NavLink>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8" style={inter}>
          {user === undefined && (
            <span className="text-xs text-neutral-700 tracking-widest">···</span>
          )}
          {user === null && (
            <>
              <NavLink to="/login"  className={linkStyle}>Sign In</NavLink>
              <NavLink to="/signup"
                className="text-xs tracking-widest uppercase px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                Register
              </NavLink>
            </>
          )}
          {user && (
            <>
              {user.role === "admin" && (
                <NavLink to="/admin" className={linkStyle}>Admin</NavLink>
              )}
              <NavLink to="/profile" className={linkStyle}>Account</NavLink>
              <button
                onClick={handleLogout}
                className="text-xs tracking-widest uppercase text-neutral-600 hover:text-red-400 transition-colors"
                style={inter}
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-1"
        >
          <span className={`block w-5 h-px bg-neutral-400 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-neutral-400 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-neutral-400 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-black border-t border-neutral-900 px-6 py-4 flex flex-col" style={inter}>
          {user === null && (
            <>
              <NavLink to="/login"  onClick={() => setOpen(false)} className={mobileLinkStyle}>Sign In</NavLink>
              <NavLink to="/signup" onClick={() => setOpen(false)} className={mobileLinkStyle}>Register</NavLink>
            </>
          )}
          {user && (
            <>
              {user.role === "admin" && (
                <NavLink to="/admin" onClick={() => setOpen(false)} className={mobileLinkStyle}>Admin</NavLink>
              )}
              <NavLink to="/profile" onClick={() => setOpen(false)} className={mobileLinkStyle}>Account</NavLink>
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="text-xs tracking-widest uppercase text-neutral-600 hover:text-red-400 transition-colors text-left py-2"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}