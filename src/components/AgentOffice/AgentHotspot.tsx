import type { Agent, AgentStatus, DepartmentId } from '../../agents/agentRegistry'
import OfficeAgentSprite from './OfficeAgentSprite'

const ROOM_ACCENT: Record<DepartmentId, string> = {
  'product-research':    '#00e5ff',
  'offer-analyst':       '#ffb300',
  'content-strategy':    '#ff9800',
  'script-writer':       '#ff4081',
  'creative-production': '#a855f7',
  'social-performance':  '#00ff9f',
}

// Matches AgentStatusBubble data so we can render inline
const S_ICON: Record<AgentStatus, string> = {
  working:      '●',
  done:         '✓',
  needs_review: '⚠',
  blocked:      '⛔',
  failed:       '⛔',
  idle:         '○',
  waiting:      '◌',
}
const S_COLOR: Record<AgentStatus, string> = {
  working:      '',           // filled in from accent at runtime
  done:         '#00ff9f',
  needs_review: '#ffb300',
  blocked:      '#ff5252',
  failed:       '#ff5252',
  idle:         '#2a3560',
  waiting:      '#4a5680',
}

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
  const accent     = ROOM_ACCENT[agent.id]
  const hasRisk    = agent.risks.length > 0
  const isActive   = agent.status === 'working' || agent.status === 'needs_review'
  const isBlocked  = agent.status === 'blocked' || agent.status === 'failed'

  const sColor = agent.status === 'working' ? accent : S_COLOR[agent.status]
  const sIcon  = S_ICON[agent.status]

  // Agents at x>55% (right column) get their bubble on the LEFT side,
  // all others get it on the RIGHT — uses the empty inter-desk space.
  const bubbleSide: 'left' | 'right' = (x + offsetX) > 55 ? 'left' : 'right'
  const bubbleBorder = isActive ? `${accent}66` : '#1a254099'

  const effectiveX = x + offsetX
  const effectiveY = y + offsetY

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
        filter:          selected ? `drop-shadow(0 0 8px ${accent}66)` : 'none',
        transition:      'filter 0.15s',
        userSelect:      'none',
      }}
    >

      {/* ── Side speech bubble ─────────────────────────────────────────────
          Positioned absolutely outside the hotspot's width into the empty
          desk-row space. pointerEvents:none so clicks still reach the sprite. */}
      <div style={{
        position:      'absolute',
        top:           30,
        ...(bubbleSide === 'right' ? { left: 168 } : { right: 168 }),
        background:    '#06090ff2',
        border:        `1px solid ${bubbleBorder}`,
        padding:       '5px 9px',
        display:       'flex',
        alignItems:    'center',
        gap:           5,
        minWidth:      72,
        maxWidth:      140,
        zIndex:        25,
        pointerEvents: 'none',
      }}>

        {/* Triangle pointing toward the agent */}
        <div style={{
          position:     'absolute',
          top:          '50%',
          transform:    'translateY(-50%)',
          width:        0,
          height:       0,
          borderTop:    '5px solid transparent',
          borderBottom: '5px solid transparent',
          ...(bubbleSide === 'right'
            ? { left: -6,  borderRight: `5px solid ${bubbleBorder}` }
            : { right: -6, borderLeft:  `5px solid ${bubbleBorder}` }),
        }} />

        {/* Status icon */}
        <span style={{
          fontFamily: 'VT323, monospace',
          fontSize:   14,
          color:      sColor,
          flexShrink: 0,
          lineHeight: 1,
        }}>
          {sIcon}
        </span>

        {/* Task text */}
        <span style={{
          fontFamily:   'Sarabun, sans-serif',
          fontSize:     10,
          color:        isBlocked ? '#ff7070' : isActive ? `${accent}cc` : '#4a5680',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   1.3,
        }}>
          {bubbleText(agent)}
        </span>
      </div>

      {/* ── Sprite / avatar ── */}
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

      {/* ── Thai display name ── */}
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

      {/* ── Progress bar ── */}
      <div style={{ width: 100, height: 2, background: '#1a2540' }}>
        <div style={{ width: `${agent.progress}%`, height: '100%', background: accent }} />
      </div>

      {/* ── Risk badge ── */}
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
