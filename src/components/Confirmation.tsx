import type { ConfirmationData } from "../hooks/useRegistration";
interface Props {
  data: ConfirmationData;
  onBack: () => void;
}

const Confirmation = ({ data, onBack }: Props) => (
  <>
    <style>{`
      .conf-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.88);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
      }
      .conf-box {
        background: #0d0d12;
        border: 1px solid rgba(0, 175, 90, 0.35);
        width: 100%;
        max-width: 520px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 2rem 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .conf-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 2px solid rgba(0, 175, 90, 0.6);
        color: #00ff8c;
        font-size: 1.4rem;
        margin: 0 auto;
      }
      .conf-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #00ff8c;
        text-align: center;
      }
      .conf-reg-id {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.62rem;
        letter-spacing: 0.2em;
        color: rgba(255, 255, 255, 0.35);
        text-align: center;
      }
      .conf-reg-id span {
        color: rgba(255, 255, 255, 0.65);
        word-break: break-all;
      }
      .conf-section-label {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #d2a93b;
        margin-bottom: 0.6rem;
      }
      .conf-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.07);
      }
      .conf-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.65);
        padding: 0.3rem 0;
      }
      .conf-row span:last-child {
        color: rgba(255, 255, 255, 0.9);
        text-align: right;
        max-width: 60%;
        word-break: break-word;
      }
      .conf-participant {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        padding: 0.85rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .conf-participant-name {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        color: #e8e8e8;
      }
      .conf-participant-detail {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.45);
      }
      .conf-status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(0, 175, 90, 0.12);
        border: 1px solid rgba(0, 175, 90, 0.35);
        color: #00ff8c;
        padding: 0.3rem 0.75rem;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.6rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }
      .conf-back-btn {
        width: 100%;
        padding: 0.85rem;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        background: transparent;
        border: 1px solid rgba(0, 175, 90, 0.5);
        color: #00ff8c;
        cursor: pointer;
        transition: background 0.2s;
      }
      .conf-back-btn:hover {
        background: rgba(0, 175, 90, 0.1);
      }
    `}</style>

    <div className="conf-overlay">
      <div className="conf-box">
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div className="conf-badge">✓</div>
          <div className="conf-title">Registration Confirmed</div>
          <div className="conf-reg-id">
            ID: <span>{data.registrationId}</span>
          </div>
        </div>

        <div className="conf-divider" />

        <div>
          <div className="conf-section-label">Event Details</div>
          <div className="conf-row">
            <span>Event</span>
            <span>{data.eventName}</span>
          </div>
          {data.isTeamEvent && data.teamName && (
            <div className="conf-row">
              <span>Team</span>
              <span>{data.teamName}</span>
            </div>
          )}
          <div className="conf-row">
            <span>Payment</span>
            <span><span className="conf-status-pill">● {data.paymentStatus}</span></span>
          </div>
        </div>

        <div className="conf-divider" />

        <div>
          <div className="conf-section-label">
            {data.isTeamEvent ? "Participants" : "Participant"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {data.participants.map((p, i) => (
              <div key={i} className="conf-participant">
                <div className="conf-participant-name">
                  {p.name}
                  {p.isLeader && (
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.55rem", color: "#d2a93b", letterSpacing: "0.2em" }}>
                      LEAD
                    </span>
                  )}
                </div>
                <div className="conf-participant-detail">{p.email}</div>
                <div className="conf-participant-detail">{p.college} · {p.food}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="conf-back-btn" onClick={onBack}>
          ← Back to Events
        </button>
      </div>
    </div>
  </>
);

export default Confirmation;
