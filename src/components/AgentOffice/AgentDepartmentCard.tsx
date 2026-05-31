import type { Agent, AgentStatus } from '../../agents/agentRegistry'
import { getCampaignById, PLATFORM_CONFIG } from '../../agents/campaignRegistry'

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

export default function AgentDepartmentCard({ agent, selected, onClick }: Props) {
  const statusCfg = STATUS_CONFIG[agent.status]
  const campaign = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const platformCfg = campaign ? PLATFORM_CONFIG[campaign.platform] : null

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#0f1a2e' : '#0c1425',
        border: `2px solid ${selected ? statusCfg.color : '#1a2540'}`,
        borderTop: `4px solid ${statusCfg.color}`,
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.1s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 220,
      }}
    >
      {/* Top row: status + platform */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 11,
            color: statusCfg.color,
            letterSpacing: 1,
            animation: statusCfg.blink ? 'blink 1s step-end infinite' : 'none',
          }}
        >
          ● {statusCfg.label}
        </span>
        {platformCfg && (
          <span
            style={{
              fontFamily: 'VT323, monospace',
              fontSize: 11,
              color: platformCfg.color,
              background: `${platformCfg.color}22`,
              padding: '1px 8px',
              letterSpacing: 1,
            }}
          >
            {platformCfg.label}
          </span>
        )}
      </div>

      {/* Agent name + title */}
      <div>
        <div
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 20,
            color: '#e8eaf6',
            lineHeight: 1.1,
            marginBottom: 2,
          }}
        >
          {agent.name}
        </div>
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 9,
            color: '#4a5680',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {agent.title}
        </div>
      </div>

      {/* Current campaign */}
      {campaign && (
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 9,
            color: platformCfg?.color ?? '#4a5680',
            background: `${platformCfg?.color ?? '#4a5680'}11`,
            padding: '3px 8px',
            borderLeft: `2px solid ${platformCfg?.color ?? '#4a5680'}`,
          }}
        >
          {campaign.name}
        </div>
      )}

      {/* Current task */}
      <div
        style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 10,
          color: '#8892b0',
          lineHeight: 1.4,
          flex: 1,
        }}
      >
        {agent.currentTask}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#2a3560', letterSpacing: 1 }}>PROGRESS</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: statusCfg.color }}>{agent.progress}%</span>
        </div>
        <div style={{ background: '#1a2540', height: 5 }}>
          <div style={{ background: statusCfg.color, height: '100%', width: `${agent.progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Decision needed badge */}
      {agent.decisionNeeded && (
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 9,
            color: '#ff9800',
            background: '#ff980011',
            padding: '4px 8px',
            borderLeft: '2px solid #ff9800',
            lineHeight: 1.4,
          }}
        >
          ◆ {agent.decisionNeeded}
        </div>
      )}

      {/* Risk warning */}
      {agent.risks.length > 0 && (
        <div
          style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 9,
            color: '#ffb300',
            background: '#ffb30011',
            padding: '3px 8px',
            borderLeft: '2px solid #ffb300',
          }}
        >
          ⚠ {agent.risks[0]}
        </div>
      )}
    </div>
  )
}
