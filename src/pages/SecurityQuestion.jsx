import { useState, useEffect } from "react";
import { verify2fa, getSecurityQuestion } from "../services/authService";

/*
  SecurityQuestion.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento-card 2FA verify form
  Logic   : Unchanged — fetches question/hint on mount, submits verify2fa()
            Redirects to /admin or /user based on role
  Palette : --gz-* tokens from index.css
  Fonts   : Playfair Display (heading) · Josefin Sans (labels) · Lato (inputs)
  Hint    : Hover-to-reveal — blurred until hovered, same UX as original
*/
export default function SecurityQuestion() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* Fetch question on mount — redirect to /login if no pending session */
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

  /* Don't render until question loaded */
  if (loading) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--gz-bark)", paddingTop: "5rem" }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(45,106,79,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── CARD ── */}
      <div
        className="relative w-full max-w-sm rounded-2xl px-8 py-10"
        style={{
          background: "var(--gz-soil)",
          border: "1px solid var(--gz-driftwood)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top ornament */}
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
          Verify
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
          Prove your identity to proceed
        </p>

        {/* ── QUESTION BLOCK ── */}
        <div
          className="rounded-xl px-5 py-4 mb-6"
          style={{
            background: "var(--gz-bark)",
            border: "1px solid var(--gz-driftwood)",
          }}
        >
          <p
            className="text-xs tracking-widest uppercase mb-2"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--gz-olive-lt)",
            }}
          >
            Your question
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--gz-cream)",
              lineHeight: 1.6,
            }}
          >
            {question}
          </p>

          {/* Hover-to-reveal hint — blurred until hovered */}
          {hint && (
            <div className="group flex items-center gap-2 mt-3 cursor-default select-none">
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.6rem",
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
                {/* Tilde mask — fades out on hover */}
                <span
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  style={{ color: "var(--gz-driftwood)" }}
                >
                  ~~~~~~
                </span>
                {/* Actual hint — unblurs on hover */}
                <span
                  className="transition-all duration-300 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none"
                  style={{ color: "var(--gz-sand)" }}
                >
                  {hint}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak your truth..."
              required
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
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
          </div>

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

          <button
            type="submit"
            disabled={submitting}
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "0.85rem",
              background: submitting
                ? "var(--gz-emerald-dim)"
                : "var(--gz-emerald)",
              color: "var(--gz-cream)",
              border: "none",
              borderRadius: "0.5rem",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              transition: "background 0.15s, opacity 0.15s",
              boxShadow: "0 4px 16px rgba(45,106,79,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!submitting)
                e.currentTarget.style.background = "var(--gz-emerald-lt)";
            }}
            onMouseLeave={(e) => {
              if (!submitting)
                e.currentTarget.style.background = "var(--gz-emerald)";
            }}
          >
            {submitting ? "Verifying..." : "Confirm Identity"}
          </button>
        </form>

        {/* Bottom rule */}
        <div className="flex items-center gap-3 mt-8">
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
      </div>
    </div>
  );
}
