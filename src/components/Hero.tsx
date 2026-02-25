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
          font-size: clamp(2rem, 8vw, 8rem);
          letter-spacing: clamp(0.05em, 1.5vw, 0.15em);
          color: transparent;
          -webkit-text-stroke: 2px rgba(0, 255, 140, 0.8);
          text-shadow:
            0 0 20px rgba(0, 255, 140, 0.3),
            0 0 60px rgba(0, 255, 140, 0.1);
          transition: all 0.4s ease;
          cursor: default;
          max-width: 100%;
          text-align: center;
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
          letter-spacing: clamp(0.15em, 1.5vw, 0.5em);
          color: rgba(0, 255, 140, 0.5);
          font-size: clamp(0.45rem, 1.2vw, 0.9rem);
          transition: color 0.3s ease;
          text-align: center;
          word-break: break-word;
        }

        @keyframes countPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .count-digit {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(1.2rem, 4vw, 3.5rem);
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
          background: linear-gradient(90deg, transparent,  rgba(0, 255, 140, 0.5), transparent);
        }

        .hero-diamond {
          width: 6px;
          height: 6px;
          background: rgba(0, 255, 140, 0.6);
          transform: rotate(45deg);
          display: inline-block;
        }
      `}</style>
      <section className="relative h-screen flex flex-col items-center justify-center   bg-[#0a0a0f]  hero-grid-bg overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0, 255, 140, 0.04) 0%, transparent 70%)",
        }} />

        <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 w-full max-w-screen-xl  ">
          <div className="flex items-center gap-3 mb-2 ">
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

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-2 sm:gap-4 md:gap-6">
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{
                      background: "linear-gradient(145deg, rgba(0, 255, 140, 0.06), rgba(0, 255, 140, 0.01))",
                      border: "1px solid rgba(0, 255, 140, 0.1)",
                      boxShadow: "0 4px 20px rgba(0, 255, 140, 0.05), inset 0 1px 0 rgba(0, 255, 140, 0.08)",
                      width: "clamp(50px, 14vw, 100px)",
                      height: "clamp(55px, 16vw, 110px)",
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

          <a
            href="https://www.google.com/maps/dir/8.544885,76.879755/Kannur+University,+X9M8%2B576,+Morazha+Kannapuram+Rd,+Mangattuparamba,+Kerala+670567/@10.2616861,74.7976075,8z/data=!3m1!4b1!4m10!4m9!1m1!4e1!1m5!1m1!1s0x3ba43e40629494dd:0x5864a69dc0ee8189!2m2!1d75.3656299!2d11.9829164!3e0?entry=ttu&g_ep=EgoyMDI2MDIyMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.5rem, 1.2vw, 0.85rem)",
              letterSpacing: "0.3em",
              color: "rgba(0, 255, 140, 0.45)",
              marginTop: "0.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5em",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 255, 140, 0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0, 255, 140, 0.45)")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            KANNUR UNIVERSITY MANAGATTUPARAMBA CAMPUS
          </a>
        </div>
      </section>
    </>
  );
};

export default Hero;
