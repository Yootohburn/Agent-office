import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

interface Props {
  agentId:   DepartmentId
  accent:    string
  status:    AgentStatus
  roomLabel: string
}

// ── Shared palette ─────────────────────────────
const DESK_T = '#1c1208'
const DESK_F = '#130e05'
const CHAIR  = '#0c1525'
const MON_BZ = '#080d1c'
const MON_SC = '#050810'

// ── Role short-label embedded in scene ─────────
const ROLE_LABEL: Record<DepartmentId, string> = {
  'product-research':    'RESEARCH',
  'offer-analyst':       'PROFIT LAB',
  'content-strategy':    'STRATEGY',
  'script-writer':       'SCRIPT',
  'creative-production': 'CREATIVE',
  'social-performance':  'SOCIAL',
}

// ── Status strip color ─────────────────────────
function statusStripColor(status: AgentStatus, accent: string): string {
  switch (status) {
    case 'working':      return accent
    case 'needs_review': return '#ffb300'
    case 'blocked':
    case 'failed':       return '#ff5252'
    case 'done':         return '#00ff9f'
    case 'waiting':      return '#2a3560'
    case 'idle':
    default:             return '#1a2540'
  }
}

export default function DeskSceneSVG({ agentId, accent, status, roomLabel }: Props) {
  const isActive  = status === 'working' || status === 'needs_review'
  const isBlocked = status === 'blocked'  || status === 'failed'
  const isDone    = status === 'done'
  const dotColor  = isBlocked ? '#ff5252' : isActive ? accent : isDone ? '#00ff9f' : '#2a3560'
  const stripColor = statusStripColor(status, accent)

  return (
    <svg viewBox="0 0 280 190" width="100%" height="190" style={{ display: 'block', userSelect: 'none' }}>

      <defs>
        <radialGradient id={`glow-${agentId}`} cx="50%" cy="55%" r="52%">
          <stop offset="0%"   stopColor={accent} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── 1. Room background ── */}
      <rect width="280" height="10" fill="#040810"/>
      <rect y="10" width="280" height="94" fill="#060c1a"/>
      {/* Wall scanlines */}
      {[14,22,30,38,46,54,62,70,78,86,94,100].map(yy => (
        <line key={yy} x1="0" y1={yy} x2="280" y2={yy}
          stroke="#070d1c" strokeWidth="0.5" opacity="0.55"/>
      ))}
      {/* Perspective corner lines */}
      <line x1="0"   y1="10" x2="140" y2="104" stroke="#090f20" strokeWidth="0.6"/>
      <line x1="280" y1="10" x2="140" y2="104" stroke="#090f20" strokeWidth="0.6"/>
      {/* Screen glow on wall */}
      <rect x="76" y="10" width="128" height="94" fill={`url(#glow-${agentId})`}/>
      {/* Baseboard */}
      <rect y="100" width="280" height="4" fill="#080f1d"/>
      <line x1="0" y1="100" x2="280" y2="100" stroke="#0c1428" strokeWidth="0.5"/>
      {/* Floor */}
      <rect y="104" width="280" height="86" fill="#04070f"/>
      {/* Floor tiles */}
      {[0,1,2,3,4,5,6].map(col => [0,1,2,3,4].map(row => (
        <rect key={`${col}-${row}`}
          x={col*40} y={104+row*17}
          width={39} height={16}
          fill="none" stroke="#070d1a" strokeWidth="0.4"/>
      )))}

      {/* ── 2. Wall decor panels ── */}
      <WallDecor agentId={agentId} accent={accent}/>

      {/* ── 3. Chair back ── */}
      <rect x="113" y="108" width="54" height="20" fill={CHAIR} rx="1"/>
      <rect x="113" y="108" width="54" height="4"  fill="#0f1c32" rx="1"/>
      <line x1="140" y1="112" x2="140" y2="128" stroke="#0a1525" strokeWidth="0.8"/>

      {/* ── 4. Desk surface ── */}
      <polygon points="6,104 274,104 270,96 10,96" fill={DESK_T}/>
      {[98.5,100.5,102.5].map(yy => (
        <line key={yy} x1="12" y1={yy} x2="268" y2={yy-0.5}
          stroke="#0e0b04" strokeWidth="0.5" opacity="0.6"/>
      ))}
      <line x1="10" y1="96" x2="270" y2="96" stroke={`${accent}1e`} strokeWidth="1"/>
      <rect x="6" y="104" width="268" height="10" fill={DESK_F}/>
      <polygon points="6,96 6,114 10,114 10,104" fill="#0e0a03"/>
      <polygon points="274,96 274,114 270,114 270,104" fill="#0e0a03"/>

      {/* ── 5. Desk legs + chair seat ── */}
      <rect x="13"  y="114" width="7" height="50" fill="#0b0803"/>
      <rect x="260" y="114" width="7" height="50" fill="#0b0803"/>
      <rect x="106" y="114" width="68" height="8" fill={CHAIR} rx="1"/>
      <rect x="104" y="112" width="6" height="14" fill="#0c1830" rx="1"/>
      <rect x="170" y="112" width="6" height="14" fill="#0c1830" rx="1"/>

      {/* ── 6. Monitor stand ── */}
      <rect x="132" y="92" width="16" height="9" fill="#161c2c"/>
      <rect x="120" y="99" width="40" height="2" fill="#161c2c"/>

      {/* ── 7. Main monitor ── */}
      <rect x="88"  y="14" width="104" height="78" fill={MON_BZ} rx="2"/>
      <rect x="91"  y="17" width="98"  height="72" fill={MON_SC}/>
      <rect x="91"  y="17" width="98"  height="72" fill={accent} opacity="0.03"/>
      {/* Screen reflection */}
      <rect x="93"  y="19" width="24"  height="9"  fill="#ffffff" opacity="0.018"/>
      {/* Screen content */}
      <ScreenContent agentId={agentId} accent={accent} x={95} y={21} w={90} h={64}/>
      {/* Active corner pixel */}
      {isActive && (
        <rect x="92" y="18" width="3" height="3" fill={accent} opacity="0.6"
          style={{ animation: 'blink 1s step-end infinite' }}/>
      )}
      {/* Webcam */}
      <circle cx="140" cy="16" r="2"  fill="#07091a"/>
      <circle cx="140" cy="16" r="0.8" fill={isActive ? `${accent}aa` : '#111826'}/>
      {/* Power LED */}
      <circle cx="189" cy="91" r="1.3"
        fill={isBlocked ? '#ff5252dd' : isActive ? `${accent}dd` : isDone ? '#00ff9faa' : '#1a2540'}/>
      {isActive && (
        <circle cx="189" cy="91" r="2.4" fill={accent} opacity="0.15"
          style={{ animation: 'blink 2s ease-in-out infinite' }}/>
      )}

      {/* ── 8. Keyboard ── */}
      <rect x="95" y="97" width="90" height="7" fill="#111726" rx="1"/>
      <rect x="97" y="98" width="86" height="5" fill="#0c1220"/>
      {[0,1].map(r => (
        <rect key={r} x={99+r*2} y={99+r} width={82-r*4} height="1"
          fill="#18203a" opacity="0.6"/>
      ))}
      <rect x="113" y="103" width="54" height="1.5" fill="#141c30"/>

      {/* ── 9. Character sprite rendered outside SVG by AgentDeskSprite ── */}

      {/* ── 10. Role-specific desk props ── */}
      <DeskProps agentId={agentId} accent={accent}/>

      {/* ── 11. Room label + status dot ── */}
      <text x="7" y="12" fontFamily="monospace" fontSize="7"
        fill={`${accent}55`} letterSpacing="1.5">{roomLabel}</text>
      <circle cx="271" cy="10" r="3.5" fill={dotColor}/>
      {isActive && (
        <circle cx="271" cy="10" r="5.5" fill={dotColor} opacity="0.2"
          style={{ animation: 'blink 2s ease-in-out infinite' }}/>
      )}

      {/* ── 12. Status strip at bottom ── */}
      <rect x="0" y="186" width="280" height="4" fill={`${stripColor}66`}/>
      <rect x="0" y="186" width="280" height="1" fill={`${stripColor}aa`}/>
      {/* Role label above strip */}
      <text x="7" y="184" fontFamily="monospace" fontSize="7"
        fill={`${accent}66`} letterSpacing="1">{ROLE_LABEL[agentId]}</text>
      {/* Status label right side */}
      {isBlocked && (
        <text x="273" y="184" fontFamily="monospace" fontSize="7" fill="#ff5252aa"
          textAnchor="end" letterSpacing="0.5">BLOCKED</text>
      )}
      {isDone && (
        <text x="273" y="184" fontFamily="monospace" fontSize="7" fill="#00ff9faa"
          textAnchor="end" letterSpacing="0.5">DONE ✓</text>
      )}
      {status === 'needs_review' && (
        <text x="273" y="184" fontFamily="monospace" fontSize="7" fill="#ffb300aa"
          textAnchor="end" letterSpacing="0.5">REVIEW ⚠</text>
      )}

    </svg>
  )
}

