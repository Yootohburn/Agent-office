import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

interface Props {
  agentId: DepartmentId
  status: AgentStatus
  /** Scale factor — defaults to 1 */
  scale?: number
}

const BODY_COLORS: Record<DepartmentId, string> = {
  'product-research':   '#00e5ff',
  'offer-analyst':      '#ffb300',
  'content-strategy':   '#ff9800',
  'script-writer':      '#ff4081',
  'creative-production':'#a855f7',
  'social-performance': '#00ff9f',
}

// Small accessory character rendered below body
const ACCESSORIES: Record<DepartmentId, { char: string; color: string }> = {
  'product-research':   { char: '▦', color: '#00e5ff' },   // data grid / research
  'offer-analyst':      { char: '▲', color: '#ffb300' },   // chart up / profit
  'content-strategy':   { char: '⊡', color: '#ff9800' },   // planning grid
  'script-writer':      { char: '⊙', color: '#ff4081' },   // camera lens / script
  'creative-production':{ char: '◈', color: '#a855f7' },   // stylus / design
  'social-performance': { char: '♥', color: '#00ff9f' },   // social/performance heart
}

// Drop-shadow glow per status
const GLOW: Partial<Record<AgentStatus, string>> = {
  working:      '#00ff9f',
  blocked:      '#ff5252',
  needs_review: '#ff9800',
  failed:       '#ff1744',
  done:         '#00e5ff',
}

export default function PixelAgentAvatar({ agentId, status, scale = 1 }: Props) {
  const bodyColor = BODY_COLORS[agentId]
  const accessory = ACCESSORIES[agentId]
  const glow = GLOW[status]

  const s = (px: number) => Math.round(px * scale)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      filter: glow ? `drop-shadow(0 0 ${s(4)}px ${glow})` : 'none',
      imageRendering: 'pixelated',
    }}>

      {/* Head */}
      <div style={{
        width: s(14),
        height: s(12),
        background: '#d4a87a',
        position: 'relative',
      }}>
        {/* Left eye */}
        <div style={{ position: 'absolute', width: s(2), height: s(2), background: '#2a1000', top: s(4), left: s(3) }} />
        {/* Right eye */}
        <div style={{ position: 'absolute', width: s(2), height: s(2), background: '#2a1000', top: s(4), right: s(3) }} />
        {/* Mouth */}
        <div style={{ position: 'absolute', width: s(4), height: s(1), background: '#8b5533', bottom: s(2), left: s(5) }} />
      </div>

      {/* Body / outfit */}
      <div style={{
        width: s(14),
        height: s(16),
        background: bodyColor,
        opacity: 0.95,
      }} />

      {/* Accessory icon */}
      <div style={{
        fontFamily: 'VT323, monospace',
        fontSize: s(11),
        color: accessory.color,
        lineHeight: 1,
        marginTop: s(1),
      }}>
        {accessory.char}
      </div>

    </div>
  )
}
