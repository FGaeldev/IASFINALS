/**
 * NotFound.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : 404 error page. Rendered by React Router when no route
 *               matches the current path.
 * Theme       : Ancient Japanese scroll — specifically a "lost scroll"
 *               (散逸, san'itsu). The page evokes a document that has
 *               been separated from its collection: the jiku dowel caps
 *               are present but the scroll body is torn at the bottom,
 *               rendered via a CSS SVG clip-path jagged edge. The 404
 *               is written as if brushed in fading ink — opacity reduced
 *               to suggest age and abandonment. A fallen vermillion seal
 *               (hanko) sits askew, implying the record has been lost.
 * Layout      : Full-viewport centered flex. Scroll column max 380px.
 *               Torn-bottom edge via inline SVG wave mask on scroll body.
 * Dependencies: react-router-dom (Link) — back-to-home CTA only.
 * Tokens      : All colors from --sc-* variables in index.css.
 */

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        background: "var(--sc-paper)",
        paddingTop: "5rem",
        /*
         * Faded amber vignette — evokes an aging room where old scrolls
         * are stored. Warmer and more diffuse than the other pages,
         * signaling something is wrong with the environment itself.
         */
        backgroundImage: `
          radial-gradient(ellipse 90% 70% at 50% 60%,
            rgba(184,134,11,0.09) 0%, transparent 70%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            rgba(26,16,8,0.012) 100px,
            rgba(26,16,8,0.012) 101px
          )
        `,
      }}
    >
      {/* ── SCROLL COLUMN ────────────────────────────────────────── */}
      <div className="relative w-full" style={{ maxWidth: "380px" }}>

        {/* ══════════════════════════════════════════════════════════
            SCROLL TOP CAP — jiku (軸) wooden dowel
            Same gilded dowel as other scroll pages — continuity shows
            this is the same document system, just a lost record.
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            height: "22px",
            borderRadius: "9999px",
            background: `linear-gradient(180deg,
              #c8a96e 0%,
              #e8d5a3 35%,
              #d4b97a 60%,
              #b8952e 100%
            )`,
            boxShadow: `
              0 -3px 8px  rgba(26,16,8,0.18),
              0  4px 12px rgba(26,16,8,0.22),
              0  1px 0    rgba(255,245,200,0.6) inset
            `,
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* ══════════════════════════════════════════════════════════
            SCROLL BODY — the lost document
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            margin: "0 6px",
            background: "var(--sc-paper-aged)",
            borderLeft:  "1px solid rgba(184,134,11,0.22)",
            borderRight: "1px solid rgba(184,134,11,0.22)",
            boxShadow: `
              -4px 0 12px rgba(26,16,8,0.06),
               4px 0 12px rgba(26,16,8,0.06),
               0   0 40px rgba(26,16,8,0.05) inset
            `,
            padding: "2.5rem 2.5rem 2rem",
            position: "relative",
            zIndex: 1,
            /*
             * No bottom border — the scroll is torn here.
             * The jagged SVG wave below visually completes the tear.
             */
          }}
        >

          {/* ── FALLEN SEAL ──────────────────────────────────── */}
          {/*
           * A vermillion hanko seal, rotated askew — visually implies
           * the document record has been disturbed or invalidated.
           * Positioned top-right like a clerk's stamp, now tilted
           * as if the scroll fell from its shelf.
           */}
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.75rem",
              transform: "rotate(18deg)",
              opacity: 0.55,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "3px",
                border: "2.5px solid var(--sc-vermillion)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(192,57,43,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-logo)",
                  fontSize: "0.55rem",
                  color: "var(--sc-vermillion)",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  lineHeight: 1.3,
                  display: "block",
                }}
              >
                失<br/>効
              </span>
            </div>
          </div>

          {/* ── MON CREST — faded, aged ──────────────────────── */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "9999px",
                border: "1.5px solid rgba(184,134,11,0.4)",
                outline: "1px solid rgba(184,134,11,0.15)",
                outlineOffset: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--sc-paper)",
                /*
                 * Reduced opacity on the crest — the record is faded,
                 * as if the ink has aged over many years without care.
                 */
                opacity: 0.6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-logo)",
                  fontSize: "1rem",
                  color: "var(--sc-purple)",
                  lineHeight: 1,
                }}
              >
                ✦
              </span>
            </div>

            {/* Gold rule — also faded */}
            <div
              style={{
                width: "100%",
                height: "1px",
                opacity: 0.45,
                background: `linear-gradient(90deg,
                  transparent 0%,
                  var(--sc-gold) 50%,
                  transparent 100%
                )`,
              }}
            />
          </div>

          {/* ── 404 BRUSHED NUMERAL ──────────────────────────── */}
          {/*
           * The 404 is rendered in Playfair at large scale, heavily
           * faded — as if brushed long ago and left to age. The number
           * itself is a classification mark, like a library archive code
           * on a scroll that has been declared lost (散逸).
           */}
          <div className="text-center mb-2">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(4rem, 18vw, 6.5rem)",
                color: "var(--sc-ink)",
                opacity: 0.12,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                display: "block",
                userSelect: "none",
              }}
            >
              404
            </span>
          </div>

          {/* ── HEADING ──────────────────────────────────────── */}
          <h1
            className="text-center mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--sc-ink)",
              letterSpacing: "0.04em",
              lineHeight: 1.25,
            }}
          >
            Record Not Found
          </h1>

          {/* Subheading — scroll classification note */}
          <p
            className="text-center italic mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              color: "var(--sc-ash-light)",
              lineHeight: 1.65,
              opacity: 0.85,
            }}
          >
            This scroll has been lost to time,
            <br />
            or perhaps it never existed.
          </p>

          {/*
           * Classification note — styled as a formal archival
           * annotation, like a librarian's assessment stamp below
           * a scroll title. Tiny, tracked-out, authoritative.
           */}
          <p
            className="text-center mb-8"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.52rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--sc-gold)",
              opacity: 0.55,
            }}
          >
            Archive Status: San'itsu (散逸) — Lost
          </p>

          {/* ── INK RULE ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg,
                  transparent, var(--sc-border-ink) 80%)`,
                opacity: 0.5,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.5rem",
                color: "var(--sc-gold)",
                opacity: 0.5,
              }}
            >
              ✦
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg,
                  var(--sc-border-ink) 20%, transparent)`,
                opacity: 0.5,
              }}
            />
          </div>

          {/* ── RETURN HOME CTA ──────────────────────────────── */}
          {/*
           * Ghost-style link — no fill, just a brushstroke border.
           * Returning home from a lost scroll should feel humble,
           * not triumphant. No purple glow; just a quiet ink border.
           */}
          <div className="flex justify-center">
            <Link
              to="/"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "0.7rem 2rem",
                color: "var(--sc-ink)",
                border: "1px solid var(--sc-border-ink)",
                borderBottom: "2px solid var(--sc-border-ink)",
                borderRadius: "0",
                background: "transparent",
                display: "inline-block",
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color        = "var(--sc-purple)";
                e.currentTarget.style.borderColor  = "var(--sc-purple)";
                e.currentTarget.style.background   = "var(--sc-purple-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color        = "var(--sc-ink)";
                e.currentTarget.style.borderColor  = "var(--sc-border-ink)";
                e.currentTarget.style.background   = "transparent";
              }}
            >
              Return to the Shrine
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            TORN SCROLL BOTTOM EDGE
            SVG wave path mimics the ragged tear of aged washi paper.
            The scroll has no bottom jiku — it was torn away.
            viewBox is deliberately wider than tall for a shallow wave.
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            margin: "0 6px",
            lineHeight: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <svg
            viewBox="0 0 392 28"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ width: "100%", display: "block" }}
            aria-hidden="true"
          >
            {/*
             * Torn paper path — irregular wave with varying amplitude
             * to simulate a genuine tear rather than a decorative wave.
             * Filled with the aged paper color to match the scroll body.
             */}
            <path
              d="
                M0,0
                L0,14
                Q18,22 34,12
                Q52,2  68,18
                Q84,28 102,16
                Q118,6 136,20
                Q154,28 170,14
                Q186,2 204,18
                Q220,28 238,12
                Q256,0 274,16
                Q292,28 308,10
                Q324,0 342,18
                Q358,28 376,14
                L392,8
                L392,0
                Z
              "
              fill="var(--sc-paper-aged)"
            />
          </svg>
        </div>

        {/*
         * Trailing shadow beneath the torn edge — a drop-shadow
         * cast by the curled, torn paper lifting slightly off the surface.
         */}
        <div
          style={{
            margin: "0 12px",
            height: "8px",
            background: "transparent",
            boxShadow: "0 4px 12px rgba(26,16,8,0.12)",
            borderRadius: "0 0 4px 4px",
          }}
        />
      </div>
    </div>
  );
}