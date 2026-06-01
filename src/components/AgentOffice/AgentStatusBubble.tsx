import type { AgentStatus } from '../../agents/agentRegistry'

interface Props {
  status: AgentStatus
  accent: string
  size?: 'sm' | 'md'
}

const STATUS_CFG: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  working:      { label: 'กำลังทำงาน', color: '',        icon: '●' },
  done:         { label: 'เสร็จแล้ว',  color: '#00ff9f', icon: '✓' },
  needs_review: { label: 'รอตรวจ',     color: '#ffb300', icon: '⚠' },
  blocked:      { label: 'ติดปัญหา',   color: '#ff5252', icon: '⛔' },
  failed:       { label: 'ล้มเหลว',   color: '#ff5252', icon: '⛔' },
  idle:         { label: 'ว่าง',       color: '#2a3560', icon: '○' },
  waiting:      { label: 'รอข้อมูล',  color: '#4a5680', icon: '◌' },
}

export default function AgentStatusBubble({ status, accent, size = 'md' }: Props) {
  const cfg    = STATUS_CFG[status]
  const color  = status === 'working' ? accent : cfg.color
  const isWrk  = status === 'working'
  const fsize  = size === 'sm' ? 10 : 11
  const pad    = size === 'sm' ? '1px 6px' : '2px 8px'

  return (
    <div style={{
      display:    'inline-flex',
      alignItems: 'center',
      gap:        3,
      background: `${color}18`,
      border:     `1px solid ${color}44`,
      padding:    pad,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        fontFamily: 'VT323, monospace',
        fontSize:   fsize + 2,
        color,
        lineHeight: 1,
        animation:  isWrk ? 'blink 1.5s ease-in-out infinite' : 'none',
      }}>
        {cfg.icon}
      </span>
      <span style={{
        fontFamily: 'Sarabun, sans-serif',
        fontSize:   fsize,
        color:      `${color}cc`,
        lineHeight: 1,
      }}>
        {cfg.label}
      </span>
    </div>
  )
}
