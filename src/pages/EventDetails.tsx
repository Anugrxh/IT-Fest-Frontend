import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import programData from "../assets/program.json";

type Category = "Games" | "Coding" | "Designing" | "Others";

interface ProgramItem {
  id: number;
  name: string;
  category: Category;
  description: string;
  event_date?: string;
  event_time?: string;
  venue?: string;
  prize_pool: number;
  price: number;
  is_team: boolean;
  team_size: number | null;
  main_image_url: string;
  gallery_images: string[];
  event_directives?: string[];
  capacity_total?: number;
  capacity_filled?: number;
}

const EventDetails = () => {
  const { id } = useParams();

  const event = useMemo(() => {
    const list = programData as ProgramItem[];
    const numericId = Number(id);
    return list.find((item) => item.id === numericId);
  }, [id]);

  if (!event) {
    return (
      <section className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-screen-lg mx-auto">
          <p className="text-lg mb-6">Event not found.</p>
          <Link to="/" className="text-emerald-400 hover:text-emerald-300">
            Back to events
          </Link>
        </div>
      </section>
    );
  }

  const teamLabel = event.is_team
    ? `Team of ${event.team_size ?? "TBA"}`
    : "Solo";

  const defaultDirectives = [
    "Participation format: {team}.",
    "Use only original submissions and assets.",
    "Check-in closes 30 minutes before start time.",
    "Teams must confirm slots after fee payment.",
    "Contact the desk for clarifications on rules.",
  ];

  const eventDirectives = (event.event_directives?.length
    ? event.event_directives
    : defaultDirectives
  ).map((directive) => directive.replace("{team}", teamLabel));

  const capacityTotal = event.capacity_total ?? 0;
  const capacityFilled = event.capacity_filled ?? 0;
  const capacityLabel = capacityTotal
    ? `${capacityFilled} / ${capacityTotal} Filled`
    : "Capacity TBA";

  const eventDate = event.event_date ?? "Date TBA";
  const eventTime = event.event_time ?? "Time TBA";
  const eventVenue = event.venue ?? "Venue TBA";

  return (
    <>
      <style>{`
        .event-details {
          background: #07070a;
          background-image:
            radial-gradient(circle at 20% 15%, rgba(255, 185, 80, 0.08), transparent 45%),
            linear-gradient(rgba(0, 255, 140, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 140, 0.035) 1px, transparent 1px);
          background-size: 100% 100%, 72px 72px, 72px 72px;
          color: #e8e8e8;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #d3a94a;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          letter-spacing: 0.08em;
          line-height: 1.05;
          color: #f4efe6;
        }

        .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.9rem 1.8rem;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.85rem;
        }

        .info-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem 1.5rem;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.85rem;
        }

        .info-item {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          color: rgba(230, 185, 80, 0.9);
        }

        .panel {
          background: rgba(9, 9, 12, 0.85);
          border: 1px solid rgba(230, 185, 80, 0.18);
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.6);
          padding: 1.6rem;
        }

        .panel-gold {
          border-color: rgba(230, 185, 80, 0.35);
          background: linear-gradient(180deg, rgba(14, 14, 18, 0.9), rgba(10, 10, 12, 0.95));
          position: relative;
        }

        .panel-gold::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, rgba(230, 185, 80, 0.8), rgba(230, 185, 80, 0));
        }

        .panel-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          color: #d2a93b;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
        }

        .status-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(18, 18, 24, 0.95), rgba(8, 8, 12, 0.95));
          padding: 1.75rem;
        }

        .status-bar {
          height: 6px;
          background: linear-gradient(90deg, #0c6b3d, #19c06b);
          margin: 0.6rem 0 1.5rem;
        }

        .status-emblem {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          border: 2px dashed rgba(230, 185, 80, 0.7);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem auto 0.25rem;
          color: #e0b54b;
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
        }

        .status-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
        }

        .price-value {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.4rem;
          letter-spacing: 0.1em;
          color: #ffffff;
        }

        .cta-btn {
          font-family: 'Orbitron', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: 0.7rem;
          padding: 0.9rem 1.6rem;
          background: rgba(0, 175, 90, 0.95);
          border: 1px solid rgba(0, 175, 90, 0.95);
          color: #fff;
          width: 100%;
          text-align: center;
        }

        .cta-btn:hover {
          background: rgba(0, 200, 102, 1);
        }

        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 1.25rem 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 200, 80, 0.1);
          border: 1px solid rgba(255, 200, 80, 0.35);
          color: #e0b54b;
          padding: 0.35rem 0.75rem;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: 'Orbitron', sans-serif;
        }

        .back-link {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #00ff8c;
          display: inline-flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .steps-list {
          display: grid;
          gap: 0.8rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          counter-reset: step;
        }

        .steps-list li {
          list-style: none;
          display: grid;
          grid-template-columns: 2.2rem 1fr;
          gap: 0.75rem;
          align-items: start;
        }

        .steps-list li::before {
          counter-increment: step;
          content: counter(step, decimal-leading-zero) ".";
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.2em;
          color: rgba(230, 185, 80, 0.8);
        }
      `}</style>

      <section className="event-details py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="max-w-3xl">
                <Link to="/" className="back-link">
                  Back to events
                </Link>
                <h1 className="hero-title">{event.name}</h1>
                <div className="info-row mt-4">
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {eventDate}
                  </span>
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v6l4 2" />
                    </svg>
                    {eventTime}
                  </span>
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {eventVenue}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)] gap-8">
              <div className="flex flex-col gap-8">
                <div className="panel">
                  <div className="panel-title">Mission Briefing</div>
                  <p className="text-sm sm:text-base leading-7 text-white/80">
                    {event.description}
                  </p>
                </div>

                <div className="panel panel-gold">
                  <div className="panel-title">General Protocols</div>
                  <ol className="steps-list">
                    <li>Carry a valid college ID for verification.</li>
                    <li>Maintain fair play and professional conduct.</li>
                    <li>Slots are limited and follow first-come allocation.</li>
                    <li>Event guidelines may be updated by the organizers.</li>
                    <li>Exceeding the specified time limit results in disqualification.</li>
                  </ol>
                </div>

                <div className="panel panel-gold">
                  <div className="panel-title">Event Directives</div>
                  <ol className="steps-list">
                    {eventDirectives.map((directive) => (
                      <li key={directive}>{directive}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex flex-col gap-6 order-first lg:order-none">
                <div className="panel">
                  <div className="panel-title">Prize Bounty</div>
                  <div className="flex flex-wrap gap-6 text-sm text-white/80">
                    <div>
                      <div className="badge">Grand Pool</div>
                      <div className="text-lg text-white mt-2">Rs {event.prize_pool}</div>
                    </div>
                    <div>
                      <div className="badge">Registration</div>
                      <div className="text-lg text-white mt-2">Rs {event.price}</div>
                    </div>
                    <div>
                      <div className="badge">Team Size</div>
                      <div className="text-lg text-white mt-2">{teamLabel}</div>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-title">Quick Info</div>
                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <div>Category: {event.category}</div>
                    <div>Format: {teamLabel}</div>
                    <div>Prize Pool: Rs {event.prize_pool}</div>
                    <div>Registration Fee: Rs {event.price}</div>
                  </div>
                </div>
              </div>

              <div className="status-card lg:col-start-1">
                <div className="flex items-center justify-between">
                  <span className="status-label">Capacity Status</span>
                  <span className="status-label">{capacityLabel}</span>
                </div>
                <div className="status-bar" />
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="status-emblem">₹</div>
                  <span className="status-label">Tribute Required</span>
                  <div className="price-value">Rs {event.price}</div>
                </div>
                <div className="divider" />
                <button className="cta-btn">Registration Open</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
