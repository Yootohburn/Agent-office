import type { Agent, AgentStatus, DepartmentId } from '../../agents/agentRegistry'
import { getCampaignById, CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import { companySummary } from '../../agents/financeRegistry'
import RoomStatusIndicator from './RoomStatusIndicator'
import DeskSceneSVG from './DeskSceneSVG'

const ROOM_META: Record<DepartmentId, { label: string; accent: string; avatarLeft: string }> = {
  'ceo-director':             { label: 'COMMAND ROOM',   accent: '#00ff9f', avatarLeft: '56%' },
  'product-analyst':          { label: 'RESEARCH LAB',   accent: '#00e5ff', avatarLeft: '58%' },
  'content-studio':           { label: 'CONTENT STUDIO', accent: '#ff9800', avatarLeft: '46%' },
  'social-community-manager': { label: 'SOCIAL STUDIO',  accent: '#ff4081', avatarLeft: '52%' },
  'ops-review':               { label: 'CONTROL ROOM',   accent: '#ffb300', avatarLeft: '57%' },
  'finance-controller':       { label: 'FINANCE ROOM',   accent: '#00c8a0', avatarLeft: '60%' },
}

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
}

export default function AgentRoom({ agent, selected, onClick }: Props) {
  const meta       = ROOM_META[agent.id]
  const campaign   = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const channelCfg = campaign ? CHANNEL_CONFIG[campaign.channel] : null
  const isFinance  = agent.id === 'finance-controller'

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#0f1a2e' : '#0c1425',
        border: `2px solid ${selected ? meta.accent : '#1a2540'}`,
        borderTop: `4px solid ${meta.accent}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.15s',
      }}
    >
      {/* ── Room scene ── */}
      <div style={{ position: 'relative' }}>
        <DeskSceneSVG
          agentId={agent.id}
          accent={meta.accent}
          status={agent.status}
          roomLabel={meta.label}
        />
        <div style={{ position: 'absolute', top: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <TaskBubble
            text={agent.currentTask}
            status={agent.status}
            isActive={agent.status === 'working' || agent.status === 'needs_review'}
          />
        </div>
        <div style={{ position: 'absolute', top: 6, right: 8 }}>
          <RoomStatusIndicator status={agent.status} />
        </div>
      </div>

      {/* ── Info section ── */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>

        {/* Name + channel badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 20, color: '#e8eaf6', lineHeight: 1.1, wordBreak: 'break-word' }}>
              {agent.thaiName}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
              {agent.title}
            </div>
          </div>
          {channelCfg && (
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: channelCfg.color, background: `${channelCfg.color}22`, padding: '1px 6px', flexShrink: 0, letterSpacing: 1 }}>
              {channelCfg.label.toUpperCase()}
            </span>
          )}
        </div>

        {/* Current task */}
        <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 14, color: '#8892b0', lineHeight: 1.4, flex: 1 }}>
          {agent.currentTask.length > 65
            ? agent.currentTask.substring(0, 65) + '…'
            : agent.currentTask}
        </div>

        {/* Finance mini stats — finance-controller only */}
        {isFinance && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <MiniStat label="กำไรสุทธิ"  value={formatTHB(companySummary.totalNetProfit)} color="#00ff9f" />
            <MiniStat label="ROAS เฉลี่ย" value={`${companySummary.avgRoas}x`}             color="#00e5ff" />
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#2a3560', letterSpacing: 1 }}>PROGRESS</span>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: meta.accent }}>{agent.progress}%</span>
          </div>
          <div style={{ background: '#1a2540', height: 3 }}>
            <div style={{ background: meta.accent, height: '100%', width: `${agent.progress}%` }} />
          </div>
        </div>

        {/* Risk / decision badges */}
        {(agent.decisionNeeded || agent.risks.length > 0) && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {agent.decisionNeeded && (
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#ff9800', background: '#ff980011', padding: '1px 6px', border: '1px solid #ff980033', letterSpacing: 0.5 }}>
                ◆ ต้องตัดสินใจ
              </span>
            )}
            {agent.risks.length > 0 && (
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#ffb300', background: '#ffb30011', padding: '1px 6px', border: '1px solid #ffb30033', letterSpacing: 0.5 }}>
                ⚠ {agent.risks.length} ความเสี่ยง
              </span>
            )}
          </div>
        )}

        {/* Next action */}
        <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 13, color: '#00e5ff', lineHeight: 1.4 }}>
          → {agent.nextAction.length > 65 ? agent.nextAction.substring(0, 65) + '…' : agent.nextAction}
        </div>

        {/* Chat button */}
        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          style={{
            fontFamily: 'VT323, monospace', fontSize: 15,
            color: meta.accent, background: `${meta.accent}11`,
            border: `1px solid ${meta.accent}44`,
            padding: '5px 0', cursor: 'pointer', letterSpacing: 1,
            width: '100%', textAlign: 'center', marginTop: 2,
          }}
        >
          ▶ คุยกับ Agent
        </button>

      </div>
    </div>
  )
}

function TaskBubble({ text, status, isActive }: { text: string; status: AgentStatus; isActive: boolean }) {
  const isBlocked = status === 'blocked' || status === 'failed'
  const isDone    = status === 'done'
  const bgColor   = isBlocked ? '#1a0808' : '#080f1e'
  const border    = isBlocked ? '#ff525244' : '#1e2e50'
  const txtColor  = isBlocked ? '#ff7070' : isDone ? '#00ff9f' : '#9baac8'

  const short = text.length > 18 ? text.slice(0, 18) + '…' : text
  const label = isBlocked ? `⚠ ${short}` : isDone ? `✓ done` : status === 'idle' ? 'idle...' : short

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        background: bgColor,
        border: `1px solid ${border}`,
        padding: '2px 6px',
        display: 'flex', alignItems: 'center', gap: 3,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 10, color: txtColor, lineHeight: 1.3 }}>
          {label}
        </span>
        {isActive && !isBlocked && (
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: txtColor, lineHeight: 1, animation: 'blink 1s step-end infinite' }}>
            ▮
          </span>
        )}
      </div>
      <div style={{
        position: 'absolute', bottom: -4, left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '4px solid transparent',
        borderRight: '4px solid transparent',
        borderTop: `4px solid ${border}`,
      }} />
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#060d1a', padding: '3px 6px', border: '1px solid #1a2540' }}>
      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color }}>{value}</div>
    </div>
  )
}
