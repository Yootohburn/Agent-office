// Legacy component — kept for reference. Replaced by AgentDepartmentCard in the main layout.
import type { Agent, AgentStatus } from '../../agents/agentRegistry'

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; blink: boolean }> = {
  idle:         { label: 'IDLE',         color: '#555e7a', blink: false },
  working:      { label: 'WORKING',      color: '#00ff9f', blink: true  },
  waiting:      { label: 'WAITING',      color: '#ffb300', blink: false },
  blocked:      { label: 'BLOCKED',      color: '#ff5252', blink: true  },
  needs_review: { label: 'NEEDS REVIEW', color: '#ff9800', blink: true  },
  done:         { label: 'DONE',         color: '#00e5ff', blink: false },
  failed:       { label: 'FAILED',       color: '#ff1744', blink: false },
}

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
}

export default function AgentStatusCard({ agent, selected, onClick }: Props) {
  const statusCfg = STATUS_CONFIG[agent.status]

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#0f1a2e' : '#0c1425',
        border: `2px solid ${selected ? statusCfg.color : '#1a2540'}`,
        borderLeft: `4px solid ${statusCfg.color}`,
        padding: '12px',
        cursor: 'pointer',
        transition: 'border-color 0.1s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: statusCfg.color, animation: statusCfg.blink ? 'blink 1s step-end infinite' : 'none', letterSpacing: 1 }}>
          ● {statusCfg.label}
        </span>
      </div>

      <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: '#e8eaf6', marginBottom: 2, lineHeight: 1.1 }}>
        {agent.name}
      </div>

      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#4a5680', marginBottom: 10 }}>
        {agent.role}
      </div>

      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#8892b0', marginBottom: 8, minHeight: 28, lineHeight: 1.4 }}>
        {agent.currentTask}
      </div>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#4a5680' }}>PROGRESS</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: statusCfg.color }}>{agent.progress}%</span>
        </div>
        <div style={{ background: '#1a2540', height: 6 }}>
          <div style={{ background: statusCfg.color, height: '100%', width: `${agent.progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {agent.risks.length > 0 && (
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ffb300', marginTop: 6, padding: '3px 6px', background: '#ffb30011', borderLeft: '2px solid #ffb300' }}>
          ⚠ {agent.risks[0]}
        </div>
      )}
    </div>
  )
}
