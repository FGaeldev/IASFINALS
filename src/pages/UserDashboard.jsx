import { useState, useEffect } from "react";
import { getProfile, update2fa, changePassword } from "../services/authService";

/*
  UserDashboard.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento card layout
  Logic   : Unchanged — getProfile, update2fa, changePassword
  Sections: Email identity · Password (inline edit) · 2FA (inline edit)
  Palette : --gz-* tokens from index.css
  Fonts   : Playfair Display (headings) · Josefin Sans (labels) · Lato (inputs)
*/

/* ── Password strength rules — 5 criteria, 0–5 score ── */
function getPasswordStrength(pw) {
  return [
    { pass: pw.length >= 8, label: "8+ chars" },
    { pass: /[A-Z]/.test(pw), label: "Uppercase" },
    { pass: /[a-z]/.test(pw), label: "Lowercase" },
    { pass: /[0-9]/.test(pw), label: "Number" },
    { pass: /[\W_]/.test(pw), label: "Special char" },
  ];
}

const strengthLabel = ["", "Weak", "Fair", "Decent", "Good", "Strong"];
const strengthColor = [
  "",
  "var(--gz-danger)",
  "#c9a227",
  "#c9a227",
  "var(--gz-olive-lt)",
  "var(--gz-emerald-lt)",
];

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);

  /* ── 2FA state ── */
  const [form, setForm] = useState({
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [editing, setEditing] = useState(false);
  const [oathMsg, setOathMsg] = useState("");
  const [oathError, setOathError] = useState("");
  const [oathLoading, setOathLoading] = useState(false);

  /* ── Password state ── */
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwEditing, setPwEditing] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    getProfile().then((res) => {
      if (res.success) {
        setProfile(res.data);
        setForm({
          security_question: res.data.u_security_question,
          security_answer: "",
          security_hint: res.data.u_security_hint ?? "",
        });
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = (e) =>
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleSaveOath = async (e) => {
    e.preventDefault();
    setOathMsg("");
    setOathError("");
    setOathLoading(true);
    const res = await update2fa(form);
    setOathLoading(false);
    if (res.success) {
      setOathMsg("Security question updated.");
      setEditing(false);
      setProfile((p) => ({
        ...p,
        u_security_question: form.security_question,
        u_security_hint: form.security_hint,
      }));
    } else {
      setOathError(res.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
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
      setPwForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } else {
      setPwError(res.message);
    }
  };

  const pwRules = getPasswordStrength(pwForm.new_password);
  const pwScore = pwRules.filter((r) => r.pass).length;

  if (!profile) return null;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "var(--gz-bark)", paddingTop: "5.5rem" }}
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* ── PAGE HEADER ── */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-border)" }}
          />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gz-cream)",
            }}
          >
            Profile
          </h1>
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-border)" }}
          />
        </div>
        <p
          className="text-center italic mb-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            color: "var(--gz-sand)",
            opacity: 0.55,
          }}
        >
          Your account settings
        </p>

        {/* ── BENTO: EMAIL IDENTITY ── */}
        <BentoCard>
          <SectionLabel>Account</SectionLabel>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--gz-cream)",
              marginTop: "0.5rem",
            }}
          >
            {profile.u_email}
          </p>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--gz-driftwood)",
              marginTop: "0.35rem",
            }}
          >
            Role: {profile.u_role ?? "user"}
          </p>
        </BentoCard>

        {/* ── BENTO: PASSWORD ── */}
        <BentoCard>
          <div className="flex justify-between items-center">
            <SectionLabel>Password</SectionLabel>
            {!pwEditing && (
              <GhostButton onClick={() => setPwEditing(true)}>
                Change
              </GhostButton>
            )}
          </div>

          {!pwEditing ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--gz-driftwood)",
                marginTop: "0.5rem",
                letterSpacing: "0.15em",
              }}
            >
              ············
            </p>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col gap-4 mt-4"
            >
              <Field label="Current Password">
                <Input
                  name="current_password"
                  type="password"
                  value={pwForm.current_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />
              </Field>
              <Field label="New Password">
                <Input
                  name="new_password"
                  type="password"
                  value={pwForm.new_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />
                {/* Strength meter */}
                {pwForm.new_password.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    {/* Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              height: "3px",
                              borderRadius: "9999px",
                              background:
                                i <= pwScore
                                  ? strengthColor[pwScore]
                                  : "var(--gz-driftwood)",
                              transition: "background 0.2s",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: strengthColor[pwScore],
                        }}
                      >
                        {strengthLabel[pwScore]}
                      </span>
                    </div>
                    {/* Checklist */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {pwRules.map((r) => (
                        <span
                          key={r.label}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.72rem",
                            fontStyle: "italic",
                            color: r.pass
                              ? "var(--gz-olive-lt)"
                              : "var(--gz-driftwood)",
                          }}
                        >
                          {r.pass ? "✓" : "✗"} {r.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Field>
              <Field label="Confirm Password">
                <Input
                  name="confirm_password"
                  type="password"
                  value={pwForm.confirm_password}
                  onChange={handlePwChange}
                  placeholder="············"
                  required
                />
                {pwForm.confirm_password.length > 0 &&
                  pwForm.new_password !== pwForm.confirm_password && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.72rem",
                        fontStyle: "italic",
                        color: "var(--gz-danger)",
                        marginTop: "0.3rem",
                      }}
                    >
                      Passwords don't match
                    </p>
                  )}
              </Field>
              {pwError && <ErrorMsg>{pwError}</ErrorMsg>}
              <ActionRow
                submitLabel={pwLoading ? "Saving..." : "Update Password"}
                loading={pwLoading}
                onCancel={() => {
                  setPwEditing(false);
                  setPwError("");
                  setPwForm({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                }}
              />
            </form>
          )}
          {pwMsg && <SuccessMsg>{pwMsg}</SuccessMsg>}
        </BentoCard>

        {/* ── BENTO: 2FA / SECURITY QUESTION ── */}
        <BentoCard>
          <div className="flex justify-between items-center">
            <SectionLabel>Security Question (2FA)</SectionLabel>
            {!editing && (
              <GhostButton onClick={() => setEditing(true)}>Edit</GhostButton>
            )}
          </div>

          {!editing ? (
            <div className="mt-3 flex flex-col gap-2">
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  color: "var(--gz-cream)",
                  lineHeight: 1.6,
                }}
              >
                {profile.u_security_question}
              </p>
              {profile.u_security_hint && (
                <div className="group flex items-center gap-2 cursor-default select-none mt-1">
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--gz-driftwood)",
                    }}
                  >
                    Hint
                  </span>
                  <span
                    className="relative text-sm italic"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                      style={{ color: "var(--gz-driftwood)" }}
                    >
                      ~~~~~~
                    </span>
                    <span
                      className="transition-all duration-300 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none"
                      style={{ color: "var(--gz-sand)" }}
                    >
                      {profile.u_security_hint}
                    </span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSaveOath}
              className="flex flex-col gap-4 mt-4"
            >
              <Field label="New Question">
                <Input
                  name="security_question"
                  value={form.security_question}
                  onChange={handleChange}
                  placeholder="Your secret question…"
                  required
                />
              </Field>
              <Field label="New Answer">
                <Input
                  name="security_answer"
                  type="password"
                  value={form.security_answer}
                  onChange={handleChange}
                  placeholder="············"
                  required
                />
              </Field>
              <Field label="Hint (optional)">
                <Input
                  name="security_hint"
                  value={form.security_hint}
                  onChange={handleChange}
                  placeholder="A subtle clue…"
                />
              </Field>
              {oathError && <ErrorMsg>{oathError}</ErrorMsg>}
              <ActionRow
                submitLabel={oathLoading ? "Saving..." : "Update Question"}
                loading={oathLoading}
                onCancel={() => {
                  setEditing(false);
                  setOathError("");
                }}
              />
            </form>
          )}
          {oathMsg && <SuccessMsg>{oathMsg}</SuccessMsg>}
        </BentoCard>

        {/* Bottom rule */}
        <div className="flex items-center gap-3 mt-2">
          <div
            className="flex-1 h-px"
            style={{ background: "var(--gz-driftwood)", opacity: 0.3 }}
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
            style={{ background: "var(--gz-driftwood)", opacity: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function BentoCard({ children }) {
  return (
    <div
      className="rounded-2xl px-6 py-5"
      style={{
        background: "var(--gz-soil)",
        border: "1px solid var(--gz-driftwood)",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.62rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--gz-olive-lt)",
      }}
    >
      {children}
    </p>
  );
}

function Field({ label, children }) {
  return (
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
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.95rem",
        background: "var(--gz-bark)",
        border: "1px solid var(--gz-driftwood)",
        borderRadius: "0.5rem",
        padding: "0.65rem 0.9rem",
        color: "var(--gz-cream)",
        outline: "none",
        width: "100%",
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
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        background: "none",
        cursor: "pointer",
        padding: "0.3rem 0.75rem",
        color: "var(--gz-olive-lt)",
        border: "1px solid var(--gz-border)",
        borderRadius: "9999px",
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gz-olive-lt)";
        e.currentTarget.style.color = "var(--gz-cream)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--gz-border)";
        e.currentTarget.style.color = "var(--gz-olive-lt)";
      }}
    >
      {children}
    </button>
  );
}

