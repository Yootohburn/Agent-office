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
  working:      '',           // filled from accent
  done:         '#00ff9f',
  needs_review: '#ffb300',
  blocked:      '#ff5252',
  failed:       '#ff5252',
  idle:         '#2a3560',
  waiting:      '#4a5680',
}

export interface AgentSceneConfig {
  x:       number   // % horizontal center of desk
  y:       number   // % from top where sprite BOTTOM (feet) should appear
  scale:   number   // size multiplier
  offsetX: number   // fine-tune horizontal shift in %
  offsetY: number   // fine-tune vertical shift in %
  anchor:  'bottom-center'
}

interface Props {
  agent:       Agent
  selected:    boolean
  onClick:     () => void
  spriteSrc?:  string
  sceneConfig: AgentSceneConfig
}

function bubbleTask(agent: Agent): string {
  if (agent.status === 'idle')    return 'ว่าง'
  if (agent.status === 'waiting') return 'รอข้อมูล'
  if (agent.status === 'done')    return 'เสร็จแล้ว ✓'
  const t = agent.currentTask
  return t.length <= 22 ? t : t.slice(0, 21) + '…'
}

// Sprite height — increase here to resize all scene agents at once.
const SPRITE_HEIGHT = 240

export default function AgentHotspot({ agent, selected, onClick, spriteSrc, sceneConfig }: Props) {
  const { x, y, scale, offsetX, offsetY } = sceneConfig
  const accent     = ROOM_ACCENT[agent.id]
  const hasRisk    = agent.risks.length > 0
  const isActive   = agent.status === 'working' || agent.status === 'needs_review'
  const isBlocked  = agent.status === 'blocked' || agent.status === 'failed'

  const sColor = agent.status === 'working' ? accent : S_COLOR[agent.status]
  const sIcon  = S_ICON[agent.status]

  // x > 55% → bubble LEFT, x < 30% → bubble RIGHT, 30-55% → bubble ABOVE (avoids overlap)
  const effectiveX = x + offsetX
  const bubbleSide: 'left' | 'right' | 'above' =
    effectiveX > 55 ? 'left' : effectiveX < 30 ? 'right' : 'above'
  const bubbleBorder = isActive ? `${accent}66` : '#1a254099'

  return (
    <div
      onClick={onClick}
      title={agent.thaiName}
      style={{
        position:        'absolute',
        left:            `${x + offsetX}%`,
        bottom:          `${100 - (y + offsetY)}%`,
        transform:       `translateX(-50%) scale(${scale})`,
        transformOrigin: 'bottom center',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        gap:             3,
        cursor:          'pointer',
        zIndex:          selected ? 10 : 1,
        width:           160,
        // NOTE: NO filter:drop-shadow here. CSS filter outputs are not clipped
        // by overflow:hidden per the CSS Filters spec, so even a small glow
        // could escape the scene container and paint over the nav bar.
        // Selection is indicated via boxShadow on the sprite container instead.
        transition:      'opacity 0.15s',
        userSelect:      'none',
      }}
    >

      {/* ── Speech bubble: side (left/right) or above ── */}
      <div style={{
        position:      'absolute',
        ...(bubbleSide === 'right' ? { top: 20, left:  168 }
          : bubbleSide === 'left'  ? { top: 20, right: 168 }
          : { bottom: SPRITE_HEIGHT + 28, left: '50%', transform: 'translateX(-50%)' }),
        background:    '#06090ff5',
        border:        `1px solid ${bubbleBorder}`,
        padding:       '6px 10px',
        display:       'flex',
        flexDirection: 'column',
        gap:           3,
        minWidth:      80,
        maxWidth:      170,
        zIndex:        25,
        pointerEvents: 'none',
        whiteSpace:    'nowrap',
      }}>

        {/* CSS triangle pointing toward the agent */}
        <div style={{
          position: 'absolute',
          width:    0,
          height:   0,
          ...(bubbleSide === 'right' ? {
            top: '50%', transform: 'translateY(-50%)',
            left: -6, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `5px solid ${bubbleBorder}`,
          } : bubbleSide === 'left' ? {
            top: '50%', transform: 'translateY(-50%)',
            right: -6, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `5px solid ${bubbleBorder}`,
          } : {
            bottom: -6, left: '50%', transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${bubbleBorder}`,
          }),
        }} />

        {/* Row 1: status icon + Thai name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontFamily: 'VT323, monospace',
            fontSize:   13,
            color:      sColor,
            flexShrink: 0,
            lineHeight: 1,
          }}>
            {sIcon}
          </span>
          <span style={{
            fontFamily:   'Sarabun, sans-serif',
            fontSize:     10,
            color:        `${accent}bb`,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            whiteSpace:   'nowrap',
            fontWeight:   'bold',
            lineHeight:   1.2,
          }}>
            {agent.thaiName}
          </span>
        </div>

        {/* Row 2: task text */}
        <div style={{
          fontFamily:   'Sarabun, sans-serif',
          fontSize:     10,
          color:        isBlocked ? '#ff7070' : isActive ? '#c8d6f0' : '#4a5680',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          lineHeight:   1.3,
          paddingLeft:  17,   // align under the name (after icon width ~13px + gap 4px)
        }}>
          {bubbleTask(agent)}
        </div>
      </div>

      {/* ── Sprite / avatar ── */}
      <div style={{
        // boxShadow is always clipped to this element's box — it cannot escape
        // the scene container unlike filter:drop-shadow.
        boxShadow:      selected ? `0 0 16px ${accent}77, inset 0 0 20px ${accent}11` : 'none',
        background:     selected ? `${accent}0d` : 'transparent',
        border:         `1px solid ${selected ? accent + '66' : 'transparent'}`,
        padding:        '3px 5px',
        display:        'flex',
        justifyContent: 'center',
        alignItems:     'flex-end',
        minHeight:      SPRITE_HEIGHT + 4,
        width:          '100%',
        transition:     'box-shadow 0.15s, border-color 0.15s',
      }}>
        <OfficeAgentSprite
          agentId={agent.id}
          status={agent.status}
          spriteSrc={spriteSrc}
          height={SPRITE_HEIGHT}
        />
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
          ⚠ {agent.risks.length}
        </div>
      )}
    </div>
  )
}
