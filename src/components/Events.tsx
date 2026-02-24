import { useState } from "react";

type Category = "All" | "Games" | "Coding" | "Designing" | "Others";

interface EventItem {
  id: string;
  title: string;
  category: Category;
  code: string;
  image: string;
}

const EVENTS: EventItem[] = [
  {
    id: "1",
    title: "ASCENSION CUP (VALORANT)",
    category: "Games",
    code: "GAM-01",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  },
  {
    id: "2",
    title: "CODE CLASH",
    category: "Coding",
    code: "COD-01",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  },
  {
    id: "3",
    title: "PIXEL FORGE",
    category: "Designing",
    code: "DES-01",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  },
  {
    id: "4",
    title: "BGMI SHOWDOWN",
    category: "Games",
    code: "GAM-02",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  },
  {
    id: "5",
    title: "WEB SIEGE",
    category: "Coding",
    code: "COD-02",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  },
  {
    id: "6",
    title: "TECH QUIZ",
    category: "Others",
    code: "OTH-01",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  },
];

const CATEGORIES: Category[] = ["All", "Games", "Coding", "Designing", "Others"];

const CategoryIcon = ({ category }: { category: Exclude<Category, "All"> }) => {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (category) {
    case "Games":
      return <svg {...props}><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><circle cx="15" cy="11" r="1" fill="currentColor" /><circle cx="18" cy="13" r="1" fill="currentColor" /></svg>;
    case "Coding":
      return <svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
    case "Designing":
      return <svg {...props}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>;
    case "Others":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  }
};

const Events = () => {
  const [active, setActive] = useState<Category>("All");

  const filtered =
    active === "All" ? EVENTS : EVENTS.filter((e) => e.category === active);

  return (
    <>
      <style>{`
        .events-section {
          background: #0a0a0f;
          background-image:
            linear-gradient(rgba(0, 255, 140, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 140, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        @keyframes fireGlow {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(255, 50, 50, 0.8),
              0 0 30px rgba(255, 80, 20, 0.6),
              0 0 60px rgba(255, 50, 50, 0.3),
              0 0 100px rgba(255, 30, 0, 0.15),
              0 2px 0 #b22222,
              0 4px 0 #8b0000,
              0 6px 8px rgba(0, 0, 0, 0.4);
          }
          25% {
            text-shadow:
              0 0 15px rgba(255, 100, 0, 0.9),
              0 0 40px rgba(255, 60, 10, 0.7),
              0 0 70px rgba(255, 120, 0, 0.4),
              0 0 110px rgba(255, 80, 0, 0.2),
              0 2px 0 #b22222,
              0 4px 0 #8b0000,
              0 6px 8px rgba(0, 0, 0, 0.4);
          }
          50% {
            text-shadow:
              0 0 12px rgba(255, 200, 0, 0.9),
              0 0 35px rgba(255, 100, 0, 0.7),
              0 0 65px rgba(255, 60, 0, 0.35),
              0 0 90px rgba(255, 50, 50, 0.2),
              0 2px 0 #b22222,
              0 4px 0 #8b0000,
              0 6px 8px rgba(0, 0, 0, 0.4);
          }
          75% {
            text-shadow:
              0 0 18px rgba(255, 80, 0, 0.85),
              0 0 45px rgba(255, 50, 50, 0.65),
              0 0 75px rgba(255, 150, 0, 0.35),
              0 0 105px rgba(255, 60, 0, 0.18),
              0 2px 0 #b22222,
              0 4px 0 #8b0000,
              0 6px 8px rgba(0, 0, 0, 0.4);
          }
        }

        .events-heading {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          letter-spacing: 0.15em;
          color: #ff4444;
          animation: fireGlow 2s ease-in-out infinite;
        }

        .cat-btn {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          font-size: clamp(0.55rem, 1.2vw, 0.8rem);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.5em 1.5em;
          border: 1px solid rgba(0, 255, 140, 0.2);
          background: transparent;
          color: rgba(0, 255, 140, 0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .cat-btn:hover {
          border-color: rgba(0, 255, 140, 0.5);
          color: rgba(0, 255, 140, 0.8);
        }
        .cat-btn.active {
          border-color: rgba(0, 255, 140, 0.6);
          background: rgba(0, 255, 140, 0.08);
          color: #00ff8c;
          box-shadow: 0 0 15px rgba(0, 255, 140, 0.1);
        }

        .event-card {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 255, 140, 0.1);
        }

        .event-card::before,
        .event-card::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .event-card::before {
          top: 8px;
          left: 8px;
          border-top: 2px solid rgba(255, 215, 0, 0.5);
          border-left: 2px solid rgba(255, 215, 0, 0.5);
        }
        .event-card::after {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid rgba(255, 215, 0, 0.4);
          border-right: 2px solid rgba(255, 215, 0, 0.4);
        }
        .event-card:hover::before,
        .event-card:hover::after {
          width: 28px;
          height: 28px;
          border-color: #FFD700;
        }

        .event-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .event-card:hover .event-card-img {
          transform: scale(1.05);
        }

        .event-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.3) 40%,
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 1;
        }

        .event-card-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem;
        }

        .event-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4em;
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(0, 255, 140, 0.7);
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(0, 255, 140, 0.15);
          padding: 0.35em 0.8em;
          border-radius: 2px;
          width: fit-content;
        }

        .event-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: clamp(1.1rem, 3vw, 1.6rem);
          letter-spacing: 0.05em;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          line-height: 1.3;
        }

        .event-code {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: rgba(0, 255, 140, 0.4);
        }

        .event-explore {
          font-family: 'Orbitron', sans-serif;
          font-weight: 400;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: rgba(0, 255, 140, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        .event-explore:hover {
          color: #00ff8c;
        }
      `}</style>

      <section className="events-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center gap-8 sm:gap-12 mb-12 sm:mb-16">
            <h2 className="events-heading">OUR EVENTS</h2>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${active === cat ? "active" : ""}`}
                  onClick={() => setActive(cat)}
                >
                  {cat === "All" ? "✦ " : ""}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((event) => (
              <div key={event.id} className="event-card">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-card-img"
                  loading="lazy"
                />
                <div className="event-card-overlay" />
                <div className="event-card-content">
                  <div>
                    <span className="event-badge">
                      <CategoryIcon category={event.category as Exclude<Category, "All">} />
                      {event.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="event-title mb-3">{event.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="event-code">// {event.code}</span>
                      <span className="event-explore">EXPLORE →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
