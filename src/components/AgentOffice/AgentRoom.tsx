import type { Agent, AgentStatus, DepartmentId } from '../../agents/agentRegistry'
import { getCampaignById, CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import { companySummary } from '../../agents/financeRegistry'
import PixelAgentAvatar from './PixelAgentAvatar'
import RoomStatusIndicator from './RoomStatusIndicator'

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
      <RoomScene
        agentId={agent.id}
        status={agent.status}
        accent={meta.accent}
        roomLabel={meta.label}
        avatarLeft={meta.avatarLeft}
      />

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

// ─────────────────────────────────────────────
// Room scene
// ─────────────────────────────────────────────

interface RoomSceneProps {
  agentId: DepartmentId
  status: AgentStatus
  accent: string
  roomLabel: string
  avatarLeft: string
}

function RoomScene({ agentId, status, accent, roomLabel, avatarLeft }: RoomSceneProps) {
  const isActive  = status === 'working' || status === 'needs_review'
  const isBlocked = status === 'blocked'  || status === 'failed'
  const statusLightColor = isBlocked ? '#ff5252' : isActive ? accent : '#1a2540'

  return (
    <div style={{
      position: 'relative', height: 110, overflow: 'hidden', background: '#060d1a',
      backgroundImage: 'radial-gradient(circle, #1a2540 1px, transparent 1px)',
      backgroundSize: '10px 10px',
    }}>
      <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, height: 1, background: '#1a2540' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: '#08101e' }} />
      <div style={{ position: 'absolute', bottom: 28, left: '6%', right: '6%', height: 3, background: '#162040', borderTop: `1px solid ${accent}22` }} />
      <RoomElements agentId={agentId} accent={accent} status={status} />
      <div style={{ position: 'absolute', bottom: 31, left: avatarLeft, transform: 'translateX(-50%)' }}>
        <PixelAgentAvatar agentId={agentId} status={status} />
      </div>
      <div style={{ position: 'absolute', top: 6, left: 8, fontFamily: 'VT323, monospace', fontSize: 10, color: `${accent}77`, letterSpacing: 2 }}>
        {roomLabel}
      </div>
      <div style={{ position: 'absolute', top: 5, right: 8 }}>
        <RoomStatusIndicator status={status} />
      </div>
      <div style={{
        position: 'absolute', bottom: 32, right: '8%', width: 4, height: 4,
        background: statusLightColor, boxShadow: `0 0 5px ${statusLightColor}`,
        animation: (isActive || isBlocked) ? 'blink 1s step-end infinite' : 'none',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────
// Room elements per department
// ─────────────────────────────────────────────

interface ElementsProps {
  agentId: DepartmentId
  accent: string
  status: AgentStatus
}

function RoomElements({ agentId, accent, status }: ElementsProps) {
  const isWorking = status === 'working'
  const isBlocked = status === 'blocked' || status === 'failed'
  const screenGlow = isBlocked ? '#ff5252' : isWorking ? accent : `${accent}44`

  switch (agentId) {
    case 'ceo-director':    return <CeoScene    accent={accent} screenGlow={screenGlow} isWorking={isWorking} />
    case 'product-analyst': return <ProductScene accent={accent} screenGlow={screenGlow} isWorking={isWorking} />
    case 'content-studio':  return <ContentScene accent={accent} isWorking={isWorking} />
    case 'social-community-manager': return <SocialScene accent={accent} isWorking={isWorking} />
    case 'ops-review':      return <OpsScene     accent={accent} screenGlow={screenGlow} isBlocked={isBlocked} isWorking={isWorking} />
    case 'finance-controller': return <FinanceScene accent={accent} screenGlow={screenGlow} isWorking={isWorking} />
  }
}

function CeoScene({ accent, screenGlow, isWorking }: { accent: string; screenGlow: string; isWorking: boolean }) {
  return (
    <>
      <div style={{ position: 'absolute', top: 16, left: 8, width: 20, height: 52, background: '#040a14', border: `1px solid ${accent}44` }}>
        <div style={{ padding: '4px 3px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[100, 60, 85, 45].map((w, i) => (
            <div key={i} style={{ height: 2, background: i === 0 ? accent : `${accent}44`, width: `${w}%` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', top: -3, left: '50%', width: 4, height: 4, background: accent, transform: 'translateX(-50%)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 31, left: '22%' }}>
        <div style={{ width: 32, height: 22, background: '#040a14', border: `2px solid ${screenGlow}`, position: 'relative' }}>
          <div style={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ height: 2, background: `${accent}99`, width: '90%' }} />
            <div style={{ height: 2, background: `${accent}55`, width: '65%' }} />
            <div style={{ height: 2, background: `${accent}99`, width: '80%' }} />
          </div>
          {isWorking && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 3, height: 3, background: accent, animation: 'blink 0.8s step-end infinite' }} />}
        </div>
        <div style={{ width: 8, height: 2, background: '#1a2540', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 32, left: '8%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <div style={{ width: 14, height: 10, background: '#040a14', border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: `${accent}88` }}>✓</span>
        </div>
        <div style={{ width: 14, height: 2, background: `${accent}33` }} />
        <div style={{ width: 14, height: 2, background: `${accent}22` }} />
      </div>
    </>
  )
}

function ProductScene({ accent, screenGlow, isWorking }: { accent: string; screenGlow: string; isWorking: boolean }) {
  const trendBars = [28, 44, 36, 60, 75]
  return (
    <>
      <div style={{ position: 'absolute', bottom: 32, left: '5%', display: 'flex', alignItems: 'flex-end', gap: 3, height: 44 }}>
        {trendBars.map((h, i) => (
          <div key={i} style={{ width: 5, height: `${h}%`, minHeight: 3, background: i === trendBars.length - 1 ? accent : `${accent}55` }} />
        ))}
        {isWorking && <div style={{ width: 5, height: 2, background: accent, position: 'absolute', top: 0, right: 0, animation: 'blink 1s step-end infinite' }} />}
      </div>
      <div style={{ position: 'absolute', bottom: 31, left: '26%' }}>
        <div style={{ width: 36, height: 26, background: '#040a14', border: `2px solid ${screenGlow}`, position: 'relative' }}>
          <div style={{ height: 3, background: `${accent}33`, borderBottom: `1px solid ${accent}44`, padding: '0 3px', display: 'flex', alignItems: 'center' }}>
            <div style={{ height: 1, background: `${accent}88`, width: '70%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, padding: '2px 4px', height: 18 }}>
            {[40, 75, 55, 88].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 3 ? accent : `${accent}55` }} />
            ))}
          </div>
          {isWorking && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 3, height: 3, background: accent, animation: 'blink 0.8s step-end infinite' }} />}
        </div>
        <div style={{ width: 10, height: 2, background: '#1a2540', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', top: 22, right: '6%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        {[20, 16, 12].map((w, i) => (
          <div key={i} style={{ width: w, height: 9, background: '#0a1420', border: `1px solid ${accent}${i === 0 ? '55' : '33'}` }} />
        ))}
      </div>
    </>
  )
}

function ContentScene({ accent, isWorking }: { accent: string; isWorking: boolean }) {
  return (
    <>
      <div style={{
        position: 'absolute', top: 16, left: '5%', width: 38, height: 38, borderRadius: '50%',
        border: `3px solid ${accent}`, boxShadow: isWorking ? `0 0 10px ${accent}44` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: isWorking ? `${accent}22` : '#060d1a', animation: isWorking ? 'glow-pulse 1.5s ease-in-out infinite' : 'none' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 31, left: '30%', width: 28, height: 32, background: '#040a14', border: `1px solid ${accent}44` }}>
        <div style={{ padding: '4px 3px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[90, 70, 80, 60, 75].map((w, i) => (
            <div key={i} style={{ height: 2, background: i === 0 ? accent : `${accent}44`, width: `${w}%` }} />
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 34, right: '5%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 32, height: 22, background: '#040a14', border: `2px solid ${accent}66` }}>
          <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', border: `2px solid ${accent}` }} />
          <div style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translate(-50%, -50%)', width: 6, height: 6, borderRadius: '50%', background: isWorking ? accent : `${accent}55` }} />
          <div style={{ position: 'absolute', top: 2, right: 2, width: 4, height: 4, borderRadius: '50%', background: isWorking ? '#ff5252' : '#1a2540', animation: isWorking ? 'blink 1s step-end infinite' : 'none' }} />
        </div>
        <div style={{ width: 3, height: 7, background: '#1a2540' }} />
        <div style={{ width: 12, height: 1, background: '#1a2540' }} />
      </div>
    </>
  )
}

function OpsScene({ accent, screenGlow, isBlocked, isWorking }: { accent: string; screenGlow: string; isBlocked: boolean; isWorking: boolean }) {
  const items = [
    { char: '✓', color: '#00ff9f' },
    { char: '✓', color: '#00ff9f' },
    { char: '✗', color: '#ff5252' },
    { char: '✓', color: '#00ff9f' },
    { char: '☐', color: '#4a5680' },
  ]
  return (
    <>
      <div style={{ position: 'absolute', top: 16, left: 8, width: 26, height: 54, background: '#040a14', border: `1px solid ${accent}44` }}>
        <div style={{ padding: '4px 3px', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: item.color, lineHeight: 1 }}>{item.char}</span>
              <div style={{ height: 1, flex: 1, background: `${item.color}33` }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 31, left: '35%' }}>
        <div style={{
          width: 32, height: 22,
          background: isBlocked ? '#140808' : '#040a14',
          border: `2px solid ${isBlocked ? '#ff5252' : screenGlow}`,
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isBlocked ? (
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: '#ff5252', animation: 'blink 0.5s step-end infinite' }}>⚠</span>
          ) : (
            <div style={{ padding: 3, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ height: 2, background: `${accent}88`, width: '85%' }} />
              <div style={{ height: 2, background: `${accent}44`, width: '60%' }} />
              <div style={{ height: 2, background: `${accent}88`, width: '75%' }} />
            </div>
          )}
          {isWorking && !isBlocked && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 3, height: 3, background: accent, animation: 'blink 0.8s step-end infinite' }} />}
        </div>
        <div style={{ width: 8, height: 2, background: '#1a2540', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', top: 20, right: '6%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
        {[3, 2, 1].map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 9, color: `${accent}55` }}>{n}</span>
            <div style={{ width: 18, height: 7, background: '#0a1420', border: `1px solid ${accent}${i === 0 ? '44' : '22'}` }} />
          </div>
        ))}
      </div>
    </>
  )
}

