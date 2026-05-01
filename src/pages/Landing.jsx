import { Link } from "react-router-dom";

/*
  Landing.jsx — GroundZero
  ─────────────────────────────────────────────────────────────────────
  Theme   : Homely / Tropical — Bento Grid Layout
  Mobile  : Single column stack — grid collapses to flex-col
  Palette : --gz-* tokens from index.css
  Fonts   : Playfair Display (brand) · Josefin Sans (labels) · Lato (body)
*/
export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gz-bark)", paddingTop: "4.5rem" }}
    >
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
        {/* ── MOBILE: flex-col stack / DESKTOP: bento grid ── */}
        <div
          className="flex flex-col md:grid gap-3 h-full"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto",
          }}
        >
          {/* ── CELL 1: BG IMAGE HERO ── */}
          <div
            className="relative rounded-2xl overflow-hidden order-1"
            style={{
              gridColumn: "1 / 8",
              gridRow: "1 / 3",
              minHeight: "260px",
              backgroundImage: "url('/background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(26,26,20,0.45) 0%, rgba(26,26,20,0.15) 100%)",
              }}
            />
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
                Est. 2026
              </span>
            </div>
          </div>

          {/* ── CELL 2: BRAND NAME ── */}
          <div
            className="rounded-2xl flex flex-col justify-center px-6 py-6 order-2"
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
                fontSize: "clamp(2rem, 6vw, 3.6rem)",
                color: "var(--gz-cream)",
                letterSpacing: "0.08em",
                wordBreak: "break-word",
              }}
            >
              Ground
              <br />
              <span style={{ color: "var(--gz-emerald-lt)" }}>Zero</span>
            </h1>
          </div>

          {/* ── CELL 3: TAGLINE ── */}
          <div
            className="rounded-2xl flex flex-col justify-between px-6 py-6 order-3"
            style={{
              gridColumn: "8 / 13",
              gridRow: "2 / 3",
              background: "var(--gz-soil)",
              border: "1px solid var(--gz-driftwood)",
            }}
          >
            <p
              className="text-base italic leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--gz-sand)",
                opacity: 0.85,
              }}
            >
              Where every bottle finds its home.
            </p>
          </div>

          {/* ── CELL 4: LOGIN CTA ── */}
          <div
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-6 gap-3 order-4"
            style={{
              gridColumn: "1 / 5",
              gridRow: "3 / 4",
              background: "var(--gz-emerald)",
              border: "1px solid var(--gz-emerald-lt)",
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
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 700,
                background: "var(--gz-emerald-dim)",
                color: "var(--gz-cream)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(64,145,108,0.4)",
                display: "block",
                transition: "background 0.15s",
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
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-6 gap-3 order-5"
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
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                color: "var(--gz-cream)",
                borderRadius: "0.5rem",
                border: "1px solid var(--gz-border)",
                display: "block",
                transition: "border-color 0.15s",
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
            className="rounded-2xl flex items-center justify-between px-6 py-4 order-6"
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
              Mark Gil Ventura | GZ Co.
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--gz-driftwood)",
                opacity: 0.5,
              }}
            >
              IAS Finals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
