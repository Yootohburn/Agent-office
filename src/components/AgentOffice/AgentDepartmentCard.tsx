import type { Agent, AgentStatus } from '../../agents/agentRegistry'
import { getCampaignById, CHANNEL_CONFIG } from '../../agents/campaignRegistry'

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
  const channelCfg = campaign ? CHANNEL_CONFIG[campaign.channel] : null
  const isFinance = agent.id === 'finance-controller'

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#0f1a2e' : '#0c1425',
        border: `2px solid ${selected ? statusCfg.color : '#1a2540'}`,
        borderTop: `4px solid ${statusCfg.color}`,
        padding: '14px',
        cursor: 'pointer',
        transition: 'border-color 0.1s',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minHeight: 210,
      }}
    >
      {/* Status + channel badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: statusCfg.color, letterSpacing: 1, animation: statusCfg.blink ? 'blink 1s step-end infinite' : 'none' }}>
          ● {statusCfg.label}
        </span>
        {channelCfg && (
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: channelCfg.color, background: `${channelCfg.color}22`, padding: '1px 8px', letterSpacing: 1 }}>
            {channelCfg.label.toUpperCase()}
          </span>
        )}
      </div>

      {/* Thai name */}
      <div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: '#e8eaf6', lineHeight: 1.2, marginBottom: 2 }}>
          {agent.thaiName}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#2a3560', letterSpacing: 1, textTransform: 'uppercase' }}>
          {agent.title}
        </div>
      </div>

      {/* Current campaign */}
      {campaign && channelCfg && (
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: channelCfg.color, background: `${channelCfg.color}11`, padding: '3px 8px', borderLeft: `2px solid ${channelCfg.color}` }}>
          {campaign.name}
        </div>
      )}

      {/* Finance quick stats (only for finance agent) */}
      {isFinance && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <MiniStat label="กำไรสุทธิ" value="฿3,150" color="#00ff9f" />
          <MiniStat label="ROAS เฉลี่ย" value="4.6x" color="#00e5ff" />
        </div>
      )}

      {/* Current task */}
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#8892b0', lineHeight: 1.4, flex: 1 }}>
        {agent.currentTask}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1 }}>PROGRESS</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: statusCfg.color }}>{agent.progress}%</span>
        </div>
        <div style={{ background: '#1a2540', height: 4 }}>
          <div style={{ background: statusCfg.color, height: '100%', width: `${agent.progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Decision needed */}
      {agent.decisionNeeded && (
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#ff9800', background: '#ff980011', padding: '3px 6px', borderLeft: '2px solid #ff9800', lineHeight: 1.4 }}>
          ◆ {agent.decisionNeeded.substring(0, 70)}{agent.decisionNeeded.length > 70 ? '...' : ''}
        </div>
      )}

      {/* Risk */}
      {agent.risks.length > 0 && (
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 8, color: '#ffb300', background: '#ffb30011', padding: '3px 6px', borderLeft: '2px solid #ffb300', lineHeight: 1.4 }}>
          ⚠ {agent.risks[0].substring(0, 70)}{agent.risks[0].length > 70 ? '...' : ''}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#060d1a', padding: '3px 6px', border: '1px solid #1a2540' }}>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 7, color: '#2a3560', marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color }}>{value}</div>
    </div>
  )
}