function FinanceScene({ accent, screenGlow, isWorking }: { accent: string; screenGlow: string; isWorking: boolean }) {
  const revBars = [38, 55, 48, 72]
  return (
    <>
      <div style={{ position: 'absolute', bottom: 32, left: '5%', display: 'flex', alignItems: 'flex-end', gap: 4, height: 45 }}>
        {revBars.map((h, i) => {
          const isLast = i === revBars.length - 1
          return (
            <div key={i} style={{ width: 6, height: `${h}%`, minHeight: 4, background: isLast ? accent : `${accent}55`, position: 'relative' }}>
              {isLast && isWorking && <div style={{ position: 'absolute', top: -2, left: 0, right: 0, height: 2, background: accent, animation: 'blink 1s step-end infinite' }} />}
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 31, left: '30%' }}>
        <div style={{ width: 38, height: 26, background: '#040a14', border: `2px solid ${screenGlow}`, padding: '3px 4px' }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 8, color: `${accent}88`, letterSpacing: 1 }}>ROAS</div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: accent, lineHeight: 1.1 }}>4.6x</div>
          <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: 2, background: i <= 3 ? accent : `${accent}22` }} />
            ))}
          </div>
        </div>
        <div style={{ width: 10, height: 2, background: '#1a2540', margin: '0 auto' }} />
      </div>
      <div style={{ position: 'absolute', top: 18, right: '8%', background: '#040a14', border: '1px solid #1a2540', padding: '5px 6px', display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff525444' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffb30044' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
      </div>
    </>
  )
}

