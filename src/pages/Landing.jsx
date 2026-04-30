import { Link } from "react-router-dom";

/*
  Landing.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento Grid Layout
  Grid    : Asymmetric bento — hero image cell + solid content cells
  Palette : Emerald/olive on deep forest darks (--gz-* tokens)
  Fonts   : Playfair Display (brand) · Josefin Sans (labels) · Lato (body)
  Readability: All text sits on solid/semi-solid surfaces — no text over raw bg
*/
export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gz-bark)", paddingTop: "3.5rem" }}
    >
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* ── BENTO GRID ── */}
        <div
          className="grid gap-3 h-full"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto",
          }}
        >
          {/* ── CELL 1: BG IMAGE HERO (visual anchor) ── */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              gridColumn: "1 / 8",
              gridRow: "1 / 3",
              minHeight: "420px",
              backgroundImage: "url('/background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Light vignette only — image stays readable */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,26,20,0.45) 0%, rgba(26,26,20,0.15) 100%)",
              }}
            />
            {/* Floating eyebrow tag */}
            <div className="absolute bottom-6 left-6">
              <span
                className="px-3 py-1 text-xs tracking-widest uppercase rounded-full"
                style={{
                  fontFamily: "var(--font-ui)",
                  background: "rgba(26,26,20,0.72)",
                  color: "var(--gz-olive-lt)",
                  border: "1px solid var(--gz-border)",
                  backdropFilter: "blur(6px)",
                }}
              >
                Est. Ground Level
              </span>
            </div>
          </div>

          {/* ── CELL 2: BRAND NAME ── */}
          <div
            className="rounded-2xl flex flex-col justify-center px-8 py-8"
            style={{
              gridColumn: "8 / 13",
              gridRow: "1 / 2",
              background: "var(--gz-emerald-dim)",
              border: "1px solid var(--gz-border)",
            }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-3"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gz-olive-lt)",
              }}
            >
              Spirits &amp; Distribution
            </p>
            <h1
              className="leading-none uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
                color: "var(--gz-cream)",
                letterSpacing: "0.08em",
              }}
            >
              Ground
              <br />
              <span style={{ color: "var(--gz-emerald-lt)" }}>Zero</span>
            </h1>
          </div>

          {/* ── CELL 3: TAGLINE ── */}
          <div
            className="rounded-2xl flex flex-col justify-between px-8 py-8"
            style={{
              gridColumn: "8 / 13",
              gridRow: "2 / 3",
              background: "var(--gz-soil)",
              border: "1px solid var(--gz-driftwood)",
            }}
          >
            <p
              className="text-lg italic leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--gz-sand)",
                opacity: 0.85,
              }}
            >
              Where every bottle finds its home.
            </p>
          </div>

          {/* ── CELL 4: ENTER CTA ── */}
          <div
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-8 gap-3"
            style={{
              gridColumn: "1 / 5",
              gridRow: "3 / 4",
              background: "var(--gz-emerald)",
              border: "1px solid var(--gz-emerald-lt)",
              cursor: "pointer",
            }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "rgba(240,230,211,0.65)",
              }}
            >
              Already a member?
            </p>
            <Link
              to="/login"
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase transition-all duration-200"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 700,
                background: "var(--gz-emerald-dim)",
                color: "var(--gz-cream)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(64,145,108,0.4)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--gz-emerald-lt)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--gz-emerald-dim)")
              }
            >
              Enter the Cellar
            </Link>
          </div>

          {/* ── CELL 5: SIGNUP CTA ── */}
          <div
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-8 gap-3"
            style={{
              gridColumn: "5 / 9",
              gridRow: "3 / 4",
              background: "var(--gz-soil)",
              border: "1px solid var(--gz-driftwood)",
            }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gz-olive-lt)",
              }}
            >
              New distributor?
            </p>
            <Link
              to="/signup"
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase transition-all duration-200"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                color: "var(--gz-cream)",
                borderRadius: "0.5rem",
                border: "1px solid var(--gz-border)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--gz-olive-lt)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--gz-border)")
              }
            >
              Join the Network
            </Link>
          </div>

          {/* ── CELL 6: FOOTER TAG ── */}
          <div
            className="rounded-2xl flex items-center justify-between px-8 py-5"
            style={{
              gridColumn: "9 / 13",
              gridRow: "3 / 4",
              background: "var(--gz-soil)",
              border: "1px solid var(--gz-driftwood)",
            }}
          >
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gz-driftwood)",
              }}
            >
              Mark Gil Ventura IAS Finals
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gz-driftwood)",
                opacity: 0.5,
              }}
            >
              GroundZero
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
