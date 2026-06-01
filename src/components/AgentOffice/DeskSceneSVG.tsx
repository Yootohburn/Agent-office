import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

interface Props {
  agentId:   DepartmentId
  accent:    string
  status:    AgentStatus
  roomLabel: string
}

// ── Shared palette ─────────────────────────────
const SKIN   = '#c8a070'
const SKIN_S = '#b08050'
const HAIR   = '#261808'
const HAIR_H = '#3d2610'
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

      <defs>
        <radialGradient id={`glow-${agentId}`} cx="50%" cy="60%" r="55%">
          <stop offset="0%"   stopColor={accent} stopOpacity="0.10"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── 1. Room background ── */}
      {/* Ceiling strip */}
      <rect width="280" height="10" fill="#040810"/>
      {/* Wall */}
      <rect y="10" width="280" height="78" fill="#060c1a"/>
      {/* Wall scanline texture */}
      {[14,22,30,38,46,54,62,70,78].map(yy => (
        <line key={yy} x1="0" y1={yy} x2="280" y2={yy}
          stroke="#070d1c" strokeWidth="0.5" opacity="0.6"/>
      ))}
      {/* Perspective corner lines */}
      <line x1="0"   y1="10" x2="140" y2="88" stroke="#0a1228" strokeWidth="0.5"/>
      <line x1="280" y1="10" x2="140" y2="88" stroke="#0a1228" strokeWidth="0.5"/>
      {/* Screen glow spill on wall */}
      <rect x="80" y="10" width="120" height="78" fill={`url(#glow-${agentId})`}/>
      {/* Baseboard */}
      <rect y="84" width="280" height="4" fill="#080f1d"/>
      <line x1="0" y1="84" x2="280" y2="84" stroke="#0c1428" strokeWidth="0.5"/>
      {/* Floor */}
      <rect y="88" width="280" height="62" fill="#04070f"/>
      {/* Floor tiles */}
      {[0,1,2,3,4,5,6].map(col => [0,1,2,3].map(row => (
        <rect key={`t-${col}-${row}`}
          x={col*40} y={88+row*16}
          width={39} height={15}
          fill="none" stroke="#070d1a" strokeWidth="0.4"/>
      )))}

      {/* ── 2. Wall decor — role-specific panels ── */}
      <WallDecor agentId={agentId} accent={accent}/>

      {/* ── 3. Chair back ── */}
      <rect x="117" y="92" width="46" height="14" fill={CHAIR} rx="1"/>
      {/* Chair headrest */}
      <rect x="117" y="92" width="46" height="3" fill="#0f1c32" rx="1"/>
      {/* Chair center seam */}
      <line x1="140" y1="95" x2="140" y2="106" stroke="#0a1525" strokeWidth="0.8"/>

      {/* ── 4. Desk surface ── */}
      {/* Top face with perspective taper */}
      <polygon points="6,91 274,91 270,82 10,82" fill={DESK_T}/>
      {/* Wood grain */}
      {[85,87,89].map(yy => (
        <line key={yy} x1="12" y1={yy} x2="268" y2={yy-0.5}
          stroke="#0e0b04" strokeWidth="0.4" opacity="0.6"/>
      ))}
      {/* Accent edge */}
      <line x1="10" y1="82" x2="270" y2="82" stroke={`${accent}20`} strokeWidth="1"/>
      {/* Front face */}
      <rect x="6" y="91" width="268" height="9" fill={DESK_F}/>
      {/* Side slivers */}
      <polygon points="6,82 6,100 10,100 10,91" fill="#0e0a03"/>
      <polygon points="274,82 274,100 270,100 270,91" fill="#0e0a03"/>

      {/* ── 5. Desk legs + chair seat ── */}
      <rect x="13"  y="100" width="7" height="36" fill="#0b0803"/>
      <rect x="260" y="100" width="7" height="36" fill="#0b0803"/>
      <rect x="110" y="101" width="60" height="7" fill={CHAIR} rx="1"/>
      {/* Chair armrests */}
      <rect x="108" y="99" width="6" height="12" fill="#0c1830" rx="1"/>
      <rect x="166" y="99" width="6" height="12" fill="#0c1830" rx="1"/>

      {/* ── 6. Monitor stand ── */}
      <rect x="132" y="81" width="16" height="8" fill="#161c2c"/>
      <rect x="122" y="89" width="36" height="2" fill="#161c2c"/>

      {/* ── 7. Main monitor ── */}
      <rect x="88"  y="14" width="104" height="68" fill={MON_BZ} rx="2"/>
      <rect x="91"  y="17" width="98"  height="62" fill={MON_SC}/>
      <rect x="91"  y="17" width="98"  height="62" fill={accent} opacity="0.03"/>
      {/* Screen reflection */}
      <rect x="93"  y="19" width="22"  height="8"  fill="#ffffff" opacity="0.02"/>
      {/* Screen content */}
      <ScreenContent agentId={agentId} accent={accent} x={95} y={21} w={90} h={54}/>
      {/* Active corner pixel */}
      {isActive && (
        <rect x="92" y="18" width="3" height="3" fill={accent} opacity="0.55"
          style={{ animation: 'blink 1s step-end infinite' }}/>
      )}
      {/* Webcam */}
      <circle cx="140" cy="16" r="1.8" fill="#07091a"/>
      <circle cx="140" cy="16" r="0.7" fill={isActive ? `${accent}88` : '#111826'}/>
      {/* Power LED */}
      <circle cx="189" cy="81" r="1.2"
        fill={isBlocked ? '#ff5252cc' : isActive ? `${accent}cc` : '#1a2540'}/>
      {isActive && (
        <circle cx="189" cy="81" r="2.2" fill={accent} opacity="0.15"
          style={{ animation: 'blink 2s ease-in-out infinite' }}/>
      )}

      {/* ── 8. Keyboard ── */}
      <rect x="97" y="84" width="86" height="7" fill="#111726" rx="1"/>
      <rect x="99" y="85" width="82" height="4" fill="#0c1220"/>
      {[0,1].map(r => (
        <rect key={r} x={101+r*2} y={86+r} width={78-r*4} height="1"
          fill="#18203a" opacity="0.6"/>
      ))}
      {/* Spacebar */}
      <rect x="114" y="89" width="52" height="1.5" fill="#141c30"/>

      {/* ── 9. Arms ── */}
      {/* Shadow on desk */}
      <rect x="83"  y="82" width="32" height="2" fill={SKIN_S} opacity="0.35" rx="2"/>
      <rect x="165" y="82" width="32" height="2" fill={SKIN_S} opacity="0.35" rx="2"/>
      <rect x="83"  y="83" width="32" height="7" fill={SKIN} rx="3"/>
      <rect x="165" y="83" width="32" height="7" fill={SKIN} rx="3"/>

      {/* ── 10. Torso / shoulders / neck ── */}
      {/* Shoulder polygon — wider than torso */}
      <polygon points="112,83 168,83 165,75 115,75" fill={accent} opacity="0.8"/>
      {/* Shirt */}
      <rect x="119" y="75" width="42" height="8" fill={accent} opacity="0.85" rx="1"/>
      {/* Collar flaps */}
      <rect x="127" y="63" width="8" height="10" fill={accent} opacity="0.8"/>
      <rect x="145" y="63" width="8" height="10" fill={accent} opacity="0.8"/>
      {/* Neck */}
      <rect x="132" y="63" width="16" height="13" fill={SKIN}/>
      {/* Neck side shadows */}
      <rect x="132" y="63" width="2" height="13" fill={SKIN_S} opacity="0.5"/>
      <rect x="146" y="63" width="2" height="13" fill={SKIN_S} opacity="0.5"/>

      {/* ── 11. Head ── */}
      {/* Sideburns */}
      <rect x="122" y="44" width="4" height="16" fill={HAIR}/>
      <rect x="154" y="44" width="4" height="16" fill={HAIR}/>
      {/* Face */}
      <rect x="123" y="44" width="34" height="22" fill={SKIN} rx="1"/>
      {/* Hair top */}
      <rect x="123" y="44" width="34" height="8"  fill={HAIR} rx="1"/>
      {/* Hair highlight */}
      <rect x="128" y="45" width="16" height="2.5" fill={HAIR_H} opacity="0.7"/>
      {/* Ears */}
      <rect x="120" y="50" width="3" height="9" fill={SKIN}/>
      <rect x="157" y="50" width="3" height="9" fill={SKIN}/>
      {/* Ear inner shadow */}
      <rect x="121" y="52" width="2" height="5" fill={SKIN_S} opacity="0.4"/>
      <rect x="157" y="52" width="2" height="5" fill={SKIN_S} opacity="0.4"/>
      {/* Eyes */}
      <rect x="130" y="55" width="5" height="3" fill="#281800" rx="0.5"/>
      <rect x="145" y="55" width="5" height="3" fill="#281800" rx="0.5"/>
      {/* Eye glints */}
      <rect x="131"   y="55.5" width="1.5" height="1" fill="#ffffff" opacity="0.25"/>
      <rect x="146"   y="55.5" width="1.5" height="1" fill="#ffffff" opacity="0.25"/>
      {/* Screen light tint on face */}
      <rect x="123" y="44" width="34" height="22" fill={accent} opacity="0.07" rx="1"/>

      {/* ── 12. Role-specific desk props ── */}
      <DeskProps agentId={agentId} accent={accent}/>

      {/* ── 13. Room label + status dot ── */}
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
// Wall decor — role-specific framed panels on back wall
// ─────────────────────────────────────────────

