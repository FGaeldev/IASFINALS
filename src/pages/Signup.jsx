import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/authService";

function getPasswordStrength(pw) {
  return [
    { pass: pw.length >= 8, label: "8+ chars" },
    { pass: /[A-Z]/.test(pw), label: "Uppercase" },
    { pass: /[a-z]/.test(pw), label: "Lowercase" },
    { pass: /[0-9]/.test(pw), label: "Number" },
    { pass: /[\W_]/.test(pw), label: "Special char" },
  ];
}

const strengthLabel = ["", "Feeble", "Weak", "Decent", "Strong", "Formidable"];
const strengthColor = [
  "",
  "bg-red-700",
  "bg-orange-600",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-amber-500",
];

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-100 placeholder-zinc-500 transition-colors";
const labelClass = "text-amber-500/90 text-xs tracking-widest uppercase";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const rules = getPasswordStrength(form.password);
    if (rules.some((r) => !r.pass)) {
      setError("Password does not meet all requirements.");
      return;
    }
    setLoading(true);
    const res = await signup(form);
    setLoading(false);
    if (res.success) {
      window.location.href = "/login";
    } else {
      setError(res.message);
    }
  };

  const pwRules = getPasswordStrength(form.password);
  const pwScore = pwRules.filter((r) => r.pass).length;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4 py-20"
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
          Pledge
        </h1>
        <p
          className="text-amber-100/55 text-sm text-center italic mb-8"
          style={garamond}
        >
          Swear your oath to the order
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className={labelClass} style={cinzel}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              onChange={handleChange}
              className={inputClass}
              style={{ ...garamond, fontSize: "1rem" }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className={labelClass} style={cinzel}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="············"
              onChange={handleChange}
              className={inputClass}
              style={{ ...garamond, fontSize: "1rem" }}
            />

            {/* Strength meter */}
            {form.password.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-zinc-800">
                    <div
                      className={`h-1 transition-all duration-300 ${strengthColor[pwScore]}`}
                      style={{ width: `${(pwScore / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-400" style={cinzel}>
                    {strengthLabel[pwScore]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {pwRules.map((r) => (
                    <span
                      key={r.label}
                      className={`text-xs italic ${r.pass ? "text-amber-500/70" : "text-zinc-400"}`}
                      style={garamond}
                    >
                      {r.pass ? "✓" : "✗"} {r.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-amber-700 text-xs">✦</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {/* Security question */}
          <div className="space-y-1">
            <label className={labelClass} style={cinzel}>
              Security Question
            </label>
            <input
              name="security_question"
              placeholder="e.g. Name of your first pet"
              onChange={handleChange}
              className={inputClass}
              style={{ ...garamond, fontSize: "1rem" }}
            />
          </div>

          {/* Answer */}
          <div className="space-y-1">
            <label className={labelClass} style={cinzel}>
              Answer
            </label>
            <input
              name="security_answer"
              type="password"
              placeholder="············"
              onChange={handleChange}
              className={inputClass}
              style={{ ...garamond, fontSize: "1rem" }}
            />
          </div>

          {/* Hint */}
          <div className="space-y-1">
            <label className={labelClass} style={cinzel}>
              Hint{" "}
              <span
                className="text-zinc-400 normal-case not-italic"
                style={garamond}
              >
                (optional)
              </span>
            </label>
            <input
              name="security_hint"
              placeholder="A subtle clue..."
              onChange={handleChange}
              className={inputClass}
              style={{ ...garamond, fontSize: "1rem" }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-red-400/80 text-sm italic text-center"
              style={garamond}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/30"
            style={{ ...cinzel, fontWeight: 700 }}
          >
            {loading ? "Binding oath..." : "Swear Allegiance"}
          </button>
        </form>

        {/* Bottom */}
        <div className="flex items-center gap-3 mt-8 mb-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-700 text-xs">✦</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <p
          className="text-center text-zinc-400 text-sm italic"
          style={garamond}
        >
          Already sworn in?{" "}
          <Link
            to="/login"
            className="text-amber-600/80 hover:text-amber-500 not-italic transition-colors"
          >
            Enter the order
          </Link>
        </p>
      </div>
    </div>
  );
}
