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
    <div style={{ background: FLOOR_BG, paddingBottom: 16, paddingTop: 14 }}>

      {/* ── Desk row 1 ── */}
      <div style={{ padding: '0 14px' }}>
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
