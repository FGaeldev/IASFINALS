import { useState, useEffect } from "react";
import { verify2fa, getSecurityQuestion } from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const inputClass =
  "w-full px-4 py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-700/30 text-white placeholder-neutral-600 transition-colors text-sm";
const labelClass =
  "text-neutral-500 text-xs tracking-widest uppercase block mb-1.5";

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
    <div className="flex min-h-screen bg-black pt-16">
      {/* LEFT — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        {/* Brand */}
        <p
          className="text-yellow-600/70 text-xs tracking-[0.5em] uppercase mb-8"
          style={inter}
        >
          Lockheart
        </p>

        {/* Heading */}
        <h1
          className="text-white text-3xl md:text-4xl leading-tight mb-2"
          style={{ ...playfair, fontWeight: 700 }}
        >
          One more step.
        </h1>
        <p className="text-neutral-600 text-sm mb-10" style={inter}>
          Verify your identity to continue.
        </p>

        {/* Question block */}
        <div className="max-w-sm mb-6 border-l-2 border-yellow-700/40 pl-4">
          <p
            className="text-neutral-500 text-xs tracking-widest uppercase mb-2"
            style={inter}
          >
            Your security question
          </p>
          <p className="text-white text-base leading-relaxed" style={playfair}>
            {question}
          </p>
          {hint && (
            <div className="group flex items-center gap-2 mt-2 cursor-default select-none">
              <span
                className="text-neutral-700 text-xs tracking-widest uppercase border-b border-dashed border-neutral-800"
                style={inter}
              >
                Hint
              </span>
              <span className="relative text-sm" style={inter}>
                <span className="absolute inset-0 text-neutral-600 group-hover:opacity-0 transition-opacity duration-300">
                  hover
                </span>
                <span className="text-neutral-400 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-300">
                  {hint}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
          <div>
            <label className={labelClass} style={inter}>
              Your Answer
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              className={inputClass}
              style={inter}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs" style={inter}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs tracking-[0.2em] uppercase transition-colors"
            style={{ ...inter, fontWeight: 600 }}
          >
            {submitting ? "Verifying..." : "Confirm Identity"}
          </button>
        </form>
      </div>

      {/* RIGHT — image, hidden on mobile */}
      <div
        className="hidden md:block flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="w-full h-full bg-black/20" />
      </div>
    </div>
  );
}
