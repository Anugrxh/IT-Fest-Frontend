import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

const API = import.meta.env.VITE_API_BASE_URL;

// ── Theme tokens ───────────────────────────────────────────────────────────────
const T = {
  bg:        '#07070a',
  bgCard:    'rgba(255,255,255,0.03)',
  bgCardHov: 'rgba(0,255,140,0.04)',
  border:    'rgba(0,255,140,0.12)',
  borderHov: 'rgba(0,255,140,0.35)',
  green:     '#00ff8c',
  greenDim:  'rgba(0,255,140,0.5)',
  greenFaint:'rgba(0,255,140,0.08)',
  gold:      '#FFD700',
  goldDim:   'rgba(255,215,0,0.4)',
  text:      'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.35)',
  textDim:   'rgba(255,255,255,0.55)',
  red:       'rgba(255,60,60,0.85)',
  redBg:     'rgba(255,60,60,0.08)',
  redBorder: 'rgba(255,60,60,0.3)',
  yellow:    '#ffd700',
  yellowBg:  'rgba(255,215,0,0.08)',
  yellowBorder:'rgba(255,215,0,0.3)',
  font:      "'Orbitron', sans-serif",
};

const gridBg = {
  backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
  backgroundSize: '60px 60px',
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface Participant { name:string; email:string; phone:string; college:string; food:string; isLeader:boolean; }
interface Registration {
  id:string; eventId:string; eventName:string; isTeamEvent:boolean; teamName:string|null;
  status:string; checkedIn:boolean; checkedInAt:string|null; createdAt:string;
  participants:Participant[]; payment?:{amount:number;status:string}|null;
}
interface Stats { total:number; confirmed:number; pending:number; checkedIn:number; revenue:number; }
interface CheckinResult {
  type:'success'|'already'|'invalid'; eventName?:string; teamName?:string|null;
  participants?:Participant[]; checkedInAt?:string; message:string;
}

const hdrs = (pw:string) => ({ 'x-admin-password': pw });

// ── Tiny helpers ───────────────────────────────────────────────────────────────
function fmt(d:string){ return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }

function GreenBadge({ on, label, offLabel }:{ on:boolean; label:string; offLabel:string }) {
  return (
    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:2, fontSize:10, fontWeight:700,
      fontFamily:T.font, letterSpacing:'0.1em',
      background: on ? 'rgba(0,255,140,0.12)' : 'rgba(255,255,255,0.05)',
      color: on ? T.green : T.textMuted,
      border: `1px solid ${on ? 'rgba(0,255,140,0.3)' : 'rgba(255,255,255,0.08)'}`,
    }}>
      {on ? label : offLabel}
    </span>
  );
}

function StatusBadge({ status }:{ status:string }) {
  const map:Record<string,{bg:string;color:string;border:string}> = {
    confirmed: { bg:'rgba(0,255,140,0.08)', color:T.green,  border:'rgba(0,255,140,0.25)' },
    pending:   { bg:T.yellowBg,             color:T.yellow, border:T.yellowBorder },
    failed:    { bg:T.redBg,                color:T.red,    border:T.redBorder },
  };
  const c = map[status] ?? { bg:'rgba(255,255,255,0.05)', color:T.textMuted, border:'rgba(255,255,255,0.1)' };
  return (
    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:2, fontSize:10, fontWeight:700,
      fontFamily:T.font, letterSpacing:'0.1em', background:c.bg, color:c.color, border:`1px solid ${c.border}` }}>
      {status.toUpperCase()}
    </span>
  );
}

