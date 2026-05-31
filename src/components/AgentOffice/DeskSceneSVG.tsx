import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

interface Props {
  agentId:   DepartmentId
  accent:    string
  status:    AgentStatus
  roomLabel: string
}

// ── Shared palette ─────────────────────────────
const SKIN   = '#c8a070'
const HAIR   = '#261808'
const DESK_T = '#1c1208'
const DESK_F = '#130e05'
const CHAIR  = '#0c1525'
const MON_BZ = '#080d1c'
const MON_SC = '#050810'

export default function DeskSceneSVG({ agentId, accent, status, roomLabel }: Props) {
  const isActive  = status === 'working' || status === 'needs_review'
  const isBlocked = status === 'blocked'  || status === 'failed'
  const dotColor  = isBlocked ? '#ff5252' : isActive ? accent : '#2a3560'

  return (
    <svg viewBox="0 0 280 150" width="100%" height="150" style={{ display: 'block', userSelect: 'none' }}>

      {/* ── 1. Room background ── */}
      <rect width="280" height="88"  fill="#060c1a"/>
      <rect y="88"  width="280" height="62" fill="#04070f"/>
      <line x1="0" y1="88" x2="280" y2="88" stroke="#0c1428" strokeWidth="0.5"/>
      {/* Subtle dot grid on floor */}
      {[0,1,2,3,4,5,6,7].map(c => [0,1,2].map(r => (
        <circle key={`${c}-${r}`} cx={14+c*37} cy={98+r*18} r={0.7} fill="#0b1424"/>
      )))}

      {/* ── 2. Chair back (drawn early — desk will overlap it) ── */}
      <rect x="117" y="94" width="46" height="12" fill={CHAIR} rx="1"/>

      {/* ── 3. Desk surface ── */}
      {/* Top face with perspective taper */}
      <polygon points="6,91 274,91 270,82 10,82" fill={DESK_T}/>
      {/* Subtle accent edge glow */}
      <line x1="10" y1="82" x2="270" y2="82" stroke={`${accent}18`} strokeWidth="1"/>
      {/* Front face */}
      <rect x="6" y="91" width="268" height="9" fill={DESK_F}/>
      {/* Side slivers */}
      <polygon points="6,82 6,100 10,100 10,91" fill="#0e0a03"/>
      <polygon points="274,82 274,100 270,100 270,91" fill="#0e0a03"/>

      {/* ── 4. Desk legs + chair seat ── */}
      <rect x="13"  y="100" width="7" height="36" fill="#0b0803"/>
      <rect x="260" y="100" width="7" height="36" fill="#0b0803"/>
      <rect x="110" y="101" width="60" height="7" fill={CHAIR} rx="1"/>

      {/* ── 5. Monitor stand ── */}
      <rect x="132" y="81" width="16" height="8" fill="#161c2c"/>
      <rect x="122" y="89" width="36" height="2" fill="#161c2c"/>

      {/* ── 6. Main monitor ── */}
      <rect x="88"  y="14" width="104" height="68" fill={MON_BZ} rx="2"/>
      <rect x="91"  y="17" width="98"  height="62" fill={MON_SC}/>
      {/* Very faint screen glow spilling toward viewer */}
      <rect x="91" y="17" width="98" height="62" fill={accent} opacity="0.03"/>
      {/* Screen content */}
      <ScreenContent agentId={agentId} accent={accent} x={95} y={21} w={90} h={54}/>
      {/* Active pixel in corner */}
      {isActive && (
        <rect x="92" y="18" width="3" height="3" fill={accent} opacity="0.55"
          style={{ animation: 'blink 1s step-end infinite' }}/>
      )}

      {/* ── 7. Keyboard ── */}
      <rect x="97" y="84" width="86" height="7" fill="#111726" rx="1"/>
      <rect x="99" y="85" width="82" height="4" fill="#0c1220"/>
      {/* Key row hints */}
      {[0,1].map(r => (
        <rect key={r} x={101+r*2} y={86+r} width={78-r*4} height="1"
          fill="#18203a" opacity="0.6"/>
      ))}

      {/* ── 8. Arms resting on desk ── */}
      <rect x="83"  y="83" width="32" height="7" fill={SKIN} rx="3"/>
      <rect x="165" y="83" width="32" height="7" fill={SKIN} rx="3"/>

      {/* ── 9. Torso / shirt visible above desk ── */}
      <rect x="119" y="76" width="42" height="7" fill={accent} rx="1" opacity="0.85"/>
      {/* Collar flaps */}
      <rect x="126" y="63" width="9" height="9" fill={accent} opacity="0.8"/>
      <rect x="145" y="63" width="9" height="9" fill={accent} opacity="0.8"/>
      {/* Neck */}
      <rect x="131" y="63" width="18" height="13" fill={SKIN}/>

      {/* ── 10. Head (drawn after desk — appears above it) ── */}
      {/* Side hair / side burns */}
      <rect x="122" y="44" width="4"  height="16" fill={HAIR}/>
      <rect x="154" y="44" width="4"  height="16" fill={HAIR}/>
      {/* Main head */}
      <rect x="123" y="44" width="34" height="22" fill={SKIN} rx="1"/>
      {/* Hair on top */}
      <rect x="123" y="44" width="34" height="8"  fill={HAIR} rx="1"/>
      {/* Ears */}
      <rect x="120" y="50" width="3" height="9" fill={SKIN}/>
      <rect x="157" y="50" width="3" height="9" fill={SKIN}/>
      {/* Eyes */}
      <rect x="130" y="55" width="5" height="3" fill="#281800" rx="0.5"/>
      <rect x="145" y="55" width="5" height="3" fill="#281800" rx="0.5"/>
      {/* Monitor light tint on face */}
      <rect x="123" y="44" width="34" height="22" fill={accent} opacity="0.07" rx="1"/>

      {/* ── 11. Role-specific desk props ── */}
      <DeskProps agentId={agentId} accent={accent}/>

      {/* ── 12. Room label + status dot ── */}
      <text x="7" y="12" fontFamily="monospace" fontSize="7"
        fill={`${accent}55`} letterSpacing="1.5">{roomLabel}</text>
      <circle cx="271" cy="10" r="3.5" fill={dotColor}/>
      {isActive && (
        <circle cx="271" cy="10" r="5.5" fill={dotColor} opacity="0.2"
          style={{ animation: 'blink 2s ease-in-out infinite' }}/>
      )}

    </svg>
  )
}

