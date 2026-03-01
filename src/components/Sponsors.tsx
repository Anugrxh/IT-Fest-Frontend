import sponsors from "../assets/sponsors.json";

type Sponsor = { name: string; logo: string | null; initials: string; url: string | null };

const TIERS = [
  {
    key: "title" as const,
    label: "TITLE SPONSOR",
    tag: "// MAIN",
    accent: "#00ff8c",
    glow: "rgba(0,255,140,0.45)",
    dim: "rgba(0,255,140,0.15)",
    border: "rgba(0,255,140,0.35)",
    cardW: "clamp(180px,28vw,320px)",
    cardH: "clamp(100px,16vw,180px)",
    textSize: "clamp(1rem,2vw,1.6rem)",
    single: true,
  },
  {
    key: "co" as const,
    label: "CO-SPONSORS",
    tag: "// ALLIED",
    accent: "#ffd700",
    glow: "rgba(255,215,0,0.4)",
    dim: "rgba(255,215,0,0.12)",
    border: "rgba(255,215,0,0.3)",
    cardW: "clamp(130px,18vw,220px)",
    cardH: "clamp(75px,11vw,130px)",
    textSize: "clamp(0.85rem,1.5vw,1.2rem)",
    single: false,
  },
  {
    key: "event" as const,
    label: "EVENT SPONSORS",
    tag: "// CATALYST",
    accent: "#e879f9",
    glow: "rgba(232,121,249,0.35)",
    dim: "rgba(232,121,249,0.1)",
    border: "rgba(232,121,249,0.25)",
    cardW: "clamp(110px,15vw,185px)",
    cardH: "clamp(64px,9vw,110px)",
    textSize: "clamp(0.78rem,1.2vw,1rem)",
    single: false,
  },
  {
    key: "prize" as const,
    label: "PRIZE SPONSORS",
    tag: "// REWARDS",
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    dim: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.25)",
    cardW: "clamp(100px,13vw,165px)",
    cardH: "clamp(58px,8vw,100px)",
    textSize: "clamp(0.72rem,1.1vw,0.9rem)",
    single: false,
  },
  {
    key: "banner" as const,
    label: "BANNER SPONSORS",
    tag: "// OUTPOST",
    accent: "rgba(255,255,255,0.6)",
    glow: "rgba(255,255,255,0.15)",
    dim: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.18)",
    cardW: "clamp(88px,11vw,145px)",
    cardH: "clamp(50px,7vw,88px)",
    textSize: "clamp(0.66rem,1vw,0.82rem)",
    single: false,
  },
] as const;

type TierKey = (typeof TIERS)[number]["key"];

const SponsorCard = ({
  s,
  accent,
  glow,
  dim,
  border,
  cardW,
  cardH,
  textSize,
}: {
  s: Sponsor;
  accent: string;
  glow: string;
  dim: string;
  border: string;
  cardW: string;
  cardH: string;
  textSize: string;
}) => {
  const inner = (
    <div
      className="sp-card"
      style={
        {
          "--sp-accent": accent,
          "--sp-glow": glow,
          "--sp-dim": dim,
          "--sp-border": border,
          "--sp-w": cardW,
          "--sp-h": cardH,
          "--sp-ts": textSize,
        } as React.CSSProperties
      }
    >
      <div className="sp-box">
        <div className="sp-shine" />
        {s.logo ? (
          <img src={s.logo} alt={s.name} className="sp-img" />
        ) : (
          <span className="sp-init">{s.initials}</span>
        )}
        <div className="sp-scanline" />
      </div>
      <span className="sp-name">{s.name}</span>
    </div>
  );

  return s.url ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {inner}
    </a>
  ) : (
    inner
  );
};

