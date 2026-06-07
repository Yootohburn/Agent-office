import { useState, useRef, useEffect, useCallback } from 'react'
import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import { getCampaignById, CHANNEL_CONFIG, PIPELINE_STAGES } from '../../agents/campaignRegistry'
import type { Campaign, AgentOutput } from '../../agents/campaignRegistry'
import { getMockResponse, getMockResponseWithContext } from '../../agents/agentChatRouter'
import type { ChatMessage } from '../../agents/agentConversationStore'
import { getConversation, addMessage, createMessage } from '../../agents/agentConversationStore'
import { getInitialGreeting } from '../../agents/agentChatRouter'
import { buildAgentContext } from '../../services/agentContextBuilder'
import { STAGE_OWNER } from '../../agents/agentTaskRouter'

const AGENT_ACCENT: Record<DepartmentId, string> = {
  'product-research':    '#00e5ff',
  'offer-analyst':       '#ffb300',
  'content-strategy':    '#ff9800',
  'script-writer':       '#ff4081',
  'creative-production': '#a855f7',
  'social-performance':  '#00ff9f',
}

const STAGE_LABEL: Record<string, string> = Object.fromEntries(
  PIPELINE_STAGES.map(s => [s.id, s.label])
)

const CHANNEL_SHORT: Record<string, string> = {
  shopee:  'Shopee',
  lazada:  'Lazada',
  tiktok:  'TikTok Shop',
}

const QUICK_PROMPTS: Record<DepartmentId, string[]> = {
  'product-research':   ['สรุปสินค้านี้', 'จุดขายคืออะไร', 'มีข้อมูลอะไรขาด', 'สินค้านี้เสี่ยงไหม'],
  'offer-analyst':      ['วิเคราะห์กำไร', 'คำนวณ ROAS คุ้มทุน', 'ควรเพิ่มงบไหม', 'แคมเปญนี้ขาดทุนเพราะอะไร'],
  'content-strategy':   ['ควรขายมุมไหน', 'หา hook framework', 'เลือก target audience', 'ทำ CTA ให้หน่อย'],
  'script-writer':      ['เขียน Hook 5 แบบ', 'ทำสคริปต์ 30 วิ', 'ทำ Caption TikTok', 'ทำ Storyboard'],
  'creative-production':['ทำ thumbnail brief', 'ต้องใช้ asset อะไร', 'ทำ Canva brief', 'ทำ A/B creative idea'],
  'social-performance': ['เขียนโพสต์ Facebook', 'เขียน IG caption', 'ทำ pinned comment', 'วิเคราะห์ performance'],
}

interface Props {
  agent:            Agent
  onClose:          () => void
  currentStageLabel?: string
  latestOutput?:    AgentOutput
  selectedCampaign?: Campaign | null
}

function initConversation(agentId: DepartmentId): ChatMessage[] {
  const existing = getConversation(agentId)
  if (existing.length > 0) return existing
  const greeting = createMessage(agentId, 'agent', getInitialGreeting(agentId))
  addMessage(greeting)
  return [greeting]
}

