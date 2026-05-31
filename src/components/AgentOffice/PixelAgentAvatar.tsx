import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

interface Props {
  agentId: DepartmentId
  status: AgentStatus
  /** Scale factor — defaults to 1 */
  scale?: number
}

const BODY_COLORS: Record<DepartmentId, string> = {
  'ceo-director':             '#00ff9f',
  'product-analyst':          '#00e5ff',
  'content-studio':           '#ff9800',
  'social-community-manager': '#ff4081',
  'ops-review':               '#ffb300',
  'finance-controller':       '#00c8a0',
}

// Small accessory character rendered below body
const ACCESSORIES: Record<DepartmentId, { char: string; color: string }> = {
  'ceo-director':             { char: '▣', color: '#e8eaf6' },   // clipboard / stamp
  'product-analyst':          { char: '▦', color: '#00e5ff' },   // data grid
  'content-studio':           { char: '⊙', color: '#ffb300' },   // camera lens
  'social-community-manager': { char: '♥', color: '#ff4081' },   // social heart
  'ops-review':               { char: '☑', color: '#00ff9f' },   // checklist
  'finance-controller':       { char: '▲', color: '#00e5ff' },   // chart up
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
