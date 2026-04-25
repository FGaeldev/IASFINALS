import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const inputClass =
  "w-full px-4 py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-700/30 text-white placeholder-neutral-600 transition-colors text-sm";
const labelClass =
  "text-neutral-500 text-xs tracking-widest uppercase block mb-1.5";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      window.location.href = "/security-question";
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-black pt-16">
      {/* LEFT — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        {/* Brand */}
        <p
          className="text-yellow-600/70 text-xs tracking-[0.5em] uppercase mb-8"
          style={inter}
        >
          Lockheart
        </p>

        {/* Heading */}
        <h1
          className="text-white text-3xl md:text-4xl leading-tight mb-2"
          style={{ ...playfair, fontWeight: 700 }}
        >
          Welcome back.
        </h1>
        <p className="text-neutral-600 text-sm mb-10" style={inter}>
          Sign in to your Lockheart account.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 max-w-sm">
          <div>
            <label className={labelClass} style={inter}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
              style={inter}
            />
          </div>

          <div>
            <label className={labelClass} style={inter}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              className={inputClass}
              style={inter}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs" style={inter}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-sm py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs tracking-[0.2em] uppercase transition-colors"
            style={{ ...inter, fontWeight: 600 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-neutral-600 text-xs mt-8 max-w-sm" style={inter}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-600 hover:text-yellow-500 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* RIGHT — image, hidden on mobile */}
      <div
        className="hidden md:block flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="w-full h-full bg-black/20" />
      </div>
    </div>
  );
}