function SocialScene({ accent, isWorking }: { accent: string; isWorking: boolean }) {
  return (
    <>
      {/* Phone prop */}
      <div style={{ position: 'absolute', bottom: 32, left: '8%', width: 22, height: 38, background: '#040a14', border: `2px solid ${accent}66`, borderRadius: 2 }}>
        <div style={{ margin: '3px 2px', background: '#060d1a', height: 24, display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
          <div style={{ height: 2, background: `${accent}99`, width: '80%' }} />
          <div style={{ height: 2, background: `${accent}44`, width: '60%' }} />
          <div style={{ display: 'flex', gap: 2, marginTop: 1 }}>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 8, color: accent, lineHeight: 1 }}>♥</span>
            <div style={{ height: 2, background: `${accent}33`, flex: 1, alignSelf: 'center' }} />
          </div>
          {isWorking && <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, margin: '0 auto', animation: 'blink 1.2s step-end infinite' }} />}
        </div>
        <div style={{ width: 6, height: 1, background: `${accent}44`, margin: '0 auto' }} />
      </div>
      {/* Notification bubbles */}
      <div style={{ position: 'absolute', top: 14, right: '5%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
        {[
          { icon: 'f', label: '2' },
          { icon: '◈', label: '5' },
        ].map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 9, color: `${accent}88` }}>{b.label}</span>
            <div style={{ width: 14, height: 10, background: '#040a14', border: `1px solid ${accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 8, color: `${accent}99` }}>{b.icon}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Post drafts stack */}
      <div style={{ position: 'absolute', bottom: 32, left: '38%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 28, height: 7, background: '#040a14',
            border: `1px solid ${i === 0 ? `${accent}66` : `${accent}22`}`,
            padding: '1px 3px',
          }}>
            <div style={{ height: 1, background: i === 0 ? `${accent}88` : `${accent}33`, width: `${90 - i * 20}%` }} />
          </div>
        ))}
      </div>
    </>
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
