/**
 * Signup.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : New member registration. Collects credentials and a
 *               security question/answer for account recovery.
 * Theme       : Ancient Japanese scroll aesthetic. The page is designed
 *               to evoke an emaki (絵巻) — a horizontal picture scroll
 *               unrolled on a table. The form reads as text brushed onto
 *               washi paper, bordered by rolled-end caps (makimono).
 *               Ink rules divide sections. Gold mon crest centers the
 *               header. Vermillion seals mark required fields.
 * Layout      : Centered scroll column, max-width 480px. Scroll-end
 *               caps rendered via CSS border-radius + box-shadow above
 *               and below the form body.
 * Dependencies: react (useState, useMemo), react-router-dom (Link),
 *               ../services/authService (signup)
 * Tokens      : All colors from --sc-* variables in index.css.
 *
 * Password strength scoring (memoized):
 *   0 = empty | 1 = weak (<8 chars) | 2 = fair | 3 = good | 4 = strong
 *   Submit blocked at score < 3.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/authService";

export default function Signup() {
  /* ── Form state — all fields in one object for clean updater fn ── */
  const [form, setForm] = useState({
    email:             "",
    password:          "",
    confirmPassword:   "",
    security_question: "",
    security_answer:   "",
    security_hint:     "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * set
   * Curried field updater. Returns an onChange handler for a given key.
   * Keeps JSX clean — no inline arrow functions in every onChange.
   *
   * @param  {string} field - Key in the form state object
   * @returns {function}     onChange event handler
   */
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /**
   * strength (memoized)
   * Computes password strength score 0–4 based on length and character
   * class diversity. Recomputes only when form.password changes.
   *
   * Scoring rules:
   *   0 — empty
   *   1 — < 8 characters (always weak regardless of complexity)
   *   2 — 8+ chars, 1 character class present
   *   3 — 8+ chars, 2–3 character classes
   *   4 — 8+ chars, all 4 classes (lower + upper + digit + symbol)
   */
  const strength = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    if (p.length < 8) return 1;
    let score = 0;
    if (/[a-z]/.test(p))          score++;
    if (/[A-Z]/.test(p))          score++;
    if (/[0-9]/.test(p))          score++;
    if (/[^a-zA-Z0-9]/.test(p))   score++;
    return Math.max(1, score);
  }, [form.password]);

  /*
   * Strength metadata — maps score to display color and segment count.
   * Colors evoke traditional Japanese pigment names:
   *   beni (紅) red, yamabuki (山吹) gold, matcha green, indigo.
   */
  const strengthMeta = [
    null,
    { label: "Weak",   color: "var(--sc-vermillion)",  segments: 1 },
    { label: "Fair",   color: "var(--sc-gold)",         segments: 2 },
    { label: "Good",   color: "var(--sc-jade)",         segments: 3 },
    { label: "Strong", color: "var(--sc-purple)",       segments: 4 },
  ];

  /**
   * handleSignup
   * Validates client-side constraints, then calls the signup service.
   * Redirects to /login on success; surfaces error message on failure.
   * confirmPassword is stripped before sending — backend does not expect it.
   *
   * @param {React.FormEvent} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (strength < 3) {
      setError("Password too weak. Add uppercase, numbers, or symbols.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await signup({
      email:             form.email,
      password:          form.password,
      security_question: form.security_question,
      security_answer:   form.security_answer,
      security_hint:     form.security_hint,
    });
    setLoading(false);

    if (res.success) {
      window.location.href = "/login";
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-16"
      style={{
        background: "var(--sc-paper)",
        paddingTop: "6rem",
        /*
         * Faint woodgrain-like vertical gradient — evokes the fibrous
         * surface of kozo washi paper held up to light.
         */
        backgroundImage: `
          radial-gradient(ellipse 100% 80% at 50% 0%,
            rgba(109,40,217,0.05) 0%, transparent 60%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 120px,
            rgba(26,16,8,0.015) 120px,
            rgba(26,16,8,0.015) 121px
          )
        `,
      }}
    >
      {/* ── SCROLL COLUMN ────────────────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ maxWidth: "480px" }}
      >

        {/* ══════════════════════════════════════════════════════════
            SCROLL TOP CAP
            Simulates the rounded wooden dowel (jiku 軸) at the top of
            an emaki scroll. Heavier shadow on top = rolled thickness.
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
              0 -3px 8px rgba(26,16,8,0.18),
              0 4px 12px rgba(26,16,8,0.22),
              0 1px 0 rgba(255,245,200,0.6) inset
            `,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* ══════════════════════════════════════════════════════════
            SCROLL BODY — the paper surface
            Slightly narrower than the caps (margin 0 6px) so the
            caps appear to wrap around the paper edges.
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            margin: "0 6px",
            background: "var(--sc-paper-aged)",
            borderLeft:  "1px solid rgba(184,134,11,0.25)",
            borderRight: "1px solid rgba(184,134,11,0.25)",
            boxShadow: `
              -4px 0 12px rgba(26,16,8,0.06),
               4px 0 12px rgba(26,16,8,0.06),
               0  0 40px rgba(26,16,8,0.04) inset
            `,
            padding: "2.5rem 2.5rem 3rem",
            position: "relative",
            zIndex: 1,
          }}
        >

          {/* ── MON CREST HEADER ─────────────────────────────── */}
          {/*
           * Mon (家紋) — Japanese family crest used as an identity
           * mark on scrolls, armor, and clan documents. Here it acts
           * as the brand seal centered at the top of the scroll.
           */}
          <div className="flex flex-col items-center gap-2 mb-8">

            {/* Circular crest border — double ring like a kamon */}
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "9999px",
                border: "2px solid var(--sc-gold)",
                outline: "1px solid rgba(184,134,11,0.25)",
                outlineOffset: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--sc-paper)",
                boxShadow: "0 2px 8px rgba(184,134,11,0.15)",
              }}
            >
              {/*
               * Inner crest glyph: ✦ four-point star — an abstracted
               * mon motif. In production replace with an SVG kamon.
               */}
              <span
                style={{
                  fontFamily: "var(--font-logo)",
                  fontSize: "1.1rem",
                  color: "var(--sc-purple)",
                  lineHeight: 1,
                }}
              >
                ✦
              </span>
            </div>

            {/* Brand wordmark under the crest */}
            <span
              style={{
                fontFamily: "var(--font-logo)",
                fontSize: "0.65rem",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--sc-gold)",
              }}
            >
              Schaden's
            </span>

            {/* Ink rule — single brushstroke width */}
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
                marginTop: "0.5rem",
              }}
            />
          </div>

          {/* ── SCROLL HEADING ───────────────────────────────── */}
          <h1
            className="text-center mb-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.9rem",
              color: "var(--sc-ink)",
              letterSpacing: "0.04em",
              lineHeight: 1.2,
            }}
          >
            Join the Guild
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
            Inscribe your name upon the register
          </p>

          {/* ── FORM ─────────────────────────────────────────── */}
          <form onSubmit={handleSignup} className="flex flex-col gap-5">

            <ScrollField label="Email" required>
              <ScrollInput
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                required
              />
            </ScrollField>

            {/* Password + live strength meter */}
            <ScrollField label="Password" required>
              <ScrollInput
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="············"
                required
              />

              {/* Strength meter — only shown when password has input */}
              {form.password.length > 0 && (() => {
                const meta = strengthMeta[strength];
                return (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {/*
                     * Four ink-stroke segments — fills left to right.
                     * Unfilled segments use the muted paper-shadow tone.
                     */}
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: "2px",
                            borderRadius: "9999px",
                            background: i <= meta.segments
                              ? meta.color
                              : "var(--sc-paper-shadow)",
                            transition: "background 0.2s",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: meta.color,
                          fontWeight: 500,
                        }}
                      >
                        {meta.label}
                      </span>
                      {strength < 3 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.68rem",
                            color: "var(--sc-ash-light)",
                            fontStyle: "italic",
                          }}
                        >
                          Add uppercase, numbers, or symbols
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </ScrollField>

            <ScrollField label="Confirm Password" required>
              <ScrollInput
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder="············"
                required
              />
              {/* Mismatch warning — only shown after user has typed */}
              {form.confirmPassword.length > 0 &&
                form.password !== form.confirmPassword && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.72rem",
                      fontStyle: "italic",
                      color: "var(--sc-vermillion)",
                      marginTop: "0.35rem",
                      opacity: 0.9,
                    }}
                  >
                    Passwords don't match
                  </p>
                )}
            </ScrollField>

            {/* ── INK RULE SECTION DIVIDER — Security ────────── */}
            {/*
             * Divider styled as a brushed ink rule with a centered
             * label — mirrors how chapter titles appear on emaki scrolls.
             */}
            <div className="flex items-center gap-3 my-1">
              <div
                className="flex-1"
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg,
                    transparent, var(--sc-border-ink) 80%)`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--sc-ash-light)",
                }}
              >
                ✦ Security ✦
              </span>
              <div
                className="flex-1"
                style={{
                  height: "1px",
                  background: `linear-gradient(90deg,
                    var(--sc-border-ink) 20%, transparent)`,
                }}
              />
            </div>

            <ScrollField label="Security Question" required>
              <select
                value={form.security_question}
                onChange={set("security_question")}
                required
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  background: "var(--sc-paper)",
                  border: "1px solid var(--sc-border-ink)",
                  borderBottom: "2px solid var(--sc-border-ink)",
                  borderRadius: "0",
                  padding: "0.65rem 0.9rem",
                  color: form.security_question
                    ? "var(--sc-ink)"
                    : "var(--sc-ash-light)",
                  outline: "none",
                  width: "100%",
                  cursor: "pointer",
                  appearance: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor  = "var(--sc-purple)";
                  e.target.style.boxShadow    = "0 2px 0 var(--sc-purple)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor  = "var(--sc-border-ink)";
                  e.target.style.boxShadow    = "none";
                }}
              >
                <option value="" disabled>Select a question…</option>
                <option value="What was your first pet's name?">
                  What was your first pet's name?
                </option>
                <option value="What is your mother's maiden name?">
                  What is your mother's maiden name?
                </option>
                <option value="What city were you born in?">
                  What city were you born in?
                </option>
                <option value="What was the name of your first school?">
                  What was the name of your first school?
                </option>
                <option value="What is your oldest sibling's middle name?">
                  What is your oldest sibling's middle name?
                </option>
              </select>
            </ScrollField>

            <ScrollField label="Answer" required>
              <ScrollInput
                value={form.security_answer}
                onChange={set("security_answer")}
                placeholder="Your answer"
                required
              />
            </ScrollField>

            <ScrollField label="Hint (optional)">
              <ScrollInput
                value={form.security_hint}
                onChange={set("security_hint")}
                placeholder="A small clue to jog your memory"
              />
            </ScrollField>

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

            {/* ── SUBMIT — vermillion seal button ──────────── */}
            {/*
             * Vermillion (beni 紅) is the color of official seals
             * (hanko/inkan) in Japanese bureaucratic tradition.
             * Primary action uses purple per brand spec; the vermillion
             * border below the button echoes the hanko stamp aesthetic.
             */}
            <div style={{ position: "relative", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 600,
                  fontSize: "0.68rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  padding: "0.9rem",
                  width: "100%",
                  background: loading ? "var(--sc-paper-shadow)" : "var(--sc-purple)",
                  color: loading ? "var(--sc-ash-light)" : "#fff",
                  border: "none",
                  borderRadius: "0",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.65 : 1,
                  transition: "background 0.15s, box-shadow 0.15s",
                  boxShadow: loading
                    ? "none"
                    : `0 4px 16px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background  = "var(--sc-purple-lt)";
                    e.currentTarget.style.boxShadow   =
                      `0 6px 20px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background  = "var(--sc-purple)";
                    e.currentTarget.style.boxShadow   =
                      `0 4px 16px var(--sc-purple-glow),
                       0 1px 0 rgba(255,255,255,0.15) inset`;
                  }
                }}
              >
                {loading ? "Inscribing…" : "Seal the Register"}
              </button>

              {/*
               * Vermillion underline — hanko seal impression below button.
               * Pure decorative; non-interactive.
               */}
              <div
                style={{
                  height: "3px",
                  background: "var(--sc-vermillion)",
                  opacity: loading ? 0.3 : 0.7,
                  transition: "opacity 0.15s",
                }}
              />
            </div>
          </form>

          {/* ── SCROLL FOOTER — ink rule + login link ────────── */}
          <div className="flex items-center gap-3 mt-8 mb-5">
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
                opacity: 0.65,
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

          <p
            className="text-center text-sm"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--sc-ash-light)",
              fontStyle: "italic",
              opacity: 0.85,
            }}
          >
            Already inscribed?{" "}
            <Link
              to="/login"
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
              Enter the Shrine
            </Link>
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════
            SCROLL BOTTOM CAP
            Mirrors the top jiku dowel — closes the scroll form.
            Slightly darker gradient = bottom face of the dowel in shadow.
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
              0 3px 10px rgba(26,16,8,0.22),
              0 -2px 6px rgba(26,16,8,0.12),
              0 -1px 0 rgba(255,245,200,0.4) inset
            `,
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HELPER: ScrollField
   ─────────────────────────────────────────────────────────────────
   Form field wrapper for the scroll aesthetic.
   Label uses a left vermillion dot for required fields — a visual
   language borrowed from Japanese annotation marks (返り点 style).

   @param  {string}    label     - Field label text
   @param  {boolean}   required  - If true, renders a vermillion dot
   @param  {ReactNode} children  - The input element(s)
   @returns {JSX.Element}
   ═══════════════════════════════════════════════════════════════════ */
