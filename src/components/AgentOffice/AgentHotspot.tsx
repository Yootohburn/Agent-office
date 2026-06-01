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

interface Props {
  agent:     Agent
  selected:  boolean
  onClick:   () => void
  spriteSrc?: string
  /** Percentage x position relative to scene container */
  x: number
  /** Percentage y position relative to scene container */
  y: number
}

function shortTask(text: string): string {
  return text.length <= 22 ? text : text.slice(0, 22) + '…'
}

export default function AgentHotspot({ agent, selected, onClick, spriteSrc, x, y }: Props) {
  const accent   = ROOM_ACCENT[agent.id]
  const hasRisk  = agent.risks.length > 0
  const isActive = agent.status === 'working' || agent.status === 'needs_review'
  const isBlocked = agent.status === 'blocked' || agent.status === 'failed'

  return (
    <div
      onClick={onClick}
      title={agent.thaiName}
      style={{
        position:  'absolute',
        left:      `${x}%`,
        top:       `${y}%`,
        transform: 'translateX(-50%)',
        display:   'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:        3,
        cursor:    'pointer',
        zIndex:    selected ? 10 : 1,
        width:     120,
        filter:    selected ? `drop-shadow(0 0 10px ${accent}77)` : 'none',
        transition: 'filter 0.15s',
        userSelect: 'none',
      }}
    >
      {/* Status bubble */}
      <AgentStatusBubble status={agent.status} accent={accent} size="sm" />

      {/* Task bubble */}
      <div style={{
        fontFamily:    'Sarabun, sans-serif',
        fontSize:      10,
        color:         isBlocked ? '#ff7070' : isActive ? `${accent}cc` : '#4a5680',
        background:    '#060a14',
        border:        `1px solid ${isBlocked ? '#ff525244' : isActive ? accent + '33' : '#1a2540'}`,
        padding:       '1px 6px',
        whiteSpace:    'nowrap',
        maxWidth:      120,
        overflow:      'hidden',
        textOverflow:  'ellipsis',
        letterSpacing: 0.3,
      }}>
        {shortTask(agent.currentTask)}
      </div>

      {/* Sprite / avatar */}
      <div style={{
        background: selected ? `${accent}11` : 'transparent',
        border:     `1px solid ${selected ? accent + '55' : 'transparent'}`,
        padding:    '3px 5px',
        display:    'flex',
        justifyContent: 'center',
        alignItems:     'flex-end',
        minHeight:  96,
      }}>
        <OfficeAgentSprite
          agentId={agent.id}
          status={agent.status}
          spriteSrc={spriteSrc}
          height={88}
        />
      </div>

      {/* Thai display name */}
      <div style={{
        fontFamily:  'Sarabun, sans-serif',
        fontSize:    11,
        color:       selected ? accent : '#8892b0',
        textAlign:   'center',
        lineHeight:  1.3,
        maxWidth:    116,
        fontWeight:  selected ? 'bold' : 'normal',
      }}>
        {agent.thaiName}
      </div>

      {/* Progress bar */}
      <div style={{ width: 80, height: 2, background: '#1a2540' }}>
        <div style={{ width: `${agent.progress}%`, height: '100%', background: accent }}/>
      </div>

      {/* Risk badge */}
      {hasRisk && (
        <div style={{
          fontFamily: 'VT323, monospace',
          fontSize:   11,
          color:      '#ffb300',
          background: '#ffb30011',
          border:     '1px solid #ffb30033',
          padding:    '0 5px',
          letterSpacing: 0.5,
        }}>
          ⚠ {agent.risks.length} ความเสี่ยง
        </div>
      )}

    </div>
  )
}
