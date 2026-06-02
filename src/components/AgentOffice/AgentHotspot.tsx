import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentStatusBubble from './AgentStatusBubble'
import OfficeAgentSprite from './OfficeAgentSprite'

const ROOM_ACCENT: Record<DepartmentId, string> = {
  'product-research':    '#00e5ff',
  'offer-analyst':       '#ffb300',
  'content-strategy':    '#ff9800',
  'script-writer':       '#ff4081',
  'creative-production': '#a855f7',
  'social-performance':  '#00ff9f',
}

// ── Per-agent scene position config ─────────────────────────────────────────
// x        — horizontal center of desk, % from left edge of scene
// y        — target % from top where sprite BOTTOM (feet) should appear
// scale    — sprite size multiplier (1.0 = default 200px height)
// offsetX  — fine-tune horizontal shift in %
// offsetY  — fine-tune vertical shift in %; positive moves down
// anchor   — only 'bottom-center' is supported
// ─────────────────────────────────────────────────────────────────────────────
// The hotspot container uses `bottom: ${100 - (y + offsetY)}%` so its lowest
// edge (progress bar) sits at y%. Sprite feet land ~5% above that due to
// name/progress labels below the sprite. Tune offsetY to compensate.
export interface AgentSceneConfig {
  x:       number
  y:       number
  scale:   number
  offsetX: number
  offsetY: number
  anchor:  'bottom-center'
}

interface Props {
  agent:       Agent
  selected:    boolean
  onClick:     () => void
  spriteSrc?:  string
  sceneConfig: AgentSceneConfig
}

// Short bubble text for scene overlay — full task text stays in right panel.
function bubbleText(agent: Agent): string {
  if (agent.status === 'idle')    return 'ว่าง'
  if (agent.status === 'waiting') return 'รอข้อมูล'
  if (agent.status === 'done')    return 'เสร็จ ✓'
  const t = agent.currentTask
  return t.length <= 10 ? t : t.slice(0, 9) + '…'
}

const SPRITE_HEIGHT = 200

export default function AgentHotspot({ agent, selected, onClick, spriteSrc, sceneConfig }: Props) {
  const { x, y, scale, offsetX, offsetY } = sceneConfig
  const accent    = ROOM_ACCENT[agent.id]
  const hasRisk   = agent.risks.length > 0
  const isActive  = agent.status === 'working' || agent.status === 'needs_review'
  const isBlocked = agent.status === 'blocked' || agent.status === 'failed'

  // `bottom: ${100 - effectiveY}%` anchors the container's bottom edge at effectiveY% from top.
  const effectiveY = y + offsetY
  const effectiveX = x + offsetX

  return (
    <div
      onClick={onClick}
      title={agent.thaiName}
      style={{
        position:        'absolute',
        left:            `${effectiveX}%`,
        bottom:          `${100 - effectiveY}%`,
        transform:       `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             3,
        cursor:          'pointer',
        zIndex:          selected ? 10 : 1,
        width:           160,
        filter:          selected ? `drop-shadow(0 0 10px ${accent}77)` : 'none',
        transition:      'filter 0.15s',
        userSelect:      'none',
      }}
    >
      {/* Status bubble — floats above sprite */}
      <AgentStatusBubble status={agent.status} accent={accent} size="sm" />

      {/* Short task bubble */}
      <div style={{
        fontFamily:    'Sarabun, sans-serif',
        fontSize:      10,
        color:         isBlocked ? '#ff7070' : isActive ? `${accent}cc` : '#4a5680',
        background:    '#060a14ee',
        border:        `1px solid ${isBlocked ? '#ff525244' : isActive ? accent + '33' : '#1a2540'}`,
        padding:       '1px 6px',
        whiteSpace:    'nowrap',
        maxWidth:      150,
        overflow:      'hidden',
        textOverflow:  'ellipsis',
        letterSpacing: 0.3,
        zIndex:        20,
      }}>
        {bubbleText(agent)}
      </div>

      {/* Sprite / avatar — bottom-aligned inside container */}
      <div style={{
        background:     selected ? `${accent}11` : 'transparent',
        border:         `1px solid ${selected ? accent + '55' : 'transparent'}`,
        padding:        '3px 5px',
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'flex-end',
        minHeight:      SPRITE_HEIGHT + 4,
        width:          '100%',
      }}>
        <OfficeAgentSprite
          agentId={agent.id}
          status={agent.status}
          spriteSrc={spriteSrc}
          height={SPRITE_HEIGHT}
        />
      </div>

      {/* Thai display name */}
      <div style={{
        fontFamily:  'Sarabun, sans-serif',
        fontSize:    11,
        color:       selected ? accent : '#8892b0',
        textAlign:   'center',
        lineHeight:  1.3,
        maxWidth:    150,
        fontWeight:  selected ? 'bold' : 'normal',
      }}>
        {agent.thaiName}
      </div>

      {/* Progress bar */}
      <div style={{ width: 100, height: 2, background: '#1a2540' }}>
        <div style={{ width: `${agent.progress}%`, height: '100%', background: accent }} />
      </div>

      {/* Risk badge */}
      {hasRisk && (
        <div style={{
          fontFamily:    'VT323, monospace',
          fontSize:      11,
          color:         '#ffb300',
          background:    '#ffb30011',
          border:        '1px solid #ffb30033',
          padding:       '0 5px',
          letterSpacing: 0.5,
        }}>
          ⚠ {agent.risks.length} ความเสี่ยง
        </div>
      )}
    </div>
  )
}
