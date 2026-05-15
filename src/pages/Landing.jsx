/**
 * Landing.jsx — Schaden's Cosplay Shop
 * ─────────────────────────────────────────────────────────────────────
 * Purpose     : Public-facing landing page. First impression for all
 *               visitors — authenticated and unauthenticated alike.
 * Theme       : Anime / Cosplay — Eastern art palette. Magazine bento
 *               grid layout. Evokes ukiyo-e woodblock composition:
 *               asymmetric panels, strong verticals, ink + violet tones.
 * Layout      : 12-column bento grid on desktop. Single-column flex
 *               stack on mobile (order props control visual sequence).
 * Tokens      : All colors from --sc-* variables defined in index.css.
 * Dependencies: react-router-dom (Link)
 */

import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--sc-paper)",
        paddingTop: "4.5rem", /* clears the fixed navbar height */
      }}
    >
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6">

        {/*
         * BENTO GRID CONTAINER
         * Desktop: 12-column CSS grid — panels span columns explicitly.
         * Mobile : flex-col stack — `order` props set reading sequence.
         * gap-3  : consistent 12px gutter between all cells.
         */}
        <div
          className="flex flex-col md:grid gap-3"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto",
          }}
        >

          {/* ══════════════════════════════════════════════════════
              CELL 1 — HERO IMAGE
              Spans columns 1–7, rows 1–3. The visual anchor of the
              composition. Background image with a warm rice-paper
              gradient overlay to blend with the eastern palette.
              ══════════════════════════════════════════════════════ */}
          <div
            className="relative rounded-2xl overflow-hidden order-1"
            style={{
              gridColumn: "1 / 8",
              gridRow: "1 / 4",
              minHeight: "340px",
              backgroundImage: "url('/background.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/*
             * Overlay: warm parchment gradient at bottom — fades the
             * photo into the page rather than hard-cutting it.
             * Top corner has a faint violet wash for brand cohesion.
             */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    160deg,
                    rgba(109, 40, 217, 0.08) 0%,
                    transparent 40%,
                    rgba(245, 240, 232, 0.18) 100%
                  )
                `,
              }}
            />

            {/* Est. badge — bottom-left, frosted pill */}
            <div className="absolute bottom-6 left-6">
              <span
                className="px-3 py-1 text-xs tracking-widest uppercase rounded-full"
                style={{
                  fontFamily: "var(--font-ui)",
                  background: "rgba(245, 240, 232, 0.82)",
                  color: "var(--sc-ash)",
                  border: "1px solid var(--sc-border-warm)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 1px 0 rgba(184,134,11,0.25) inset",
                }}
              >
                Est. 2026
              </span>
            </div>

            {/*
             * Vermillion corner accent — top-right triangle.
             * References the red torii gate / hanko seal motif
             * common in Japanese woodblock print composition.
             */}
            <div
              className="absolute top-0 right-0"
              style={{
                width: 0,
                height: 0,
                borderStyle: "solid",
                borderWidth: "0 48px 48px 0",
                borderColor: `transparent var(--sc-vermillion) transparent transparent`,
                opacity: 0.85,
              }}
            />
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 2 — BRAND NAME
              Column 8–13, row 1. Deep violet surface. The editorial
              headline cell — Playfair Display at maximum weight.
              ══════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl flex flex-col justify-center px-7 py-7 order-2"
            style={{
              gridColumn: "8 / 13",
              gridRow: "1 / 2",
              background: "var(--sc-purple-dim)",
              border: "1px solid rgba(109, 40, 217, 0.18)",
              /*
               * Inset gold hairline at top — echoes gilded manuscript
               * borders, ties visually to the navbar pill treatment.
               */
              boxShadow: "0 1px 0 rgba(184,134,11,0.20) inset",
            }}
          >
            <p
              className="text-xs tracking-[0.45em] uppercase mb-3"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--sc-purple-lt)",
                fontWeight: 500,
              }}
            >
              Anime &amp; Cosplay
            </p>

            {/*
             * Wordmark: Cinzel for "Schaden's" (possessive reinforces
             * brand ownership), Playfair for "Shop" to add editorial
             * contrast — two typeface personalities, one identity.
             */}
            <h1
              className="leading-none"
              style={{
                fontFamily: "var(--font-logo)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
                color: "var(--sc-ink)",
                letterSpacing: "0.06em",
                wordBreak: "break-word",
              }}
            >
              Schaden
              <span style={{ color: "var(--sc-purple)" }}>'s</span>
              <br />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  color: "var(--sc-ink-soft)",
                  letterSpacing: "0.02em",
                }}
              >
                Cosplay
              </span>
            </h1>
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 3 — TAGLINE
              Column 8–13, row 2. Aged paper surface. Pull-quote
              style italic text — magazine editorial convention.
              ══════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl flex flex-col justify-between px-7 py-6 order-3"
            style={{
              gridColumn: "8 / 13",
              gridRow: "2 / 3",
              background: "var(--sc-paper-aged)",
              border: "1px solid var(--sc-border-ink)",
            }}
          >
            {/*
             * Gold rule above tagline — visual device borrowed from
             * newspaper column design. Anchors the quote visually.
             */}
            <div
              style={{
                width: "2rem",
                height: "2px",
                background: "var(--sc-gold)",
                marginBottom: "0.75rem",
                borderRadius: "1px",
              }}
            />

            <p
              className="text-base italic leading-relaxed"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--sc-ash)",
                opacity: 0.9,
              }}
            >
              Wear the character. Live the story.
            </p>

            {/* Category pills — decorative, evokes a magazine tag row */}
            <div className="flex gap-2 flex-wrap mt-4">
              {["Costumes", "Props", "Wigs", "Accessories"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    background: "var(--sc-paper)",
                    color: "var(--sc-ash-light)",
                    border: "1px solid var(--sc-border-ink)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 4 — LOGIN CTA
              Column 1–5, row 4. Purple-filled CTA cell.
              Primary action for returning members.
              ══════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-6 gap-3 order-4"
            style={{
              gridColumn: "1 / 5",
              gridRow: "4 / 5",
              background: "var(--sc-purple)",
              border: "1px solid rgba(159, 91, 245, 0.4)",
              boxShadow: "0 4px 24px var(--sc-purple-glow)",
            }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "rgba(237, 233, 254, 0.70)",
              }}
            >
              Already a member?
            </p>

            <Link
              to="/login"
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                background: "var(--sc-purple-dim)",
                color: "var(--sc-parchment)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(159, 91, 245, 0.35)",
                display: "block",
                transition: "background 0.15s, box-shadow 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--sc-purple-lt)";
                e.currentTarget.style.boxShadow = "0 2px 12px var(--sc-purple-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--sc-purple-dim)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Enter the Shrine
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 5 — SIGNUP CTA
              Column 5–9, row 4. Aged paper surface, ghost button.
              Secondary action for new visitors.
              ══════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl flex flex-col justify-center items-center px-6 py-6 gap-3 order-5"
            style={{
              gridColumn: "5 / 9",
              gridRow: "4 / 5",
              background: "var(--sc-paper-aged)",
              border: "1px solid var(--sc-border-ink)",
            }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                color: "var(--sc-ash-light)",
              }}
            >
              New cosplayer?
            </p>

            <Link
              to="/signup"
              className="w-full text-center py-3 text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-ui)",
                fontWeight: 600,
                color: "var(--sc-ink)",
                borderRadius: "0.5rem",
                border: "1px solid var(--sc-border)",
                display: "block",
                textDecoration: "none",
                transition: "border-color 0.15s, color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--sc-purple)";
                e.currentTarget.style.color = "var(--sc-purple)";
                e.currentTarget.style.background = "var(--sc-purple-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--sc-border)";
                e.currentTarget.style.color = "var(--sc-ink)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Join the Guild
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 6 — FOOTER TAG
              Column 9–13, row 4. Minimal ink-on-paper credits cell.
              Vermillion dot accent echoes hanko seal aesthetic.
              ══════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl flex flex-col justify-between px-6 py-5 order-6"
            style={{
              gridColumn: "9 / 13",
              gridRow: "4 / 5",
              background: "var(--sc-paper)",
              border: "1px solid var(--sc-border-ink)",
            }}
          >
            {/* Vermillion hanko dot — decorative stamp motif */}
            <div
              style={{
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "9999px",
                background: "var(--sc-vermillion)",
                opacity: 0.85,
                marginBottom: "auto",
              }}
            />

            <div className="mt-auto">
              <p
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "var(--sc-ash-light)",
                  marginBottom: "0.2rem",
                }}
              >
                Schaden's Co.
              </p>
              <p
                className="text-xs tracking-widest uppercase"
                style={{
                  fontFamily: "var(--font-ui)",
                  color: "var(--sc-ash-light)",
                  opacity: 0.45,
                }}
              >
                IAS Finals
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              CELL 7 — FEATURE STRIP (desktop only visual bonus)
              Column 8–13, row 3. Ink-rule divider + feature trio.
              Magazine "at a glance" info panel.
              ══════════════════════════════════════════════════════ */}
          <div
            className="hidden md:flex rounded-2xl flex-row items-center justify-around px-6 py-5 order-7"
            style={{
              gridColumn: "8 / 13",
              gridRow: "3 / 4",
              background: "var(--sc-silk)",
              border: "1px solid var(--sc-border-ink)",
              gap: "0.5rem",
            }}
          >
            {/*
             * Feature trio: three micro-stats arranged horizontally.
             * Evokes a magazine sidebar — concise, scannable, editorial.
             */}
            {[
              { value: "500+",    label: "Costumes"  },
              { value: "100+",    label: "Franchises" },
              { value: "Fast",    label: "Shipping"   },
            ].map(({ value, label }, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--sc-purple)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--sc-ash-light)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}