function ScrollField({ label, required = false, children }) {
  return (
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
        {/*
         * Vermillion required dot — echoes the red annotation marks
         * used in classical Japanese manuscript notation.
         */}
        {required && (
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
        )}
        {label}
      </label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HELPER: ScrollInput
   ─────────────────────────────────────────────────────────────────
   Text input styled for the scroll aesthetic.
   No border-radius — flat bottom border only, like brushed ink on paper.
   Focus state: purple bottom stroke replaces ink border.

   @param  {string}   type        - Input type (default: "text")
   @param  {string}   value       - Controlled value
   @param  {function} onChange    - Change handler
   @param  {string}   placeholder - Placeholder text
   @param  {boolean}  required    - HTML required attribute
   @returns {JSX.Element}
   ═══════════════════════════════════════════════════════════════════ */
function ScrollInput({ type = "text", value, onChange, placeholder, required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.95rem",
        background: "transparent",
        /*
         * Flat underline input — no box border, only bottom stroke.
         * Reads as text being brushed onto the scroll surface rather
         * than typed into a digital form field.
         */
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
        e.target.style.boxShadow         = "0 2px 0 var(--sc-purple-glow)";
      }}
      onBlur={(e) => {
        e.target.style.borderBottomColor = "var(--sc-border-ink)";
        e.target.style.boxShadow         = "none";
      }}
    />
  );
}