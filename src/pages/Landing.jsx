import { Link } from "react-router-dom";

const playfair = { fontFamily: "'Playfair Display', serif" };
const inter = { fontFamily: "'Inter', sans-serif" };

export default function Landing() {
  return (
    <div className="bg-black min-h-screen flex flex-col overflow-x-hidden">
      {/* HERO — split layout */}
      <div className="flex flex-col md:flex-row min-h-screen pt-16">
        {/* LEFT — text */}
        <div className="flex-1 flex flex-col justify-center px-10 md:px-16 lg:px-24 py-20 bg-black">
          <p
            className="text-yellow-600/70 text-xs tracking-[0.5em] uppercase mb-6"
            style={inter}
          >
            Member Portal
          </p>
          <h1
            className="text-white text-5xl md:text-6xl lg:text-7xl leading-tight mb-6"
            style={{ ...playfair, fontWeight: 700 }}
          >
            Welcome to
            <br />
            Lockheart.
          </h1>
          <div className="w-12 h-px bg-yellow-700/60 mb-6" />
          <p
            className="text-neutral-500 text-base leading-relaxed max-w-sm mb-10"
            style={inter}
          >
            Exclusive access for Lockheart members. Sign in to manage your
            account or create one to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black text-xs tracking-[0.2em] uppercase transition-colors text-center"
              style={{ ...inter, fontWeight: 600 }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3 border border-neutral-800 hover:border-neutral-600 text-neutral-500 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors text-center"
              style={inter}
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* RIGHT — image */}
        <div
          className="flex-1 min-h-64 md:min-h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/background.jpg')" }}
        >
          <div className="w-full h-full bg-black/20" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-black border-t border-neutral-900 px-10 md:px-16 py-5 flex flex-col md:flex-row justify-between items-center gap-2">
        <p
          className="text-neutral-800 text-xs tracking-widest uppercase"
          style={{ ...playfair, fontStyle: "italic" }}
        >
          Lockheart
        </p>
        <p
          className="text-neutral-800 text-xs tracking-widest uppercase"
          style={inter}
        >
          Vince Timothy Esmeralda — IAS 1
        </p>
      </div>
    </div>
  );
}
