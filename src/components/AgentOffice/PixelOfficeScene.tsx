import type { DepartmentId } from '../../agents/agentRegistry'
import { agents } from '../../agents/agentRegistry'
import AgentRoom from './AgentRoom'

interface Props {
  selectedAgentId: DepartmentId | null
  onSelectAgent: (id: DepartmentId) => void
}

const FLOOR_BG = `
  repeating-linear-gradient(
    90deg,
    transparent 0px, transparent 79px,
    rgba(255,255,255,0.012) 79px, rgba(255,255,255,0.012) 80px
  ),
  #06090f
`

export default function PixelOfficeScene({ selectedAgentId, onSelectAgent }: Props) {
  const row1 = agents.slice(0, 3)
  const row2 = agents.slice(3, 6)

  return (
    <div style={{ background: FLOOR_BG, paddingBottom: 16 }}>

      {/* ── Back wall ── */}
      <OfficeBackWall />

      {/* ── Desk row 1 ── */}
      <div style={{ padding: '12px 14px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {row1.map(agent => (
            <AgentRoom
              key={agent.id}
              agent={agent}
              selected={selectedAgentId === agent.id}
              onClick={() => onSelectAgent(agent.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Floor strip between rows ── */}
      <FloorStrip />

      {/* ── Desk row 2 ── */}
      <div style={{ padding: '0 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {row2.map(agent => (
            <AgentRoom
              key={agent.id}
              agent={agent}
              selected={selectedAgentId === agent.id}
              onClick={() => onSelectAgent(agent.id)}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// Back wall
// ─────────────────────────────────────────────

function OfficeBackWall() {
  return (
    <div style={{
      background: '#070b16',
      borderBottom: '3px solid #0e1830',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      minHeight: 84,
    }}>
      {/* Windows */}
      <div style={{ display: 'flex', gap: 8 }}>
        <PixelWindow />
        <PixelWindow />
      </div>

      <div style={{ flex: 1 }} />

      {/* Neon sign */}
      <NeonSign />

      <div style={{ flex: 1 }} />

      {/* Company badge */}
      <div style={{
        fontFamily: 'VT323, monospace', fontSize: 14, letterSpacing: 3,
        border: '2px solid #1a2540', padding: '5px 12px',
        background: '#060a14', textAlign: 'center', lineHeight: 1.4,
      }}>
        <div style={{ color: '#2a3560' }}>AI AFFILIATE</div>
        <div style={{ color: '#00ff9f', textShadow: '0 0 8px #00ff9f88' }}>PIXEL OFFICE</div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bookshelf */}
      <PixelBookshelf />

      {/* Water cooler */}
      <WaterCooler />
    </div>
  )
}

function PixelWindow() {
  const buildings = [6, 10, 7, 13, 8, 5, 11, 9, 7, 12]
  return (
    <div style={{
      width: 54, height: 46,
      background: '#08172e',
      border: '3px solid #1a2a48',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Cross dividers */}
      <div style={{ position: 'absolute', top: 0, left: '50%', bottom: 0, width: 1, background: '#1a2a48' }} />
      <div style={{ position: 'absolute', top: '43%', left: 0, right: 0, height: 1, background: '#1a2a48' }} />
      {/* Sky gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to bottom, #0a1e3a, #08172e)' }} />
      {/* City skyline */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 18, display: 'flex', alignItems: 'flex-end' }}>
        {buildings.map((h, i) => (
          <div key={i} style={{ flex: 1, height: h, background: i % 3 === 0 ? '#0d1e36' : '#0b1a30' }} />
        ))}
      </div>
      {/* Window light flickers */}
      <div style={{ position: 'absolute', top: 6, left: 4, width: 3, height: 3, background: '#ffee8844', animation: 'blink 3s step-end infinite' }} />
      <div style={{ position: 'absolute', top: 10, right: 6, width: 2, height: 2, background: '#4488ff44' }} />
    </div>
  )
}

function NeonSign() {
  const lines = [
    { text: 'FIND',   color: '#00ff9f' },
    { text: 'CREATE', color: '#ff4081' },
    { text: 'SELL',   color: '#00e5ff' },
    { text: 'REPEAT', color: '#ffb300' },
  ]
  return (
    <div style={{
      border: '1px solid #1a2540', padding: '6px 14px',
      background: '#04080f',
      display: 'flex', flexDirection: 'column', gap: 1,
    }}>
      {lines.map(({ text, color }) => (
        <div
          key={text}
          style={{
            fontFamily: 'VT323, monospace', fontSize: 15,
            color, letterSpacing: 4, lineHeight: 1.25,
            textShadow: `0 0 6px ${color}88`,
          }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}

function PixelBookshelf() {
  const rows = [
    ['#ff5252', '#00e5ff', '#ffb300', '#00ff9f'],
    ['#ff9800', '#ff4081', '#4488ff'],
    ['#66bb6a', '#ff5252', '#00e5ff', '#ffb300'],
  ]
  return (
    <div style={{
      width: 46,
      height: 62,
      background: '#08101e',
      border: '2px solid #1a2540',
      borderBottom: '4px solid #1a2540',
      padding: '2px 3px 0',
      display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      {rows.map((books, r) => (
        <div key={r} style={{
          flex: 1,
          display: 'flex', alignItems: 'flex-end', gap: 1,
          borderBottom: '1px solid #1a2540', paddingBottom: 1,
        }}>
          {books.map((color, i) => (
            <div key={i} style={{
              width: 5 + (i % 2),
              height: `${70 + (i * 7 + r * 5) % 28}%`,
              background: color,
              opacity: 0.75,
            }} />
          ))}
        </div>
      ))}
    </div>
  )
}

function WaterCooler() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginLeft: 6 }}>
      {/* Jug */}
      <div style={{
        width: 14, height: 18,
        background: 'linear-gradient(to right, #1e4a80, #0d3060)',
        border: '1px solid #2a5a90',
      }}>
        <div style={{ width: 5, height: 3, background: '#1a6090', margin: '2px auto' }} />
      </div>
      {/* Body */}
      <div style={{
        width: 20, height: 22,
        background: '#0c1525',
        border: '2px solid #1a2540',
        borderTop: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 3,
      }}>
        <div style={{ width: 6, height: 3, background: '#00e5ff88' }} />
        <div style={{ width: 6, height: 3, background: '#ff525288' }} />
      </div>
      {/* Base */}
      <div style={{ width: 22, height: 3, background: '#1a2540' }} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Floor strip between rows
// ─────────────────────────────────────────────

function FloorStrip() {
  return (
    <div style={{
      margin: '10px 14px',
      height: 28,
      background: 'repeating-linear-gradient(90deg, #07090f 0px, #07090f 39px, #090c14 40px)',
      border: '1px solid #0e1628',
      display: 'flex', alignItems: 'center', gap: 14, padding: '0 10px',
    }}>
      <FloorPlant />
      <div style={{ flex: 1, height: 1, background: '#0e1628' }} />
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540', letterSpacing: 2 }}>
        ── FLOOR 1 ──
      </span>
      <div style={{ flex: 1, height: 1, background: '#0e1628' }} />
      <FloorPlant />
    </div>
  )
}

function FloorPlant() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <div style={{ width: 3, height: 8, background: '#1a5c28', transformOrigin: 'bottom', transform: 'rotate(-18deg)' }} />
        <div style={{ width: 3, height: 11, background: '#22782e' }} />
        <div style={{ width: 3, height: 8, background: '#1a5c28', transformOrigin: 'bottom', transform: 'rotate(18deg)' }} />
      </div>
      <div style={{ width: 10, height: 6, background: '#5c3010', border: '1px solid #3c2008' }} />
    </div>
  )
}
