import { useState, useEffect } from "react";
import {
  getProfile,
  update2fa,
  logout,
  changePassword,
} from "../services/authService";

const cinzel = { fontFamily: "'Cinzel', serif" };
const garamond = { fontFamily: "'EB Garamond', serif" };

const inputClass =
  "w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/50 text-amber-50 placeholder-zinc-500 transition-colors";
const labelClass = "text-amber-500/90 text-xs tracking-widest uppercase";

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

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);

  // 2FA state
  const [form, setForm] = useState({
    security_question: "",
    security_answer: "",
    security_hint: "",
  });
  const [editing, setEditing] = useState(false);
  const [oathMsg, setOathMsg] = useState("");
  const [oathError, setOathError] = useState("");
  const [oathLoading, setOathLoading] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwEditing, setPwEditing] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

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
  const handlePwChange = (e) =>
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleSaveOath = async (e) => {
    e.preventDefault();
    setOathMsg("");
    setOathError("");
    setOathLoading(true);
    const res = await update2fa(form);
    setOathLoading(false);
    if (res.success) {
      setOathMsg("Oath resworn. Security question updated.");
      setEditing(false);
      setProfile((p) => ({
        ...p,
        u_security_question: form.security_question,
        u_security_hint: form.security_hint,
      }));
    } else {
      setOathError(res.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("Passwords do not match");
      return;
    }
    setPwLoading(true);
    const res = await changePassword(pwForm);
    setPwLoading(false);
    if (res.success) {
      setPwMsg("Cipher reforged. Password updated.");
      setPwEditing(false);
      setPwForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } else {
      setPwError(res.message);
    }
  };

  const pwRules = getPasswordStrength(pwForm.new_password);
  const pwScore = pwRules.filter((r) => r.pass).length;

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

          {/* PASSWORD SECTION */}
          <div className="border border-zinc-800 bg-zinc-900/60 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className={labelClass} style={cinzel}>
                Cipher (Password)
              </p>
              {!pwEditing && (
                <button
                  onClick={() => setPwEditing(true)}
                  className="text-xs tracking-widest uppercase px-3 py-1 border border-amber-800/50 text-amber-500/80 hover:border-amber-600 hover:text-amber-400 transition-colors"
                  style={cinzel}
                >
                  Reforge
                </button>
              )}
            </div>

            {!pwEditing ? (
              <p className="text-zinc-600 text-sm italic" style={garamond}>
                ············
              </p>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    Current Password
                  </label>
                  <input
                    name="current_password"
                    type="password"
                    value={pwForm.current_password}
                    onChange={handlePwChange}
                    placeholder="············"
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                </div>

                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    New Password
                  </label>
                  <input
                    name="new_password"
                    type="password"
                    value={pwForm.new_password}
                    onChange={handlePwChange}
                    placeholder="············"
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                  {/* Strength meter */}
                  {pwForm.new_password.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-zinc-800">
                          <div
                            className={`h-1 transition-all duration-300 ${strengthColor[pwScore]}`}
                            style={{ width: `${(pwScore / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500" style={cinzel}>
                          {strengthLabel[pwScore]}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {pwRules.map((r) => (
                          <span
                            key={r.label}
                            className={`text-xs italic ${r.pass ? "text-amber-500/70" : "text-zinc-600"}`}
                            style={garamond}
                          >
                            {r.pass ? "✓" : "✗"} {r.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className={labelClass} style={cinzel}>
                    Confirm Password
                  </label>
                  <input
                    name="confirm_password"
                    type="password"
                    value={pwForm.confirm_password}
                    onChange={handlePwChange}
                    placeholder="············"
                    className={inputClass}
                    style={{ ...garamond, fontSize: "1rem" }}
                  />
                </div>

                {pwError && (
                  <p
                    className="text-red-400/80 text-sm italic"
                    style={garamond}
                  >
                    {pwError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={{ ...cinzel, fontWeight: 700 }}
                  >
                    {pwLoading ? "Forging..." : "Reforge Cipher"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPwEditing(false);
                      setPwError("");
                      setPwForm({
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                      });
                    }}
                    className="flex-1 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={cinzel}
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}

            {pwMsg && (
              <p
                className="text-amber-500/70 text-sm italic text-center"
                style={garamond}
              >
                {pwMsg}
              </p>
            )}
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
              <form onSubmit={handleSaveOath} className="space-y-4 pt-1">
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

                {oathError && (
                  <p
                    className="text-red-400/80 text-sm italic"
                    style={garamond}
                  >
                    {oathError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={oathLoading}
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-zinc-950 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={{ ...cinzel, fontWeight: 700 }}
                  >
                    {oathLoading ? "Binding..." : "Reseal Oath"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setOathError("");
                    }}
                    className="flex-1 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 text-xs tracking-[0.2em] uppercase transition-colors"
                    style={cinzel}
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            )}

            {oathMsg && (
              <p
                className="text-amber-500/70 text-sm italic text-center"
                style={garamond}
              >
                {oathMsg}
              </p>
            )}
          </div>
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