// ─────────────────────────────────────────────
// Screen content — role-specific
// ─────────────────────────────────────────────

interface SCProps { agentId: DepartmentId; accent: string; x: number; y: number; w: number; h: number }

function ScreenContent({ agentId, accent, x, y, w, h }: SCProps) {
  switch (agentId) {

    case 'ceo-director': {
      const rows = [
        { label: 'REVENUE',   pct: 75 },
        { label: 'PROFIT',    pct: 62 },
        { label: 'ROAS AVG',  pct: 90 },
        { label: 'CAMPAIGNS', pct: 50 },
      ]
      return (
        <g>
          <rect x={x} y={y} width={w} height={7} fill="#080e1c"/>
          <text x={x+3} y={y+5} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">DASHBOARD</text>
          {rows.map((r, i) => (
            <g key={r.label} transform={`translate(0,${i*11})`}>
              <text x={x+2} y={y+16} fontFamily="monospace" fontSize="4" fill="#2a3560">{r.label}</text>
              <rect x={x+40} y={y+11} width={w-42} height={4} fill="#080e1c"/>
              <rect x={x+40} y={y+11} width={(w-42)*r.pct/100} height={4}
                fill={r.pct >= 80 ? accent : '#ffb300'} opacity="0.85"/>
            </g>
          ))}
          <text x={x+w-14} y={y+h-4} fontFamily="monospace" fontSize="14"
            fill={`${accent}55`}>✓</text>
        </g>
      )
    }

    case 'product-analyst': {
      const bars = [38, 62, 48, 84, 72]
      const maxH = 38
      const bw   = 13
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">TREND ANALYSIS</text>
          {bars.map((v, i) => (
            <rect key={i}
              x={x+4+i*17} y={y+h-6-v*maxH/100}
              width={bw} height={v*maxH/100}
              fill={i===bars.length-1 ? accent : `${accent}55`}/>
          ))}
          <polyline
            points={bars.map((v,i) => `${x+10+i*17},${y+h-6-v*maxH/100}`).join(' ')}
            stroke={accent} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
          <line x1={x+2} y1={y+h-6} x2={x+w-2} y2={y+h-6}
            stroke="#1a2540" strokeWidth="0.5"/>
        </g>
      )
    }

    case 'content-studio': {
      const lw = [86,68,80,54,76,62,80]
      return (
        <g>
          {lw.map((pw, i) => (
            <rect key={i} x={x+3} y={y+4+i*7} width={pw*w/100} height={3}
              fill={i===0 ? accent : `${accent}${i%2===0?'66':'33'}`}/>
          ))}
          {/* Timeline */}
          <rect x={x}   y={y+h-10} width={w} height={8}   fill="#07090e"/>
          <rect x={x+2} y={y+h-9}  width={30} height={5}  fill={`${accent}66`}/>
          <rect x={x+33} y={y+h-10} width={2} height={8}  fill={accent}/>
          {/* Record dot */}
          <circle cx={x+w-8} cy={y+8} r={4} fill="#ff525222"/>
          <circle cx={x+w-8} cy={y+8} r={2} fill="#ff5252"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}/>
        </g>
      )
    }

    case 'social-community-manager': {
      const platforms = [
        { lbl: 'FB',  bg: '#1877F233' },
        { lbl: 'IG',  bg: '#E1306C33' },
        { lbl: 'TK',  bg: '#ffffff11' },
      ]
      return (
        <g>
          {platforms.map((p, i) => (
            <g key={p.lbl}>
              <rect x={x+i*31} y={y+1} width={28} height={11} fill={p.bg} rx="1"/>
              <text x={x+i*31+9} y={y+9} fontFamily="monospace" fontSize="5" fill={accent}>{p.lbl}</text>
            </g>
          ))}
          {[0,1,2].map(i => (
            <g key={i} transform={`translate(0,${i*13})`}>
              <rect x={x+1}  y={y+15} width={4}  height={4} fill="#1a2540" rx="1"/>
              <rect x={x+8}  y={y+15} width={52} height={2} fill={`${accent}44`}/>
              <rect x={x+8}  y={y+18} width={34} height={1} fill="#1a2540"/>
              <text x={x+w-20} y={y+21} fontFamily="monospace" fontSize="4.5"
                fill={`${accent}88`}>♥{(i+1)*148}</text>
            </g>
          ))}
        </g>
      )
    }

    case 'ops-review': {
      const items = [
        { ok: true,  w: 54 },
        { ok: true,  w: 48 },
        { ok: false, w: 38 },
        { ok: true,  w: 50 },
        { ok: null,  w: 42 },
      ]
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">COMPLIANCE</text>
          {items.map((item, i) => (
            <g key={i} transform={`translate(0,${i*9+10})`}>
              <rect x={x+2} y={y+2} width={6} height={6}
                fill="#060c18" stroke="#1a2540" strokeWidth="0.5" rx="0.5"/>
              {item.ok === true  && <text x={x+2.5} y={y+7} fontSize="5.5" fill="#00ff9f">✓</text>}
              {item.ok === false && <text x={x+2.5} y={y+7} fontSize="5.5" fill="#ff5252">✗</text>}
              <rect x={x+11} y={y+4} width={item.w} height={2}
                fill={item.ok === true ? '#00ff9f55' : item.ok === false ? '#ff525255' : '#1a2540'}/>
            </g>
          ))}
        </g>
      )
    }

    case 'finance-controller': {
      const ch = [
        { lbl: 'TT', val: 80, color: '#00e5ff' },
        { lbl: 'SH', val: 62, color: '#ff5722' },
        { lbl: 'LZ', val: 22, color: '#2979ff' },
      ]
      const maxH = 36
      return (
        <g>
          {/* ROAS */}
          <text x={x+w-38} y={y+22} fontFamily="monospace" fontSize="18"
            fill={accent} fontWeight="bold">4.6x</text>
          <text x={x+w-30} y={y+29} fontFamily="monospace" fontSize="4.5" fill="#2a3560">ROAS</text>
          {/* Bars */}
          {ch.map((c, i) => (
            <g key={c.lbl}>
              <rect x={x+4+i*24} y={y+h-6-c.val*maxH/100}
                width={18} height={c.val*maxH/100} fill={c.color} opacity="0.8"/>
              <text x={x+6+i*24} y={y+h-1} fontFamily="monospace" fontSize="4" fill="#2a3560">{c.lbl}</text>
            </g>
          ))}
          <line x1={x+2} y1={y+h-6} x2={x+78} y2={y+h-6} stroke="#1a2540" strokeWidth="0.5"/>
        </g>
      )
    }
  }
}

