import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentRoom from './AgentRoom'

interface Props {
  agents: Agent[]
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

const ROW_LABELS = ['ROW A — RESEARCH · PROFIT · STRATEGY', 'ROW B — SCRIPT · CREATIVE · SOCIAL']

export default function PixelOfficeScene({ agents, selectedAgentId, onSelectAgent }: Props) {
  const row1 = agents.slice(0, 3)
  const row2 = agents.slice(3, 6)

  return (
    <div style={{ background: FLOOR_BG, paddingBottom: 16, boxShadow: 'inset 0 0 60px #000a' }}>

      {/* ── Office banner ── */}
      <OfficeBanner/>

      {/* ── Desk row 1 ── */}
      <RowHeader label={ROW_LABELS[0]}/>
      <div style={{ padding: '0 14px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          borderLeft: '2px solid #0e1628', borderRight: '2px solid #0e1628',
          padding: '0 8px',
        }}>
          {row1.map((agent, i) => (
            <div key={agent.id} style={{
              borderRight: i < 2 ? '1px solid #0c1222' : 'none',
              paddingRight: i < 2 ? 8 : 0,
            }}>
              <AgentRoom
                agent={agent}
                selected={selectedAgentId === agent.id}
                onClick={() => onSelectAgent(agent.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Floor strip between rows ── */}
      <FloorStrip/>

      {/* ── Desk row 2 ── */}
      <RowHeader label={ROW_LABELS[1]}/>
      <div style={{ padding: '0 14px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          borderLeft: '2px solid #0e1628', borderRight: '2px solid #0e1628',
          padding: '0 8px',
        }}>
          {row2.map((agent, i) => (
            <div key={agent.id} style={{
              borderRight: i < 2 ? '1px solid #0c1222' : 'none',
              paddingRight: i < 2 ? 8 : 0,
            }}>
              <AgentRoom
                agent={agent}
                selected={selectedAgentId === agent.id}
                onClick={() => onSelectAgent(agent.id)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// Office banner — top of scene
// ─────────────────────────────────────────────

function OfficeBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 22px 6px',
      borderBottom: '1px solid #0e1628',
      background: '#05080e',
    }}>
      <FloorPlant />
      <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, #0e1628 0px, #0e1628 4px, transparent 4px, transparent 8px)' }}/>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#1a2848', letterSpacing: 3 }}>
        ── AGENT OFFICE FLOOR 1 ──
      </span>
      <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, #0e1628 0px, #0e1628 4px, transparent 4px, transparent 8px)' }}/>
      <FloorPlant />
    </div>
  )
}

// ─────────────────────────────────────────────
// Row header — subtle label above each desk row
// ─────────────────────────────────────────────

function RowHeader({ label }: { label: string }) {
  return (
    <div style={{
      padding: '5px 22px 3px',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{ width: 3, height: 3, background: '#1a2540' }}/>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#1a2540', letterSpacing: 2 }}>
        {label}
      </span>
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
      height: 32,
      background: 'repeating-linear-gradient(90deg, #07090f 0px, #07090f 39px, #090c14 40px)',
      border: '1px solid #0e1628',
      display: 'flex', alignItems: 'center', gap: 0, overflow: 'hidden',
    }}>
      {/* Left plant */}
      <div style={{ paddingLeft: 10, paddingRight: 10, flexShrink: 0 }}>
        <FloorPlant />
      </div>

      {/* Divider ticks — 3 columns marked */}
      {[0, 1].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0 }}>
          <div style={{ flex: 1, height: 1, background: '#0e1628' }}/>
          {/* Cubicle divider tick */}
          <div style={{
            width: 1, height: 20, background: '#0e1e38',
            flexShrink: 0, margin: '0 2px',
          }}/>
        </div>
      ))}
      <div style={{ flex: 1, height: 1, background: '#0e1628' }}/>

      {/* Center label */}
      <span style={{
        fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540',
        letterSpacing: 2, flexShrink: 0, padding: '0 10px',
      }}>
        ── FLOOR 1 ──
      </span>

      {[0, 1].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0 }}>
          <div style={{ flex: 1, height: 1, background: '#0e1628' }}/>
          <div style={{
            width: 1, height: 20, background: '#0e1e38',
            flexShrink: 0, margin: '0 2px',
          }}/>
        </div>
      ))}
      <div style={{ flex: 1, height: 1, background: '#0e1628' }}/>

      {/* Right plant */}
      <div style={{ paddingLeft: 10, paddingRight: 10, flexShrink: 0 }}>
        <FloorPlant />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Pixel plant decoration
// ─────────────────────────────────────────────

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
