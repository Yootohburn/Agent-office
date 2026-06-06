import type { AgentStatus } from '../../agents/agentRegistry'

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
  status: AgentStatus
}

export default function RoomStatusIndicator({ status }: Props) {
  const cfg = STATUS_CONFIG[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 5,
        height: 5,
        background: cfg.color,
        boxShadow: `0 0 5px ${cfg.color}`,
        flexShrink: 0,
        animation: cfg.blink ? 'blink 1s step-end infinite' : 'none',
      }} />
      <span style={{
        fontFamily: 'VT323, monospace',
        fontSize: 13,
        color: cfg.color,
        letterSpacing: 1,
      }}>
        {cfg.label}
      </span>
    </div>
  )
}
