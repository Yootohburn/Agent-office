import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentRegistryCard from './AgentRegistryCard'

interface Props {
  agents:          Agent[]
  selectedAgentId: DepartmentId | null
  onSelectAgent:   (id: DepartmentId) => void
}

export default function AgentRegistryView({ agents, selectedAgentId, onSelectAgent }: Props) {
  const workingCount = agents.filter(a => a.status === 'working').length
  const reviewCount  = agents.filter(a => a.status === 'needs_review').length
  const doneCount    = agents.filter(a => a.status === 'done').length
  const idleCount    = agents.filter(a => a.status === 'idle' || a.status === 'waiting').length

  return (
    <div style={{ overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Registry header ── */}
      <div>
        <div style={{
          fontFamily:   'VT323, monospace',
          fontSize:     20,
          color:        '#00ff9f',
          letterSpacing: 2,
          marginBottom: 10,
          lineHeight:   1,
        }}>
          ░ AGENT REGISTRY — ทะเบียน AI ทีมงาน
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatChip label="Agent ทั้งหมด"   value={agents.length} color="#00e5ff" />
          <StatChip label="กำลังทำงาน"      value={workingCount}  color="#00ff9f" />
          <StatChip label="รอตรวจสอบ"       value={reviewCount}   color="#ffb300" />
          <StatChip label="เสร็จแล้ว"        value={doneCount}     color="#a855f7" />
          <StatChip label="ว่าง / รอข้อมูล" value={idleCount}     color="#4a5680" />
        </div>
      </div>

      {/* ── Active Agents ── */}
      <div style={{ paddingBottom: 16 }}>
        <SectionLabel>ACTIVE AGENTS — ทีมงาน AI ฝ่ายผลิต ({agents.length} / {agents.length})</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {agents.map(agent => (
            <AgentRegistryCard
              key={agent.id}
              agent={agent}
              selected={selectedAgentId === agent.id}
              onSelect={onSelectAgent}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StatChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      display:    'flex',
      alignItems: 'center',
      gap:        6,
      background: `${color}0f`,
      border:     `1px solid ${color}30`,
      padding:    '4px 10px',
    }}>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: 22, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: `${color}aa` }}>{label}</span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily:   'Share Tech Mono, monospace',
      fontSize:     10,
      color:        '#2a3560',
      letterSpacing: 1.5,
      borderBottom: '1px solid #1a2540',
      paddingBottom: 6,
      marginBottom: 10,
    }}>
      {children}
    </div>
  )
}
