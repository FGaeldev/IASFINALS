/**
 * UserDashboard.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Authenticated user profile and account settings page.
 *               Three sections: identity, password change, 2FA update.
 * Theme       : Emaki scroll panels — each settings section is a named
 *               "kan" (巻, scroll chapter) on the page. Sections are
 *               rendered as .sc-panel cards on the rice-paper ground,
 *               divided by .sc-gold-rule ornaments. The page heading
 *               uses a centered mon crest + Cinzel wordmark identical
 *               to the scroll pages for visual continuity.
 *               Flat underline inputs throughout — ink-on-paper feel.
 *               Inline edit pattern (view → form → save) preserved.
 * Layout      : Single centered column, max-width 640px.
 * Dependencies: react (useState, useEffect),
 *               ../services/authService (getProfile, update2fa, changePassword)
 * Tokens      : --sc-* CSS variables. Classes: .sc-panel, .sc-gold-rule,
 *               .sc-ink-rule, .sc-mon-ring, .sc-hanko-seal from index.css.
 *
 * Password strength scoring: 5 criteria, score 0–5.
 * Hint reveal: CSS group-hover blur technique — no JS state.
 */

import { useState, useEffect } from "react";
import { getProfile, update2fa, changePassword } from "../services/authService";

/* ── Password strength helpers ──────────────────────────────────── */

/**
 * getPasswordStrength
 * Returns an array of 5 rule objects with pass/fail status and label.
 * Used to render the checklist below the new-password field.
 *
 * @param  {string} pw - The password string to evaluate
 * @returns {{ pass: boolean, label: string }[]}
 */
function getPasswordStrength(pw) {
  return [
    { pass: pw.length >= 8,          label: "8+ chars"     },
    { pass: /[A-Z]/.test(pw),        label: "Uppercase"    },
    { pass: /[a-z]/.test(pw),        label: "Lowercase"    },
    { pass: /[0-9]/.test(pw),        label: "Number"       },
    { pass: /[\W_]/.test(pw),        label: "Special char" },
  ];
}

/*
 * Strength label and color maps — index = score (0–5).
 * Colors reference Eastern pigment conventions:
 *   beni (紅) red → yamabuki (山吹) gold → matcha → indigo.
 */
