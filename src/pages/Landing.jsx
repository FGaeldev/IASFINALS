import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed flex flex-col"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/95" />

      {/* Horizontal top rule */}
      <div className="relative z-10 mt-14 mx-8 md:mx-16 border-t border-amber-900/40" />

      {/* HERO */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">

        {/* Org name */}
        <h1
          className="text-amber-200 text-6xl md:text-8xl lg:text-9xl leading-none tracking-[0.15em] uppercase mb-2"
          style={{ fontFamily: "'Cinzel Decorative', serif", fontWeight: 700 }}
        >
          Nomads
        </h1>

        {/* Thin amber rule */}
        <div className="flex items-center gap-4 my-6 w-full max-w-sm">
          <div className="flex-1 h-px bg-amber-700/40" />
          <span
            className="text-amber-600/60 text-xs tracking-widest"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            ✦
          </span>
          <div className="flex-1 h-px bg-amber-700/40" />
        </div>

        {/* Tagline */}
        <p
          className="text-amber-100/70 text-lg md:text-xl italic max-w-md leading-relaxed mb-10"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          We do not conquer territories. We haunt them.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-zinc-950 text-xs tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/40"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
          >
            Enter the Order
          </Link>
          <Link
            to="/signup"
            className="px-8 py-3 border border-amber-800/60 hover:border-amber-600 text-amber-200/60 hover:text-amber-200 text-xs tracking-[0.2em] uppercase transition-all duration-200"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Pledge Allegiance
          </Link>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="relative z-10 border-t border-amber-900/30 px-8 md:px-16 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <p
          className="text-zinc-400 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Information Assurance & Security
        </p>
        <p
          className="text-zinc-700 text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Isaac Psalm Inamac
        </p>
      </div>
    </div>
  );
}