// ─────────────────────────────────────────────
// Wall decor — icon-based panels, no tiny text
// ─────────────────────────────────────────────

function WallDecor({ agentId, accent }: { agentId: DepartmentId; accent: string }) {
  // Left panel: x=14, y=22, w=44, h=36
  // Right panel: x=222, y=22, w=44, h=36
  const LX=14, LY=22, LW=44, LH=36
  const RX=222, RY=22, RW=44, RH=36

  const PanelBg = ({ x, y, w, h }: { x:number; y:number; w:number; h:number }) => (
    <rect x={x} y={y} width={w} height={h} fill="#06090e"
      stroke={`${accent}28`} strokeWidth="0.6" rx="1"/>
  )

  switch (agentId) {

    case 'product-research':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: score bars for 4 products */}
          <text x={LX+3} y={LY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">SCORE</text>
          {[88,74,91,79].map((pct, i) => (
            <g key={i}>
              <text x={LX+2}  y={LY+16+i*6} fontFamily="monospace" fontSize="4" fill="#2a3560">P{i+1}</text>
              <rect x={LX+12} y={LY+13+i*6} width={28} height={3.5} fill="#0c1428"/>
              <rect x={LX+12} y={LY+13+i*6} width={28*pct/100} height={3.5}
                fill={pct>=85 ? accent : `${accent}66`}/>
            </g>
          ))}
          {/* Right: database cylinder */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">DATA</text>
          <ellipse cx={RX+22} cy={RY+17} rx={13} ry={4}
            fill={`${accent}0a`} stroke={`${accent}55`} strokeWidth="0.8"/>
          <rect x={RX+9} y={RY+17} width={26} height={10} fill={`${accent}07`}
            stroke={`${accent}33`} strokeWidth="0.5"/>
          <ellipse cx={RX+22} cy={RY+27} rx={13} ry={4}
            fill={`${accent}0a`} stroke={`${accent}44`} strokeWidth="0.7"/>
          <text x={RX+5} y={RY+35} fontFamily="monospace" fontSize="4" fill="#2a3560">132 SKUs</text>
        </g>
      )

    case 'offer-analyst':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: large ฿ icon + target */}
          <text x={LX+10} y={LY+24} fontFamily="monospace" fontSize="20" fill={`${accent}55`}>฿</text>
          <text x={LX+3}  y={LY+34} fontFamily="monospace" fontSize="5" fill={`${accent}aa`}>5.0x ROAS</text>
          {/* Right: 4-bar profit chart */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">PROFIT</text>
          {[52,38,65,44].map((v, i) => (
            <rect key={i}
              x={RX+4+i*10} y={RY+36-v*22/100}
              width={8} height={v*22/100}
              fill={i===2 ? accent : `${accent}55`}/>
          ))}
          <line x1={RX+2} y1={RY+36} x2={RX+42} y2={RY+36}
            stroke="#1a2540" strokeWidth="0.5"/>
        </g>
      )

    case 'content-strategy':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: platform tags */}
          <text x={LX+3} y={LY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">CHANNEL</text>
          <rect x={LX+3}  y={LY+11} width={12} height={8} fill="#ffffff14" rx="1"/>
          <text x={LX+5}  y={LY+17} fontFamily="monospace" fontSize="5" fill={accent}>TK</text>
          <rect x={LX+17} y={LY+11} width={12} height={8} fill="#ff572228" rx="1"/>
          <text x={LX+19} y={LY+17} fontFamily="monospace" fontSize="5" fill="#ff7043">SH</text>
          <rect x={LX+31} y={LY+11} width={12} height={8} fill="#2979ff28" rx="1"/>
          <text x={LX+33} y={LY+17} fontFamily="monospace" fontSize="5" fill="#64b5f6">LZ</text>
          {/* Mix bars */}
          {[['TK',14],[' SH',9],['LZ',7]].map(([,bw], i) => (
            <g key={i}>
              <rect x={LX+3}  y={LY+22+i*5} width={38} height={3} fill="#0c1428"/>
              <rect x={LX+3}  y={LY+22+i*5} width={Number(bw)*2} height={3}
                fill={[accent,'#ff7043','#64b5f6'][i]}  opacity="0.6"/>
            </g>
          ))}
          {/* Right: hook framework bullets */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">HOOKS</text>
          {['PROBLEM','WORTH IT','BEFORE/AFT','REVEAL'].map((fw, i) => (
            <g key={fw}>
              <rect x={RX+3} y={RY+11+i*6} width={3.5} height={3.5} fill={`${accent}55`} rx="0.5"/>
              <text x={RX+9} y={RY+15+i*6} fontFamily="monospace" fontSize="4" fill="#2a4070">{fw}</text>
            </g>
          ))}
        </g>
      )

    case 'script-writer':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: 4-frame storyboard grid */}
          <text x={LX+3} y={LY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">STORY</text>
          {[[0,0],[1,0],[0,1],[1,1]].map(([c,r], i) => (
            <rect key={i}
              x={LX+4+c*20} y={LY+12+r*11}
              width={17} height={8}
              fill={i===0 ? `${accent}22` : '#080e1c'}
              stroke={i===0 ? accent : `${accent}33`}
              strokeWidth="0.5" rx="0.5"/>
          ))}
          {/* Scene numbers */}
          {['1','2','3','4'].map((n, i) => (
            <text key={n}
              x={LX+6+([0,1,0,1][i])*20}
              y={LY+18+([0,0,1,1][i])*11}
              fontFamily="monospace" fontSize="4" fill={`${accent}55`}>{n}</text>
          ))}
          {/* Right: timeline bars */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">TIMELINE</text>
          {['HOOK','DEMO','PROOF','CTA'].map((s, i) => (
            <g key={s}>
              <text x={RX+2} y={RY+16+i*6} fontFamily="monospace" fontSize="4" fill="#2a4070">{s}</text>
              <rect x={RX+20} y={RY+13+i*6}
                width={[18,10,14,8][i]} height="3"
                fill={i===0 ? accent : `${accent}44`}/>
            </g>
          ))}
        </g>
      )

    case 'creative-production':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: thumbnail layout frame */}
          <text x={LX+3} y={LY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">LAYOUT</text>
          {/* Main frame */}
          <rect x={LX+3}  y={LY+11} width={24} height={18}
            fill={`${accent}18`} stroke={accent} strokeWidth="0.7" rx="0.5"/>
          {/* Thumb 1 */}
          <rect x={LX+29} y={LY+11} width={12} height={8}
            fill={`${accent}0f`} stroke={`${accent}44`} strokeWidth="0.5" rx="0.5"/>
          {/* Thumb 2 */}
          <rect x={LX+29} y={LY+21} width={12} height={8}
            fill="#080e1c" stroke={`${accent}33`} strokeWidth="0.5" rx="0.5"/>
          {/* Checkmark on main */}
          <text x={LX+11} y={LY+23} fontFamily="monospace" fontSize="8" fill={accent} opacity="0.5">✓</text>
          {/* Right: color swatches */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">PALETTE</text>
          {[accent,'#ff4081','#ffb300','#a855f7','#00e5ff'].map((c, i) => (
            <rect key={i} x={RX+2+i*8} y={RY+12} width="7" height="12" fill={c} rx="0.5"/>
          ))}
          <text x={RX+3} y={RY+32} fontFamily="monospace" fontSize="4" fill="#2a4070">BRAND KIT</text>
          {/* Swatches 2nd row */}
          {['#e8eaf6','#06090f','#1a2540','#00ff9f','#0c1425'].map((c, i) => (
            <rect key={i} x={RX+2+i*8} y={RY+26} width="7" height="8" fill={c} rx="0.5"/>
          ))}
        </g>
      )

    case 'social-performance':
      return (
        <g>
          <PanelBg x={LX} y={LY} w={LW} h={LH}/>
          <PanelBg x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: phone icon with mini chart */}
          <rect x={LX+10} y={LY+10} width={18} height={26} fill="#0c1525" rx="2"
            stroke={`${accent}55`} strokeWidth="0.8"/>
          <rect x={LX+12} y={LY+13} width={14} height={18} fill="#060a14"/>
          {/* Chart on phone */}
          <polyline
            points={`${LX+13},${LY+28} ${LX+15},${LY+25} ${LX+18},${LY+26} ${LX+21},${LY+22} ${LX+24},${LY+23}`}
            stroke={accent} strokeWidth="1" fill="none"/>
          <circle cx={LX+24} cy={LY+23} r="1.2" fill={accent}/>
          <circle cx={LX+19} cy={LY+36} r="1.5" fill="#1a2540"/>
          {/* Right: live KPI panel */}
          <text x={RX+3} y={RY+8} fontFamily="monospace" fontSize="5" fill={`${accent}88`} letterSpacing="1">LIVE KPI</text>
          {[['CTR','3.2%'],['CVR','1.8%'],['ROAS','6.1x'],['POST','4/day']].map(([lbl, val], i) => (
            <g key={lbl}>
              <text x={RX+2}  y={RY+16+i*6} fontFamily="monospace" fontSize="4" fill="#2a4070">{lbl}</text>
              <text x={RX+22} y={RY+16+i*6} fontFamily="monospace" fontSize="4.5" fill={accent}>{val}</text>
            </g>
          ))}
        </g>
      )
  }
}

