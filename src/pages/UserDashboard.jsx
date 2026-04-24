import { useState, useEffect } from "react";
import { getProfile, update2fa, logout } from "../services/authService";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [msg, setMsg]       = useState("");
  const [error, setError]   = useState("");
  const [editing, setEditing] = useState(false);

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

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    const res = await update2fa(form);
    if (res.success) {
      setMsg("Security question updated.");
      setEditing(false);
      setProfile((p) => ({
        ...p,
        u_security_question: form.security_question,
        u_security_hint: form.security_hint,
      }));
    } else {
      setError(res.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const glass = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg";

  if (!profile) return null;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className={`relative w-full max-w-md rounded-2xl ${glass} text-white p-8 space-y-6`}>

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            Logout
          </button>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
          <p className="text-white">{profile.u_email}</p>
        </div>

        {/* 2FA SECTION */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Security Question (2FA)</p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition"
              >
                Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-1">
              <p className="text-white">{profile.u_security_question}</p>
              {profile.u_security_hint && (
                <p className="text-xs text-gray-400">Hint: {profile.u_security_hint}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <input
                name="security_question"
                placeholder="New security question"
                value={form.security_question}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="security_answer"
                type="password"
                placeholder="New answer"
                value={form.security_answer}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="security_hint"
                placeholder="Hint (optional)"
                value={form.security_hint}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setError(""); }}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {msg && <p className="text-sm text-green-400 text-center">{msg}</p>}
      </div>
    </div>
  );
}