import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

/*
  Login.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento-card login form
  Layout  : Centered single card, solid surface, no raw bg text
  Palette : --gz-* tokens from index.css
  Fonts   : Playfair Display (heading) · Josefin Sans (labels/btn) · Lato (inputs/body)
*/
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
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--gz-bark)",
        paddingTop: "5rem" /* clear floating pill navbar */,
      }}
    >
      {/* Subtle radial glow behind card — tropical warmth */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(45,106,79,0.12) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── LOGIN CARD ── */}
      <div
        className="relative w-full max-w-sm rounded-2xl px-8 py-10"
        style={{
          background: "var(--gz-soil)",
          border: "1px solid var(--gz-driftwood)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── TOP ORNAMENT ── */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-border)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              color: "var(--gz-emerald-lt)",
              fontStyle: "italic",
            }}
          >
            GroundZero
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-border)" }}
          />
        </div>

        {/* ── HEADING ── */}
        <h1
          className="text-center mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--gz-cream)",
          }}
        >
          Welcome Back
        </h1>
        <p
          className="text-center italic mb-8"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "var(--gz-sand)",
            opacity: 0.6,
          }}
        >
          Sign in to your account
        </p>

        {/* ── FORM ── */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gz-olive-lt)",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                background: "var(--gz-bark)",
                border: "1px solid var(--gz-driftwood)",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.9rem",
                color: "var(--gz-cream)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--gz-emerald)";
                e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--gz-driftwood)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gz-olive-lt)",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              required
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                background: "var(--gz-bark)",
                border: "1px solid var(--gz-driftwood)",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.9rem",
                color: "var(--gz-cream)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--gz-emerald)";
                e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--gz-driftwood)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-center italic text-sm"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--gz-danger)",
                opacity: 0.85,
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.85rem",
              marginTop: "0.25rem",
              background: loading
                ? "var(--gz-emerald-dim)"
                : "var(--gz-emerald)",
              color: "var(--gz-cream)",
              border: "none",
              borderRadius: "0.5rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "background 0.15s, opacity 0.15s",
              boxShadow: "0 4px 16px rgba(45,106,79,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.background = "var(--gz-emerald-lt)";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                e.currentTarget.style.background = "var(--gz-emerald)";
            }}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        {/* ── BOTTOM DIVIDER + LINK ── */}
        <div className="flex items-center gap-3 mt-8 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-driftwood)", opacity: 0.4 }}
          />
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.55rem",
              color: "var(--gz-driftwood)",
            }}
          >
            ✦
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-driftwood)", opacity: 0.4 }}
          />
        </div>

        <p
          className="text-center italic text-sm"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--gz-sand)",
            opacity: 0.55,
          }}
        >
          No account yet?{" "}
          <Link
            to="/signup"
            style={{
              fontStyle: "normal",
              color: "var(--gz-emerald-lt)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--gz-olive-lt)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--gz-emerald-lt)")
            }
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
