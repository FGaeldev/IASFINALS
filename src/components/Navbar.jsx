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

  // shared glass style
  const glass =
    "bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg";

  const linkStyle = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-300 font-semibold"
        : "text-gray-200 hover:text-white"
    }`;

  return (
    <nav className="fixed top-4 right-6 z-50">

      {/* DESKTOP NAV */}
      <div
        className={`hidden md:flex items-center gap-4 px-5 py-2 rounded-full ${glass}`}
      >
        <NavLink to="/" className={linkStyle}>
          Home
        </NavLink>

        {user === undefined && (
          <span className="text-sm text-gray-300">Loading...</span>
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
            {user.role === "user" && (
              <NavLink to="/user" className={linkStyle}>
                Dashboard
              </NavLink>
            )}

            {user.role === "admin" && (
              <NavLink to="/admin" className={linkStyle}>
                Admin
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-300 hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden">

        {/* hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`p-2 rounded-full ${glass}`}
        >
          <div className="space-y-1">
            <span className="block w-5 h-0.5 bg-gray-200"></span>
            <span className="block w-5 h-0.5 bg-gray-200"></span>
            <span className="block w-5 h-0.5 bg-gray-200"></span>
          </div>
        </button>

        {/* dropdown */}
        {open && (
          <div
            className={`absolute right-0 mt-3 w-48 p-3 flex flex-col space-y-2 rounded-xl ${glass}`}
          >
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              Home
            </NavLink>

            {user === null && (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={linkStyle}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className={linkStyle}
                >
                  Sign Up
                </NavLink>
              </>
            )}

            {user && (
              <>
                {user.role === "user" && (
                  <NavLink
                    to="/user"
                    onClick={() => setOpen(false)}
                    className={linkStyle}
                  >
                    Dashboard
                  </NavLink>
                )}

                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className={linkStyle}
                  >
                    Admin
                  </NavLink>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="text-sm text-red-300 hover:text-red-400 text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}