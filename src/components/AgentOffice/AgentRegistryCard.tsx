import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentStatusBubble from './AgentStatusBubble'
import OfficeAgentSprite from './OfficeAgentSprite'

const ACCENT: Record<DepartmentId, string> = {
  'product-research':    '#00e5ff',
  'offer-analyst':       '#ffb300',
  'content-strategy':    '#ff9800',
  'script-writer':       '#ff4081',
  'creative-production': '#a855f7',
  'social-performance':  '#00ff9f',
}

const SPRITE_PATHS: Partial<Record<DepartmentId, string>> = {
  'product-research':    '/assets/pixel-office/agents/product-research.png',
  'offer-analyst':       '/assets/pixel-office/agents/offer-profit-analyst.png',
  'content-strategy':    '/assets/pixel-office/agents/content-strategy.png',
  'script-writer':       '/assets/pixel-office/agents/script-storyboard.png',
  'creative-production': '/assets/pixel-office/agents/creative-production.png',
  'social-performance':  '/assets/pixel-office/agents/social-performance.png',
}

const AGENT_TAGS: Record<DepartmentId, string[]> = {
  'product-research':    ['Research', 'Shopee', 'Lazada', 'TikTok'],
  'offer-analyst':       ['Finance', 'ROAS', 'Commission'],
  'content-strategy':    ['Strategy', 'Hook', 'Platform'],
  'script-writer':       ['Script', '30s', 'Storyboard'],
  'creative-production': ['Canva', 'CapCut', 'Assets'],
  'social-performance':  ['Analytics', 'UTM', 'TikTok'],
}

interface Props {
  agent:    Agent
  selected: boolean
  onSelect: (id: DepartmentId) => void
}

function clip(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max - 1) + '…'
}

export default function AgentRegistryCard({ agent, selected, onSelect }: Props) {
  const accent = ACCENT[agent.id]
  const tags   = AGENT_TAGS[agent.id]
  const isActive = agent.status === 'working' || agent.status === 'needs_review'
  const isBlocked = agent.status === 'blocked' || agent.status === 'failed'

  return (
    <div
      onClick={() => onSelect(agent.id)}
      style={{
        background:  selected ? `${accent}0a` : '#080c18',
        border:      `1px solid ${selected ? accent + '55' : '#1a2540'}`,
        padding:     '10px 12px',
        display:     'flex',
        flexDirection: 'column',
        gap:         8,
        cursor:      'pointer',
        transition:  'border-color 0.1s',
        filter:      selected ? `drop-shadow(0 0 6px ${accent}33)` : 'none',
      }}
    >
      {/* Row 1: status + risk */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AgentStatusBubble status={agent.status} accent={accent} size="sm" />
        {agent.risks.length > 0 && (
          <div style={{
            fontFamily:  'VT323, monospace',
            fontSize:    11,
            color:       '#ffb300',
            background:  '#ffb30011',
            border:      '1px solid #ffb30033',
            padding:     '0 5px',
          }}>
            ⚠ {agent.risks.length}
          </div>
        )}
      </div>

      {/* Row 2: sprite + info */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          flexShrink:    0,
          width:         60,
          display:       'flex',
          alignItems:    'flex-end',
          justifyContent: 'center',
          minHeight:     72,
          background:    selected ? `${accent}08` : 'transparent',
          border:        `1px solid ${selected ? accent + '33' : 'transparent'}`,
          padding:       '2px 3px',
        }}>
          <OfficeAgentSprite
            agentId={agent.id}
            status={agent.status}
            spriteSrc={SPRITE_PATHS[agent.id]}
            height={72}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily:  'Sarabun, sans-serif',
            fontSize:    14,
            fontWeight:  'bold',
            color:       selected ? accent : '#c8d6f0',
            lineHeight:  1.2,
            marginBottom: 2,
          }}>
            {agent.thaiName}
          </div>
          <div style={{
            fontFamily:  'Share Tech Mono, monospace',
            fontSize:    9,
            color:       '#2a3560',
            letterSpacing: 0.3,
            marginBottom: 6,
          }}>
            {agent.title}
          </div>
          <div style={{
            fontFamily:  'Sarabun, sans-serif',
            fontSize:    11,
            color:       isBlocked ? '#ff7070' : isActive ? `${accent}cc` : '#4a5680',
            lineHeight:  1.4,
            marginBottom: 4,
          }}>
            {clip(agent.currentTask, 40)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, height: 3, background: '#1a2540', borderRadius: 0 }}>
              <div style={{ width: `${agent.progress}%`, height: '100%', background: accent, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', flexShrink: 0 }}>
              {agent.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: tags */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <span key={tag} style={{
            fontFamily:  'Share Tech Mono, monospace',
            fontSize:    9,
            color:       `${accent}99`,
            background:  `${accent}0d`,
            border:      `1px solid ${accent}22`,
            padding:     '1px 5px',
            letterSpacing: 0.5,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Row 4: campaign */}
      {agent.currentCampaignId && (
        <div style={{
          fontFamily:  'Share Tech Mono, monospace',
          fontSize:    9,
          color:       '#2a3560',
          letterSpacing: 0.3,
        }}>
          Campaign: {agent.currentCampaignId}
        </div>
      )}

      {/* Row 5: action button */}
      <button
        onClick={e => { e.stopPropagation(); onSelect(agent.id) }}
        style={{
          fontFamily:  'Sarabun, sans-serif',
          fontSize:    12,
          color:       selected ? accent : '#4a5680',
          background:  selected ? `${accent}18` : 'transparent',
          border:      `1px solid ${selected ? accent + '55' : '#1a2540'}`,
          padding:     '5px 8px',
          cursor:      'pointer',
          letterSpacing: 0.3,
          textAlign:   'center',
          width:       '100%',
        }}
      >
        {selected ? '✓ เลือกแล้ว — คุยกับ Agent ทางขวา' : 'เลือก Agent'}
      </button>
    </div>
  )
}
