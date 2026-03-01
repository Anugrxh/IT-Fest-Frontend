import { Link } from "react-router-dom";
import { useState } from "react";
import items from "../assets/faq.json";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="min-h-screen bg-black text-white px-6 pt-24 pb-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .oracle-bg {
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 215, 0, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 35%, rgba(220, 50, 50, 0.05) 0%, transparent 55%),
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 120px 120px, 120px 120px;
          background-position: center;
        }

        .oracle-frame {
          position: relative;
          overflow: hidden;
        }
        .oracle-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.92) 100%);
        }

        .oracle-corner {
          position: absolute;
          width: clamp(18px, 2vw, 28px);
          height: clamp(18px, 2vw, 28px);
          border: 2px solid rgba(255, 215, 0, 0.35);
          pointer-events: none;
        }
        .oracle-corner.tl { top: clamp(14px, 2vw, 22px); left: clamp(14px, 2vw, 22px); border-right: 0; border-bottom: 0; }
        .oracle-corner.tr { top: clamp(14px, 2vw, 22px); right: clamp(14px, 2vw, 22px); border-left: 0; border-bottom: 0; }
        .oracle-corner.bl { bottom: clamp(14px, 2vw, 22px); left: clamp(14px, 2vw, 22px); border-right: 0; border-top: 0; }
        .oracle-corner.br { bottom: clamp(14px, 2vw, 22px); right: clamp(14px, 2vw, 22px); border-left: 0; border-top: 0; }

        .oracle-kicker {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.35em;
          font-size: clamp(0.58rem, 0.9vw, 0.7rem);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }

        .oracle-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: clamp(2.1rem, 6.2vw, 4.6rem);
          color: #f2e2b0;
          text-shadow:
            0 0 18px rgba(255, 215, 0, 0.18),
            0 0 44px rgba(255, 215, 0, 0.08);
        }

        .oracle-sub {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.25em;
          font-size: clamp(0.58rem, 0.9vw, 0.7rem);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
        }

        .oracle-row {
          display: grid;
          grid-template-columns: clamp(42px, 5vw, 60px) 1fr auto;
          gap: 1rem;
          padding: clamp(0.95rem, 1.6vw, 1.25rem) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 200ms ease, background-color 200ms ease;
        }
        .oracle-row:first-of-type { border-top: 0; }
        .oracle-row:hover {
          transform: translateY(-1px);
        }

        .oracle-num {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.12em;
          color: rgba(255, 215, 0, 0.5);
          font-size: clamp(0.85rem, 1.1vw, 1.05rem);
        }

        .oracle-q {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: clamp(0.9rem, 1.6vw, 1.05rem);
          color: rgba(255, 255, 255, 0.78);
        }

        .oracle-a {
          grid-column: 2 / 4;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-6px);
          transition:
            max-height 320ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 220ms ease,
            transform 220ms ease;
          will-change: max-height, opacity, transform;
        }

        .oracle-a-inner {
          margin-top: 0.75rem;
          padding-left: 0.9rem;
          border-left: 2px solid rgba(220, 50, 50, 0.5);
          color: rgba(255, 255, 255, 0.62);
          line-height: 1.75;
          font-size: clamp(0.92rem, 1.2vw, 1rem);
          padding-bottom: 0.25rem;
        }

        .oracle-a.open {
          max-height: 340px;
          opacity: 1;
          transform: translateY(0);
        }

        .oracle-toggle {
          width: clamp(36px, 4vw, 46px);
          height: clamp(36px, 4vw, 46px);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 215, 0, 0.2);
          background: rgba(0,0,0,0.25);
          color: rgba(255, 215, 0, 0.7);
          transition: all 0.2s ease;
          user-select: none;
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
        }
        .oracle-toggle:hover {
          border-color: rgba(255, 215, 0, 0.45);
          color: rgba(255, 215, 0, 0.95);
        }
        .oracle-toggle.red {
          border-color: rgba(220, 50, 50, 0.35);
          color: rgba(220, 50, 50, 0.9);
        }
      `}</style>

      <div className="oracle-bg py-6 sm:py-10">
        <div className="max-w-screen-xl mx-auto">
          <Link to="/" className="text-emerald-400 hover:text-emerald-300">
            Back
          </Link>

          <div
            className="oracle-frame mt-8 border border-white/10 w-full"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <div className="oracle-corner tl" />
            <div className="oracle-corner tr" />
            <div className="oracle-corner bl" />
            <div className="oracle-corner br" />

            <div className="relative p-6 sm:p-10">
              <div className="oracle-kicker">// KNOWLEDGE BASE</div>
              <div className="mt-3 oracle-title">THE ORACLE</div>
              <div className="mt-3 oracle-sub">FREQUENTLY ACCESSED DATA STREAMS</div>

              <div className="mt-10">
                {items.map((item, idx) => {
                  const open = openIndex === idx;
                  return (
                    <div key={item.n} className="oracle-row">
                      <div className="oracle-num">{item.n}</div>
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => setOpenIndex(open ? null : idx)}
                        aria-expanded={open}
                        aria-controls={`faq-${item.n}`}
                      >
                        <div className="oracle-q">{item.q}</div>
                      </button>
                      <div className="flex items-start justify-end">
                        <button
                          type="button"
                          onClick={() => setOpenIndex(open ? null : idx)}
                          className={`oracle-toggle ${idx === 0 ? "" : "red"}`}
                          aria-label={open ? "Collapse" : "Expand"}
                        >
                          {open ? "−" : "+"}
                        </button>
                      </div>

                      <div
                        id={`faq-${item.n}`}
                        className={`oracle-a ${open ? "open" : ""}`}
                      >
                        <div className="oracle-a-inner">{item.a}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