const strengthLabel = ["", "Weak", "Fair", "Decent", "Good", "Strong"];
const strengthColor = [
  "",
  "var(--sc-vermillion)",
  "var(--sc-gold)",
  "var(--sc-gold)",
  "var(--sc-jade)",
  "var(--sc-purple)",
];

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);

  /* ── 2FA / Security Question state ────────────────────────────── */
  const [form, setForm] = useState({
    security_question: "",
    security_answer:   "",
    security_hint:     "",
  });
  const [editing,     setEditing]     = useState(false);
  const [oathMsg,     setOathMsg]     = useState("");
  const [oathError,   setOathError]   = useState("");
  const [oathLoading, setOathLoading] = useState(false);

  /* ── Password change state ─────────────────────────────────────── */
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password:     "",
    confirm_password: "",
  });
  const [pwEditing, setPwEditing] = useState(false);
  const [pwMsg,     setPwMsg]     = useState("");
  const [pwError,   setPwError]   = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  /* Load profile on mount — redirect to login if session is invalid */
  useEffect(() => {
    getProfile().then((res) => {
      if (res.success) {
        setProfile(res.data);
        setForm({
          security_question: res.data.u_security_question,
          security_answer:   "",
          security_hint:     res.data.u_security_hint ?? "",
        });
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  const handleChange   = (e) => setForm({   ...form,   [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  /**
   * handleSaveOath
   * Submits the updated security question/answer/hint to update2fa().
   * On success: updates local profile state and exits edit mode.
   *
   * @param {React.FormEvent} e
   * @returns {Promise<void>}
   */
  const handleSaveOath = async (e) => {
    e.preventDefault();
    setOathMsg(""); setOathError("");
    setOathLoading(true);
    const res = await update2fa(form);
    setOathLoading(false);
    if (res.success) {
      setOathMsg("Security question updated.");
      setEditing(false);
      setProfile((p) => ({
        ...p,
        u_security_question: form.security_question,
        u_security_hint:     form.security_hint,
      }));
    } else {
      setOathError(res.message);
    }
  };

  /**
   * handleChangePassword
   * Validates password match client-side, then calls changePassword().
   * Clears the form and exits edit mode on success.
   *
   * @param {React.FormEvent} e
   * @returns {Promise<void>}
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg(""); setPwError("");
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwLoading(true);
    const res = await changePassword(pwForm);
    setPwLoading(false);
    if (res.success) {
      setPwMsg("Password updated.");
      setPwEditing(false);
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    } else {
      setPwError(res.message);
    }
  };

  const pwRules = getPasswordStrength(pwForm.new_password);
  const pwScore = pwRules.filter((r) => r.pass).length;

  /* Guard: wait for profile before rendering */
  if (!profile) return null;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "var(--sc-paper)", paddingTop: "5.5rem" }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* ── PAGE HEADER — mon crest + Cinzel wordmark ────────── */}
        {/*
         * Same header motif as the scroll pages — creates visual
         * continuity across the full authenticated experience.
         */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="sc-mon-ring" style={{ width: "52px", height: "52px" }}>
            <span style={{
              fontFamily: "var(--font-logo)",
              fontSize: "1.1rem",
              color: "var(--sc-purple)",
              lineHeight: 1,
            }}>✦</span>
          </div>

          <span style={{
            fontFamily: "var(--font-logo)",
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--sc-gold)",
          }}>
            Schaden's
          </span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.9rem",
            color: "var(--sc-ink)",
            letterSpacing: "0.04em",
            lineHeight: 1.2,
            textAlign: "center",
            margin: 0,
          }}>
            Your Account
          </h1>

          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "0.85rem",
            color: "var(--sc-ash-light)",
            margin: 0,
            opacity: 0.85,
          }}>
            Member settings &amp; security
          </p>

          <div className="sc-gold-rule w-full" style={{ marginTop: "0.5rem" }} />
        </div>

        {/* ══════════════════════════════════════════════════════════
            KAN I — Account Identity (巻一)
            Displays the member's email and role. Read-only — email
            changes are not supported; role is set by admin only.
            ══════════════════════════════════════════════════════════ */}
        <ScrollPanel>
          <KanLabel>巻一 · Account</KanLabel>

          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "1.05rem",
            color: "var(--sc-ink)",
            marginTop: "0.5rem",
            lineHeight: 1.5,
          }}>
            {profile.u_email}
          </p>

          {/* Role badge — vermillion for admin, ink for user */}
          <span style={{
            display: "inline-block",
            marginTop: "0.5rem",
            fontFamily: "var(--font-ui)",
            fontSize: "0.55rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            padding: "0.2rem 0.7rem",
            borderRadius: "9999px",
            background: profile.u_role === "admin"
              ? "rgba(192,57,43,0.10)"
              : "var(--sc-purple-dim)",
            color: profile.u_role === "admin"
              ? "var(--sc-vermillion)"
              : "var(--sc-purple)",
            border: `1px solid ${profile.u_role === "admin"
              ? "rgba(192,57,43,0.25)"
              : "var(--sc-border)"}`,
          }}>
            {profile.u_role ?? "user"}
          </span>
        </ScrollPanel>

        {/* ══════════════════════════════════════════════════════════
            KAN II — Password (巻二)
            Inline edit — collapsed to dots by default, expands to
            a three-field form (current / new / confirm) on "Change".
            ══════════════════════════════════════════════════════════ */}
        <ScrollPanel>
          <div className="flex justify-between items-center">
            <KanLabel>巻二 · Password</KanLabel>
            {!pwEditing && (
              <InkButton onClick={() => setPwEditing(true)}>Change</InkButton>
            )}
          </div>

          {!pwEditing ? (
            /* Redacted password display */
            <p style={{
              fontFamily: "var(--font-body)",
              color: "var(--sc-ash-light)",
              marginTop: "0.5rem",
              letterSpacing: "0.2em",
              opacity: 0.6,
            }}>
              ············
            </p>
          ) : (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-5 mt-5">
              <DashField label="Current Password">
                <DashInput
                  name="current_password"
                  type="password"
                  value={pwForm.current_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />
              </DashField>

              <DashField label="New Password">
                <DashInput
                  name="new_password"
                  type="password"
                  value={pwForm.new_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />

                {/* Live strength meter — 5-segment ink brush bars */}
                {pwForm.new_password.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} style={{
                            flex: 1,
                            height: "2px",
                            borderRadius: "9999px",
                            background: i <= pwScore
                              ? strengthColor[pwScore]
                              : "var(--sc-paper-shadow)",
                            transition: "background 0.2s",
                          }} />
                        ))}
                      </div>
                      <span style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: strengthColor[pwScore],
                        fontWeight: 500,
                      }}>
                        {strengthLabel[pwScore]}
                      </span>
                    </div>

                    {/* Checklist — pass/fail per criterion */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {pwRules.map((r) => (
                        <span key={r.label} style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.72rem",
                          fontStyle: "italic",
                          color: r.pass ? "var(--sc-jade)" : "var(--sc-ash-light)",
                          transition: "color 0.15s",
                        }}>
                          {r.pass ? "✓" : "✗"} {r.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </DashField>

              <DashField label="Confirm Password">
                <DashInput
                  name="confirm_password"
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />
                {pwForm.confirm_password.length > 0 &&
                  pwForm.new_password !== pwForm.confirm_password && (
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: "var(--sc-vermillion)",
                    marginTop: "0.35rem",
                    opacity: 0.9,
                  }}>
                    Passwords don't match
                  </p>
                )}
              </DashField>

              {pwError && <InlineError>{pwError}</InlineError>}

              <DashActionRow
                submitLabel={pwLoading ? "Saving…" : "Update Password"}
                loading={pwLoading}
                onCancel={() => {
                  setPwEditing(false);
                  setPwError("");
                  setPwForm({ current_password: "", new_password: "", confirm_password: "" });
                }}
              />
            </form>
          )}

          {pwMsg && <InlineSuccess>{pwMsg}</InlineSuccess>}
        </ScrollPanel>

        {/* ══════════════════════════════════════════════════════════
            KAN III — Security Question / 2FA (巻三)
            Displays current question (read-only) with hover-reveal hint.
            Edit mode opens the three-field update form.
            ══════════════════════════════════════════════════════════ */}
        <ScrollPanel>
          <div className="flex justify-between items-center">
            <KanLabel>巻三 · Security Question</KanLabel>
            {!editing && (
              <InkButton onClick={() => setEditing(true)}>Edit</InkButton>
            )}
          </div>

          {!editing ? (
            <div className="mt-4 flex flex-col gap-3">
              {/*
               * Question displayed in a sc-zassho citation block —
               * mirrors the SecurityQuestion page for visual continuity.
               */}
              <div className="sc-zassho">
                <p style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  color: "var(--sc-ink)",
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {profile.u_security_question}
                </p>
              </div>

              {/* Hover-to-reveal hint — fukusa silk-veil technique */}
              {profile.u_security_hint && (
                <div className="group flex items-center gap-2 cursor-default select-none">
                  <span style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--sc-gold)",
                    opacity: 0.7,
                    flexShrink: 0,
                  }}>
                    Hint
                  </span>
                  <span className="relative text-sm italic">
                    {/* Veil: 〰 waves — lifts on hover */}
                    <span
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0!"
                      style={{ color: "var(--sc-ash-light)", opacity: 0.5 }}
                    >
                      ~~~~~~~~
                    </span>
                    {/* Revealed hint — unblurs on group hover */}
                    <span
                      className="transition-all duration-500 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none"
                      style={{ fontFamily: "var(--font-body)", color: "var(--sc-ash)" }}
                    >
                      {profile.u_security_hint}
                    </span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveOath} className="flex flex-col gap-5 mt-5">
              <DashField label="New Question">
                <DashInput
                  name="security_question"
                  value={form.security_question}
                  onChange={handleChange}
                  placeholder="Your secret question…"
                  required
                />
              </DashField>

              <DashField label="New Answer">
                <DashInput
                  name="security_answer"
                  type="password"
                  value={form.security_answer}
                  onChange={handleChange}
                  placeholder="············"
                  required
                />
              </DashField>

              <DashField label="Hint (optional)">
                <DashInput
                  name="security_hint"
                  value={form.security_hint}
                  onChange={handleChange}
                  placeholder="A subtle clue…"
                />
              </DashField>

              {oathError && <InlineError>{oathError}</InlineError>}

              <DashActionRow
                submitLabel={oathLoading ? "Saving…" : "Update Question"}
                loading={oathLoading}
                onCancel={() => { setEditing(false); setOathError(""); }}
              />
            </form>
          )}

          {oathMsg && <InlineSuccess>{oathMsg}</InlineSuccess>}
        </ScrollPanel>

        {/* Footer rule */}
        <div className="flex items-center gap-3 mt-2 mb-6">
          <div className="flex-1 sc-ink-rule" />
          <span style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.5rem",
            color: "var(--sc-gold)",
            opacity: 0.55,
          }}>✦</span>
          <div className="flex-1 sc-ink-rule" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HELPERS — Dashboard-specific components
   These use --sc-* tokens and .sc-* classes from index.css.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * ScrollPanel — aged paper card using .sc-panel utility class.
 * Wraps each "kan" chapter section on the dashboard.
 */
