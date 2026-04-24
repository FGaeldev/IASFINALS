import { useState } from "react";
import { signup } from "../services/authService";

function getPasswordStrength(pw) {
  const rules = [
    { pass: pw.length >= 8,              label: "8+ chars" },
    { pass: /[A-Z]/.test(pw),            label: "Uppercase" },
    { pass: /[a-z]/.test(pw),            label: "Lowercase" },
    { pass: /[0-9]/.test(pw),            label: "Number" },
    { pass: /[\W_]/.test(pw),            label: "Special char" },
  ];
  return rules;
}

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    security_question: "",
    security_answer: "",
    security_hint: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const rules = getPasswordStrength(form.password);
    if (rules.some((r) => !r.pass)) {
      alert("Password too weak. Meet all requirements.");
      return;
    }
    const res = await signup(form);
    if (res.success) {
      window.location.href = "/login";
    } else {
      alert(res.message);
    }
  };

  const pwRules = getPasswordStrength(form.password);
  const pwScore = pwRules.filter((r) => r.pass).length;
  const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-lime-400", "bg-green-500"][pwScore];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('./public/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg text-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-3">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Strength bar */}
          {form.password.length > 0 && (
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white/20 rounded-full">
                <div
                  className={`h-1.5 rounded-full transition-all ${strengthColor}`}
                  style={{ width: `${(pwScore / 5) * 100}%` }}
                />
              </div>
              <ul className="grid grid-cols-2 gap-x-4 text-xs">
                {pwRules.map((r) => (
                  <li key={r.label} className={r.pass ? "text-green-400" : "text-gray-400"}>
                    {r.pass ? "✓" : "✗"} {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <input
            name="security_question"
            placeholder="Security Question"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="security_answer"
            placeholder="Answer"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="security_hint"
            placeholder="Hint (optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            Create Account
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}