// ─────────────────────────────────────────────
// Desk props — role-specific objects on the desk
// ─────────────────────────────────────────────

function DeskProps({ agentId, accent }: { agentId: DepartmentId; accent: string }) {
  switch (agentId) {

    case 'ceo-director':
      return (
        <g>
          {/* Document stack — right */}
          <rect x="220" y="83" width="40" height="2" fill="#d0d8e8" opacity="0.4"/>
          <rect x="222" y="81" width="36" height="2" fill="#c0c8d8" opacity="0.35"/>
          <rect x="218" y="85" width="44" height="2" fill="#b0b8c8" opacity="0.3"/>
          {/* Coffee mug — left */}
          <rect x="21"  y="77" width="16" height="12" fill="#1a2030" rx="1"/>
          <rect x="23"  y="79" width="12" height={8}  fill="#2a3548"/>
          <rect x="37"  y="79" width={4}  height={8}  fill="none"
            stroke="#1a2030" strokeWidth="1.5"/>
          <path d="M27,77 Q28.5,74 27,71" stroke="#ffffff18" strokeWidth="1" fill="none"/>
          <path d="M31,77 Q32.5,73 31,70" stroke="#ffffff14" strokeWidth="1" fill="none"/>
        </g>
      )

    case 'product-analyst':
      return (
        <g>
          {/* Sticky notes — right */}
          <rect x="222" y="80" width="28" height="8" fill="#ffee5533" rx="1"/>
          <rect x="226" y="83" width="24" height="8" fill="#ffdd4433" rx="1"/>
          <rect x="222" y="81" width="20" height="1" fill="#2a1a0033"/>
          <rect x="222" y="83" width="16" height="1" fill="#2a1a0033"/>
          {/* Magnifying glass — left */}
          <circle cx="33" cy="82" r="7" fill="none" stroke={`${accent}44`} strokeWidth="2"/>
          <circle cx="33" cy="82" r="4" fill={`${accent}0d`}/>
          <line x1="38" y1="87" x2="44" y2="93"
            stroke={`${accent}44`} strokeWidth="2.5" strokeLinecap="round"/>
        </g>
      )

    case 'content-studio':
      return (
        <g>
          {/* Clapperboard — left */}
          <rect x="19" y="76" width="28" height="18" fill="#141414" rx="1"/>
          <rect x="19" y="76" width="28" height="6"  fill="#222"/>
          {[0,1,2,3,4].map(i => (
            <line key={i}
              x1={19+i*6} y1="76" x2={22+i*6} y2="82"
              stroke={`${accent}99`} strokeWidth="1.5"/>
          ))}
          <rect x="21" y="85" width="24" height="2" fill="#2a2830" opacity="0.8"/>
          <rect x="21" y="88" width="18" height="2" fill="#2a2830" opacity="0.6"/>
          {/* Headphones — right */}
          <path d="M225,83 Q236,75 248,83"
            stroke={`${accent}66`} strokeWidth="2" fill="none"/>
          <rect x="221" y="82" width="5" height="8" fill={`${accent}44`} rx="1"/>
          <rect x="248" y="82" width="5" height="8" fill={`${accent}44`} rx="1"/>
        </g>
      )

    case 'social-community-manager':
      return (
        <g>
          {/* Smartphone — right */}
          <rect x="223" y="74" width="20" height="33" fill="#0c1525" rx="2"
            stroke={`${accent}55`} strokeWidth="1"/>
          <rect x="225" y="77" width="16" height="24" fill="#060a14"/>
          <rect x="226" y="79" width="14" height="2"  fill={`${accent}66`}/>
          <rect x="226" y="82" width={9}  height="1"  fill="#1a2540"/>
          <rect x="226" y="85" width="14" height="2"  fill="#ff408144"/>
          <rect x="226" y="88" width={9}  height="1"  fill="#1a2540"/>
          <circle cx="233" cy="97" r="2" fill="#1a2540"/>
          {/* Heart badge */}
          <text x="214" y="78" fontSize="9" fill="#ff408177">♥</text>
          {/* Small tablet — left */}
          <rect x="20" y="78" width="30" height="20" fill="#0c1525" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="22" y="80" width="26" height="16" fill="#060a14"/>
          <rect x="23" y="82" width="24" height="2"  fill={`${accent}44`}/>
          <rect x="23" y="85" width="16" height="1"  fill="#1a2540"/>
          <rect x="23" y="87" width="20" height="1"  fill="#1a2540"/>
        </g>
      )

    case 'ops-review':
      return (
        <g>
          {/* Clipboard — left */}
          <rect x="18" y="75" width="26" height="30" fill="#0c1020" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="24" y="72" width="14" height="5"  fill="#1a2030" rx="1"/>
          {[0,1,2,3,4].map(i => (
            <g key={i}>
              <rect x="21" y={80+i*4} width="4" height="3"
                fill="#060c18" stroke="#1a2030" strokeWidth="0.4"/>
              <rect x="27" y={81+i*4} width={[14,10,14,8,12][i]} height="1"
                fill={i<2 ? '#00ff9f55' : i===2 ? '#ff525555' : '#1a2540'}/>
            </g>
          ))}
          {/* Stamp — right */}
          <rect x="224" y="82" width="30" height="13" fill="#ff525211"
            stroke="#ff525444" strokeWidth="0.8" rx="1"/>
          <text x="226" y="91" fontFamily="monospace" fontSize="5.5" fill="#ff5252aa">REVIEW</text>
        </g>
      )

    case 'finance-controller':
      return (
        <g>
          {/* Calculator — left */}
          <rect x="17" y="76" width="26" height="30" fill="#0c1020" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="19" y="78" width="22" height="8"  fill="#040810"/>
          <text x="21" y="84" fontFamily="monospace" fontSize="5" fill={`${accent}99`}>4.6x</text>
          {[0,1,2].map(row => [0,1,2,3].map(col => (
            <rect key={`${row}-${col}`}
              x={20+col*5} y={88+row*5} width={4} height={4}
              fill="#09101e" rx="0.5"/>
          )))}
          {/* Report stack — right */}
          <rect x="220" y="82" width="38" height="2" fill="#c8d0e0" opacity="0.28"/>
          <rect x="222" y="79" width="34" height="3" fill="#c8d0e0" opacity="0.22"/>
          <rect x="218" y="85" width="42" height="2" fill="#c8d0e0" opacity="0.18"/>
          <rect x="220" y="82" width={9} height="2"  fill={accent}   opacity="0.45"/>
        </g>
      )
  }
}
