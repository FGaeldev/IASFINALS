import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

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
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950/95" />

      {/* Card */}
      <div className="relative w-full max-w-sm">

        {/* Top ornament */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-amber-900/40" />
          <span
            className="text-amber-500/90 text-xs tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Nomads
          </span>
          <div className="flex-1 h-px bg-amber-900/40" />
        </div>

        {/* Heading */}
        <h1
          className="text-amber-200 text-3xl tracking-[0.2em] uppercase text-center mb-1"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
        >
          Enter
        </h1>
        <p
          className="text-amber-100/55 text-sm text-center italic mb-8"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          Identify yourself to the order
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div className="space-y-1">
            <label
              className="text-amber-500/90 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-100 placeholder-zinc-500 transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem" }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              className="text-amber-500/90 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-100 placeholder-zinc-500 transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem" }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-red-400/80 text-sm italic text-center"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/30"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
          >
            {loading ? "Verifying..." : "Present Credentials"}
          </button>
        </form>

        {/* Bottom rule + link */}
        <div className="flex items-center gap-3 mt-8 mb-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-700 text-xs">✦</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <p
          className="text-center text-zinc-400 text-sm italic"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          Not yet sworn in?{" "}
          <Link
            to="/signup"
            className="text-amber-600/80 hover:text-amber-500 not-italic transition-colors"
          >
            Pledge allegiance
          </Link>
        </p>

      </div>
    </div>
  );
}