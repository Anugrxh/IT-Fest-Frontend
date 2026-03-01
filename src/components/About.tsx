import about from "../assets/about.json";

const About = () => {
  return (
    <section id="about" className="about-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .about-wrap {
          position: relative;
          background: #0a0a0f;
          padding: clamp(5rem,9vw,8rem) clamp(1.2rem,4vw,3rem);
          overflow: hidden;
        }

        /* grid bg */
        .about-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,140,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.022) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        /* top divider */
        .about-wrap::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,140,0.3), transparent);
        }

        /* radial glow */
        .about-glow {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 55%;
          height: 70%;
          background: radial-gradient(ellipse at 30% 40%, rgba(0,255,140,0.05), transparent 65%);
          pointer-events: none;
        }
        .about-glow-r {
          position: absolute;
          bottom: -10%;
          right: -5%;
          width: 45%;
          height: 60%;
          background: radial-gradient(ellipse at 70% 60%, rgba(255,215,0,0.04), transparent 65%);
          pointer-events: none;
        }

        /* layout */
        .about-inner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2.5rem,5vw,5rem);
          align-items: start;
        }
        @media (max-width: 768px) {
          .about-inner { grid-template-columns: 1fr; }
        }

        /* left col */
        .about-kicker {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: .38em;
          font-size: clamp(.52rem,.82vw,.66rem);
          color: rgba(0,255,140,.55);
          text-transform: uppercase;
          margin-bottom: .7rem;
        }

        .about-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
          font-size: clamp(1.9rem,5vw,3.6rem);
          color: #f2e2b0;
          text-shadow: 0 0 22px rgba(255,215,0,.18), 0 0 50px rgba(255,215,0,.07);
          line-height: 1.1;
          margin-bottom: .9rem;
        }

        .about-rule {
          width: clamp(55px,7vw,80px);
          height: 3px;
          background: rgba(0,255,140,.65);
          margin-bottom: 1.8rem;
        }

        .about-desc {
          font-size: clamp(.92rem,1.05vw,1.05rem);
          color: rgba(255,255,255,.68);
          line-height: 1.85;
          margin-bottom: 1.3rem;
        }

        .about-sub {
          font-size: clamp(.86rem,.98vw,.98rem);
          color: rgba(255,255,255,.45);
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        /* meta badges */
        .about-meta {
          display: flex;
          flex-wrap: wrap;
          gap: .6rem;
          margin-bottom: 2.5rem;
        }
        .meta-badge {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.48rem,.72vw,.6rem);
          letter-spacing: .22em;
          text-transform: uppercase;
          color: rgba(0,255,140,.7);
          border: 1px solid rgba(0,255,140,.2);
          padding: .35rem .75rem;
          background: rgba(0,255,140,.04);
        }

        /* highlights */
        .about-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: .75rem;
        }
        .highlight-row {
          display: flex;
          align-items: center;
          gap: .65rem;
          font-size: clamp(.78rem,.9vw,.88rem);
          color: rgba(255,255,255,.55);
          padding: .55rem .8rem;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.02);
          transition: border-color .2s ease, color .2s ease;
        }
        .highlight-row:hover {
          border-color: rgba(0,255,140,.22);
          color: rgba(255,255,255,.8);
        }
        .highlight-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }

        /* right col — stats panel */
        .stats-panel {
          position: relative;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(0,0,0,.3);
          padding: clamp(1.5rem,3vw,2.5rem);
        }

        /* corner brackets */
        .stats-panel::before,
        .stats-panel::after {
          content: "";
          position: absolute;
          width: 20px; height: 20px;
          border-color: rgba(0,255,140,.4);
          border-style: solid;
        }
        .stats-panel::before { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
        .stats-panel::after  { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }

        .stats-panel-tag {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.48rem,.72vw,.6rem);
          letter-spacing: .38em;
          color: rgba(0,255,140,.4);
          text-transform: uppercase;
          margin-bottom: 1.8rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,.07);
          margin-bottom: 2rem;
        }
        .stat-cell {
          background: rgba(0,0,0,.45);
          padding: clamp(1.2rem,2.5vw,2rem) clamp(1rem,2vw,1.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .4rem;
          transition: background .2s ease;
        }
        .stat-cell:hover { background: rgba(0,255,140,.04); }

        .stat-value {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(1.6rem,3.5vw,2.8rem);
          color: #00ff8c;
          text-shadow: 0 0 18px rgba(0,255,140,.4);
          line-height: 1;
        }
        .stat-label {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.46rem,.7vw,.58rem);
          letter-spacing: .3em;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
        }

        /* edition banner */
        .edition-banner {
          border: 1px solid rgba(255,215,0,.18);
          background: rgba(255,215,0,.03);
          padding: 1.2rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .edition-num {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(1.4rem,2.8vw,2.2rem);
          color: #d8b85b;
          text-shadow: 0 0 14px rgba(255,215,0,.22);
        }
        .edition-detail {
          text-align: right;
        }
        .edition-date {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.52rem,.78vw,.64rem);
          letter-spacing: .28em;
          color: rgba(255,255,255,.45);
          text-transform: uppercase;
        }
        .edition-venue {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.44rem,.65vw,.55rem);
          letter-spacing: .18em;
          color: rgba(255,255,255,.28);
          text-transform: uppercase;
          margin-top: .3rem;
        }

        /* entry animations */
        @keyframes abFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .about-left  { animation: abFadeUp .7s ease both; }
        .about-right { animation: abFadeUp .7s .15s ease both; }
      `}</style>

      <div className="about-glow" />
      <div className="about-glow-r" />

      <div className="about-inner">
        {/* ── LEFT ── */}
        <div className="about-left">
          <div className="about-kicker">// WHO WE ARE</div>
          <div className="about-title">{about.headline}</div>
          <div className="about-rule" />

          <p className="about-desc">{about.description}</p>
          <p className="about-sub">{about.sub_description}</p>

          <div className="about-meta">
            <span className="meta-badge">{about.date}</span>
            <span className="meta-badge">{about.venue}</span>
          </div>

          <div className="about-highlights">
            {about.highlights.map((h) => (
              <div key={h.text} className="highlight-row">
                <span className="highlight-icon">{h.icon}</span>
                <span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="about-right">
          <div className="stats-panel">
            <div className="stats-panel-tag">// SYSTEM METRICS</div>

            <div className="stats-grid">
              {about.stats.map((s) => (
                <div key={s.label} className="stat-cell">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="edition-banner">
              <span className="edition-num">ZEITGEIST {about.edition}</span>
              <div className="edition-detail">
                <div className="edition-date">{about.date}</div>
                <div className="edition-venue">{about.venue}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