const InfiniteStrip = ({
  list,
  cfg,
  reverse = false,
}: {
  list: Sponsor[];
  cfg: (typeof TIERS)[number];
  reverse?: boolean;
}) => {
  const items = list.length < 4 ? [...list, ...list, ...list] : list;
  return (
    <div className="strip-outer">
      <div className={`strip-track ${reverse ? "strip-rev" : ""}`}>
        {[0, 1].map((d) => (
          <div key={d} className="strip-inner" aria-hidden={d === 1}>
            {items.map((s, i) => (
              <SponsorCard
                key={`${s.name}-${i}`}
                s={s}
                accent={cfg.accent}
                glow={cfg.glow}
                dim={cfg.dim}
                border={cfg.border}
                cardW={cfg.cardW}
                cardH={cfg.cardH}
                textSize={cfg.textSize}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Sponsors = () => {
  const data = sponsors as Record<TierKey, Sponsor[]>;

  return (
    <section className="spons-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .spons-wrap {
          position: relative;
          background: #0a0a0f;
          padding: clamp(5rem,9vw,8rem) 0 clamp(4rem,7vw,6rem);
          overflow: hidden;
        }

        /* subtle grid + top/bottom fades */
        .spons-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,140,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.022) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }
        .spons-wrap::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,140,0.35), transparent);
        }

        /* ── Header ── */
        .spons-header {
          text-align: center;
          padding: 0 1.5rem;
          margin-bottom: clamp(3rem,5vw,5rem);
          animation: spFadeUp .7s ease both;
        }
        .spons-kicker {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: .38em;
          font-size: clamp(.55rem,.85vw,.68rem);
          color: rgba(0,255,140,.55);
          text-transform: uppercase;
          margin-bottom: .6rem;
        }
        .spons-h1 {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
          font-size: clamp(1.9rem,5.5vw,3.8rem);
          color: #f2e2b0;
          text-shadow: 0 0 22px rgba(255,215,0,.18), 0 0 50px rgba(255,215,0,.07);
          line-height: 1.1;
        }
        .spons-rule {
          width: clamp(60px,8vw,88px);
          height: 3px;
          background: rgba(0,255,140,.65);
          margin: .9rem auto 0;
        }

        /* ── Tier block ── */
        .tier-block {
          margin-bottom: clamp(3rem,5vw,4.5rem);
          animation: spFadeUp .7s ease both;
        }
        .tier-block:nth-child(2){ animation-delay:.08s }
        .tier-block:nth-child(3){ animation-delay:.15s }
        .tier-block:nth-child(4){ animation-delay:.22s }
        .tier-block:nth-child(5){ animation-delay:.29s }
        .tier-block:nth-child(6){ animation-delay:.36s }

        .tier-head {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 clamp(1.2rem,4vw,3rem);
          margin-bottom: clamp(1.2rem,2.5vw,2rem);
        }
        .tier-tag {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.52rem,.78vw,.64rem);
          letter-spacing: .35em;
          color: rgba(255,255,255,.3);
        }
        .tier-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,.08), transparent);
        }
        .tier-label {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          letter-spacing: .22em;
          font-size: clamp(.6rem,.95vw,.75rem);
          text-transform: uppercase;
          color: rgba(255,255,255,.38);
          order: -1;
        }

        /* ── Title tier — big centred single card ── */
        .title-stage {
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
          position: relative;
        }
        .title-stage::before {
          content: "";
          position: absolute;
          inset: -40px -60px;
          background: radial-gradient(ellipse at 50% 50%, rgba(0,255,140,.07), transparent 70%);
          pointer-events: none;
        }
        .title-crown {
          position: absolute;
          top: -2.2rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.48rem,.7vw,.6rem);
          letter-spacing: .5em;
          color: rgba(0,255,140,.45);
          white-space: nowrap;
        }

        /* ── Infinite strip ── */
        .strip-outer {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, black 7%, black 93%, transparent);
        }
        .strip-track {
          display: flex;
          width: max-content;
        }
        .strip-inner {
          display: flex;
          align-items: center;
          gap: clamp(1rem,2.5vw,2rem);
          padding: clamp(.5rem,1.2vw,1rem) clamp(1rem,2vw,1.5rem);
          animation: scrollL 32s linear infinite;
        }
        .strip-rev .strip-inner {
          animation-name: scrollR;
        }
        .strip-outer:hover .strip-inner { animation-play-state: paused; }
        @keyframes scrollL { 0%{ transform:translateX(0) } 100%{ transform:translateX(-50%) } }
        @keyframes scrollR { 0%{ transform:translateX(-50%) } 100%{ transform:translateX(0) } }

        /* ── Sponsor card ── */
        .sp-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .5rem;
          flex-shrink: 0;
          cursor: default;
          transition: transform .22s ease;
        }
        .sp-card:hover { transform: translateY(-5px); }

        .sp-box {
          width: var(--sp-w);
          height: var(--sp-h);
          position: relative;
          border: 1px solid var(--sp-border);
          background: rgba(255,255,255,.025);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color .22s ease, box-shadow .22s ease;
        }
        .sp-card:hover .sp-box {
          border-color: var(--sp-accent);
          box-shadow: 0 0 18px var(--sp-glow), 0 0 40px var(--sp-dim), inset 0 0 12px var(--sp-dim);
        }

        /* top-left corner accent */
        .sp-box::before,.sp-box::after {
          content:"";
          position:absolute;
          width:12px;height:12px;
          border-color: var(--sp-accent);
          border-style: solid;
          opacity:.5;
          transition: opacity .22s ease;
        }
        .sp-box::before { top:5px;left:5px; border-width:1px 0 0 1px; }
        .sp-box::after  { bottom:5px;right:5px; border-width:0 1px 1px 0; }
        .sp-card:hover .sp-box::before,
        .sp-card:hover .sp-box::after { opacity:1; }

        .sp-shine {
          position:absolute;
          inset:0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.06), transparent 65%);
          pointer-events:none;
        }
        .sp-scanline {
          position:absolute;
          bottom:-100%;
          left:0;right:0;
          height:60%;
          background: linear-gradient(to bottom, var(--sp-dim), transparent);
          opacity:0;
          transition: bottom .3s ease, opacity .3s ease;
          pointer-events:none;
        }
        .sp-card:hover .sp-scanline { bottom:0; opacity:1; }

        .sp-img {
          width:65%;height:65%;
          object-fit:contain;
          filter:grayscale(1) brightness(1.15);
          transition:filter .25s ease;
        }
        .sp-card:hover .sp-img { filter:grayscale(0) brightness(1); }

        .sp-init {
          font-family:'Orbitron',sans-serif;
          font-weight:700;
          letter-spacing:.08em;
          font-size: var(--sp-ts);
          color: var(--sp-accent);
          opacity:.75;
          transition: opacity .22s ease;
        }
        .sp-card:hover .sp-init { opacity:1; }

        .sp-name {
          font-family:'Orbitron',sans-serif;
          font-size:clamp(.45rem,.75vw,.58rem);
          letter-spacing:.2em;
          text-transform:uppercase;
          color:rgba(255,255,255,.3);
          transition: color .22s ease;
          max-width: var(--sp-w);
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          text-align:center;
        }
        .sp-card:hover .sp-name { color:rgba(255,255,255,.6); }

        @keyframes spFadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="spons-header">
        <div className="spons-kicker">// POWERED BY</div>
        <div className="spons-h1">OUR SPONSORS</div>
        <div className="spons-rule" />
      </div>

      {TIERS.map((t, ti) => {
        const list: Sponsor[] = data[t.key] ?? [];
        if (!list.length) return null;

        if (t.key === "title") {
          return (
            <div key={t.key} className="tier-block">
              <div className="tier-head">
                <span className="tier-label">{t.label}</span>
                <span className="tier-tag">{t.tag}</span>
                <div className="tier-line" />
              </div>
              <div className="title-stage">
                <div className="title-crown">★ TITLE SPONSOR ★</div>
                {list.map((s) => (
                  <SponsorCard
                    key={s.name}
                    s={s}
                    accent={t.accent}
                    glow={t.glow}
                    dim={t.dim}
                    border={t.border}
                    cardW={t.cardW}
                    cardH={t.cardH}
                    textSize={t.textSize}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={t.key} className="tier-block">
            <div className="tier-head">
              <span className="tier-label">{t.label}</span>
              <span className="tier-tag">{t.tag}</span>
              <div className="tier-line" />
            </div>
            <InfiniteStrip list={list} cfg={t} reverse={ti % 2 === 0} />
          </div>
        );
      })}
    </section>
  );
};

export default Sponsors;
