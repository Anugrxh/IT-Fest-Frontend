import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

interface ParticipantInfo {
  name: string;
  email: string;
  phone: string;
  college: string;
  food: "veg" | "non-veg";
  isLeader: boolean;
}

interface CheckinResult {
  type: "success" | "already" | "invalid";
  eventName?: string;
  teamName?: string | null;
  isTeamEvent?: boolean;
  participants?: ParticipantInfo[];
  checkedInAt?: string;
  message: string;
}

export default function AdminScanner() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [camError, setCamError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function login() {
    if (pwInput === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else setPwError(true);
  }

  async function handleScan(token: string) {
    if (loading) return;
    setLoading(true);
    await stopScanner();
    try {
      const { data } = await axios.post(`${API_BASE}/api/checkin`, { token });
      setResult({
        type: "success",
        message: data.message,
        eventName: data.registration.eventName,
        teamName: data.registration.teamName,
        isTeamEvent: data.registration.isTeamEvent,
        participants: data.registration.participants,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const body = err.response.data;
        if (body.error === "Already checked in") {
          setResult({
            type: "already",
            message: "Already checked in",
            checkedInAt: body.checkedInAt,
            eventName: body.registration?.eventName,
            teamName: body.registration?.teamName,
            isTeamEvent: body.registration?.isTeamEvent,
            participants: body.registration?.participants,
          });
        } else {
          setResult({ type: "invalid", message: body.error ?? "Invalid or expired QR code" });
        }
      } else {
        setResult({ type: "invalid", message: "Network error. Try again." });
      }
    } finally {
      setLoading(false);
      resetTimer.current = setTimeout(() => {
        setResult(null);
        startScanner();
      }, 4000);
    }
  }

  async function startScanner() {
    setCamError(null);
    try {
      const qr = new Html5Qrcode("qr-reader");
      scannerRef.current = qr;
      await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => handleScan(text),
        () => {}
      );
      setScanning(true);
    } catch {
      setCamError("Camera access denied or unavailable. Please allow camera permissions and try again.");
      setScanning(false);
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch { /* already stopped */ }
      scannerRef.current = null;
    }
    setScanning(false);
  }

  // Start scanner once authed
  useEffect(() => {
    if (authed) startScanner();
    return () => {
      stopScanner();
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [authed]);


  // ── Login screen ──
  if (!authed) {
    return (
      <div style={{ minHeight:"100vh", background:"#07070a", display:"flex", alignItems:"center", justifyContent:"center", padding:"1.5rem" }}>
        <div style={{ background:"#0d0d12", border:"1px solid rgba(230,185,80,0.25)", padding:"2.5rem 2rem", width:"100%", maxWidth:"360px", display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase", color:"#d2a93b", textAlign:"center" }}>
            Admin Access
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ padding:"0.75rem 1rem", background:"rgba(255,255,255,0.04)", border:`1px solid ${pwError ? "rgba(255,80,80,0.5)" : "rgba(255,255,255,0.1)"}`, color:"#e8e8e8", fontSize:"0.9rem", outline:"none", width:"100%" }}
          />
          {pwError && <p style={{ fontSize:"0.75rem", color:"rgba(255,100,100,0.8)", margin:"-0.5rem 0 0" }}>Incorrect password.</p>}
          <button
            onClick={login}
            style={{ padding:"0.85rem", fontFamily:"'Orbitron',sans-serif", fontSize:"0.68rem", letterSpacing:"0.25em", textTransform:"uppercase", background:"rgba(0,175,90,0.9)", border:"none", color:"#fff", cursor:"pointer" }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ── Scanner screen ──
  const resultColors = {
    success: { bg:"rgba(0,175,90,0.12)", border:"rgba(0,175,90,0.45)", title:"#00ff8c", icon:"✅" },
    already:  { bg:"rgba(255,180,0,0.1)",  border:"rgba(255,180,0,0.4)",  title:"#ffd700", icon:"⚠️" },
    invalid:  { bg:"rgba(255,60,60,0.1)",  border:"rgba(255,60,60,0.4)",  title:"#ff6060", icon:"❌" },
  };

  return (
    <div style={{ minHeight:"100vh", background:"#07070a", color:"#e8e8e8", padding:"1.25rem", display:"flex", flexDirection:"column", gap:"1.25rem", maxWidth:"480px", margin:"0 auto" }}>
      <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"0.7rem", letterSpacing:"0.35em", textTransform:"uppercase", color:"#d2a93b", textAlign:"center", paddingTop:"0.5rem" }}>
        Check-in Scanner
      </div>

      {/* Camera viewport */}
      <div style={{ position:"relative", background:"#000", border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden", borderRadius:"4px" }}>
        <div id="qr-reader" style={{ width:"100%" }} />
        {loading && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Orbitron',sans-serif", fontSize:"0.7rem", letterSpacing:"0.2em", color:"#00ff8c" }}>
            Verifying...
          </div>
        )}
        {!scanning && !loading && !camError && (
          <div style={{ padding:"3rem 1rem", textAlign:"center", fontSize:"0.8rem", color:"rgba(255,255,255,0.4)" }}>
            Initializing camera...
          </div>
        )}
      </div>

      {camError && (
        <div style={{ background:"rgba(255,60,60,0.1)", border:"1px solid rgba(255,60,60,0.35)", padding:"1rem", fontSize:"0.82rem", color:"rgba(255,120,120,0.9)", borderRadius:"2px" }}>
          {camError}
          <button onClick={startScanner} style={{ display:"block", marginTop:"0.75rem", fontFamily:"'Orbitron',sans-serif", fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", background:"none", border:"1px solid rgba(255,120,120,0.4)", color:"rgba(255,120,120,0.8)", padding:"0.5rem 1rem", cursor:"pointer" }}>
            Retry
          </button>
        </div>
      )}

      {scanning && !result && !loading && (
        <p style={{ textAlign:"center", fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em" }}>
          Point camera at QR code
        </p>
      )}

      {/* Result card */}
      {result && (() => {
        const c = resultColors[result.type];
        return (
          <div style={{ background:c.bg, border:`1px solid ${c.border}`, padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.75rem", borderRadius:"2px" }}>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"0.8rem", letterSpacing:"0.2em", color:c.title, display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <span>{c.icon}</span>
              {result.type === "success" ? "Check-in Successful" : result.type === "already" ? "Already Checked In" : "Invalid QR Code"}
            </div>

            {result.eventName && (
              <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.75)" }}>
                <span style={{ color:"rgba(255,255,255,0.4)", marginRight:"0.5rem" }}>Event:</span>{result.eventName}
                {result.teamName && <span style={{ marginLeft:"0.75rem", color:"rgba(255,255,255,0.4)" }}>· Team: <span style={{ color:"rgba(255,255,255,0.75)" }}>{result.teamName}</span></span>}
              </div>
            )}

            {result.checkedInAt && (
              <div style={{ fontSize:"0.78rem", color:"rgba(255,180,0,0.75)" }}>
                Checked in at: {new Date(result.checkedInAt).toLocaleTimeString()}
              </div>
            )}

            {result.participants && result.participants.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem" }}>
                {result.participants.map((p, i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", padding:"0.65rem 0.85rem", display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"0.65rem", letterSpacing:"0.1em", color:"#e8e8e8" }}>
                      {p.name}
                      {p.isLeader && <span style={{ marginLeft:"0.5rem", fontSize:"0.52rem", color:"#d2a93b", letterSpacing:"0.2em" }}>LEAD</span>}
                    </div>
                    <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.4)" }}>{p.college}</div>
                    <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.4)" }}>Food: {p.food}</div>
                  </div>
                ))}
              </div>
            )}

            <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.05em", marginTop:"0.25rem" }}>
              Scanner resets in 4 seconds...
            </p>
          </div>
        );
      })()}
    </div>
  );
}