// ── Participant sub-row ────────────────────────────────────────────────────────
function ParticipantRows({ participants }:{ participants:Participant[] }) {
  return (
    <div style={{ padding:'12px 16px', background:'#111118', borderTop:`1px solid ${T.border}` }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
        <thead>
          <tr style={{ color:T.textMuted, fontFamily:T.font, fontSize:10, letterSpacing:'0.1em' }}>
            {['Name','Email','Phone','College'].map(h=>(
              <th key={h} style={{ textAlign:'left', padding:'4px 8px', fontWeight:600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.map((p,i)=>(
            <tr key={i} style={{ borderTop:`1px solid rgba(255,255,255,0.04)` }}>
              <td style={{ padding:'6px 8px', color:T.text }}>{p.isLeader?'★ ':''}{p.name}</td>
              <td style={{ padding:'6px 8px', color:T.textDim }}>{p.email}</td>
              <td style={{ padding:'6px 8px', color:T.textDim }}>{p.phone}</td>
              <td style={{ padding:'6px 8px', color:T.textDim }}>{p.college}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── CSV Export ─────────────────────────────────────────────────────────────────
function exportCSV(registrations:Registration[]) {
  const rows=[['ID','Event','Team','Type','Status','Payment','Checked In','Date','Participants']];
  for(const r of registrations){
    rows.push([r.id,r.eventName,r.teamName??'',r.isTeamEvent?'Team':'Solo',r.status,
      r.payment?`₹${r.payment.amount/100}`:'-',r.checkedIn?'Yes':'No',fmt(r.createdAt),
      r.participants.map(p=>p.name).join('; ')]);
  }
  const csv=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download=`registrations-${Date.now()}.csv`; a.click();
}

// ── Login Screen ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }:{ onLogin:(pw:string,role:string)=>void }) {
  const [pw,setPw]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  async function handleSubmit(e:React.FormEvent){ e.preventDefault(); setLoading(true); setError('');
    try{ const res=await axios.get(`${API}/api/admin/role`,{headers:hdrs(pw)}); onLogin(pw,res.data.role); }
    catch{ setError('Invalid password'); } finally{ setLoading(false); }
  }

  return (
    <div style={{ minHeight:'100vh', background:T.bg, ...gridBg, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');`}</style>
      <div style={{ background:T.bgCard, border:`1px solid ${T.border}`, padding:'40px 36px', width:'100%', maxWidth:380,
        boxShadow:`0 0 40px rgba(0,255,140,0.04)` }}>
        <p style={{ margin:'0 0 4px', fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase', color:T.goldDim, fontFamily:T.font }}>
          Admin Access
        </p>
        <h1 style={{ margin:'0 0 28px', fontSize:22, fontWeight:900, fontFamily:T.font, letterSpacing:'0.15em',
          color:'transparent', WebkitTextStroke:`1.5px ${T.greenDim}`,
          textShadow:`0 0 20px rgba(0,255,140,0.2)` }}>
          ZEITGEIST 2026
        </h1>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input type="password" placeholder="Enter admin password" value={pw} onChange={e=>setPw(e.target.value)} autoFocus
            style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:`1px solid ${error?T.redBorder:T.border}`,
              color:T.text, fontSize:13, outline:'none', width:'100%', boxSizing:'border-box',
              fontFamily:'monospace' }} />
          {error && <p style={{ color:T.red, fontSize:12, margin:0, fontFamily:T.font, letterSpacing:'0.05em' }}>{error}</p>}
          <button type="submit" disabled={loading||!pw}
            style={{ padding:'11px', background:loading||!pw?'rgba(0,255,140,0.1)':'rgba(0,255,140,0.15)',
              border:`1px solid ${loading||!pw?'rgba(0,255,140,0.15)':T.greenDim}`,
              color:loading||!pw?T.textMuted:T.green, fontFamily:T.font, fontSize:11,
              letterSpacing:'0.25em', textTransform:'uppercase', cursor:loading||!pw?'not-allowed':'pointer',
              transition:'all 0.2s' }}>
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Stats Bar ──────────────────────────────────────────────────────────────────
function StatsBar({ stats }:{ stats:Stats }) {
  const items=[
    { label:'Total',      value:stats.total },
    { label:'Confirmed',  value:stats.confirmed },
    { label:'Pending',    value:stats.pending },
    { label:'Checked In', value:stats.checkedIn },
    { label:'Revenue',    value:`₹${(stats.revenue/100).toLocaleString('en-IN')}` },
  ];
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:24 }}>
      {items.map(item=>(
        <div key={item.label} style={{ flex:'1 1 120px', background:T.bgCard, border:`1px solid ${T.border}`,
          padding:'14px 18px', boxShadow:`0 0 20px rgba(0,255,140,0.02)` }}>
          <p style={{ margin:0, fontSize:9, color:T.goldDim, textTransform:'uppercase', letterSpacing:'0.25em', fontFamily:T.font }}>{item.label}</p>
          <p style={{ margin:'6px 0 0', fontSize:24, fontWeight:700, fontFamily:T.font, color:T.green,
            textShadow:`0 0 12px rgba(0,255,140,0.3)` }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Confirm Modal ──────────────────────────────────────────────────────────────
function ConfirmModal({ title, body, confirmLabel, confirmColor, onConfirm, onCancel }:{
  title:string; body:string; confirmLabel:string; confirmColor:string;
  onConfirm:()=>void; onCancel:()=>void;
}) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex',
      alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }}>
      <div style={{ background:'#0d0d12', border:`1px solid ${T.border}`, padding:28, maxWidth:360, width:'100%',
        boxShadow:`0 0 40px rgba(0,0,0,0.6)` }}>
        <p style={{ margin:'0 0 8px', fontWeight:700, fontFamily:T.font, fontSize:13, color:T.text, letterSpacing:'0.1em' }}>{title}</p>
        <p style={{ margin:'0 0 24px', fontSize:12, color:T.textMuted }}>{body}</p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'9px', border:`1px solid ${T.border}`,
            background:'transparent', color:T.textDim, cursor:'pointer', fontFamily:T.font, fontSize:10, letterSpacing:'0.15em' }}>
            CANCEL
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:'9px', border:`1px solid ${confirmColor}`,
            background:`${confirmColor}22`, color:confirmColor, cursor:'pointer', fontFamily:T.font, fontSize:10,
            letterSpacing:'0.15em', fontWeight:700 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Registrations Table ────────────────────────────────────────────────────────
function RegistrationsTable({ registrations, isSuperAdmin, onDelete, onCheckin }:{
  registrations:Registration[]; isSuperAdmin:boolean;
  onDelete?:(id:string)=>void; onCheckin?:(id:string)=>void;
}) {
  const [expanded,setExpanded]=useState<Set<string>>(new Set());
  const [confirmDelete,setConfirmDelete]=useState<string|null>(null);
  const [confirmCheckin,setConfirmCheckin]=useState<string|null>(null);
  const [checkingIn,setCheckingIn]=useState<string|null>(null);

  function toggleRow(id:string){ setExpanded(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; }); }

  if(registrations.length===0) return (
    <p style={{ color:T.textMuted, textAlign:'center', padding:48, fontFamily:T.font, fontSize:11, letterSpacing:'0.2em' }}>
      NO REGISTRATIONS FOUND
    </p>
  );

  const thStyle:React.CSSProperties={ textAlign:'left', padding:'10px 12px', fontFamily:T.font, fontSize:9,
    letterSpacing:'0.2em', color:T.goldDim, fontWeight:600, whiteSpace:'nowrap' };
  const tdStyle:React.CSSProperties={ padding:'10px 12px', color:T.textDim, fontSize:12, verticalAlign:'middle' };

  return (
    <>
      {confirmDelete && <ConfirmModal title="Delete Registration?" confirmColor={T.red} confirmLabel="DELETE"
        body="This will permanently delete the registration and all associated data."
        onConfirm={()=>{ onDelete?.(confirmDelete); setConfirmDelete(null); }} onCancel={()=>setConfirmDelete(null)} />}
      {confirmCheckin && <ConfirmModal title="Confirm Check-in?" confirmColor={T.green} confirmLabel="CHECK IN"
        body="This will mark the registration as checked in. This action cannot be undone."
        onConfirm={async()=>{ const id=confirmCheckin; setConfirmCheckin(null); setCheckingIn(id); await onCheckin?.(id); setCheckingIn(null); }}
        onCancel={()=>setConfirmCheckin(null)} />}

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.border}`, background:'#111118' }}>
              <th style={thStyle}></th>
              <th style={thStyle}>Event</th>
              <th style={thStyle}>Name / Team</th>
              <th style={thStyle}>Type</th>
              {isSuperAdmin && <th style={thStyle}>Status</th>}
              {isSuperAdmin && <th style={thStyle}>Payment</th>}
              <th style={thStyle}>Check-in</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(r=>(
              <>
                <tr key={r.id} onClick={()=>toggleRow(r.id)} style={{ borderBottom:`1px solid rgba(255,255,255,0.04)`,
                  cursor:'pointer', transition:'background 0.15s',
                  background: expanded.has(r.id) ? '#111118' : '#0d0d12' }}>
                  <td style={{ ...tdStyle, color:T.greenDim, fontSize:14, width:28 }}>{expanded.has(r.id)?'▾':'▸'}</td>
                  <td style={{ ...tdStyle, color:T.text, fontFamily:T.font, fontSize:10, letterSpacing:'0.05em' }}>{r.eventName}</td>
                  <td style={tdStyle}>
                    {r.isTeamEvent
                      ? <span style={{ color:T.text }}>{r.teamName}<br/><span style={{ color:T.textMuted, fontSize:10 }}>{r.participants.length} members</span></span>
                      : <span style={{ color:T.text }}>{r.participants[0]?.name??'-'}</span>}
                  </td>
                  <td style={{ ...tdStyle, fontFamily:T.font, fontSize:9, letterSpacing:'0.1em', color:T.textMuted }}>{r.isTeamEvent?'TEAM':'SOLO'}</td>
                  {isSuperAdmin && <td style={tdStyle}><StatusBadge status={r.status}/></td>}
                  {isSuperAdmin && <td style={{ ...tdStyle, color:T.green, fontFamily:T.font, fontSize:11 }}>{r.payment?`₹${r.payment.amount/100}`:'-'}</td>}
                  <td style={tdStyle}><GreenBadge on={r.checkedIn} label="CHECKED IN" offLabel="NOT YET"/></td>
                  <td style={{ ...tdStyle, fontSize:11, color:T.textMuted }}>{fmt(r.createdAt)}</td>
                  <td style={tdStyle} onClick={e=>e.stopPropagation()}>
                    <div style={{ display:'flex', gap:6 }}>
                      {r.status==='confirmed' && !r.checkedIn && (
                        <button disabled={checkingIn===r.id} onClick={()=>setConfirmCheckin(r.id)}
                          style={{ padding:'4px 10px', background:'rgba(0,255,140,0.1)', color:T.green,
                            border:`1px solid rgba(0,255,140,0.3)`, cursor:'pointer', fontSize:9,
                            fontFamily:T.font, letterSpacing:'0.1em', opacity:checkingIn===r.id?0.5:1 }}>
                          {checkingIn===r.id?'...':'CHECK IN'}
                        </button>
                      )}
                      {isSuperAdmin && (
                        <button onClick={()=>setConfirmDelete(r.id)}
                          style={{ padding:'4px 10px', background:T.redBg, color:T.red,
                            border:`1px solid ${T.redBorder}`, cursor:'pointer', fontSize:9,
                            fontFamily:T.font, letterSpacing:'0.1em' }}>
                          DELETE
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expanded.has(r.id) && (
                  <tr key={`${r.id}-exp`}>
                    <td colSpan={isSuperAdmin?9:7} style={{ padding:0 }}>
                      <ParticipantRows participants={r.participants}/>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── QR Scanner Tab ─────────────────────────────────────────────────────────────
function ScannerTab({ onCheckinDone }:{ onCheckinDone:()=>void }) {
  const [activeTab,setActiveTab]=useState<'camera'|'manual'>('camera');
  const [scanning,setScanning]=useState(false);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<CheckinResult|null>(null);
  const [camError,setCamError]=useState<string|null>(null);
  const [manualToken,setManualToken]=useState('');
  const scannerRef=useRef<Html5Qrcode|null>(null);
  const resetTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

  async function handleScan(token:string) {
    if(loading) return; setLoading(true); await stopScanner();
    try {
      const { data }=await axios.post(`${API}/api/checkin`,{ token:token.trim() });
      setResult({ type:'success', message:data.message, eventName:data.registration.eventName,
        teamName:data.registration.teamName, participants:data.registration.participants });
      onCheckinDone();
    } catch(err:unknown) {
      if(axios.isAxiosError(err)&&err.response){
        const b=err.response.data;
        if(b.error==='Already checked in')
          setResult({ type:'already', message:'Already checked in', checkedInAt:b.checkedInAt,
            eventName:b.registration?.eventName, teamName:b.registration?.teamName, participants:b.registration?.participants });
        else setResult({ type:'invalid', message:b.error??'Invalid or expired QR code' });
      } else setResult({ type:'invalid', message:'Network error. Try again.' });
    } finally {
      setLoading(false);
      resetTimer.current=setTimeout(()=>{ setResult(null); setManualToken(''); if(activeTab==='camera') startScanner(); },4000);
    }
  }

  async function startScanner() {
    setCamError(null);
    try {
      const qr=new Html5Qrcode('qr-reader-dashboard'); scannerRef.current=qr;
      await qr.start({ facingMode:'environment' },{ fps:10, qrbox:{ width:250, height:250 } },(text)=>handleScan(text),()=>{});
      setScanning(true);
    } catch { setCamError('Camera access denied or unavailable.'); setScanning(false); }
  }

  async function stopScanner() {
    if(scannerRef.current){ try{ await scannerRef.current.stop(); }catch{} scannerRef.current=null; }
    setScanning(false);
  }

  useEffect(()=>{
    if(activeTab==='camera') startScanner(); else stopScanner();
    return ()=>{ stopScanner(); if(resetTimer.current) clearTimeout(resetTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeTab]);

  const resultCfg = {
    success: { bg:'rgba(0,255,140,0.06)', border:'rgba(0,255,140,0.3)', color:T.green,   label:'CHECK-IN SUCCESSFUL' },
    already: { bg:T.yellowBg,             border:T.yellowBorder,        color:T.yellow,  label:'ALREADY CHECKED IN' },
    invalid: { bg:T.redBg,                border:T.redBorder,           color:T.red,     label:'INVALID QR CODE' },
  };

  return (
    <div style={{ maxWidth:520, margin:'0 auto' }}>
      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
        {(['camera','manual'] as const).map(tab=>(
          <button key={tab} onClick={()=>{ setResult(null); setActiveTab(tab); }}
            style={{ flex:1, padding:'10px', border:'none', background:'none', cursor:'pointer',
              fontFamily:T.font, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase',
              borderBottom: activeTab===tab ? `2px solid ${T.green}` : '2px solid transparent',
              color: activeTab===tab ? T.green : T.textMuted, transition:'all 0.2s' }}>
            {tab==='camera' ? 'Camera Scan' : 'Manual Token'}
          </button>
        ))}
      </div>

      {activeTab==='camera' && (
        <>
          <div style={{ background:'#000', border:`1px solid ${T.border}`, overflow:'hidden', marginBottom:12, position:'relative' }}>
            <div id="qr-reader-dashboard" style={{ width:'100%' }}/>
            {loading && (
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', display:'flex',
                alignItems:'center', justifyContent:'center', color:T.green, fontFamily:T.font, fontSize:10, letterSpacing:'0.2em' }}>
                VERIFYING...
              </div>
            )}
            {!scanning&&!loading&&!camError && (
              <div style={{ padding:'3rem 1rem', textAlign:'center', fontSize:12, color:T.textMuted }}>Initializing camera...</div>
            )}
          </div>
          {camError && (
            <div style={{ background:T.redBg, border:`1px solid ${T.redBorder}`, padding:14, fontSize:12, color:T.red, marginBottom:12 }}>
              {camError}
              <button onClick={startScanner} style={{ display:'block', marginTop:8, fontSize:10, background:'none',
                border:`1px solid ${T.redBorder}`, padding:'4px 12px', cursor:'pointer', color:T.red, fontFamily:T.font, letterSpacing:'0.1em' }}>
                RETRY
              </button>
            </div>
          )}
          {scanning&&!result&&!loading && (
            <p style={{ textAlign:'center', fontSize:10, color:T.textMuted, fontFamily:T.font, letterSpacing:'0.15em' }}>
              POINT CAMERA AT QR CODE
            </p>
          )}
        </>
      )}

      {activeTab==='manual' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <textarea value={manualToken} onChange={e=>setManualToken(e.target.value)}
            placeholder="Paste JWT token here..." rows={4}
            style={{ padding:'10px 12px', background:'rgba(255,255,255,0.03)', border:`1px solid ${T.border}`,
              color:T.text, fontSize:12, resize:'vertical', fontFamily:'monospace', outline:'none' }}/>
          <button disabled={loading||!manualToken.trim()} onClick={()=>handleScan(manualToken)}
            style={{ padding:'11px', background:loading||!manualToken.trim()?'rgba(0,255,140,0.05)':'rgba(0,255,140,0.12)',
              border:`1px solid ${loading||!manualToken.trim()?'rgba(0,255,140,0.1)':T.greenDim}`,
              color:loading||!manualToken.trim()?T.textMuted:T.green, fontFamily:T.font, fontSize:10,
              letterSpacing:'0.2em', textTransform:'uppercase', cursor:loading||!manualToken.trim()?'not-allowed':'pointer' }}>
            {loading?'VERIFYING...':'SUBMIT'}
          </button>
        </div>
      )}

      {result && (()=>{
        const c=resultCfg[result.type];
        return (
          <div style={{ background:c.bg, border:`1px solid ${c.border}`, padding:18, marginTop:16 }}>
            <p style={{ margin:'0 0 10px', fontWeight:700, color:c.color, fontFamily:T.font, fontSize:11, letterSpacing:'0.2em' }}>
              {result.type==='success'?'✅ ':result.type==='already'?'⚠️ ':'❌ '}{c.label}
            </p>
            {result.eventName && <p style={{ margin:'0 0 4px', fontSize:12, color:T.textDim }}>Event: <span style={{ color:T.text }}>{result.eventName}</span>{result.teamName?` · ${result.teamName}`:''}</p>}
            {result.checkedInAt && <p style={{ margin:'0 0 8px', fontSize:11, color:T.textMuted }}>Checked in at: {new Date(result.checkedInAt).toLocaleTimeString()}</p>}
            {result.participants?.map((p,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.06)`,
                padding:'6px 10px', marginTop:6, fontSize:12 }}>
                <span style={{ color:T.text, fontWeight:600 }}>{p.isLeader?'★ ':''}{p.name}</span>
                <span style={{ color:T.textMuted, marginLeft:10 }}>{p.college}</span>
              </div>
            ))}
            <p style={{ margin:'10px 0 0', fontSize:10, color:T.textMuted, fontFamily:T.font, letterSpacing:'0.1em' }}>
              RESETS IN 4 SECONDS...
            </p>
          </div>
        );
      })()}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [password,setPassword]=useState(()=>sessionStorage.getItem('admin_pw')?? '');
  const [role,setRole]=useState<'admin'|'superadmin'|null>(()=>sessionStorage.getItem('admin_role') as 'admin'|'superadmin'|null);
  const [stats,setStats]=useState<Stats|null>(null);
  const [registrations,setRegistrations]=useState<Registration[]>([]);
  const [loading,setLoading]=useState(false);
  const [filterStatus,setFilterStatus]=useState('');
  const [filterEvent,setFilterEvent]=useState('');
  const [filterCheckin,setFilterCheckin]=useState('');
  const [activeView,setActiveView]=useState<'registrations'|'scanner'>('registrations');

  const isSuperAdmin=role==='superadmin';
  const eventOptions=Array.from(new Set(registrations.map(r=>r.eventId)))
    .map(id=>({ id, name:registrations.find(r=>r.eventId===id)?.eventName??id }));

  const fetchData=useCallback(async(pw:string,r:string)=>{
    setLoading(true);
    try {
      if(r==='superadmin'){
        const [sRes,rRes]=await Promise.all([
          axios.get(`${API}/api/admin/stats`,{headers:hdrs(pw)}),
          axios.get(`${API}/api/admin/registrations`,{headers:hdrs(pw)}),
        ]);
        setStats(sRes.data); setRegistrations(rRes.data.registrations);
      } else {
        const res=await axios.get(`${API}/api/admin/confirmed`,{headers:hdrs(pw)});
        setRegistrations(res.data.registrations);
      }
    } catch(err){ console.error(err); } finally{ setLoading(false); }
  },[]);

  useEffect(()=>{ if(password&&role) fetchData(password,role); },[]);// eslint-disable-line

  function handleLogin(pw:string,r:string){
    sessionStorage.setItem('admin_pw',pw); sessionStorage.setItem('admin_role',r);
    setPassword(pw); setRole(r as 'admin'|'superadmin'); fetchData(pw,r);
  }
  function handleLogout(){
    sessionStorage.removeItem('admin_pw'); sessionStorage.removeItem('admin_role');
    setRole(null); setPassword(''); setRegistrations([]); setStats(null);
  }
  async function handleDelete(id:string){
    try{ await axios.delete(`${API}/api/admin/registrations/${id}`,{headers:hdrs(password)});
      setRegistrations(prev=>prev.filter(r=>r.id!==id));
      if(stats) setStats({...stats,total:stats.total-1});
    } catch{ alert('Failed to delete'); }
  }
  async function handleCheckin(id:string){
    try{ await axios.post(`${API}/api/admin/checkin`,{registrationId:id},{headers:hdrs(password)});
      setRegistrations(prev=>prev.map(r=>r.id===id?{...r,checkedIn:true,checkedInAt:new Date().toISOString()}:r));
      if(stats) setStats({...stats,checkedIn:stats.checkedIn+1});
    } catch{ alert('Check-in failed'); }
  }

  const filtered=registrations.filter(r=>{
    if(filterStatus&&r.status!==filterStatus) return false;
    if(filterEvent&&r.eventId!==filterEvent) return false;
    if(filterCheckin==='yes'&&!r.checkedIn) return false;
    if(filterCheckin==='no'&&r.checkedIn) return false;
    return true;
  });

  useEffect(()=>{
    if(!password||!role||!isSuperAdmin) return;
    const p=new URLSearchParams();
    if(filterStatus) p.set('status',filterStatus);
    if(filterEvent) p.set('eventId',filterEvent);
    setLoading(true);
    axios.get(`${API}/api/admin/registrations?${p}`,{headers:hdrs(password)})
      .then(res=>setRegistrations(res.data.registrations)).catch(console.error).finally(()=>setLoading(false));
  },[filterStatus,filterEvent,password,role,isSuperAdmin]);

  if(!role) return <LoginScreen onLogin={handleLogin}/>;

  const selectStyle:React.CSSProperties={ padding:'7px 12px', background:'#0d0d12',
    border:`1px solid ${T.border}`, color:T.textDim, fontSize:11, fontFamily:T.font,
    letterSpacing:'0.1em', outline:'none', cursor:'pointer', colorScheme:'dark' };

  return (
    <div style={{ minHeight:'100vh', background:T.bg, ...gridBg, fontFamily:'Arial,sans-serif', color:T.text }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');`}</style>

      {/* Top bar */}
      <div style={{ background:'rgba(7,7,10,0.95)', borderBottom:`1px solid ${T.border}`,
        padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:10, backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:50 }}>
        <div>
          <p style={{ margin:0, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:T.goldDim, fontFamily:T.font }}>
            Admin Dashboard
          </p>
          <h1 style={{ margin:'4px 0 0', fontSize:18, fontWeight:900, fontFamily:T.font, letterSpacing:'0.15em',
            color:'transparent', WebkitTextStroke:`1.5px ${T.greenDim}`,
            textShadow:`0 0 16px rgba(0,255,140,0.2)` }}>
            ZEITGEIST 2026
          </h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:10, color:T.textMuted, fontFamily:T.font, letterSpacing:'0.1em' }}>
            {role.toUpperCase()}
          </span>
          <button onClick={()=>setActiveView(activeView==='scanner'?'registrations':'scanner')}
            style={{ padding:'7px 16px', border:`1px solid ${activeView==='scanner'?T.greenDim:T.border}`,
              background: activeView==='scanner'?'rgba(0,255,140,0.12)':'transparent',
              color: activeView==='scanner'?T.green:T.textDim, cursor:'pointer',
              fontFamily:T.font, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', transition:'all 0.2s' }}>
            {activeView==='scanner'?'Registrations':'QR Scanner'}
          </button>
          <button onClick={handleLogout}
            style={{ padding:'7px 16px', border:`1px solid ${T.border}`, background:'transparent',
              color:T.textMuted, cursor:'pointer', fontFamily:T.font, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 16px' }}>
        {isSuperAdmin&&stats&&activeView==='registrations' && <StatsBar stats={stats}/>}

        {activeView==='scanner' ? (
          <ScannerTab onCheckinDone={()=>fetchData(password,role!)}/>
        ) : (
          <>
            {/* Filters */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:16, alignItems:'center' }}>
              <select value={filterEvent} onChange={e=>setFilterEvent(e.target.value)} style={selectStyle}>
                <option value="">All Events</option>
                {eventOptions.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              {isSuperAdmin && (
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selectStyle}>
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              )}
              <select value={filterCheckin} onChange={e=>setFilterCheckin(e.target.value)} style={selectStyle}>
                <option value="">All Check-ins</option>
                <option value="yes">Checked In</option>
                <option value="no">Not Checked In</option>
              </select>
              <span style={{ marginLeft:'auto', fontSize:10, color:T.textMuted, fontFamily:T.font, letterSpacing:'0.1em' }}>
                {loading?'LOADING...': `${filtered.length} REGISTRATIONS`}
              </span>
              {isSuperAdmin && (
                <button onClick={()=>exportCSV(filtered)}
                  style={{ padding:'7px 16px', background:'rgba(255,215,0,0.08)', border:`1px solid ${T.goldDim}`,
                    color:T.gold, fontFamily:T.font, fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>
                  Export CSV
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ background:'#0d0d12', border:`1px solid ${T.border}`, overflow:'hidden' }}>
              {loading
                ? <p style={{ textAlign:'center', padding:48, color:T.textMuted, fontFamily:T.font, fontSize:10, letterSpacing:'0.2em' }}>LOADING...</p>
                : <RegistrationsTable registrations={filtered} isSuperAdmin={isSuperAdmin} onDelete={handleDelete} onCheckin={handleCheckin}/>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
