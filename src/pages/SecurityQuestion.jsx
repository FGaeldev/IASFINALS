import { useState, useEffect } from "react";
import { verify2fa, getSecurityQuestion } from "../services/authService";

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

export default function SecurityQuestion() {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  if (loading) return null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950/95" />

      <div className="relative w-full max-w-sm">
        {/* Top ornament */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-amber-900/40" />
          <span
            className="text-amber-500/90 text-xs tracking-[0.4em] uppercase"
            style={cinzel}
          >
            Nomads
          </span>
          <div className="flex-1 h-px bg-amber-900/40" />
        </div>

        {/* Heading */}
        <h1
          className="text-amber-200 text-3xl tracking-[0.2em] uppercase text-center mb-1"
          style={{ ...cinzel, fontWeight: 700 }}
        >
          Verify
        </h1>
        <p
          className="text-amber-100/55 text-sm text-center italic mb-8"
          style={garamond}
        >
          Prove your identity to proceed
        </p>

        {/* Question block */}
        <div className="border border-zinc-800 bg-zinc-900/60 px-5 py-4 mb-6 space-y-1">
          <p
            className="text-xs tracking-widest uppercase text-amber-500/90 mb-2"
            style={cinzel}
          >
            Your question
          </p>
          <p
            className="text-amber-100 text-base leading-relaxed"
            style={garamond}
          >
            {question}
          </p>
          {hint && (
            <div className="group flex items-center gap-2 pt-1 cursor-default select-none">
              <span
                className="text-zinc-600 text-xs tracking-widest uppercase"
                style={cinzel}
              >
                Hint
              </span>
              <span className="relative text-sm italic" style={garamond}>
                {/* Cue — fades out on hover */}
                <span className="absolute inset-0 text-zinc-500 group-hover:opacity-0 transition-opacity duration-300">
                  ~~~~~~
                </span>
                {/* Hint — fades + unblurs on hover */}
                <span className="text-zinc-300 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-300">
                  {hint}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              className="text-amber-500/90 text-xs tracking-widest uppercase"
              style={cinzel}
            >
              Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak your truth..."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-50 placeholder-zinc-500 transition-colors"
              style={{ ...garamond, fontSize: "1rem" }}
            />
          </div>

          {error && (
            <p
              className="text-red-400/80 text-sm italic text-center"
              style={garamond}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/30"
            style={{ ...cinzel, fontWeight: 700 }}
          >
            {submitting ? "Verifying..." : "Confirm Identity"}
          </button>
        </form>

        {/* Bottom rule */}
        <div className="flex items-center gap-3 mt-8">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-700 text-xs">✦</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
