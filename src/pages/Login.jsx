/**
 * Login.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Authentication entry point for returning members.
 *               Submits credentials to the auth service and redirects
 *               to the security question step on success.
 * Theme       : Anime / Cosplay — Eastern art palette. Single centered
 *               card on a warm rice-paper background. Ink-stroke borders,
 *               gold hairline ornaments, violet CTA.
 * Layout      : Full-viewport centered flex. Card max-width 384px.
 * Dependencies: react (useState), react-router-dom (Link),
 *               ../services/authService (login)
 * Tokens      : All colors from --sc-* variables in index.css.
 *
 * Auth flow   : login() → success → /security-question
 *                        → failure → inline error message
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  /* ── Local state ──────────────────────────────────────────────── */
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  /**
   * handleLogin
   * Prevents default form submission, calls the login service,
   * then either redirects or surfaces the error message inline.
   *
   * @param {React.FormEvent} e - The form submit event
   * @returns {Promise<void>}
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      /*
       * Hard navigation intentional — clears any stale React auth
       * context before proceeding to the security question gate.
       */
      window.location.href = "/security-question";
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--sc-paper)",
        paddingTop: "5rem", /* clears the fixed floating navbar */
      }}
    >
      {/*
       * Background glow: soft violet radial behind the card.
       * Mimics the halo effect in anime key-art — character centered
       * in a pool of ambient light. pointer-events:none so it never
       * intercepts clicks.
       */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "640px",
          height: "640px",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── LOGIN CARD ─────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-sm rounded-2xl px-8 py-10"
        style={{
          background: "var(--sc-silk)",
          border: "1px solid var(--sc-border-ink)",
          /*
           * Shadow stack: gold inset hairline (folding-screen border
           * reference) + deep ambient drop shadow for depth.
           */
          boxShadow: `
            0 1px 0 rgba(184, 134, 11, 0.22) inset,
            0 24px 64px rgba(26, 16, 8, 0.10),
            0 4px 16px rgba(26, 16, 8, 0.06)
          `,
        }}
      >

        {/* ── TOP ORNAMENT — ink rule + brand wordmark ─────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--sc-border-warm)" }}
          />
          {/*
           * Center ornament: Cinzel logotype acts as a chapter marker —
           * same device used in illuminated manuscript section headers.
           */}
          <span
            style={{
              fontFamily: "var(--font-logo)",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              color: "var(--sc-gold)",
              textTransform: "uppercase",
            }}
          >
            Schaden's
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--sc-border-warm)" }}
          />
        </div>

        {/* ── HEADING ──────────────────────────────────────────── */}
        <h1
          className="text-center mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "0.06em",
            color: "var(--sc-ink)",
            lineHeight: 1.15,
          }}
        >
          Welcome Back
        </h1>
        <p
          className="text-center italic mb-8"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.88rem",
            color: "var(--sc-ash-light)",
            opacity: 0.85,
          }}
        >
          Sign in to your account
        </p>

        {/* ── FORM ─────────────────────────────────────────────── */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* ── EMAIL FIELD ──────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--sc-ash-light)",
                fontWeight: 500,
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
                background: "var(--sc-paper)",
                border: "1px solid var(--sc-border-ink)",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.9rem",
                color: "var(--sc-ink)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
                /*
                 * Placeholder color: muted ash — legible but clearly
                 * distinguishable from real input value.
                 */
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--sc-purple)";
                e.target.style.boxShadow   = "0 0 0 3px rgba(109,40,217,0.10)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--sc-border-ink)";
                e.target.style.boxShadow   = "none";
              }}
            />
          </div>

          {/* ── PASSWORD FIELD ───────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--sc-ash-light)",
                fontWeight: 500,
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
                background: "var(--sc-paper)",
                border: "1px solid var(--sc-border-ink)",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.9rem",
                color: "var(--sc-ink)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--sc-purple)";
                e.target.style.boxShadow   = "0 0 0 3px rgba(109,40,217,0.10)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--sc-border-ink)";
                e.target.style.boxShadow   = "none";
              }}
            />
          </div>

          {/* ── INLINE ERROR MESSAGE ─────────────────────────── */}
          {error && (
            <p
              className="text-center text-sm"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--sc-danger)",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              {error}
            </p>
          )}

          {/* ── SUBMIT BUTTON ────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 600,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.85rem",
              marginTop: "0.25rem",
              /*
               * Disabled state: desaturated purple-dim. Preserves
               * brand color without implying interactivity.
               */
              background: loading ? "var(--sc-purple-dim)" : "var(--sc-purple)",
              color: loading ? "var(--sc-ash-light)" : "#fff",
              border: "none",
              borderRadius: "0.5rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              transition: "background 0.15s, box-shadow 0.15s, opacity 0.15s",
              boxShadow: loading ? "none" : "0 4px 16px var(--sc-purple-glow)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background  = "var(--sc-purple-lt)";
                e.currentTarget.style.boxShadow   = "0 6px 20px var(--sc-purple-glow)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background  = "var(--sc-purple)";
                e.currentTarget.style.boxShadow   = "0 4px 16px var(--sc-purple-glow)";
              }
            }}
          >
            {loading ? "Verifying…" : "Enter the Shrine"}
          </button>
        </form>

        {/* ── BOTTOM DIVIDER ───────────────────────────────────── */}
        <div className="flex items-center gap-3 mt-8 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--sc-border-ink)", opacity: 0.5 }}
          />
          {/*
           * ✦ glyph: a four-point star used in classical East Asian
           * typographic ornament — equivalent to a Western fleuron.
           */}
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.55rem",
              color: "var(--sc-gold)",
              opacity: 0.7,
            }}
          >
            ✦
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--sc-border-ink)", opacity: 0.5 }}
          />
        </div>

        {/* ── SIGNUP REDIRECT LINK ─────────────────────────────── */}
        <p
          className="text-center text-sm"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--sc-ash-light)",
            fontStyle: "italic",
            opacity: 0.8,
          }}
        >
          No account yet?{" "}
          <Link
            to="/signup"
            style={{
              fontStyle: "normal",
              fontWeight: 500,
              color: "var(--sc-purple)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--sc-purple-lt)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--sc-purple)")
            }
          >
            Join the Guild
          </Link>
        </p>
      </div>
    </div>
  );
}