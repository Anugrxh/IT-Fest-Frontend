import type { ConfirmationData } from "../hooks/useRegistration";

interface Props {
  data: ConfirmationData;
  onBack: () => void;
}

function downloadQR(base64: string, registrationId: string) {
  const link = document.createElement("a");
  link.href = base64.startsWith("data:") ? base64 : `data:image/png;base64,${base64}`;
  link.download = `ITFest-${registrationId}.png`;
  link.click();
}

const Confirmation = ({ data, onBack }: Props) => (
  <>
    <style>{`
      .conf-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.92);
        display: flex; align-items: center; justify-content: center;
        z-index: 9999; padding: 1rem;
      }
      .conf-box {
        background: #0d0d12;
        border: 1px solid rgba(0,175,90,0.35);
        width: 100%; max-width: 520px; max-height: 92vh;
        overflow-y: auto;
        padding: 2rem 1.75rem;
        display: flex; flex-direction: column; gap: 1.4rem;
      }
      @keyframes popIn {
        0%   { transform: scale(0.5); opacity: 0; }
        70%  { transform: scale(1.15); }
        100% { transform: scale(1); opacity: 1; }
      }
      .conf-badge {
        width: 60px; height: 60px; border-radius: 50%;
        border: 2px solid rgba(0,175,90,0.7);
        color: #00ff8c; font-size: 1.6rem;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto;
        animation: popIn 0.5s ease forwards;
      }
      .conf-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.75rem; letter-spacing: 0.35em;
        text-transform: uppercase; color: #00ff8c; text-align: center;
      }
      .conf-reg-id {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.6rem; letter-spacing: 0.18em;
        color: rgba(255,255,255,0.35); text-align: center;
      }
      .conf-reg-id span { color: rgba(255,255,255,0.65); word-break: break-all; }
      .conf-divider { height: 1px; background: rgba(255,255,255,0.07); }
      .conf-section-label {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.6rem; letter-spacing: 0.3em;
        text-transform: uppercase; color: #d2a93b; margin-bottom: 0.6rem;
      }
      .conf-row {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 0.82rem; color: rgba(255,255,255,0.6); padding: 0.28rem 0;
      }
      .conf-row span:last-child {
        color: rgba(255,255,255,0.9); text-align: right;
        word-break: break-word;
      }
      .conf-status-pill {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: rgba(0,175,90,0.12); border: 1px solid rgba(0,175,90,0.35);
        color: #00ff8c; padding: 0.28rem 0.7rem;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
        width: fit-content;
      }
      .conf-participant {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        padding: 0.8rem 1rem;
        display: flex; flex-direction: column; gap: 0.28rem;
      }
      .conf-participant-name {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.68rem; letter-spacing: 0.1em; color: #e8e8e8;
      }
      .conf-participant-detail { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
      .conf-qr-wrap {
        display: flex; flex-direction: column; align-items: center; gap: 0.85rem;
      }
      .conf-qr-img {
        width: 200px; height: 200px;
        border: 3px solid rgba(0,175,90,0.5);
        background: #fff;
        display: block;
      }
      .conf-qr-hint {
        font-size: 0.72rem; color: rgba(255,255,255,0.4);
        text-align: center; letter-spacing: 0.05em;
      }
      .conf-dl-btn {
        padding: 0.6rem 1.4rem;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase;
        background: rgba(0,175,90,0.15); border: 1px solid rgba(0,175,90,0.5);
        color: #00ff8c; cursor: pointer; transition: background 0.2s;
      }
      .conf-dl-btn:hover { background: rgba(0,175,90,0.28); }
      .conf-back-btn {
        width: 100%; padding: 0.85rem;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.68rem; letter-spacing: 0.25em; text-transform: uppercase;
        background: transparent; border: 1px solid rgba(0,175,90,0.4);
        color: #00ff8c; cursor: pointer; transition: background 0.2s;
      }
      .conf-back-btn:hover { background: rgba(0,175,90,0.08); }
    `}</style>

    <div className="conf-overlay">
      <div className="conf-box">
        {/* Header */}
        <div style={{ textAlign:"center", display:"flex", flexDirection:"column", gap:"0.55rem" }}>
          <div className="conf-badge">✓</div>
          <div className="conf-title">Registration Confirmed</div>
          <div className="conf-reg-id">ID: <span>{data.registrationId}</span></div>
        </div>

        <div className="conf-divider" />

        {/* QR Code — shown first for quick access */}
        <div className="conf-qr-wrap">
          <div className="conf-section-label" style={{ marginBottom:0 }}>Your Entry QR Code</div>
          {data.qrCode ? (
            <>
              <img className="conf-qr-img" src={data.qrCode} alt="Entry QR Code" />
              <p className="conf-qr-hint">Show this QR at the venue for check-in</p>
              <button className="conf-dl-btn" onClick={() => downloadQR(data.qrCode, data.registrationId)}>
                ↓ Download QR
              </button>
            </>
          ) : (
            <p className="conf-qr-hint">QR code unavailable. Contact support.</p>
          )}
        </div>

        <div className="conf-divider" />

        {/* Event details */}
        <div>
          <div className="conf-section-label">Event Details</div>
          <div className="conf-row"><span>Event</span><span>{data.eventName}</span></div>
          {data.isTeamEvent && data.teamName && (
            <div className="conf-row"><span>Team</span><span>{data.teamName}</span></div>
          )}
          <div className="conf-row">
            <span>Payment</span>
            <span className="conf-status-pill">● {data.paymentStatus}</span>
          </div>
        </div>

        <div className="conf-divider" />

        {/* Participants */}
        <div>
          <div className="conf-section-label">{data.isTeamEvent ? "Participants" : "Participant"}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            {data.participants.map((p, i) => (
              <div key={i} className="conf-participant">
                <div className="conf-participant-name">
                  {p.name}
                  {p.isLeader && (
                    <span style={{ marginLeft:"0.5rem", fontSize:"0.55rem", color:"#d2a93b", letterSpacing:"0.2em" }}>LEAD</span>
                  )}
                </div>
                <div className="conf-participant-detail">{p.email}</div>
                <div className="conf-participant-detail">{p.college} · {p.food}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="conf-back-btn" onClick={onBack}>← Back to Events</button>
      </div>
    </div>
  </>
);

export default Confirmation;
