import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const inputClass =
  "w-full px-4 py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-700/30 text-white placeholder-neutral-600 transition-colors text-sm";
const labelClass =
  "text-neutral-500 text-xs tracking-widest uppercase block mb-1.5";

function getPasswordStrength(pw) {
  return [
    { pass: pw.length >= 8, label: "8+ chars" },
    { pass: /[A-Z]/.test(pw), label: "Uppercase" },
    { pass: /[a-z]/.test(pw), label: "Lowercase" },
    { pass: /[0-9]/.test(pw), label: "Number" },
    { pass: /[\W_]/.test(pw), label: "Special char" },
  ];
}

const strengthLabel = ["", "Weak", "Poor", "Fair", "Good", "Strong"];
const strengthColor = [
  "",
  "bg-red-600",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-yellow-600",
];

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
    <div className="flex min-h-screen bg-black pt-16">
      {/* LEFT — image, hidden on mobile */}
      <div
        className="hidden md:block flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="w-full h-full bg-black/20" />
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 overflow-y-auto">
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
          Create your account.
        </h1>
        <p className="text-neutral-600 text-sm mb-10" style={inter}>
          Join Lockheart and enjoy exclusive member access.
        </p>

        <form onSubmit={handleSignup} className="space-y-5 max-w-sm">
          {/* Email */}
          <div>
            <label className={labelClass} style={inter}>
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              onChange={handleChange}
              className={inputClass}
              style={inter}
            />
          </div>

          {/* Password */}
          <div>
            <label className={labelClass} style={inter}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="············"
              onChange={handleChange}
              className={inputClass}
              style={inter}
            />

            {/* Strength meter */}
            {form.password.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-neutral-800">
                    <div
                      className={`h-0.5 transition-all duration-300 ${strengthColor[pwScore]}`}
                      style={{ width: `${(pwScore / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-neutral-600 text-xs" style={inter}>
                    {strengthLabel[pwScore]}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {pwRules.map((r) => (
                    <span
                      key={r.label}
                      className={`text-xs ${r.pass ? "text-yellow-600/80" : "text-neutral-700"}`}
                      style={inter}
                    >
                      {r.pass ? "✓" : "✗"} {r.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-900" />
            <span
              className="text-neutral-700 text-xs tracking-widest uppercase"
              style={inter}
            >
              Security
            </span>
            <div className="flex-1 h-px bg-neutral-900" />
          </div>

          {/* Security question */}
          <div>
            <label className={labelClass} style={inter}>
              Security Question
            </label>
            <input
              name="security_question"
              placeholder="e.g. Name of your first pet"
              onChange={handleChange}
              className={inputClass}
              style={inter}
            />
          </div>

          {/* Answer */}
          <div>
            <label className={labelClass} style={inter}>
              Answer
            </label>
            <input
              name="security_answer"
              type="password"
              placeholder="············"
              onChange={handleChange}
              className={inputClass}
              style={inter}
            />
          </div>

          {/* Hint */}
          <div>
            <label className={labelClass} style={inter}>
              Hint{" "}
              <span className="text-neutral-700 normal-case">— optional</span>
            </label>
            <input
              name="security_hint"
              placeholder="A subtle reminder..."
              onChange={handleChange}
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
            disabled={loading}
            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-xs tracking-[0.2em] uppercase transition-colors"
            style={{ ...inter, fontWeight: 600 }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-neutral-600 text-xs mt-8 max-w-sm" style={inter}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 hover:text-yellow-500 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
