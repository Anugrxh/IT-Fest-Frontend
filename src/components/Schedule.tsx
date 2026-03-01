import schedule from "../assets/schedule.json";

const CATEGORY_COLOR: Record<string, string> = {
    General: "rgba(255,255,255,0.38)",
    Coding: "#00ff8c",
    Designing: "#e879f9",
    Games: "#ffd700",
    Others: "#fb923c",
};

const Schedule = () => {
    return (
        <section id="schedule" className="sch-wrap">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .sch-wrap {
          position: relative;
          background: #0a0a0f;
          padding: clamp(5rem,9vw,8rem) clamp(1.2rem,4vw,3rem) clamp(4rem,7vw,6rem);
          overflow: hidden;
        }
        .sch-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,140,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.022) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }
        .sch-wrap::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,140,0.3), transparent);
        }

        /* header */
        .sch-header {
          text-align: center;
          margin-bottom: clamp(3rem,5vw,5rem);
          position: relative;
          animation: schUp .7s ease both;
        }
        .sch-kicker {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: .38em;
          font-size: clamp(.52rem,.82vw,.66rem);
          color: rgba(0,255,140,.55);
          text-transform: uppercase;
          margin-bottom: .6rem;
        }
        .sch-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
          font-size: clamp(1.9rem,5vw,3.5rem);
          color: #f2e2b0;
          text-shadow: 0 0 22px rgba(255,215,0,.18), 0 0 50px rgba(255,215,0,.07);
        }
        .sch-rule {
          width: clamp(55px,7vw,80px);
          height: 3px;
          background: rgba(0,255,140,.65);
          margin: .9rem auto 0;
        }

        /* grid — 2 col on md+, 1 col on mobile */
        .sch-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(1.2rem,3vw,2.5rem);
        }
        @media (max-width: 768px) {
          .sch-grid { grid-template-columns: 1fr; }
        }

        /* day card */
        .day-card {
          position: relative;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.3);
          padding: clamp(1.4rem,2.5vw,2rem);
          animation: schUp .7s ease both;
        }
        .day-card:nth-child(1){ animation-delay:.1s }
        .day-card:nth-child(2){ animation-delay:.2s }

        /* corner brackets */
        .day-card::before,.day-card::after {
          content:"";
          position:absolute;
          width:16px;height:16px;
          border-color:rgba(0,255,140,.35);
          border-style:solid;
        }
        .day-card::before{ top:7px;left:7px; border-width:1px 0 0 1px; }
        .day-card::after { bottom:7px;right:7px; border-width:0 1px 1px 0; }

        /* day header */
        .day-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: clamp(1.2rem,2vw,1.8rem);
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .day-label {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.5rem,.76vw,.62rem);
          letter-spacing: .38em;
          color: rgba(0,255,140,.5);
          text-transform: uppercase;
          margin-bottom: .3rem;
        }
        .day-name {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(1.1rem,2vw,1.6rem);
          letter-spacing: .1em;
          color: #f2e2b0;
          text-shadow: 0 0 14px rgba(255,215,0,.15);
        }
        .day-date {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.46rem,.7vw,.58rem);
          letter-spacing: .28em;
          color: rgba(255,255,255,.25);
          margin-top: .25rem;
        }
        .day-count {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.48rem,.72vw,.6rem);
          letter-spacing: .2em;
          color: rgba(255,255,255,.22);
          border: 1px solid rgba(255,255,255,.1);
          padding: .3rem .65rem;
          white-space: nowrap;
        }

        /* event rows */
        .sch-row {
          display: grid;
          grid-template-columns: clamp(72px,11vw,92px) 1fr;
          gap: .6rem;
          padding: .75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background .18s ease;
        }
        .sch-row:last-child { border-bottom: 0; }
        .sch-row:hover { background: rgba(255,255,255,0.02); margin: 0 -.5rem; padding-left: .5rem; padding-right: .5rem; }

        .sch-time {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.5rem,.78vw,.62rem);
          letter-spacing: .1em;
          color: rgba(0,255,140,.55);
          padding-top: .15rem;
          white-space: nowrap;
        }

        .sch-info {}
        .sch-event-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(.72rem,1.1vw,.9rem);
          letter-spacing: .06em;
          color: rgba(255,255,255,.82);
          margin-bottom: .25rem;
          line-height: 1.3;
        }
        .sch-meta {
          display: flex;
          align-items: center;
          gap: .6rem;
          flex-wrap: wrap;
        }
        .sch-venue {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.44rem,.66vw,.54rem);
          letter-spacing: .16em;
          color: rgba(255,255,255,.28);
          text-transform: uppercase;
        }
        .sch-cat {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(.42rem,.62vw,.5rem);
          letter-spacing: .2em;
          text-transform: uppercase;
          padding: .15rem .5rem;
          border-radius: 2px;
        }

        @keyframes schUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

            <div className="sch-header">
                <div className="sch-kicker">// EVENT TIMELINE</div>
                <div className="sch-title">SCHEDULE</div>
                <div className="sch-rule" />
            </div>

            <div className="sch-grid">
                {schedule.map((day) => (
                    <div key={day.day} className="day-card">
                        <div className="day-header">
                            <div>
                                <div className="day-label">{day.label}</div>
                                <div className="day-name">{day.day.toUpperCase()}</div>
                                <div className="day-date">{day.date}</div>
                            </div>
                            <div className="day-count">{day.events.length} EVENTS</div>
                        </div>

                        <div>
                            {day.events.map((ev, i) => {
                                const color = CATEGORY_COLOR[ev.category] ?? "rgba(255,255,255,0.4)";
                                return (
                                    <div key={i} className="sch-row">
                                        <div className="sch-time">{ev.time}</div>
                                        <div className="sch-info">
                                            <div className="sch-event-title">{ev.title}</div>
                                            <div className="sch-meta">
                                                <span className="sch-venue">{ev.venue}</span>
                                                <span
                                                    className="sch-cat"
                                                    style={{
                                                        color,
                                                        border: `1px solid ${color}44`,
                                                        background: `${color}10`,
                                                    }}
                                                >
                                                    {ev.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Schedule;