function ActionRow({ submitLabel, loading, onCancel }) {
  return (
    <div className="flex gap-2 pt-1">
      <button
        type="submit"
        disabled={loading}
        style={{
          flex: 1,
          fontFamily: "var(--font-ui)",
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "0.75rem",
          background: loading ? "var(--gz-emerald-dim)" : "var(--gz-emerald)",
          color: "var(--gz-cream)",
          border: "none",
          borderRadius: "0.5rem",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!loading)
            e.currentTarget.style.background = "var(--gz-emerald-lt)";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.currentTarget.style.background = "var(--gz-emerald)";
        }}
      >
        {submitLabel}
      </button>
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
          color: "rgba(201,185,154,0.45)",
          border: "1px solid var(--gz-driftwood)",
          borderRadius: "0.5rem",
          cursor: "pointer",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--gz-olive-lt)";
          e.currentTarget.style.color = "var(--gz-cream)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--gz-driftwood)";
          e.currentTarget.style.color = "rgba(201,185,154,0.45)";
        }}
      >
        Cancel
      </button>
    </div>
  );
}

function ErrorMsg({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8rem",
        fontStyle: "italic",
        color: "var(--gz-danger)",
        opacity: 0.85,
      }}
    >
      {children}
    </p>
  );
}

function SuccessMsg({ children }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8rem",
        fontStyle: "italic",
        color: "var(--gz-emerald-lt)",
        textAlign: "center",
        marginTop: "0.5rem",
      }}
    >
      {children}
    </p>
  );
}