function ScrollPanel({ children }) {
  return (
    <div className="sc-panel" style={{ borderRadius: "0.75rem", padding: "1.5rem 1.75rem" }}>
      {children}
    </div>
  );
}

/**
 * KanLabel — chapter label in the scroll tradition.
 * Uses the Japanese 巻 (kan = scroll/volume) numbering prefix.
 */
function KanLabel({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-ui)",
      fontSize: "0.60rem",
      letterSpacing: "0.25em",
      textTransform: "uppercase",
      color: "var(--sc-ash-light)",
      fontWeight: 500,
    }}>
      {children}
    </p>
  );
}

/**
 * DashField — labeled field wrapper for dashboard forms.
 * Dot-accent on label; children are the input element(s).
 *
 * @param {string}    label    - Field label text
 * @param {ReactNode} children - Input element(s)
 */
function DashField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.60rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "var(--sc-ash-light)",
        fontWeight: 500,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * DashInput — flat underline input for dashboard scroll panels.
 * Inherits .sc-scroll-input visual language from index.css via inline style.
 *
 * @param {string}   name        - Input name attribute (for form submission)
 * @param {string}   type        - Input type (default: "text")
 * @param {string}   value       - Controlled value
 * @param {function} onChange    - Change handler
 * @param {string}   placeholder - Placeholder text
 * @param {boolean}  required    - HTML required attribute
 */
