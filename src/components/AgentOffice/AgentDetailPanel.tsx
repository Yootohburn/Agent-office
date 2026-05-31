import type { Agent } from '../../agents/agentRegistry'
import { getCampaignById, PIPELINE_STAGES, CHANNEL_CONFIG, getStageIndex, formatTHB } from '../../agents/campaignRegistry'
import { channelSummaries, companySummary, RECOMMENDATION_CONFIG } from '../../agents/financeRegistry'
import styles from './AgentDesk.module.css'

interface Props {
  agent: Agent
  onClose: () => void
}

export default function AgentDetailPanel({ agent, onClose }: Props) {
  const campaign = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const channelCfg = campaign ? CHANNEL_CONFIG[campaign.channel] : null
  const activeStageIdx = campaign ? getStageIndex(campaign.stage) : -1
  const isFinance = agent.id === 'finance-controller'

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
      {/* Close */}
      <button
        onClick={onClose}
        style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#4a5680', background: 'none', border: '1px solid #1a2540', padding: '2px 8px', cursor: 'pointer', marginBottom: 12, letterSpacing: 1 }}
      >
        ✕ ปิด
      </button>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a2540', paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: '#00ff9f', lineHeight: 1.2, marginBottom: 2 }}>
          ▶ {agent.thaiName}
        </div>
        <div style={{ fontSize: 8, color: '#4a5680', letterSpacing: 1, textTransform: 'uppercase' }}>
          {agent.title} · {agent.codeName}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Field label="STATUS" value={agent.status.replace(/_/g, ' ').toUpperCase()} />
        <Field label="PROGRESS" value={`${agent.progress}%`} />
      </div>

      {/* Finance Controller — dedicated financial view */}
      {isFinance && (
        <Section title="สรุปการเงินบริษัท">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            <FinRow label="รายได้รวม"         value={formatTHB(companySummary.totalRevenue)}     color="#e8eaf6" />
            <FinRow label="กำไรสุทธิ"         value={formatTHB(companySummary.totalNetProfit)}   color="#00ff9f" bold />
            <FinRow label="ค่าโฆษณารวม"       value={formatTHB(companySummary.totalAdSpend)}     color="#ffb300" />
            <FinRow label="ROAS เฉลี่ย"        value={`${companySummary.avgRoas}x`}               color={companySummary.avgRoas >= 4 ? '#00ff9f' : '#ffb300'} bold />
            <FinRow label="ยอดรอรับเงิน"      value={formatTHB(companySummary.totalPendingPayout)} color="#8892b0" />
          </div>
          <div style={{ fontSize: 9, color: '#4a5680', marginBottom: 4, letterSpacing: 1 }}>ช่องทางแยก</div>
          {channelSummaries.map(s => {
            const cfg = CHANNEL_CONFIG[s.channel]
            const rec = RECOMMENDATION_CONFIG[s.recommendation]
            return (
              <div key={s.channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #0f1a2e' }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: cfg.color }}>{cfg.label}</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: s.netProfit < 0 ? '#ff5252' : '#00ff9f' }}>{formatTHB(s.netProfit)}</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: s.roas >= 4 ? '#00ff9f' : '#ffb300' }}>{s.roas}x</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: rec.color }}>{rec.label}</span>
              </div>
            )
          })}

          {/* Finance recommendations */}
          <div style={{ marginTop: 10, fontSize: 9, color: '#4a5680', letterSpacing: 1, marginBottom: 4 }}>คำแนะนำ Finance Controller</div>
          {companySummary.activeWarnings.map((w, i) => (
            <div key={i} style={{ fontSize: 9, color: '#ff5252', background: '#ff525211', padding: '3px 8px', borderLeft: '2px solid #ff5252', marginBottom: 3, lineHeight: 1.4 }}>
              ⚠ {w}
            </div>
          ))}
        </Section>
      )}

      {/* Current campaign */}
      {campaign && channelCfg && (
        <Section title="แคมเปญปัจจุบัน">
          <div style={{ background: `${channelCfg.color}11`, border: `1px solid ${channelCfg.color}33`, padding: 10, marginBottom: 8 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: channelCfg.color, marginBottom: 4 }}>
              {campaign.name}
            </div>
            <div style={{ fontSize: 9, color: '#4a5680', marginBottom: 6 }}>
              Channel: <span style={{ color: channelCfg.color }}>{channelCfg.label}</span>
              &nbsp;&nbsp;·&nbsp;&nbsp;{campaign.category}
              &nbsp;&nbsp;·&nbsp;&nbsp;{campaign.targetPrice}
            </div>
            <div style={{ fontSize: 9, color: '#8892b0', lineHeight: 1.4, marginBottom: 8 }}>{campaign.brief}</div>

            {/* Pipeline mini */}
            <div style={{ display: 'flex', gap: 2 }}>
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage.id} title={stage.label} style={{ flex: 1, height: 6, background: i < activeStageIdx ? `${channelCfg.color}55` : i === activeStageIdx ? channelCfg.color : '#1a2540' }} />
              ))}
            </div>
            <div style={{ fontSize: 9, color: channelCfg.color, marginTop: 4 }}>
              {PIPELINE_STAGES[activeStageIdx]?.label ?? '—'}
            </div>
          </div>

          {/* Finance metrics for this campaign */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 6 }}>
            <MetricChip label="รายได้" value={formatTHB(campaign.finance.revenue)} color="#e8eaf6" />
            <MetricChip label="กำไรสุทธิ" value={formatTHB(campaign.finance.netProfit)} color={campaign.finance.netProfit < 0 ? '#ff5252' : '#00ff9f'} />
            <MetricChip label="ค่าโฆษณา" value={formatTHB(campaign.finance.adSpend)} color="#ffb300" />
            <MetricChip label="ROAS" value={`${campaign.finance.roas}x`} color={campaign.finance.roas >= 4 ? '#00ff9f' : campaign.finance.roas >= 2 ? '#ffb300' : '#ff5252'} />
          </div>

          {/* Finance warnings */}
          {campaign.financeWarnings.length > 0 && campaign.financeWarnings.map((w, i) => (
            <div key={i} style={{ fontSize: 9, color: '#ff5252', background: '#ff525211', padding: '3px 8px', borderLeft: '2px solid #ff5252', marginBottom: 3, lineHeight: 1.4 }}>
              ⚠ {w}
            </div>
          ))}
        </Section>
      )}

      {/* Decision needed */}
      {agent.decisionNeeded && (
        <Section title="รอการตัดสินใจ">
          <div style={{ fontSize: 10, color: '#ff9800', background: '#ff980011', padding: 8, borderLeft: '2px solid #ff9800', lineHeight: 1.5 }}>
            ◆ {agent.decisionNeeded}
          </div>
        </Section>
      )}

      {/* Current task */}
      <Section title="งานปัจจุบัน">
        <p style={{ margin: 0, fontSize: 10, color: '#8892b0', lineHeight: 1.5 }}>{agent.currentTask}</p>
      </Section>

      {/* Recent output */}
      <Section title="ผลลัพธ์ล่าสุด">
        <p style={{ margin: 0, fontSize: 10, color: '#00ff9f', background: '#00ff9f08', padding: 8, borderLeft: '2px solid #00ff9f', lineHeight: 1.5 }}>
          {agent.recentOutput}
        </p>
      </Section>

      {/* Risks */}
      {agent.risks.length > 0 && (
        <Section title="ความเสี่ยง">
          {agent.risks.map((r, i) => (
            <div key={i} style={{ fontSize: 10, color: '#ffb300', background: '#ffb30011', padding: '4px 8px', borderLeft: '2px solid #ffb300', marginBottom: 4, lineHeight: 1.4 }}>
              ⚠ {r}
            </div>
          ))}
        </Section>
      )}

      {/* Next action */}
      <Section title="ขั้นตอนต่อไป">
        <p style={{ margin: 0, fontSize: 10, color: '#00e5ff' }}>→ {agent.nextAction}</p>
      </Section>

      {/* HTML detail */}
      {agent.detailHtml && (
        <Section title="รายละเอียดแผนก">
          <div className={styles.detail} dangerouslySetInnerHTML={{ __html: agent.detailHtml }} />
        </Section>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 8, color: '#4a5680', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#e8eaf6' }}>{value}</div>
    </div>
  )
}

function MetricChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#060d1a', padding: '4px 8px', border: '1px solid #1a2540' }}>
      <div style={{ fontSize: 8, color: '#2a3560', letterSpacing: 1, marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 13, color, fontFamily: 'VT323, monospace' }}>{value}</div>
    </div>
  )
}

function FinRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 9, color: '#4a5680' }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: bold ? 15 : 13, color, letterSpacing: 0.5 }}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#4a5680', letterSpacing: 2, marginBottom: 6, borderBottom: '1px solid #1a2540', paddingBottom: 3 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