function WallDecor({ agentId, accent }: { agentId: DepartmentId; accent: string }) {
  const LX = 14, LY = 18, LW = 44, LH = 26
  const RX = 222, RY = 18, RW = 44, RH = 26

  const Panel = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
    <rect x={x} y={y} width={w} height={h} fill="#070d1c"
      stroke={`${accent}22`} strokeWidth="0.5" rx="1"/>
  )

  switch (agentId) {

    case 'product-research':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: product score board */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">SCORE</text>
          {(['P001','P002','P003','P004'] as const).map((lbl, i) => (
            <g key={lbl}>
              <text x={LX+2} y={LY+13+i*4} fontFamily="monospace" fontSize="3.5" fill="#2a3560">{lbl}</text>
              <rect x={LX+17} y={LY+10+i*4} width={[26,20,28,22][i]} height="2.5" fill={`${accent}44`}/>
            </g>
          ))}
          {/* Right: database icon */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">DATA</text>
          <ellipse cx={RX+22} cy={RY+14} rx={12} ry={3.5} fill="none" stroke={`${accent}44`} strokeWidth="0.8"/>
          <ellipse cx={RX+22} cy={RY+19} rx={12} ry={3.5} fill="none" stroke={`${accent}33`} strokeWidth="0.6"/>
          <line x1={RX+10} y1={RY+14} x2={RX+10} y2={RY+19} stroke={`${accent}33`} strokeWidth="0.6"/>
          <line x1={RX+34} y1={RY+14} x2={RX+34} y2={RY+19} stroke={`${accent}33`} strokeWidth="0.6"/>
          <text x={RX+4} y={RY+26} fontFamily="monospace" fontSize="3.5" fill="#2a3560">132 SKUs</text>
        </g>
      )

    case 'offer-analyst':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: ROAS target */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">TARGET</text>
          <text x={LX+3} y={LY+15} fontFamily="monospace" fontSize="9" fill={accent}>5.0x</text>
          <rect x={LX+2} y={LY+17} width={40} height="3" fill="#0c1428"/>
          <rect x={LX+2} y={LY+17} width={26} height="3" fill={`${accent}66`}/>
          <text x={LX+3} y={LY+25} fontFamily="monospace" fontSize="3.5" fill="#2a3560">52% of goal</text>
          {/* Right: P&L table */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">P+L</text>
          {(['REV','COST','NET'] as const).map((lbl, i) => (
            <g key={lbl}>
              <text x={RX+2}  y={RY+13+i*5} fontFamily="monospace" fontSize="3.5" fill="#2a3560">{lbl}</text>
              <text x={RX+22} y={RY+13+i*5} fontFamily="monospace" fontSize="3.5"
                fill={i===2 ? accent : `${accent}77`}>{['92k','38k','54k'][i]}</text>
            </g>
          ))}
        </g>
      )

    case 'content-strategy':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: platform mix bars */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">MIX</text>
          {(['TK','SH','LZ'] as const).map((p, i) => {
            const bw = [14, 9, 8][i]
            return (
              <g key={p}>
                <text x={LX+2} y={LY+14+i*5} fontFamily="monospace" fontSize="3.5" fill={`${accent}99`}>{p}</text>
                <rect x={LX+12} y={LY+11+i*5} width={30} height="2.5" fill="#0c1428"/>
                <rect x={LX+12} y={LY+11+i*5} width={bw*2} height="2.5" fill={`${accent}55`}/>
              </g>
            )
          })}
          {/* Right: hook frameworks */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">HOOKS</text>
          {['PROBLEM','WORTH_IT','B_AFTER','REVEAL'].map((fw, i) => (
            <g key={fw}>
              <rect x={RX+2} y={RY+9+i*4} width="3" height="3" fill={`${accent}44`} rx="0.5"/>
              <text x={RX+7} y={RY+12+i*4} fontFamily="monospace" fontSize="3" fill="#2a3560">{fw}</text>
            </g>
          ))}
        </g>
      )

    case 'script-writer':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: scene plan */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">SCENES</text>
          {['S1:HOOK','S2:DEMO','S3:PROOF','S4:CTA'].map((s, i) => (
            <g key={s}>
              <rect x={LX+2} y={LY+9+i*4} width="3" height="3" fill={`${accent}33`} rx="0.5"/>
              <text x={LX+7} y={LY+12+i*4} fontFamily="monospace" fontSize="3" fill="#2a3560">{s}</text>
            </g>
          ))}
          {/* Right: shot list */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">SHOTS</text>
          {['WIDE','MCU','INSERT','CU'].map((sh, i) => (
            <g key={sh}>
              <rect x={RX+2} y={RY+9+i*4} width="3" height="3" fill={`${accent}33`} rx="0.5"/>
              <text x={RX+7} y={RY+12+i*4} fontFamily="monospace" fontSize="3" fill="#2a3560">{sh}</text>
            </g>
          ))}
        </g>
      )

    case 'creative-production':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: asset checklist */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">ASSETS</text>
          {([['✓','THUMB'],['✓','VIDEO'],['✓','CAPTION'],['○','CARD']] as const).map(([ic, lbl], i) => (
            <g key={lbl}>
              <text x={LX+2} y={LY+13+i*4} fontFamily="monospace" fontSize="3.5"
                fill={ic==='✓' ? accent : '#2a3560'}>{ic}</text>
              <text x={LX+9} y={LY+13+i*4} fontFamily="monospace" fontSize="3" fill="#2a3560">{lbl}</text>
            </g>
          ))}
          {/* Right: color palette swatches */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">PALETTE</text>
          {([accent, '#ff4081', '#ffb300', '#00e5ff', '#1a2540'] as const).map((c, i) => (
            <rect key={i} x={RX+2+i*8} y={RY+10} width="7" height="10" fill={c} rx="0.5"/>
          ))}
          <text x={RX+3} y={RY+26} fontFamily="monospace" fontSize="3.5" fill="#2a3560">BRAND KIT</text>
        </g>
      )

    case 'social-performance':
      return (
        <g>
          <Panel x={LX} y={LY} w={LW} h={LH}/>
          <Panel x={RX} y={RY} w={RW} h={RH}/>
          {/* Left: live KPIs */}
          <text x={LX+3} y={LY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">LIVE</text>
          {(['CTR','CVR','ROAS'] as const).map((lbl, i) => (
            <g key={lbl}>
              <text x={LX+2}  y={LY+13+i*5} fontFamily="monospace" fontSize="3.5" fill="#2a3560">{lbl}</text>
              <text x={LX+22} y={LY+13+i*5} fontFamily="monospace" fontSize="3.5" fill={accent}>
                {['3.2%','1.8%','6.1x'][i]}
              </text>
            </g>
          ))}
          {/* Right: post schedule */}
          <text x={RX+3} y={RY+6} fontFamily="monospace" fontSize="4" fill={`${accent}77`} letterSpacing="1">QUEUE</text>
          {['09:00 TK','14:00 SH','18:00 TK','20:00 IG'].map((t, i) => (
            <g key={t}>
              <rect x={RX+2} y={RY+9+i*4} width="3" height="3" fill={`${accent}33`} rx="0.5"/>
              <text x={RX+7} y={RY+12+i*4} fontFamily="monospace" fontSize="3" fill="#2a3560">{t}</text>
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
          <rect x={x} y={y} width={w} height={7} fill="#080e1c"/>
          <text x={x+3} y={y+5} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">PRODUCT CARDS</text>
          {cards.map((r, i) => (
            <g key={r.label} transform={`translate(0,${i*11})`}>
              <text x={x+2} y={y+16} fontFamily="monospace" fontSize="4" fill="#2a3560">{r.label}</text>
              <rect x={x+32} y={y+11} width={w-34} height={4} fill="#080e1c"/>
              <rect x={x+32} y={y+11} width={(w-34)*r.pct/100} height={4}
                fill={r.pct >= 85 ? accent : `${accent}77`} opacity="0.85"/>
              <text x={x+w-12} y={y+16} fontFamily="monospace" fontSize="4"
                fill={`${accent}99`}>{r.pct}</text>
            </g>
          ))}
        </g>
      )
    }

    case 'offer-analyst': {
      const bars = [52, 38, 61, 42]
      const maxH = 38
      const bw   = 16
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">PROFIT ANALYSIS</text>
          {bars.map((v, i) => (
            <rect key={i}
              x={x+4+i*21} y={y+h-6-v*maxH/100}
              width={bw} height={v*maxH/100}
              fill={i===2 ? accent : `${accent}55`}/>
          ))}
          <line x1={x+2} y1={y+h-6} x2={x+w-2} y2={y+h-6}
            stroke="#1a2540" strokeWidth="0.5"/>
          <text x={x+w-22} y={y+h-8} fontFamily="monospace" fontSize="4"
            fill={`${accent}88`}>ROAS 5.0x</text>
        </g>
      )
    }

    case 'content-strategy': {
      const platforms = [
        { lbl: 'TK', bg: '#ffffff11' },
        { lbl: 'SH', bg: '#ff572233' },
        { lbl: 'LZ', bg: '#2979ff33' },
      ]
      const frameworks = ['daily_problem', 'worth_it', 'before_after']
      return (
        <g>
          {platforms.map((p, i) => (
            <g key={p.lbl}>
              <rect x={x+i*31} y={y+1} width={28} height={11} fill={p.bg} rx="1"/>
              <text x={x+i*31+9} y={y+9} fontFamily="monospace" fontSize="5" fill={accent}>{p.lbl}</text>
            </g>
          ))}
          {frameworks.map((fw, i) => (
            <g key={fw} transform={`translate(0,${i*13})`}>
              <rect x={x+1}  y={y+15} width={4}  height={4} fill={`${accent}44`} rx="1"/>
              <rect x={x+8}  y={y+15} width={62} height={2} fill={`${accent}33`}/>
              <rect x={x+8}  y={y+18} width={44} height={1} fill="#1a2540"/>
            </g>
          ))}
        </g>
      )
    }

    case 'script-writer': {
      const lw = [86,68,80,54,76,62,80]
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">SCRIPT 25s</text>
          {lw.map((pw, i) => (
            <rect key={i} x={x+3} y={y+10+i*6} width={pw*w/100} height={2.5}
              fill={i===0 ? accent : `${accent}${i%2===0?'66':'33'}`}/>
          ))}
          <rect x={x}   y={y+h-10} width={w} height={7}   fill="#07090e"/>
          <rect x={x+2} y={y+h-9}  width={24} height={4}  fill={`${accent}55`}/>
          <rect x={x+27} y={y+h-10} width={2} height={7}  fill={accent}/>
          <circle cx={x+w-8} cy={y+8} r={3} fill="#ff525222"/>
          <circle cx={x+w-8} cy={y+8} r={1.5} fill="#ff5252"
            style={{ animation: 'blink 1.5s ease-in-out infinite' }}/>
        </g>
      )
    }

    case 'creative-production': {
      const cells = [
        [0,0], [1,0], [2,0],
        [0,1], [1,1], [2,1],
      ]
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">CANVA BRIEF</text>
          {cells.map(([col, row], i) => (
            <rect key={i}
              x={x+3+col*29} y={y+10+row*22}
              width={26} height={18}
              fill={i===0 ? `${accent}22` : '#080e1c'}
              stroke={i===0 ? accent : `${accent}33`}
              strokeWidth="0.5" rx="1"/>
          ))}
          <line x1={x+w-12} y1={y+10} x2={x+w-4} y2={y+h-8}
            stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          <circle cx={x+w-4} cy={y+h-8} r={2} fill={accent} opacity="0.5"/>
        </g>
      )
    }

    case 'social-performance': {
      const pts = [28, 42, 35, 58, 48, 72, 65, 80]
      const maxH = 38
      return (
        <g>
          <text x={x+2} y={y+7} fontFamily="monospace" fontSize="4.5"
            fill={`${accent}99`} letterSpacing="1">ANALYTICS</text>
          <polyline
            points={pts.map((v,i) => `${x+4+i*11},${y+h-6-v*maxH/100}`).join(' ')}
            stroke={accent} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
          {pts.map((v, i) => (
            <circle key={i}
              cx={x+4+i*11} cy={y+h-6-v*maxH/100}
              r={i===pts.length-1 ? 2 : 1}
              fill={i===pts.length-1 ? accent : `${accent}77`}/>
          ))}
          <line x1={x+2} y1={y+h-6} x2={x+w-2} y2={y+h-6}
            stroke="#1a2540" strokeWidth="0.5"/>
          <text x={x+w-28} y={y+h-8} fontFamily="monospace" fontSize="4"
            fill={`${accent}88`}>ROAS 6.1x</text>
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
          {/* Product box */}
          <rect x="52" y="80" width="14" height="10" fill={`${accent}22`}
            stroke={`${accent}44`} strokeWidth="0.8" rx="1"/>
          <line x1="59" y1="80" x2="59" y2="90" stroke={`${accent}33`} strokeWidth="0.5"/>
        </g>
      )

    case 'offer-analyst':
      return (
        <g>
          {/* Calculator — left */}
          <rect x="17" y="76" width="26" height="30" fill="#0c1020" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="19" y="78" width="22" height="8"  fill="#040810"/>
          <text x="21" y="84" fontFamily="monospace" fontSize="5" fill={`${accent}99`}>5.2x</text>
          {[0,1,2].map(row => [0,1,2,3].map(col => (
            <rect key={`${row}-${col}`}
              x={20+col*5} y={88+row*5} width={4} height={4}
              fill="#09101e" rx="0.5"/>
          )))}
          {/* Spreadsheet — right */}
          <rect x="220" y="78" width="42" height="16" fill="#0c1020"
            stroke="#1a2540" strokeWidth="0.5" rx="1"/>
          {[0,1,2].map(i => (
            <rect key={i} x="222" y={80+i*4} width={[30, 24, 36][i]} height="2"
              fill={i===0 ? `${accent}66` : `${accent}22`}/>
          ))}
        </g>
      )

    case 'content-strategy':
      return (
        <g>
          {/* Planning pad — left */}
          <rect x="16" y="74" width="32" height="22" fill="#0c1020" rx="1"
            stroke={`${accent}33`} strokeWidth="0.8"/>
          {[0,1,2,3].map(i => (
            <rect key={i} x="19" y={77+i*4} width={[24, 18, 22, 14][i]} height="1.5"
              fill={i===0 ? `${accent}77` : `${accent}33`}/>
          ))}
          {/* Post-its — right */}
          <rect x="223" y="79" width="18" height="12" fill="#ffee5522" rx="1"
            stroke={`${accent}33`} strokeWidth="0.5"/>
          <rect x="243" y="76" width="16" height="11" fill="#ff980022" rx="1"
            stroke={`${accent}22`} strokeWidth="0.5"/>
        </g>
      )

    case 'script-writer':
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
          {/* Script pages — right */}
          <rect x="222" y="78" width="26" height="16" fill="#0c1020"
            stroke="#1a2540" strokeWidth="0.5" rx="1"/>
          {[0,1,2,3].map(i => (
            <rect key={i} x="224" y={80+i*3} width={[20,16,18,12][i]} height="1.5"
              fill={`${accent}33`}/>
          ))}
        </g>
      )

    case 'creative-production':
      return (
        <g>
          {/* Drawing tablet — left */}
          <rect x="16" y="78" width="34" height="22" fill="#0c1020" rx="2"
            stroke={`${accent}44`} strokeWidth="0.8"/>
          <rect x="18" y="80" width="30" height="18" fill="#060a14" rx="1"/>
          <rect x="20" y="82" width="12" height="9" fill={`${accent}22`} rx="1"/>
          <rect x="34" y="82" width="12" height="4"  fill={`${accent}11`} rx="1"/>
          <rect x="34" y="87" width={8}  height="3"  fill={`${accent}11`} rx="1"/>
          {/* Stylus */}
          <line x1="44" y1="76" x2="50" y2="96"
            stroke={`${accent}66`} strokeWidth="2" strokeLinecap="round"/>
          <circle cx="50" cy="96" r="1.5" fill={accent} opacity="0.5"/>
          {/* File stack — right */}
          <rect x="222" y="80" width="38" height="2" fill="#c8d0e0" opacity="0.22"/>
          <rect x="224" y="77" width="34" height="3" fill="#c8d0e0" opacity="0.18"/>
          <rect x="220" y="83" width="42" height="2" fill="#c8d0e0" opacity="0.14"/>
          <rect x="222" y="80" width={10} height="2" fill={accent}   opacity="0.4"/>
        </g>
      )

    case 'social-performance':
      return (
        <g>
          {/* Phone mockup — right */}
          <rect x="223" y="74" width="20" height="33" fill="#0c1525" rx="2"
            stroke={`${accent}55`} strokeWidth="1"/>
          <rect x="225" y="77" width="16" height="24" fill="#060a14"/>
          <rect x="226" y="79" width="14" height="6"  fill={`${accent}22`}/>
          <polyline points="226,84 229,82 232,83 236,80 240,81"
            stroke={accent} strokeWidth="1" fill="none"/>
          <rect x="226" y="86" width={9}  height="1"  fill="#1a2540"/>
          <rect x="226" y="88" width="14" height="1"  fill={`${accent}33`}/>
          <circle cx="233" cy="97" r="2" fill="#1a2540"/>
          {/* Report — left */}
          <rect x="18" y="77" width="30" height="20" fill="#0c1525" rx="1"
            stroke="#1a2540" strokeWidth="0.5"/>
          <rect x="20" y="79" width="26" height="2"  fill={`${accent}55`}/>
          {[0,1,2].map(i => (
            <rect key={i} x="20" y={83+i*4} width={[22, 16, 20][i]} height="1.5"
              fill={`${accent}22`}/>
          ))}
        </g>
      )
  }
}