export default function AgentCommandPanel({ agent, onClose, currentStageLabel, latestOutput, selectedCampaign }: Props) {
  const fallbackCampaign = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const activeCampaign   = selectedCampaign ?? fallbackCampaign
  const channelCfg       = activeCampaign ? CHANNEL_CONFIG[activeCampaign.channel] : null
  const accent           = AGENT_ACCENT[agent.id]

  const ownerAgentId     = activeCampaign ? STAGE_OWNER[activeCampaign.stage] : null
  const isOwner          = ownerAgentId === agent.id
  const context          = buildAgentContext(activeCampaign ?? null, agent)

  const [messages, setMessages] = useState<ChatMessage[]>(() => initConversation(agent.id))
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(initConversation(agent.id))
    setInputText('')
    setIsTyping(false)
  }, [agent.id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg = createMessage(agent.id, 'user', trimmed, {
      campaignId: activeCampaign?.id ?? undefined,
    })
    addMessage(userMsg)
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    const { text: responseText, intent, mockDelay } = activeCampaign
      ? getMockResponseWithContext(agent.id, trimmed, context)
      : getMockResponse(agent.id, trimmed, agent.currentCampaignId ?? undefined)

    setTimeout(() => {
      const agentMsg = createMessage(agent.id, 'agent', responseText, {
        campaignId: activeCampaign?.id ?? undefined,
        intent,
      })
      addMessage(agentMsg)
      setMessages(prev => [...prev, agentMsg])
      setIsTyping(false)
    }, mockDelay)
  }, [agent.id, activeCampaign, context, isTyping])

  const agentShortName = agent.thaiName.split('/')[0].trim()
  const quickPrompts   = QUICK_PROMPTS[agent.id] ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Sarabun, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1a2540', flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'VT323, monospace', fontSize: 13, color: '#4a5680',
            background: 'none', border: '1px solid #1a2540', padding: '2px 8px',
            cursor: 'pointer', marginBottom: 10, letterSpacing: 1,
          }}
        >
          ✕ ปิด
        </button>

        <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: accent, lineHeight: 1.1, marginBottom: 2 }}>
          ▶ {agent.thaiName}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#4a5680', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          {agent.title} · {agent.status.replace(/_/g, ' ')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
          {activeCampaign && channelCfg && (
            <div>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, marginBottom: 2 }}>แคมเปญปัจจุบัน</div>
              <div style={{ fontSize: 13, color: channelCfg.color, lineHeight: 1.3 }}>{activeCampaign.name}</div>
            </div>
          )}
          <div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, marginBottom: 2 }}>ขั้นตอนถัดไป</div>
            <div style={{ fontSize: 13, color: '#00e5ff', lineHeight: 1.3 }}>
              {agent.nextAction.length > 55 ? agent.nextAction.slice(0, 55) + '…' : agent.nextAction}
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, marginBottom: 2 }}>งานปัจจุบัน</div>
            <div style={{ fontSize: 13, color: '#8892b0', lineHeight: 1.4 }}>
              {agent.currentTask.length > 85 ? agent.currentTask.slice(0, 85) + '…' : agent.currentTask}
            </div>
          </div>
        </div>

        {agent.risks.length > 0 && (
          <div style={{ background: '#ff525211', border: '1px solid #ff525233', borderLeft: '3px solid #ff5252', padding: '6px 10px', marginTop: 8, fontSize: 13, color: '#ff5252', lineHeight: 1.4 }}>
            ⚠ {agent.risks[0]}
          </div>
        )}
        {agent.decisionNeeded && (
          <div style={{ background: '#ff980011', border: '1px solid #ff980033', borderLeft: '3px solid #ff9800', padding: '6px 10px', marginTop: 6, fontSize: 13, color: '#ff9800', lineHeight: 1.4 }}>
            ◆ {agent.decisionNeeded.length > 90 ? agent.decisionNeeded.slice(0, 90) + '…' : agent.decisionNeeded}
          </div>
        )}

        {/* Stage + latest output */}
        {(currentStageLabel || latestOutput) && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {currentStageLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1 }}>STAGE</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: accent, background: `${accent}14`, padding: '1px 8px', border: `1px solid ${accent}33`, letterSpacing: 1 }}>
                  {currentStageLabel}
                </span>
              </div>
            )}
            {latestOutput && (
              <div style={{ background: '#06090f', border: '1px solid #1a2540', borderLeft: `2px solid ${accent}`, padding: '5px 8px' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, marginBottom: 2 }}>ผลลัพธ์ล่าสุด</div>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#6878a0', lineHeight: 1.4 }}>
                  {latestOutput.summary.length > 85 ? latestOutput.summary.slice(0, 85) + '…' : latestOutput.summary}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Context Chips (shown when campaign is selected) ── */}
      {activeCampaign && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #1a2540', flexShrink: 0, background: '#080c18' }}>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', letterSpacing: 1, marginBottom: 5 }}>
            CONTEXT
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <ContextChip label="Agent"    value={agentShortName}                               color={accent} />
            <ContextChip label="Campaign" value={activeCampaign.name.slice(0, 20) + (activeCampaign.name.length > 20 ? '…' : '')} color={channelCfg?.color ?? '#e8eaf6'} />
            <ContextChip label="Stage"    value={STAGE_LABEL[activeCampaign.stage] ?? activeCampaign.stage} color="#8892b0" />
            <ContextChip label="Platform" value={CHANNEL_SHORT[activeCampaign.channel] ?? activeCampaign.channel} color={channelCfg?.color ?? '#e8eaf6'} />
            <ContextChip label="Risk"     value={activeCampaign.riskLevel.toUpperCase()}
              color={activeCampaign.riskLevel === 'critical' ? '#ff5252' : activeCampaign.riskLevel === 'high' ? '#ff9800' : activeCampaign.riskLevel === 'medium' ? '#ffb300' : '#2a3560'} />
            {activeCampaign.targetPrice && (
              <ContextChip label="Price" value={activeCampaign.targetPrice} color="#e8eaf6" />
            )}
          </div>
          {!isOwner && ownerAgentId && (
            <div style={{ marginTop: 5, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ffb300' }}>
              ⚠ ผู้รับผิดชอบขั้นตอนนี้คือ {ownerAgentId.replace(/-/g, ' ')}
            </div>
          )}
        </div>
      )}

      {/* ── Quick Prompts ── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a2540', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 1, marginBottom: 6 }}>
          QUICK PROMPTS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={isTyping}
              style={{
                fontFamily: 'Sarabun, sans-serif', fontSize: 12,
                color:      isTyping ? '#2a3560' : accent,
                background: `${accent}08`,
                border:     `1px solid ${accent}22`,
                padding: '5px 8px', cursor: isTyping ? 'default' : 'pointer',
                textAlign: 'left', lineHeight: 1.3,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '90%',
              alignSelf:  msg.sender === 'user' ? 'flex-end' : 'flex-start',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', letterSpacing: 0.5 }}>
              {msg.sender === 'user' ? 'คุณ' : agentShortName} — {msg.timestamp}
            </div>
            <div style={{
              fontFamily: 'Sarabun, sans-serif', fontSize: 14, lineHeight: 1.6,
              padding: '8px 12px',
              background: msg.sender === 'user' ? `${accent}11` : '#0c1425',
              border:     `1px solid ${msg.sender === 'user' ? `${accent}33` : '#1a2540'}`,
              color:      msg.sender === 'user' ? accent : '#e8eaf6',
              whiteSpace: 'pre-line',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ alignSelf: 'flex-start' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#2a3560', marginBottom: 3 }}>
              {agentShortName} กำลังพิมพ์…
            </div>
            <div style={{ background: '#0c1425', border: '1px solid #1a2540', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6,
                  background: accent,
                  animation: `blink 1s step-end ${i * 0.3}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input ── */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #1a2540', display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(inputText) }}
          placeholder="พิมพ์คำถามหรือคำสั่ง..."
          disabled={isTyping}
          style={{
            flex: 1, background: '#0c1425',
            border: `1px solid ${isTyping ? '#1a2540' : '#2a3560'}`,
            color: '#e8eaf6', fontFamily: 'Sarabun, sans-serif', fontSize: 14,
            padding: '8px 12px', outline: 'none',
          }}
        />
        <button
          onClick={() => send(inputText)}
          disabled={isTyping || !inputText.trim()}
          style={{
            fontFamily: 'VT323, monospace', fontSize: 16,
            color: '#06090f',
            background: isTyping || !inputText.trim() ? '#2a3560' : accent,
            border: 'none', padding: '8px 16px',
            cursor: isTyping || !inputText.trim() ? 'default' : 'pointer',
            letterSpacing: 1, flexShrink: 0, transition: 'background 0.1s',
          }}
        >
          ส่ง ▶
        </button>
      </div>

    </div>
  )
}

function ContextChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
      background: `${color}0d`, border: `1px solid ${color}28`,
      padding: '1px 6px', lineHeight: 1.6,
    }}>
      <span style={{ color: '#2a3560' }}>{label}: </span>
      <span style={{ color }}>{value}</span>
    </div>
  )
}