// ─────────────────────────────────────────────
// Screen content — role-specific
// ─────────────────────────────────────────────

interface SCProps { agentId: DepartmentId; accent: string; x: number; y: number; w: number; h: number }

function ScreenContent({ agentId, accent, x, y, w, h }: SCProps) {
  switch (agentId) {

    case 'product-research': {
      const cards = [
        { label: 'P-001', pct: 88 },
        { label: 'P-002', pct: 74 },
        { label: 'P-003', pct: 91 },
        { label: 'P-004', pct: 79 },
      ]
      return (
        <g>
          <rect x={x} y={y} width={w} height={8} fill="#080e1c"/>
          <text x={x+3} y={y+6} fontFamily="monospace" fontSize="5"
            fill={`${accent}99`} letterSpacing="1">PRODUCT CARDS</text>
          {cards.map((r, i) => (
            <g key={r.label} transform={`translate(0,${i*13})`}>
              <text x={x+2} y={y+19} fontFamily="monospace" fontSize="4.5" fill="#2a3560">{r.label}</text>
              <rect x={x+32} y={y+13} width={w-34} height={5} fill="#080e1c"/>
              <rect x={x+32} y={y+13} width={(w-34)*r.pct/100} height={5}
                fill={r.pct >= 85 ? accent : `${accent}77`} opacity="0.85"/>
              <text x={x+w-13} y={y+19} fontFamily="monospace" fontSize="4.5"
                fill={`${accent}99`}>{r.pct}</text>
            </g>
          ))}
        </g>
      )
    }

    case 'offer-analyst': {
      const bars = [52, 38, 61, 42]
      const maxH = 46
      const bw   = 16
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="5"
            fill={`${accent}99`} letterSpacing="1">PROFIT ANALYSIS</text>
          {bars.map((v, i) => (
            <rect key={i}
              x={x+4+i*21} y={y+h-6-v*maxH/100}
              width={bw} height={v*maxH/100}
              fill={i===2 ? accent : `${accent}55`}/>
          ))}
          <line x1={x+2} y1={y+h-6} x2={x+w-2} y2={y+h-6}
            stroke="#1a2540" strokeWidth="0.5"/>
          <text x={x+2}   y={y+h-8} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}55`}>฿COMM</text>
          <text x={x+w-26} y={y+h-8} fontFamily="monospace" fontSize="5"
            fill={accent}>ROAS 5.0x</text>
        </g>
      )
    }

    case 'content-strategy': {
      const platforms = [
        { lbl: 'TK', bg: '#ffffff11', c: accent },
        { lbl: 'SH', bg: '#ff572228', c: '#ff7043' },
        { lbl: 'LZ', bg: '#2979ff28', c: '#64b5f6' },
      ]
      const frameworks = ['daily_problem', 'worth_it', 'before_after']
      return (
        <g>
          {platforms.map((p, i) => (
            <g key={p.lbl}>
              <rect x={x+i*31} y={y+1} width={28} height={13} fill={p.bg} rx="1"/>
              <text x={x+i*31+8} y={y+10} fontFamily="monospace" fontSize="6" fill={p.c}>{p.lbl}</text>
            </g>
          ))}
          {frameworks.map((fw, i) => (
            <g key={fw} transform={`translate(0,${i*15})`}>
              <rect x={x+1}  y={y+18} width={5} height={5} fill={`${accent}44`} rx="1"/>
              <rect x={x+9}  y={y+18} width={62} height={2.5} fill={`${accent}33`}/>
              <rect x={x+9}  y={y+22} width={44} height={1.5} fill="#1a2540"/>
            </g>
          ))}
        </g>
      )
    }

    case 'script-writer': {
      const lw = [86,68,80,54,76,62,80]
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="5"
            fill={`${accent}99`} letterSpacing="1">SCRIPT 25s</text>
          {lw.map((pw, i) => (
            <rect key={i} x={x+3} y={y+11+i*7} width={pw*w/100} height={3}
              fill={i===0 ? accent : `${accent}${i%2===0?'66':'33'}`}/>
          ))}
          <rect x={x}    y={y+h-12} width={w} height={9}   fill="#07090e"/>
          <rect x={x+2}  y={y+h-11} width={28} height={5}  fill={`${accent}55`}/>
          <rect x={x+32} y={y+h-12} width={2}  height={9}  fill={accent}/>
          <circle cx={x+w-8} cy={y+9} r={3.5} fill="#ff525222"/>
          <circle cx={x+w-8} cy={y+9} r={1.8} fill="#ff5252"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}/>
        </g>
      )
    }

    case 'creative-production': {
      const cells = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="5"
            fill={`${accent}99`} letterSpacing="1">CANVA BRIEF</text>
          {cells.map(([col, row], i) => (
            <rect key={i}
              x={x+3+col*29} y={y+12+row*25}
              width={26} height={21}
              fill={i===0 ? `${accent}22` : '#080e1c'}
              stroke={i===0 ? accent : `${accent}33`}
              strokeWidth="0.5" rx="1"/>
          ))}
          <line x1={x+w-14} y1={y+12} x2={x+w-4} y2={y+h-8}
            stroke={accent} strokeWidth="1.8" strokeLinecap="round" opacity="0.65"/>
          <circle cx={x+w-4} cy={y+h-8} r={2.5} fill={accent} opacity="0.55"/>
        </g>
      )
    }

    case 'social-performance': {
      const pts = [28, 42, 35, 58, 48, 72, 65, 80]
      const maxH = 46
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="5"
            fill={`${accent}99`} letterSpacing="1">ANALYTICS</text>
          <polyline
            points={pts.map((v,i) => `${x+4+i*11},${y+h-6-v*maxH/100}`).join(' ')}
            stroke={accent} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
          {pts.map((v, i) => (
            <circle key={i}
              cx={x+4+i*11} cy={y+h-6-v*maxH/100}
              r={i===pts.length-1 ? 2.5 : 1.2}
              fill={i===pts.length-1 ? accent : `${accent}88`}/>
          ))}
          <line x1={x+2} y1={y+h-6} x2={x+w-2} y2={y+h-6}
            stroke="#1a2540" strokeWidth="0.5"/>
          <text x={x+w-32} y={y+h-9} fontFamily="monospace" fontSize="5"
            fill={accent}>ROAS 6.1x</text>
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

    case 'product-research':
      return (
        <g>
          {/* Sticky notes cluster — right side */}
          <rect x="226" y="92" width="28" height="9"  fill="#ffee5530" rx="1"/>
          <rect x="230" y="96" width="24" height="9"  fill="#ffdd4428" rx="1"/>
          <rect x="226" y="93" width="22" height="1"  fill="#2a1a0020"/>
          <rect x="226" y="95" width="17" height="1"  fill="#2a1a0020"/>
          {/* Magnifying glass — left */}
          <circle cx="32" cy="96" r="8"  fill="none" stroke={`${accent}44`} strokeWidth="2.5"/>
          <circle cx="32" cy="96" r="4.5" fill={`${accent}0d`}/>
          <line x1="38" y1="102" x2="46" y2="110"
            stroke={`${accent}44`} strokeWidth="3" strokeLinecap="round"/>
          {/* Product box */}
          <rect x="52" y="94" width="16" height="10" fill={`${accent}22`}
            stroke={`${accent}44`} strokeWidth="0.8" rx="1"/>
          <line x1="60" y1="94" x2="60" y2="104" stroke={`${accent}33`} strokeWidth="0.5"/>
          <line x1="52" y1="99" x2="68" y2="99"  stroke={`${accent}22`} strokeWidth="0.5"/>
        </g>
      )

    case 'offer-analyst':
      return (
        <g>
          {/* Calculator — left */}
          <rect x="16" y="88" width="28" height="20" fill="#0c1020" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="18" y="90" width="24" height="8"  fill="#040810"/>
          <text x="20" y="96" fontFamily="monospace" fontSize="5.5" fill={`${accent}99`}>5.2x</text>
          {[0,1,2].map(row => [0,1,2,3].map(col => (
            <rect key={`${row}-${col}`}
              x={19+col*5} y={100+row*5} width={4} height={4}
              fill="#09101e" rx="0.5"/>
          )))}
          {/* P&L slip — right */}
          <rect x="220" y="90" width="44" height="14" fill="#0c1020"
            stroke="#1a2540" strokeWidth="0.5" rx="1"/>
          {[0,1,2].map(i => (
            <rect key={i} x="222" y={92+i*4} width={[32,26,38][i]} height="2.5"
              fill={i===0 ? `${accent}66` : `${accent}22`}/>
          ))}
        </g>
      )

    case 'content-strategy':
      return (
        <g>
          {/* Planning board — left */}
          <rect x="14" y="87" width="36" height="19" fill="#0c1020" rx="1"
            stroke={`${accent}33`} strokeWidth="0.8"/>
          {[0,1,2,3].map(i => (
            <rect key={i} x="17" y={90+i*4} width={[28,20,24,16][i]} height="2"
              fill={i===0 ? `${accent}77` : `${accent}33`}/>
          ))}
          {/* Post-its — right */}
          <rect x="223" y="91" width="20" height="13" fill="#ffee5520" rx="1"
            stroke={`${accent}33`} strokeWidth="0.5"/>
          <rect x="245" y="89" width="18" height="12" fill="#ff980020" rx="1"
            stroke={`${accent}22`} strokeWidth="0.5"/>
          <rect x="224" y="92" width="14" height="1.5" fill="#ffee5540"/>
          <rect x="224" y="95" width="10" height="1.5" fill="#ffee5530"/>
        </g>
      )

    case 'script-writer':
      return (
        <g>
          {/* Clapperboard — left */}
          <rect x="17" y="88" width="30" height="18" fill="#141414" rx="1"/>
          <rect x="17" y="88" width="30" height="6"  fill="#222"/>
          {[0,1,2,3,4].map(i => (
            <line key={i}
              x1={17+i*6} y1="88" x2={20+i*6} y2="94"
              stroke={`${accent}99`} strokeWidth="1.5"/>
          ))}
          <rect x="19" y="97"  width="26" height="2.5" fill="#2a2830" opacity="0.8"/>
          <rect x="19" y="101" width="20" height="2.5" fill="#2a2830" opacity="0.6"/>
          {/* Script pages — right */}
          <rect x="221" y="90" width="28" height="16" fill="#0c1020"
            stroke="#1a2540" strokeWidth="0.5" rx="1"/>
          {[0,1,2,3].map(i => (
            <rect key={i} x="223" y={92+i*3.5} width={[22,17,20,13][i]} height="2"
              fill={`${accent}33`}/>
          ))}
        </g>
      )

    case 'creative-production':
      return (
        <g>
          {/* Drawing tablet — left */}
          <rect x="14" y="90" width="36" height="18" fill="#0c1020" rx="2"
            stroke={`${accent}44`} strokeWidth="0.8"/>
          <rect x="16" y="92" width="32" height="14" fill="#060a14" rx="1"/>
          <rect x="18" y="93" width="13" height="10" fill={`${accent}22`} rx="1"/>
          <rect x="33" y="93" width="13" height="5"  fill={`${accent}11`} rx="1"/>
          <rect x="33" y="99" width={9}  height="4"  fill={`${accent}11`} rx="1"/>
          {/* Stylus */}
          <line x1="44" y1="88" x2="52" y2="106"
            stroke={`${accent}66`} strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="52" cy="106" r="1.8" fill={accent} opacity="0.55"/>
          {/* File stack — right */}
          <rect x="222" y="92" width="40" height="2" fill="#c8d0e0" opacity="0.22"/>
          <rect x="224" y="89" width="36" height="3" fill="#c8d0e0" opacity="0.18"/>
          <rect x="220" y="95" width="44" height="2" fill="#c8d0e0" opacity="0.14"/>
          <rect x="222" y="92" width={11} height="2" fill={accent}  opacity="0.42"/>
        </g>
      )

    case 'social-performance':
      return (
        <g>
          {/* Phone mockup — right */}
          <rect x="224" y="85" width="22" height="36" fill="#0c1525" rx="2"
            stroke={`${accent}55`} strokeWidth="1"/>
          <rect x="226" y="88" width="18" height="27" fill="#060a14"/>
          <rect x="227" y="90" width="16" height="7"  fill={`${accent}22`}/>
          <polyline points="227,96 230,94 233,95 237,91 242,92"
            stroke={accent} strokeWidth="1.2" fill="none"/>
          <rect x="227" y="98"  width={10} height="1.2" fill="#1a2540"/>
          <rect x="227" y="100" width="16" height="1.2" fill={`${accent}33`}/>
          <rect x="227" y="102" width={12} height="1.2" fill="#1a2540"/>
          <circle cx="235" cy="111" r="2.5" fill="#1a2540"/>
          {/* Report — left */}
          <rect x="16" y="88" width="32" height="19" fill="#0c1525" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="18" y="91" width="28" height="3"  fill={`${accent}55`}/>
          {[0,1,2].map(i => (
            <rect key={i} x="18" y={96+i*4} width={[24,18,22][i]} height="2"
              fill={`${accent}22`}/>
          ))}
        </g>
      )
  }
}
