import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import programData from "../assets/program.json";
import termsData from "../assets/terms.json";
import { useRegistration } from "../hooks/useRegistration";
import Confirmation from "../components/Confirmation";

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
  first_prize?: number;
  second_prize?: number;
  registration_fee_note?: string;
  coordinator_name?: string;
  coordinator_number?: string;
  is_team: boolean;
  team_size: number | null;
  main_image_url: string;
  gallery_images: string[];
  event_directives?: string[];
  capacity_total?: number;
  capacity_filled?: number;
}

interface MemberFields {
  name: string;
  email: string;
  phone: string;
  college: string;
  food: "veg" | "non-veg";
}

const EMPTY_MEMBER = (): MemberFields => ({ name: "", email: "", phone: "", college: "", food: "veg" });
const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN").format(amount);

const EventDetails = () => {
  const { id } = useParams();
  const { register, loading, error, confirmation, reset } = useRegistration();

  const [showForm, setShowForm] = useState(false);
  const [tcOpen, setTcOpen] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);

  // Solo / team-lead fields
  const [leader, setLeader] = useState<MemberFields>(EMPTY_MEMBER());
  // Team-only
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<MemberFields[]>([]);

  const event = useMemo(() => {
    const list = programData as ProgramItem[];
    return list.find((item) => item.id === Number(id));
  }, [id]);

  if (!event) {
    return (
      <section className="min-h-screen bg-black text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-lg mb-6">Event not found.</p>
          <Link to="/" className="text-emerald-400 hover:text-emerald-300">Back to events</Link>
        </div>
      </section>
    );
  }

  const teamLabel = event.is_team ? `Team of ${event.team_size ?? "TBA"}` : "Solo";
  const maxTeamSize = event.team_size ?? 4;

  const defaultDirectives = [
    "Participation format: {team}.",
    "Use only original submissions and assets.",
    "Check-in closes 30 minutes before start time.",
    "Teams must confirm slots after fee payment.",
    "Contact the desk for clarifications on rules.",
  ];
  const eventDirectives = (event.event_directives?.length ? event.event_directives : defaultDirectives)
    .map((d) => d.replace("{team}", teamLabel));

  const capacityTotal = event.capacity_total ?? 0;
  const capacityFilled = event.capacity_filled ?? 0;
  const capacityLabel = capacityTotal ? `${capacityFilled} / ${capacityTotal} Filled` : "Capacity TBA";
  const eventDate = event.event_date ?? "Date TBA";
  const eventTime = event.event_time ?? "Time TBA";
  const eventVenue = event.venue ?? "Venue TBA";
  const firstPrize = event.first_prize ?? event.prize_pool;
  const secondPrize = event.second_prize ?? 0;
  const hasSecondPrize = secondPrize > 0;
  const registrationFeeLabel = event.registration_fee_note
    ? `₹${event.registration_fee_note}`
    : event.is_team
      ? `₹${event.price} per head`
      : `₹${event.price}`;
  const coordinatorName = event.coordinator_name?.trim() || "________________";
  const coordinatorNumber = event.coordinator_number?.trim() || "________________";

  function updateLeader(field: keyof MemberFields, val: string) {
    setLeader((p) => ({ ...p, [field]: val }));
  }
  function updateMember(idx: number, field: keyof MemberFields, val: string) {
    setMembers((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: val } : m));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    if (event.is_team) {
      const totalMembers = 1 + members.length; // 1 leader + additional members
      const totalAmount = event.price * totalMembers;
      await register({
        eventId: String(event.id),
        eventName: event.name,
        isTeamEvent: true,
        teamName,
        participants: [
          { ...leader, isLeader: true },
          ...members.map((m) => ({ ...m, isLeader: false })),
        ],
      }, totalAmount);
    } else {
      await register({
        eventId: String(event.id),
        eventName: event.name,
        isTeamEvent: false,
        participant: { ...leader },
      }, event.price);
    }
  }

  if (confirmation) {
    return <Confirmation data={confirmation} onBack={() => { reset(); setShowForm(false); }} />;
  }

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
        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          letter-spacing: 0.08em;
          line-height: 1.05;
          color: #f4efe6;
        }
        .info-row { display: flex; flex-wrap: wrap; gap: 0.85rem 1.5rem; color: rgba(255,255,255,0.75); font-size: 0.85rem; }
        .info-item { display: inline-flex; align-items: center; gap: 0.45rem; }
        .info-icon { width: 16px; height: 16px; color: rgba(230,185,80,0.9); }
        .panel { background: rgba(9,9,12,0.85); border: 1px solid rgba(230,185,80,0.18); box-shadow: 0 0 24px rgba(0,0,0,0.6); padding: 1.6rem; }
        .panel-gold { border-color: rgba(230,185,80,0.35); background: linear-gradient(180deg,rgba(14,14,18,0.9),rgba(10,10,12,0.95)); position: relative; }
        .panel-gold::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:linear-gradient(180deg,rgba(230,185,80,0.8),rgba(230,185,80,0)); }
        .panel-title { font-family:'Orbitron',sans-serif; font-size:0.75rem; letter-spacing:0.35em; color:#d2a93b; text-transform:uppercase; margin-bottom:0.9rem; }
        .status-card { border:1px solid rgba(255,255,255,0.08); background:linear-gradient(180deg,rgba(18,18,24,0.95),rgba(8,8,12,0.95)); padding:1.75rem; }
        .status-bar { height:6px; background:linear-gradient(90deg,#0c6b3d,#19c06b); margin:0.6rem 0 1.5rem; }
        .status-emblem { width:58px; height:58px; border-radius:999px; border:2px dashed rgba(230,185,80,0.7); display:inline-flex; align-items:center; justify-content:center; margin:0.5rem auto 0.25rem; color:#e0b54b; font-family:'Orbitron',sans-serif; font-size:1.2rem; }
        .status-label { font-family:'Orbitron',sans-serif; font-size:0.55rem; letter-spacing:0.35em; text-transform:uppercase; color:rgba(255,255,255,0.6); }
        .price-value { font-family:'Orbitron',sans-serif; font-size:2.4rem; letter-spacing:0.1em; color:#ffffff; }
        .cta-btn { font-family:'Orbitron',sans-serif; text-transform:uppercase; letter-spacing:0.25em; font-size:0.7rem; padding:0.9rem 1.6rem; background:rgba(0,175,90,0.95); border:1px solid rgba(0,175,90,0.95); color:#fff; width:100%; text-align:center; cursor:pointer; transition:background 0.2s; }
        .cta-btn:hover { background:rgba(0,200,102,1); }
        .cta-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .divider { height:1px; background:rgba(255,255,255,0.08); margin:1.25rem 0; }
        .badge { display:inline-flex; align-items:center; gap:0.5rem; background:rgba(255,200,80,0.1); border:1px solid rgba(255,200,80,0.35); color:#e0b54b; padding:0.35rem 0.75rem; font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; font-family:'Orbitron',sans-serif; }
        .back-link { font-family:'Orbitron',sans-serif; font-size:0.7rem; letter-spacing:0.25em; text-transform:uppercase; color:#00ff8c; display:inline-flex; align-items:center; gap:0.45rem; margin-bottom:0.75rem; transition:color 0.2s ease, transform 0.2s ease; }
        .back-link:hover { color:#00d878; }
        .back-link-icon { width:0.9rem; height:0.9rem; transition:transform 0.2s ease; }
        .back-link:hover .back-link-icon { transform:translateX(-2px); }
        .steps-list { display:grid; gap:0.8rem; font-size:0.85rem; color:rgba(255,255,255,0.7); counter-reset:step; }
        .steps-list li { list-style:none; display:grid; grid-template-columns:2.2rem 1fr; gap:0.75rem; align-items:start; }
        .steps-list li::before { counter-increment:step; content:counter(step,decimal-leading-zero)"."; font-family:'Orbitron',sans-serif; letter-spacing:0.2em; color:rgba(230,185,80,0.8); }
        .reg-form { overflow:hidden; max-height:0; opacity:0; transition:max-height 0.4s ease,opacity 0.3s ease,margin 0.3s ease; margin-top:0; }
        .reg-form.open { max-height:6000px; opacity:1; margin-top:1.25rem; }
        .reg-input { width:100%; padding:0.7rem 0.9rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#e8e8e8; font-size:0.85rem; outline:none; transition:border-color 0.2s ease; }
        .reg-input:focus { border-color:rgba(0,175,90,0.6); }
        .reg-input::placeholder { color:rgba(255,255,255,0.3); }
        .reg-input[readonly] { color:rgba(255,255,255,0.5); cursor:default; }
        .reg-label { font-family:'Orbitron',sans-serif; font-size:0.6rem; letter-spacing:0.25em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:0.35rem; }
        .food-btn { flex:1; padding:0.6rem; font-family:'Orbitron',sans-serif; font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03); color:rgba(255,255,255,0.5); cursor:pointer; transition:all 0.2s ease; }
        .food-btn.active { background:rgba(0,175,90,0.2); border-color:rgba(0,175,90,0.6); color:#00ff8c; }
        .tc-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:9999; padding:1.5rem; }
        .tc-modal { background:#0d0d12; border:1px solid rgba(230,185,80,0.3); max-width:560px; width:100%; max-height:80vh; display:flex; flex-direction:column; overflow:hidden; }
        .tc-modal-header { padding:1.25rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.08); font-family:'Orbitron',sans-serif; font-size:0.7rem; letter-spacing:0.35em; text-transform:uppercase; color:#d2a93b; display:flex; justify-content:space-between; align-items:center; }
        .tc-modal-body { padding:1.25rem 1.5rem; overflow-y:auto; flex:1; }
        .tc-modal-body ol { counter-reset:tc; display:grid; gap:0.9rem; padding:0; margin:0; }
        .tc-modal-body ol li { list-style:none; display:grid; grid-template-columns:1.6rem 1fr; gap:0.6rem; font-size:0.83rem; color:rgba(255,255,255,0.7); line-height:1.6; }
        .tc-modal-body ol li::before { counter-increment:tc; content:counter(tc)"."; font-family:'Orbitron',sans-serif; font-size:0.6rem; color:rgba(230,185,80,0.7); padding-top:0.15rem; }
        .tc-close-btn { background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.1rem; line-height:1; padding:0; }
        .tc-close-btn:hover { color:#fff; }
        .tc-checkbox-row { display:flex; align-items:center; gap:0.6rem; margin-top:0.75rem; font-size:0.78rem; color:rgba(255,255,255,0.6); }
        .tc-checkbox-row input[type="checkbox"] { width:15px; height:15px; accent-color:#3b82f6; cursor:pointer; flex-shrink:0; }
        .tc-link { color:#3b82f6; cursor:pointer; text-decoration:underline; background:none; border:none; padding:0; font-size:inherit; font-family:inherit; }
        .tc-link:hover { color:#60a5fa; }
        .reg-error { background:rgba(255,60,60,0.1); border:1px solid rgba(255,60,60,0.3); color:rgba(255,120,120,0.9); padding:0.75rem 1rem; font-size:0.8rem; margin-top:0.5rem; }
      `}</style>

      {tcOpen && (
        <div className="tc-overlay" onClick={() => setTcOpen(false)}>
          <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tc-modal-header">
              Terms &amp; Conditions
              <button className="tc-close-btn" onClick={() => setTcOpen(false)}>✕</button>
            </div>
            <div className="tc-modal-body">
              <ol>{termsData.map((item, i) => <li key={i}>{item}</li>)}</ol>
            </div>
          </div>
        </div>
      )}

      <section className="event-details py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="max-w-3xl">
                <Link to="/" className="back-link" aria-label="Back to events">
                  <svg className="back-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span>Back to events</span>
                </Link>
                <h1 className="hero-title">{event.name}</h1>
                <div className="info-row mt-4">
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {eventDate}
                  </span>
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>
                    </svg>
                    {eventTime}
                  </span>
                  <span className="info-item">
                    <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>
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
                  <p className="text-sm sm:text-base leading-7 text-white/80">{event.description}</p>
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
                    {eventDirectives.map((directive) => <li key={directive}>{directive}</li>)}
                  </ol>
                </div>
              </div>

              <div className="flex flex-col gap-6 order-first lg:order-0">
                <div className="panel">
                  <div className="panel-title">Prize Bounty</div>
                  <div className="flex flex-wrap gap-6 text-sm text-white/80">
                    <div><div className="badge">First Prize</div><div className="text-lg text-white mt-2">₹{formatCurrency(firstPrize)}/-</div></div>
                    {hasSecondPrize && <div><div className="badge">Second Prize</div><div className="text-lg text-white mt-2">₹{formatCurrency(secondPrize)}/-</div></div>}
                    <div><div className="badge">Grand Pool</div><div className="text-lg text-white mt-2">₹{formatCurrency(event.prize_pool)}/-</div></div>
                    <div><div className="badge">Registration</div><div className="text-lg text-white mt-2">{registrationFeeLabel}</div></div>
                    <div><div className="badge">Team Size</div><div className="text-lg text-white mt-2">{teamLabel}</div></div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-title">Contact</div>
                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <div>Coordinator Name: {coordinatorName}</div>
                    <div>Coordinator Number: {coordinatorNumber}</div>
                  </div>
                </div>
              </div>

              {/* Registration card */}
              <div className="status-card lg:col-span-2">
                {/* <div className="flex items-center justify-between">
                  <span className="status-label">Capacity Status</span>
                  <span className="status-label">{capacityLabel}</span>
                </div> */}
                <div className="status-bar" />
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="status-emblem">₹</div>
                  <span className="status-label">Entry Fee</span>
                  <div className="price-value">{event.is_team ? `₹${event.price}/head` : `₹${event.price}/-`}</div>
                  {event.registration_fee_note && <div className="text-xs text-white/60">{event.registration_fee_note}</div>}
                </div>
                <div className="divider" />
                <button className="cta-btn" onClick={() => setShowForm((v) => !v)}>
                  {showForm ? "Close Form" : "Registration Open"}
                </button>

                <form onSubmit={handleSubmit}>
                  {/* ── SOLO FORM ── */}
                  {!event.is_team && (
                    <div className={`reg-form ${showForm ? "open" : ""}`}>
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="reg-label">Selected Event</div>
                          <input className="reg-input" type="text" value={event.name} readOnly />
                        </div>
                        <div>
                          <div className="reg-label">Full Name</div>
                          <input className="reg-input" type="text" placeholder="Enter your full name" value={leader.name} onChange={(e) => updateLeader("name", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Email ID</div>
                          <input className="reg-input" type="email" placeholder="Enter your email" value={leader.email} onChange={(e) => updateLeader("email", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Mobile No</div>
                          <div className="flex">
                            <span style={{ padding:"0.7rem 0.75rem", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRight:"none", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", whiteSpace:"nowrap" }}>+91</span>
                            <input className="reg-input" type="tel" placeholder="Enter your mobile number" value={leader.phone} maxLength={10} pattern="[0-9]{10}" onChange={(e) => updateLeader("phone", e.target.value.replace(/\D/g,"").slice(0,10))} required />
                          </div>
                        </div>
                        <div>
                          <div className="reg-label">College</div>
                          <input className="reg-input" type="text" placeholder="Enter your college name" value={leader.college} onChange={(e) => updateLeader("college", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Food Preference</div>
                          <div className="flex gap-3">
                            <button type="button" className={`food-btn ${leader.food === "veg" ? "active" : ""}`} onClick={() => updateLeader("food", "veg")}>Veg</button>
                            <button type="button" className={`food-btn ${leader.food === "non-veg" ? "active" : ""}`} onClick={() => updateLeader("food", "non-veg")}>Non Veg</button>
                          </div>
                          <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginTop:"0.4rem", letterSpacing:"0.05em" }}>* Food is included in the registration fee. No extra charges.</p>
                        </div>
                        <div className="tc-checkbox-row">
                          <input type="checkbox" id="tc-solo" checked={tcAccepted} onChange={(e) => setTcAccepted(e.target.checked)} />
                          <label htmlFor="tc-solo">I agree to the <button type="button" className="tc-link" onClick={() => setTcOpen(true)}>Terms and Conditions</button></label>
                        </div>
                        {error && <div className="reg-error">{error}</div>}
                        <button type="submit" className="cta-btn" style={{ marginTop:"0.5rem" }} disabled={!tcAccepted || loading}>
                          {loading ? "Processing..." : "Register and Pay"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── TEAM FORM ── */}
                  {event.is_team && (
                    <div className={`reg-form ${showForm ? "open" : ""}`}>
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="reg-label">Selected Event</div>
                          <input className="reg-input" type="text" value={event.name} readOnly />
                        </div>
                        <div>
                          <div className="reg-label">Team Name</div>
                          <input className="reg-input" type="text" placeholder="Enter your team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                        </div>

                        <div className="divider" />
                        <div className="reg-label" style={{ color:"#d2a93b", fontSize:"0.7rem", marginBottom:"-0.25rem" }}>Team Lead</div>

                        <div>
                          <div className="reg-label">Full Name</div>
                          <input className="reg-input" type="text" placeholder="Enter team lead's full name" value={leader.name} onChange={(e) => updateLeader("name", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Email ID</div>
                          <input className="reg-input" type="email" placeholder="Enter team lead's email" value={leader.email} onChange={(e) => updateLeader("email", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Mobile No</div>
                          <div className="flex">
                            <span style={{ padding:"0.7rem 0.75rem", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRight:"none", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", whiteSpace:"nowrap" }}>+91</span>
                            <input className="reg-input" type="tel" placeholder="Enter mobile number" value={leader.phone} maxLength={10} pattern="[0-9]{10}" onChange={(e) => updateLeader("phone", e.target.value.replace(/\D/g,"").slice(0,10))} required />
                          </div>
                        </div>
                        <div>
                          <div className="reg-label">College</div>
                          <input className="reg-input" type="text" placeholder="Enter college name" value={leader.college} onChange={(e) => updateLeader("college", e.target.value)} required />
                        </div>
                        <div>
                          <div className="reg-label">Food Preference</div>
                          <div className="flex gap-3">
                            <button type="button" className={`food-btn ${leader.food === "veg" ? "active" : ""}`} onClick={() => updateLeader("food", "veg")}>Veg</button>
                            <button type="button" className={`food-btn ${leader.food === "non-veg" ? "active" : ""}`} onClick={() => updateLeader("food", "non-veg")}>Non Veg</button>
                          </div>
                          <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginTop:"0.4rem", letterSpacing:"0.05em" }}>* Food is included in the registration fee. No extra charges.</p>
                        </div>

                        {/* Additional team members */}
                        {members.map((member, idx) => (
                          <div key={idx}>
                            <div className="divider" />
                            <div className="flex items-center justify-between" style={{ marginBottom:"0.75rem" }}>
                              <div className="reg-label" style={{ color:"#d2a93b", fontSize:"0.7rem", marginBottom:0 }}>Team Member {idx + 1}</div>
                              <button type="button" onClick={() => setMembers((m) => m.filter((_,i) => i !== idx))} style={{ fontSize:"0.6rem", color:"rgba(255,100,100,0.7)", background:"none", border:"none", cursor:"pointer", fontFamily:"'Orbitron',sans-serif", letterSpacing:"0.15em" }}>REMOVE</button>
                            </div>
                            <div className="flex flex-col gap-4">
                              <div>
                                <div className="reg-label">Full Name</div>
                                <input className="reg-input" type="text" placeholder="Enter member's full name" value={member.name} onChange={(e) => updateMember(idx,"name",e.target.value)} required />
                              </div>
                              <div>
                                <div className="reg-label">Email ID</div>
                                <input className="reg-input" type="email" placeholder="Enter member's email" value={member.email} onChange={(e) => updateMember(idx,"email",e.target.value)} required />
                              </div>
                              <div>
                                <div className="reg-label">Mobile No</div>
                                <div className="flex">
                                  <span style={{ padding:"0.7rem 0.75rem", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRight:"none", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", whiteSpace:"nowrap" }}>+91</span>
                                  <input className="reg-input" type="tel" placeholder="Enter mobile number" value={member.phone} maxLength={10} pattern="[0-9]{10}" onChange={(e) => updateMember(idx,"phone",e.target.value.replace(/\D/g,"").slice(0,10))} required />
                                </div>
                              </div>
                              <div>
                                <div className="reg-label">College</div>
                                <input className="reg-input" type="text" placeholder="Enter college name" value={member.college} onChange={(e) => updateMember(idx,"college",e.target.value)} required />
                              </div>
                              <div>
                                <div className="reg-label">Food Preference</div>
                                <div className="flex gap-3">
                                  <button type="button" className={`food-btn ${member.food === "veg" ? "active" : ""}`} onClick={() => updateMember(idx,"food","veg")}>Veg</button>
                                  <button type="button" className={`food-btn ${member.food === "non-veg" ? "active" : ""}`} onClick={() => updateMember(idx,"food","non-veg")}>Non Veg</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {members.length < maxTeamSize - 1 && (
                          <>
                            <div className="divider" />
                            <button type="button" className="cta-btn" style={{ background:"rgba(255,255,255,0.05)", border:"1px dashed rgba(255,255,255,0.2)" }} onClick={() => setMembers((m) => [...m, EMPTY_MEMBER()])}>
                              + Add Team Member ({members.length + 1}/{maxTeamSize - 1})
                            </button>
                          </>
                        )}

                        <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", letterSpacing:"0.05em", textAlign:"center" }}>
                          Total team size: {members.length + 1} / {maxTeamSize} (including lead)
                        </p>

                        <div className="tc-checkbox-row">
                          <input type="checkbox" id="tc-team" checked={tcAccepted} onChange={(e) => setTcAccepted(e.target.checked)} />
                          <label htmlFor="tc-team">I agree to the <button type="button" className="tc-link" onClick={() => setTcOpen(true)}>Terms and Conditions</button></label>
                        </div>
                        {error && <div className="reg-error">{error}</div>}
                        <button type="submit" className="cta-btn" style={{ marginTop:"0.5rem" }} disabled={!tcAccepted || loading}>
                          {loading ? "Processing..." : "Register and Pay"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
