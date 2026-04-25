import { useState, useEffect } from "react";
import { getProfile, update2fa, logout } from "../services/authService";

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-50 placeholder-zinc-500 transition-colors";
const labelClass = "text-amber-500/90 text-xs tracking-widest uppercase";

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
      setMsg("Oath resworn. Security question updated.");
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

  if (!profile) return null;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center px-4 py-20"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/95" />

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
          Dossier
        </h1>
        <p
          className="text-amber-100/55 text-sm text-center italic mb-8"
          style={garamond}
        >
          Your standing within the order
        </p>

        <div className="space-y-6">
          {/* EMAIL */}
          <div className="border border-zinc-800 bg-zinc-900/60 px-5 py-4">
            <p className={`${labelClass} mb-2`} style={cinzel}>
              Sworn Identity
            </p>
            <p className="text-amber-100 text-base" style={garamond}>
              {profile.u_email}
            </p>
          </div>

          {/* 2FA SECTION */}
          <div className="border border-zinc-800 bg-zinc-900/60 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className={labelClass} style={cinzel}>
                Secret Oath (2FA)
              </p>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs tracking-widest uppercase px-3 py-1 border border-amber-800/50 text-amber-500/80 hover:border-amber-600 hover:text-amber-400 transition-colors"
                  style={cinzel}
                >
                  Amend
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-2">
                <p
                  className="text-amber-100/80 text-base italic"
                  style={garamond}
                >
                  {profile.u_security_question}
                </p>
                {profile.u_security_hint && (
                  <div className="group flex items-center gap-2 cursor-default select-none">
                    <span
                      className="text-zinc-600 text-xs tracking-widest uppercase border-b border-dashed border-zinc-700"
                      style={cinzel}
                    >
                      Hint
                    </span>
                    <span className="relative text-sm italic" style={garamond}>
                      <span className="absolute inset-0 text-zinc-500 group-hover:opacity-0 transition-opacity duration-300">
                       ~~~~~~~~
                      </span>
                      <span className="text-zinc-300 opacity-0 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-300">
                        {profile.u_security_hint}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    New Question
                  </label>
                  <input
                    name="security_question"
                    value={form.security_question}
                    onChange={handleChange}
                    placeholder="Your secret question..."
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    New Answer
                  </label>
                  <input
                    name="security_answer"
                    type="password"
                    value={form.security_answer}
                    onChange={handleChange}
                    placeholder="············"
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    Hint{" "}
                    <span
                      className="text-zinc-600 normal-case"
                      style={garamond}
                    >
                      (optional)
                    </span>
                  </label>
                  <input
                    name="security_hint"
                    value={form.security_hint}
                    onChange={handleChange}
                    placeholder="A subtle clue..."
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                </div>

                {error && (
                  <p
                    className="text-red-400/80 text-sm italic"
                    style={garamond}
                  >
                    {error}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={{ ...cinzel, fontWeight: 700 }}
                  >
                    {loading ? "Binding..." : "Reseal Oath"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                    }}
                    className="flex-1 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={cinzel}
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Success msg */}
          {msg && (
            <p
              className="text-amber-500/70 text-sm italic text-center"
              style={garamond}
            >
              {msg}
            </p>
          )}
        </div>

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
