import { useState } from "react";
import { signup } from "../services/authService";

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

    const res = await signup(form);

    if (res.success) {
      window.location.href = "/login";
    } else {
      alert(res.message);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('./public/background.jpg')",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* form card */}
      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg text-white">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign Up
        </h1>

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

        {/* link */}
        <p className="text-sm text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}