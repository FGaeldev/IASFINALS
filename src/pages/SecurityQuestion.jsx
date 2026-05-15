/**
 * SecurityQuestion.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Second authentication factor. Fetches the user's
 *               registered security question on mount, accepts their
 *               answer, and redirects to the appropriate dashboard.
 * Theme       : Ancient Japanese scroll — specifically an "oraculo"
 *               (神託, shintaku) — an oracle tablet or shrine petition
 *               scroll. The question is presented as sacred text on
 *               aged paper inside a formal document frame. The hint is
 *               concealed behind an ink-wash veil, revealed on hover —
 *               like lifting a silk cloth from a shrine inscription.
 *               Vermillion torii gate motif anchors the header crest.
 * Layout      : Centered scroll column, narrower than Signup (max 400px).
 *               Same jiku dowel caps as Signup for visual continuity.
 * Logic       : Unchanged from original — getSecurityQuestion() on mount,
 *               verify2fa() on submit. Redirects by role on success.
 * Dependencies: react (useState, useEffect), ../services/authService
 * Tokens      : All colors from --sc-* variables in index.css.
 */

import { useState, useEffect } from "react";
import { verify2fa, getSecurityQuestion } from "../services/authService";

export default function SecurityQuestion() {
  /* ── Local state ──────────────────────────────────────────────── */
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Fetch the security question on component mount.
   * If the service returns failure (no pending session / expired),
   * hard-redirect to /login — the user should not be on this page.
   */
  useEffect(() => {
    getSecurityQuestion().then((res) => {
      if (res.success) {
        setQuestion(res.data.question);
        setHint(res.data.hint);
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    });
  }, []);

  /**
   * handleSubmit
   * Submits the user's answer to the verify2fa endpoint.
   * On success: redirects by role (admin → /admin, user → /user).
   * On failure: surfaces error inline, does not redirect.
   *
   * @param {React.FormEvent} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await verify2fa(answer);
    setSubmitting(false);

    if (res.success) {
      const role = res.data.role;
      if (role === "admin") window.location.href = "/admin";
      else if (role === "user") window.location.href = "/user";
      else window.location.href = "/";
    } else {
      setError(res.message);
    }
  };

  /*
   * Guard: render nothing until the question is fetched.
   * Prevents flash of empty form before redirect or data load.
   */
  if (loading) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--sc-paper)",
        paddingTop: "5rem",
        /*
         * Washi paper texture — faint vertical fiber lines +
         * a central amber warmth glow beneath the scroll.
         */
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 55%,
            rgba(184,134,11,0.06) 0%, transparent 65%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            rgba(26,16,8,0.012) 100px,
            rgba(26,16,8,0.012) 101px
          )
        `,
      }}
    >
      {/* ── SCROLL COLUMN ────────────────────────────────────────── */}
      <div className="relative w-full" style={{ maxWidth: "400px" }}>
        {/* ══════════════════════════════════════════════════════════
            SCROLL TOP CAP — jiku (軸) wooden dowel
            Same gilded dowel treatment as Signup for page continuity.
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            height: "22px",
            borderRadius: "9999px",
            background: `linear-gradient(180deg,
              #c8a96e 0%,
              #e8d5a3 35%,
              #d4b97a 60%,
              #b8952e 100%
            )`,
            boxShadow: `
              0 -3px 8px  rgba(26,16,8,0.18),
              0  4px 12px rgba(26,16,8,0.22),
              0  1px 0    rgba(255,245,200,0.6) inset
            `,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* ══════════════════════════════════════════════════════════
            SCROLL BODY
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            margin: "0 6px",
            background: "var(--sc-paper-aged)",
            borderLeft: "1px solid rgba(184,134,11,0.25)",
            borderRight: "1px solid rgba(184,134,11,0.25)",
            boxShadow: `
              -4px 0 12px rgba(26,16,8,0.06),
               4px 0 12px rgba(26,16,8,0.06),
               0   0 40px rgba(26,16,8,0.04) inset
            `,
            padding: "2.5rem 2.5rem 3rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── TORII HEADER CREST ───────────────────────────── */}
          {/*
           * Torii gate (鳥居) abstraction — two vertical pillars +
           * a double horizontal kasagi beam. The torii marks the
           * boundary between the mundane and the sacred; appropriate
           * for a shrine-gate authentication challenge. Rendered
           * purely in CSS — no SVG dependency.
           */}
          <div className="flex flex-col items-center gap-3 mb-8">
            {/* Torii gate SVG — inline, no external asset required */}
            <svg
              width="48"
              height="42"
              viewBox="0 0 48 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Torii gate crest"
            >
              {/* Top kasagi beam — slightly wider, overhangs pillars */}
              <rect
                x="1"
                y="2"
                width="46"
                height="4"
                rx="1"
                fill="var(--sc-vermillion)"
                opacity="0.85"
              />
              {/* Second nuki beam — inset, sits below kasagi */}
              <rect
                x="6"
                y="10"
                width="36"
                height="3"
                rx="0.5"
                fill="var(--sc-vermillion)"
                opacity="0.65"
              />
              {/* Left pillar */}
              <rect
                x="10"
                y="10"
                width="4"
                height="32"
                rx="1"
                fill="var(--sc-vermillion)"
                opacity="0.80"
              />
              {/* Right pillar */}
              <rect
                x="34"
                y="10"
                width="4"
                height="32"
                rx="1"
                fill="var(--sc-vermillion)"
                opacity="0.80"
              />
            </svg>

            {/* Oracle label — vertical rhythm borrowed from tategumi */}
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: "0.6rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "var(--sc-vermillion)",
                opacity: 0.8,
              }}
            >
              The Shrine Gate
            </span>

            {/* Gold ink rule */}
            <div
              style={{
                width: "100%",
                height: "1px",
                background: `linear-gradient(90deg,
                  transparent 0%,
                  var(--sc-border-warm) 20%,
                  var(--sc-gold) 50%,
                  var(--sc-border-warm) 80%,
                  transparent 100%
                )`,
              }}
            />
          </div>

          {/* ── HEADING ──────────────────────────────────────── */}
          <h1
            className="text-center mb-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.85rem",
              color: "var(--sc-ink)",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            Prove Thyself
          </h1>
          <p
            className="text-center italic mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              color: "var(--sc-ash-light)",
              opacity: 0.85,
            }}
          >
            Answer to be granted passage
          </p>

          {/* ── ORACLE QUESTION BLOCK ────────────────────────── */}
          {/*
           * Styled as a formal document inset — a "zassho" (雑書),
           * an official notation block within a scroll. Slightly
           * recessed background + left gold border mark it as quoted
           * or cited text, distinct from the surrounding paper.
           */}
          <div
            style={{
              background: "var(--sc-paper)",
              borderLeft: "3px solid var(--sc-gold)",
              padding: "1rem 1.25rem",
              marginBottom: "1.75rem",
              boxShadow: "2px 2px 8px rgba(26,16,8,0.06) inset",
            }}
          >
            {/* Section label — annotation style */}
            <p
              className="text-xs tracking-widest uppercase mb-2"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--sc-gold)",
                fontWeight: 500,
                letterSpacing: "0.3em",
              }}
            >
              Your Question
            </p>

            {/* The question itself — set in Playfair for document weight */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                color: "var(--sc-ink)",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              {question}
            </p>

            {/* ── HOVER-TO-REVEAL HINT ─────────────────────── */}
            {/*
             * Hint concealed by a tilde-wave veil — a visual metaphor
             * for a silk cloth (帛紗, fukusa) draped over a shrine
             * offering. Hover lifts the veil and reveals the text.
             * Uses CSS group-hover via Tailwind — no JS state needed.
             */}
            {hint && (
              <div className="group flex items-center gap-2 mt-4 cursor-default select-none">
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--sc-gold)",
                    opacity: 0.7,
                    flexShrink: 0,
                  }}
                >
                  Hint
                </span>

                {/* Veil + revealed text stacked in relative container */}
                <span className="relative text-sm italic">
                  {/*
                   * Veil layer: tilde waves rendered in ash tone.
                   * Fades to opacity-0 on group hover — the cloth lifts.
                   */}
                  <span
                    className="absolute inset-0 transition-opacity duration-400 group-hover:opacity-0!"
                    style={{
                      color: "var(--sc-ash-light)",
                      opacity: 0.5,
                    }}
                  >
                    ~~~~~~~~
                  </span>

                  {/*
                   * Revealed hint: blurred + invisible by default.
                   * Unblurs and becomes visible on group hover.
                   * duration-400 for a slow, ceremonial reveal.
                   */}
                  <span
                    className="transition-all duration-500 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--sc-ash)",
                    }}
                  >
                    {hint}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* ── ANSWER FORM ──────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.60rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--sc-ash-light)",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {/* Vermillion required dot — annotation mark */}
                <span
                  style={{
                    display: "inline-block",
                    width: "4px",
                    height: "4px",
                    borderRadius: "9999px",
                    background: "var(--sc-vermillion)",
                    flexShrink: 0,
                  }}
                />
                Your Answer
              </label>

              {/*
               * Flat underline input — same scroll-input treatment
               * as Signup. Brushed ink on paper, not a boxed field.
               */}
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Speak your truth…"
                required
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1.5px solid var(--sc-border-ink)",
                  borderRadius: "0",
                  padding: "0.5rem 0.25rem",
                  color: "var(--sc-ink)",
                  outline: "none",
                  width: "100%",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--sc-purple)";
                  e.target.style.boxShadow = "0 2px 0 var(--sc-purple-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--sc-border-ink)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Inline error */}
            {error && (
              <p
                className="text-center text-sm italic"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--sc-vermillion)",
                  opacity: 0.9,
                }}
              >
                {error}
              </p>
            )}

            {/* ── SUBMIT BUTTON + hanko underline seal ──────── */}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 600,
                  fontSize: "0.68rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "0.9rem",
                  width: "100%",
                  background: submitting
                    ? "var(--sc-paper-shadow)"
                    : "var(--sc-purple)",
                  color: submitting ? "var(--sc-ash-light)" : "#fff",
                  border: "none",
                  borderRadius: "0",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.65 : 1,
                  transition: "background 0.15s, box-shadow 0.15s",
                  boxShadow: submitting
                    ? "none"
                    : `0 4px 16px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = "var(--sc-purple-lt)";
                    e.currentTarget.style.boxShadow = `0 6px 20px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.background = "var(--sc-purple)";
                    e.currentTarget.style.boxShadow = `0 4px 16px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`;
                  }
                }}
              >
                {submitting
                  ? "Consulting the Oracle…"
                  : "Pass Through the Gate"}
              </button>

              {/* Vermillion hanko seal underline */}
              <div
                style={{
                  height: "3px",
                  background: "var(--sc-vermillion)",
                  opacity: submitting ? 0.3 : 0.7,
                  transition: "opacity 0.15s",
                }}
              />
            </div>
          </form>

          {/* ── SCROLL FOOTER RULE ───────────────────────────── */}
          <div className="flex items-center gap-3 mt-8">
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg,
                  transparent, var(--sc-border-ink) 80%)`,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.52rem",
                color: "var(--sc-gold)",
                opacity: 0.6,
              }}
            >
              ✦
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg,
                  var(--sc-border-ink) 20%, transparent)`,
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SCROLL BOTTOM CAP — closing jiku dowel
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            height: "22px",
            borderRadius: "9999px",
            background: `linear-gradient(180deg,
              #b8952e 0%,
              #d4b97a 30%,
              #e8d5a3 55%,
              #c8a96e 80%,
              #8a6520 100%
            )`,
            boxShadow: `
              0  3px 10px rgba(26,16,8,0.22),
              0 -2px  6px rgba(26,16,8,0.12),
              0 -1px  0   rgba(255,245,200,0.4) inset
            `,
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
