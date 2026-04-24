import { useState, useEffect } from "react";
import { verify2fa, getSecurityQuestion } from "../services/authService";

export default function SecurityQuestion() {
  const [answer, setAnswer]     = useState("");
  const [question, setQuestion] = useState("");
  const [hint, setHint]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getSecurityQuestion().then((res) => {
      if (res.success) {
        setQuestion(res.data.question);
        setHint(res.data.hint);
      } else {
        // No pending session — boot back to login
        window.location.href = "/login";
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await verify2fa(answer);
    if (res.success) {
      const role = res.data.role;
      if (role === "admin")     window.location.href = "/admin";
      else if (role === "user") window.location.href = "/user";
      else                      window.location.href = "/";
    } else {
      setError(res.message);
    }
  };

  if (loading) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg text-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Security Verification</h1>

        {/* Display the question */}
        <p className="text-center text-gray-200 mb-1">{question}</p>
        {hint && (
          <p className="text-center text-xs text-gray-400 mb-4">Hint: {hint}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}