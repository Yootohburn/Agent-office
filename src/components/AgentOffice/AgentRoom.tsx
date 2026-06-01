import type { Agent, AgentStatus, DepartmentId } from '../../agents/agentRegistry'
import { getCampaignById, CHANNEL_CONFIG } from '../../agents/campaignRegistry'
import DeskSceneSVG from './DeskSceneSVG'

const ROOM_META: Record<DepartmentId, { label: string; accent: string; avatarLeft: string }> = {
  'product-research':   { label: 'RESEARCH LAB',    accent: '#00e5ff', avatarLeft: '58%' },
  'offer-analyst':      { label: 'PROFIT LAB',       accent: '#ffb300', avatarLeft: '56%' },
  'content-strategy':   { label: 'STRATEGY ROOM',    accent: '#ff9800', avatarLeft: '54%' },
  'script-writer':      { label: 'SCRIPT STUDIO',    accent: '#ff4081', avatarLeft: '52%' },
  'creative-production':{ label: 'PRODUCTION ROOM',  accent: '#a855f7', avatarLeft: '57%' },
  'social-performance': { label: 'SOCIAL ROOM',      accent: '#00ff9f', avatarLeft: '60%' },
}

interface Props {
  agent: Agent
  selected: boolean
  onClick: () => void
}

const STATUS_BADGE: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  working:      { label: 'WORKING',      icon: '●', color: '' },   // color set from accent
  needs_review: { label: 'NEEDS REVIEW', icon: '⚠', color: '#ffb300' },
  blocked:      { label: 'BLOCKED',      icon: '⛔', color: '#ff5252' },
  failed:       { label: 'FAILED',       icon: '⛔', color: '#ff5252' },
  done:         { label: 'DONE',         icon: '✓', color: '#00ff9f' },
  idle:         { label: 'IDLE',         icon: '○', color: '#2a3560' },
  waiting:      { label: 'WAITING',      icon: '◌', color: '#4a5680' },
}

function getCardBorder(status: AgentStatus, accent: string, selected: boolean) {
  if (selected) return { border: `2px solid ${accent}`, borderTop: `4px solid ${accent}` }
  switch (status) {
    case 'working':      return { border: `2px solid ${accent}44`, borderTop: `4px solid ${accent}` }
    case 'needs_review': return { border: `2px solid #ffb30055`, borderTop: `4px solid #ffb300` }
    case 'blocked':
    case 'failed':       return { border: `2px solid #ff525255`, borderTop: `4px solid #ff5252` }
    case 'done':         return { border: `2px solid #00ff9f33`, borderTop: `4px solid #00ff9f55` }
    case 'waiting':      return { border: `2px solid #4a568033`, borderTop: `4px solid #4a5680` }
    default:             return { border: `2px solid #1a2540`, borderTop: `4px solid ${accent}44` }
  }
}

export default function AgentRoom({ agent, selected, onClick }: Props) {
  const meta       = ROOM_META[agent.id]
  const campaign   = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const channelCfg = campaign ? CHANNEL_CONFIG[campaign.channel] : null
  const statusBadge = STATUS_BADGE[agent.status]
  const badgeColor  = agent.status === 'working' ? meta.accent : statusBadge.color
  const borders     = getCardBorder(agent.status, meta.accent, selected)

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? '#0f1a2e' : '#0c1425',
        border: borders.border,
        borderTop: borders.borderTop,
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
        <div style={{ position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <TaskBubble
            text={agent.currentTask}
            status={agent.status}
            isActive={agent.status === 'working' || agent.status === 'needs_review'}
          />
        </div>
      </div>

      {/* ── Status badge bar ── */}
      <div style={{
        background: `${badgeColor}0d`,
        borderBottom: `1px solid ${badgeColor}33`,
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: badgeColor, lineHeight: 1 }}>
          {statusBadge.icon}
        </span>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: badgeColor, letterSpacing: 1.5, fontWeight: 'bold' }}>
          {statusBadge.label}
        </span>
        {campaign && (
          <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: `${badgeColor}88`, marginLeft: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
            {campaign.name.length > 16 ? campaign.name.slice(0, 16) + '…' : campaign.name}
          </span>
        )}
      </div>

      {/* ── Info section ── */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>

        {/* Name + channel badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 20, color: '#e8eaf6', lineHeight: 1.1, wordBreak: 'break-word', minWidth: 0 }}>
            {agent.thaiName}
          </div>
          {channelCfg && (
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: channelCfg.color, background: `${channelCfg.color}22`, padding: '1px 6px', flexShrink: 0, letterSpacing: 1, border: `1px solid ${channelCfg.color}44` }}>
              {channelCfg.label}
            </span>
          )}
        </div>

        {/* Current task */}
        <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 14, color: '#8892b0', lineHeight: 1.4, flex: 1 }}>
          {agent.currentTask.length > 70
            ? agent.currentTask.substring(0, 70) + '…'
            : agent.currentTask}
        </div>

        {/* Social-performance mini stats */}
        {agent.id === 'social-performance' && campaign && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <MiniStat label="กำไรสุทธิ"  value={`฿${campaign.finance.netProfit.toLocaleString('th-TH')}`} color="#00ff9f" />
            <MiniStat label="ROAS"        value={`${campaign.finance.roas}x`}                              color="#00e5ff" />
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

  const short = text.length > 22 ? text.slice(0, 22) + '…' : text
  const label = isBlocked ? `⚠ ${short}` : isDone ? `✓ เสร็จแล้ว` : status === 'idle' ? 'รอคิว…' : status === 'waiting' ? 'รอข้อมูล…' : short

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        background: bgColor,
        border: `1px solid ${border}`,
        borderLeft: isBlocked ? '2px solid #ff5252' : isDone ? '2px solid #00ff9f' : `1px solid ${border}`,
        padding: '3px 8px',
        display: 'flex', alignItems: 'center', gap: 4,
        whiteSpace: 'nowrap',
        boxShadow: isActive ? `0 0 6px ${txtColor}18` : 'none',
      }}>
        <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: txtColor, lineHeight: 1.3 }}>
          {label}
        </span>
        {isActive && !isBlocked && (
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: txtColor, lineHeight: 1, animation: 'blink 1s step-end infinite' }}>
            ▮
          </span>
        )}
      </div>
      <div style={{
        position: 'absolute', bottom: -5, left: '50%',
        transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `5px solid ${border}`,
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