function DashInput({ name, type = "text", value, onChange, placeholder, required }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="sc-scroll-input"
      style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem" }}
    />
  );
}

/**
 * InkButton — ghost action button styled as a brushstroke border pill.
 * Used for inline "Change" and "Edit" triggers within panels.
 *
 * @param {function}  onClick  - Click handler
 * @param {ReactNode} children - Button label
 */
function InkButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.58rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        background: "none",
        cursor: "pointer",
        padding: "0.28rem 0.75rem",
        color: "var(--sc-ash-light)",
        border: "1px solid var(--sc-border-ink)",
        borderRadius: "9999px",
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--sc-purple)";
        e.currentTarget.style.color       = "var(--sc-purple)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--sc-border-ink)";
        e.currentTarget.style.color       = "var(--sc-ash-light)";
      }}
    >
      {children}
    </button>
  );
}

/**
 * DashActionRow — save + cancel button pair for inline edit forms.
 * Submit is the primary purple CTA with hanko seal underline.
 * Cancel is a ghost ink-border button.
 *
 * @param {string}   submitLabel - Text for the submit button
 * @param {boolean}  loading     - Disables submit and dims it when true
 * @param {function} onCancel    - Cancel handler
 */
function DashActionRow({ submitLabel, loading, onCancel }) {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex gap-2 pt-1">
        {/* Primary save button */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              fontFamily: "var(--font-ui)",
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.75rem",
              background: loading ? "var(--sc-paper-shadow)" : "var(--sc-purple)",
              color: loading ? "var(--sc-ash-light)" : "#fff",
              border: "none",
              borderRadius: "0",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              transition: "background 0.15s, box-shadow 0.15s",
              boxShadow: loading ? "none" : "0 4px 12px var(--sc-purple-glow)",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "var(--sc-purple-lt)";
                e.currentTarget.style.boxShadow  = "0 6px 16px var(--sc-purple-glow)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "var(--sc-purple)";
                e.currentTarget.style.boxShadow  = "0 4px 12px var(--sc-purple-glow)";
              }
            }}
          >
            {submitLabel}
          </button>
          {/* Hanko seal underline below submit */}
          <div className="sc-hanko-seal" style={{ opacity: loading ? 0.2 : 0.65 }} />
        </div>

        {/* Cancel ghost button */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            fontFamily: "var(--font-ui)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.75rem",
            background: "none",
            color: "var(--sc-ash-light)",
            border: "1px solid var(--sc-border-ink)",
            borderRadius: "0",
            cursor: "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--sc-ash-light)";
            e.currentTarget.style.color       = "var(--sc-ink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--sc-border-ink)";
            e.currentTarget.style.color       = "var(--sc-ash-light)";
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/** InlineError — vermillion italic error message */
function InlineError({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "0.8rem",
      fontStyle: "italic",
      color: "var(--sc-vermillion)",
      opacity: 0.9,
      margin: 0,
    }}>
      {children}
    </p>
  );
}

/** InlineSuccess — jade italic success confirmation */
function InlineSuccess({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "0.8rem",
      fontStyle: "italic",
      color: "var(--sc-jade)",
      textAlign: "center",
      marginTop: "0.5rem",
    }}>
      {children}
    </p>
  );
}