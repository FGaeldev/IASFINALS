import { useState, useEffect } from "react";
import { getProfile, update2fa } from "../services/authService";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

const inputClass =
  "w-full px-4 py-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-yellow-700 focus:outline-none focus:ring-1 focus:ring-yellow-700/30 text-white placeholder-neutral-600 transition-colors text-sm";
const labelClass =
  "text-neutral-500 text-xs tracking-widest uppercase block mb-1.5";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setMsg("");
    setError("");
    setLoading(true);
    const res = await update2fa(form);
    setLoading(false);
    if (res.success) {
      setMsg("Security question updated successfully.");
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

  if (!profile) return null;

  return (
    <div className="flex min-h-screen bg-black pt-16">
      {/* LEFT — content */}
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
          My Account.
        </h1>
        <p className="text-neutral-600 text-sm mb-10" style={inter}>
          Manage your Lockheart account details.
        </p>

        <div className="max-w-sm space-y-8">
          {/* EMAIL */}
          <div>
            <p className={labelClass} style={inter}>
              Email Address
            </p>
            <p className="text-white text-sm" style={inter}>
              {profile.u_email}
            </p>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-neutral-900" />

          {/* 2FA SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className={labelClass} style={inter}>
                Security Question
              </p>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs tracking-widest uppercase border border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-white px-3 py-1.5 transition-colors"
                  style={inter}
                >
                  Edit
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-3">
                <p className="text-white text-sm leading-relaxed" style={inter}>
                  {profile.u_security_question}
                </p>
                {profile.u_security_hint && (
                  <div className="group flex items-center gap-2 cursor-default select-none">
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
                        {profile.u_security_hint}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className={labelClass} style={inter}>
                    New Question
                  </label>
                  <input
                    name="security_question"
                    value={form.security_question}
                    onChange={handleChange}
                    placeholder="Your security question"
                    className={inputClass}
                    style={inter}
                  />
                </div>
                <div>
                  <label className={labelClass} style={inter}>
                    New Answer
                  </label>
                  <input
                    name="security_answer"
                    type="password"
                    value={form.security_answer}
                    onChange={handleChange}
                    placeholder="············"
                    className={inputClass}
                    style={inter}
                  />
                </div>
                <div>
                  <label className={labelClass} style={inter}>
                    Hint{" "}
                    <span className="text-neutral-700 normal-case">
                      — optional
                    </span>
                  </label>
                  <input
                    name="security_hint"
                    value={form.security_hint}
                    onChange={handleChange}
                    placeholder="A subtle reminder..."
                    className={inputClass}
                    style={inter}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs" style={inter}>
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-black text-xs tracking-[0.2em] uppercase transition-colors"
                    style={{ ...inter, fontWeight: 600 }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                    }}
                    className="flex-1 py-3 border border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
                    style={inter}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {msg && (
            <p className="text-yellow-600/70 text-xs" style={inter}>
              {msg}
            </p>
          )}
        </div>
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
