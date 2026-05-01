import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/authService";

/*
  Signup.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento-card signup form
  Palette : --gz-* tokens from index.css
  Fonts   : Playfair Display (heading) · Josefin Sans (labels/btn) · Lato (inputs)
  Keys    : Match authService.signup() — email, password, security_question,
            security_answer, security_hint (optional)
  Password: Live 4-segment strength meter, blocks weak submit (score < 3)
*/
export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  /*
    Password strength scoring
    ─────────────────────────────────────────────────────────────────
    0 — empty
    1 — weak    : < 8 chars
    2 — fair    : 8+ chars, 1 char class
    3 — good    : 8+ chars, 2–3 char classes
    4 — strong  : 8+ chars, all 4 classes (upper+lower+digit+symbol)
  */
  const strength = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    if (p.length < 8) return 1;
    let score = 0;
    if (/[a-z]/.test(p)) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return Math.max(1, score);
  }, [form.password]);

  const strengthMeta = [
    null,
    { label: "Weak", color: "var(--gz-danger)", segments: 1 },
    { label: "Fair", color: "#c9a227", segments: 2 },
    { label: "Good", color: "var(--gz-olive-lt)", segments: 3 },
    { label: "Strong", color: "var(--gz-emerald-lt)", segments: 4 },
  ];

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
    /* Send only keys backend expects — strip confirmPassword */
    const res = await signup({
      email: form.email,
      password: form.password,
      security_question: form.security_question,
      security_answer: form.security_answer,
      security_hint: form.security_hint,
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
      style={{ background: "var(--gz-bark)", paddingTop: "6rem" }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(45,106,79,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── SIGNUP CARD ── */}
      <div
        className="relative w-full max-w-lg rounded-2xl px-8 py-10"
        style={{
          background: "var(--gz-soil)",
          border: "1px solid var(--gz-driftwood)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Ornament */}
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

        {/* Heading */}
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
          Join the Network
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
          Create your distributor account
        </p>

        {/* ── FORM ── */}
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          {/* Email */}
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="your@email.com"
              required
            />
          </Field>

          {/* Password */}
          <Field label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="············"
              required
            />
            {/* Strength meter */}
            {form.password.length > 0 &&
              (() => {
                const meta = strengthMeta[strength];
                return (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: "3px",
                            borderRadius: "9999px",
                            background:
                              i <= meta.segments
                                ? meta.color
                                : "var(--gz-driftwood)",
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
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: meta.color,
                        }}
                      >
                        {meta.label}
                      </span>
                      {strength < 3 && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.7rem",
                            color: "var(--gz-sand)",
                            opacity: 0.45,
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
          </Field>

          {/* Confirm password */}
          <Field label="Confirm Password">
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="············"
              required
            />
            {form.confirmPassword.length > 0 &&
              form.password !== form.confirmPassword && (
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontStyle: "italic",
                    color: "var(--gz-danger)",
                    marginTop: "0.35rem",
                    opacity: 0.8,
                  }}
                >
                  Passwords don't match
                </p>
              )}
          </Field>

          {/* Security divider */}
          <div className="flex items-center gap-3 my-1">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--gz-driftwood)", opacity: 0.4 }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--gz-driftwood)",
              }}
            >
              Security
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--gz-driftwood)", opacity: 0.4 }}
            />
          </div>

          {/* Security question */}
          <Field label="Security Question">
            <select
              value={form.security_question}
              onChange={set("security_question")}
              required
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                background: "var(--gz-bark)",
                border: "1px solid var(--gz-driftwood)",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.9rem",
                color: form.security_question
                  ? "var(--gz-cream)"
                  : "rgba(201,185,154,0.35)",
                outline: "none",
                width: "100%",
                cursor: "pointer",
                appearance: "none",
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
            >
              <option value="" disabled>
                Select a question…
              </option>
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
          </Field>

          {/* Security answer */}
          <Field label="Answer">
            <Input
              value={form.security_answer}
              onChange={set("security_answer")}
              placeholder="Your answer"
              required
            />
          </Field>

          {/* Hint (optional) */}
          <Field label="Hint (optional)">
            <Input
              value={form.security_hint}
              onChange={set("security_hint")}
              placeholder="A small clue to jog your memory"
            />
          </Field>

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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Bottom link */}
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              fontStyle: "normal",
              color: "var(--gz-emerald-lt)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--gz-olive-lt)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--gz-emerald-lt)")
            }
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

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

function Input({ type = "text", value, onChange, placeholder, required }) {
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
