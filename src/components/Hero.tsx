import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-03-11T00:00:00+05:30").getTime();

function getTimeLeft() {
  const now = Date.now();
  const diff = Math.max(TARGET_DATE - now, 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const Hero = () => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(0, 255, 140, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 140, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(3rem, 10vw, 8rem);
          letter-spacing: 0.15em;
          color: transparent;
          -webkit-text-stroke: 2px rgba(0, 255, 140, 0.8);
          text-shadow:
            0 0 20px rgba(0, 255, 140, 0.3),
            0 0 60px rgba(0, 255, 140, 0.1);
          transition: all 0.4s ease;
          cursor: default;
        }
        .hero-title:hover {
          -webkit-text-stroke: 2px rgba(0, 255, 140, 1);
          color: rgba(0, 255, 140, 0.15);
          text-shadow:
            0 0 30px rgba(0, 255, 140, 0.5),
            0 0 80px rgba(0, 255, 140, 0.25),
            0 0 120px rgba(0, 255, 140, 0.1);
        }

        @keyframes letterVibrate {
          0%, 100% {
            transform: translateY(0);
            -webkit-text-stroke: 2px rgba(0, 255, 140, 0.8);
            color: transparent;
            text-shadow: 0 0 20px rgba(0, 255, 140, 0.3), 0 0 60px rgba(0, 255, 140, 0.1);
          }
          15% {
            transform: translateY(-3px);
            -webkit-text-stroke: 2px rgba(0, 255, 140, 1);
            color: rgba(0, 255, 140, 0.2);
            text-shadow: 0 0 30px rgba(0, 255, 140, 0.6), 0 0 80px rgba(0, 255, 140, 0.3);
          }
          20% {
            transform: translateY(2px);
          }
          25% {
            transform: translateY(-1px);
          }
          30% {
            transform: translateY(0);
            -webkit-text-stroke: 2px rgba(0, 255, 140, 0.8);
            color: transparent;
            text-shadow: 0 0 20px rgba(0, 255, 140, 0.3), 0 0 60px rgba(0, 255, 140, 0.1);
          }
        }
        .hero-letter {
          display: inline-block;
          animation: letterVibrate 4.5s ease-in-out infinite;
        }

        .hero-subtitle {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          letter-spacing: 0.5em;
          color: rgba(0, 255, 140, 0.5);
          font-size: clamp(0.6rem, 1.5vw, 0.9rem);
          transition: color 0.3s ease;
        }

        @keyframes countPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .count-digit {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: #00ff8c;
          text-shadow: 0 0 20px rgba(0, 255, 140, 0.4);
          line-height: 1;
        }
        .count-label {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          font-size: clamp(0.55rem, 1vw, 0.75rem);
          letter-spacing: 0.3em;
          color: rgba(0, 255, 140, 0.4);
          text-transform: uppercase;
        }
        .count-separator {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(1.5rem, 4vw, 3rem);
          color: rgba(0, 255, 140, 0.3);
          animation: countPulse 2s ease-in-out infinite;
          line-height: 1;
          align-self: flex-start;
          padding-top: 0.15em;
        }

        .hero-line {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 140, 0.5), transparent);
        }

        .hero-diamond {
          width: 6px;
          height: 6px;
          background: rgba(0, 255, 140, 0.6);
          transform: rotate(45deg);
          display: inline-block;
        }
      `}</style>
      <section className="relative h-screen flex flex-col items-center justify-center bg-[#0a0a0f] hero-grid-bg overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0, 255, 140, 0.04) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 flex flex-col items-center gap-8 px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="hero-diamond" />
            <span className="hero-subtitle">SYSTEM: ONLINE // NATIONAL_LEVEL_FEST</span>
            <span className="hero-diamond" />
          </div>

          <h1 className="hero-title">
            {"ZEITGEIST".split("").map((ch, i) => (
              <span
                key={i}
                className="hero-letter"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>

          <div className="hero-line mb-2" />

          <div className="flex items-center gap-4 sm:gap-6">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-4 sm:gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(145deg, rgba(0, 255, 140, 0.06), rgba(0, 255, 140, 0.01))",
                      border: "1px solid rgba(0, 255, 140, 0.1)",
                      boxShadow: "0 4px 20px rgba(0, 255, 140, 0.05), inset 0 1px 0 rgba(0, 255, 140, 0.08)",
                      width: "clamp(60px, 16vw, 100px)",
                      height: "clamp(70px, 18vw, 110px)",
                    }}
                  >
                    <span className="count-digit">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="count-label">{unit.label}</span>
                </div>
                {i < units.length - 1 && (
                  <span className="count-separator">:</span>
                )}
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.7rem, 1.5vw, 1rem)",
            letterSpacing: "0.4em",
            color: "rgba(0, 255, 140, 0.45)",
            marginTop: "0.5rem",
          }}>
            MARCH 11, 12 — 2026
          </p>
        </div>
      </section>
    </>
  );
};

export default Hero;
