import type { Agent } from '../../agents/agentRegistry'
import { getCampaignById, PIPELINE_STAGES, PLATFORM_CONFIG, getStageIndex } from '../../agents/campaignRegistry'
import styles from './AgentDesk.module.css'

interface Props {
  agent: Agent
  onClose: () => void
}

export default function AgentDetailPanel({ agent, onClose }: Props) {
  const campaign = agent.currentCampaignId ? getCampaignById(agent.currentCampaignId) : null
  const platformCfg = campaign ? PLATFORM_CONFIG[campaign.platform] : null
  const activeStageIdx = campaign ? getStageIndex(campaign.stage) : -1

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          fontFamily: 'VT323, monospace',
          fontSize: 12,
          color: '#4a5680',
          background: 'none',
          border: '1px solid #1a2540',
          padding: '2px 8px',
          cursor: 'pointer',
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        ✕ CLOSE
      </button>

      {/* Agent header */}
      <div style={{ borderBottom: '1px solid #1a2540', paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 20, color: '#00ff9f', lineHeight: 1.1, marginBottom: 2 }}>
          ▶ {agent.name.toUpperCase()}
        </div>
        <div style={{ fontSize: 9, color: '#4a5680', letterSpacing: 1, textTransform: 'uppercase' }}>
          {agent.title}
        </div>
      </div>

      {/* Meta grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Field label="STATUS" value={agent.status.replace(/_/g, ' ').toUpperCase()} />
        <Field label="PROGRESS" value={`${agent.progress}%`} />
      </div>

      {/* Current campaign */}
      {campaign && platformCfg && (
        <Section title="CURRENT CAMPAIGN">
          <div style={{ background: `${platformCfg.color}11`, border: `1px solid ${platformCfg.color}33`, padding: 10, marginBottom: 6 }}>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: platformCfg.color, marginBottom: 4 }}>
              {campaign.name}
            </div>
            <div style={{ fontSize: 9, color: '#4a5680', marginBottom: 6 }}>
              Platform: <span style={{ color: platformCfg.color }}>{platformCfg.label}</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;Category: {campaign.category}
              &nbsp;&nbsp;|&nbsp;&nbsp;Price: {campaign.targetPrice}
            </div>
            <div style={{ fontSize: 10, color: '#8892b0', lineHeight: 1.4, marginBottom: 8 }}>
              {campaign.brief}
            </div>
            {/* Mini pipeline */}
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {PIPELINE_STAGES.map((stage, i) => {
                const isDone   = i < activeStageIdx
                const isActive = i === activeStageIdx
                return (
                  <div
                    key={stage.id}
                    title={stage.label}
                    style={{
                      flex: 1,
                      height: 8,
                      background: isDone
                        ? `${platformCfg.color}55`
                        : isActive
                        ? platformCfg.color
                        : '#1a2540',
                      border: isActive ? `1px solid ${platformCfg.color}` : 'none',
                    }}
                  />
                )
              })}
            </div>
            <div style={{ fontSize: 9, color: platformCfg.color, marginTop: 4 }}>
              Stage: {PIPELINE_STAGES[activeStageIdx]?.label ?? '—'}
            </div>
          </div>

          {/* Target metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <MetricChip label="Target Views"   value={campaign.targetMetrics.views} />
            <MetricChip label="Target CTR"     value={campaign.targetMetrics.ctr} />
            <MetricChip label="Conversion"     value={campaign.targetMetrics.conversion} />
            <MetricChip label="Mock Revenue"   value={campaign.targetMetrics.mockRevenue} />
          </div>
        </Section>
      )}

      {/* Decision needed */}
      {agent.decisionNeeded && (
        <Section title="DECISION NEEDED">
          <div style={{ fontSize: 10, color: '#ff9800', background: '#ff980011', padding: 8, borderLeft: '2px solid #ff9800', lineHeight: 1.5 }}>
            ◆ {agent.decisionNeeded}
          </div>
        </Section>
      )}

      {/* Current task */}
      <Section title="CURRENT TASK">
        <p style={{ margin: 0, fontSize: 10, color: '#8892b0', lineHeight: 1.5 }}>{agent.currentTask}</p>
      </Section>

      {/* Recent output */}
      <Section title="RECENT OUTPUT">
        <p style={{ margin: 0, fontSize: 10, color: '#00ff9f', background: '#00ff9f08', padding: 8, borderLeft: '2px solid #00ff9f', lineHeight: 1.5 }}>
          {agent.recentOutput}
        </p>
      </Section>

      {/* Risks */}
      {agent.risks.length > 0 && (
        <Section title="RISKS">
          {agent.risks.map((r, i) => (
            <div key={i} style={{ fontSize: 10, color: '#ffb300', background: '#ffb30011', padding: '4px 8px', borderLeft: '2px solid #ffb300', marginBottom: 4 }}>
              ⚠ {r}
            </div>
          ))}
        </Section>
      )}

      {/* Campaign risk flag */}
      {campaign?.riskFlag && (
        <Section title="CAMPAIGN RISK FLAG">
          <div style={{ fontSize: 10, color: '#ff5252', background: '#ff525211', padding: '4px 8px', borderLeft: '2px solid #ff5252' }}>
            ⚠ {campaign.riskFlag}
          </div>
        </Section>
      )}

      {/* Next action */}
      <Section title="NEXT ACTION">
        <p style={{ margin: 0, fontSize: 10, color: '#00e5ff' }}>→ {agent.nextAction}</p>
      </Section>

      {/* HTML detail */}
      {agent.detailHtml && (
        <Section title="AGENT DETAIL">
          <div className={styles.detail} dangerouslySetInnerHTML={{ __html: agent.detailHtml }} />
        </Section>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#4a5680', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: '#e8eaf6' }}>{value}</div>
    </div>
  )
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#060d1a', padding: '4px 8px', border: '1px solid #1a2540' }}>
      <div style={{ fontSize: 8, color: '#2a3560', letterSpacing: 1, marginBottom: 1 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 11, color: '#00e5ff', fontFamily: 'VT323, monospace' }}>{value}</div>
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
