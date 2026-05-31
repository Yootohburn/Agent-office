import type { Agent } from '../../agents/agentRegistry'
import { workflowTemplates } from '../../agents/agentTaskRouter'
import styles from './AgentDesk.module.css'

interface Props {
  agent: Agent
}

const STEP_STATUS_COLOR: Record<string, string> = {
  pending: '#1a2540',
  active:  '#00ff9f',
  done:    '#00e5ff',
  blocked: '#ff5252',
}

export default function AgentDesk({ agent }: Props) {
  const workflows = workflowTemplates.filter(wf => wf.steps.includes(agent.id))

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>
      {/* Header */}
      <div
        style={{
          fontFamily: 'VT323, monospace',
          fontSize: 22,
          color: '#00ff9f',
          borderBottom: '1px solid #1a2540',
          paddingBottom: 8,
          marginBottom: 14,
          letterSpacing: 1,
        }}
      >
        ▶ {agent.name.toUpperCase()}
      </div>

      {/* Meta grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <Field label="PLATFORM" value={agent.platform.toUpperCase()} />
        <Field label="STATUS" value={agent.status.replace('_', ' ').toUpperCase()} />
        <Field label="PROGRESS" value={`${agent.progress}%`} />
        <Field label="ROLE" value={agent.role} />
      </div>

      {/* Current task */}
      <Section title="CURRENT TASK">
        <p style={{ margin: 0, fontSize: 11, color: '#8892b0', lineHeight: 1.5 }}>{agent.currentTask}</p>
      </Section>

      {/* Recent output */}
      <Section title="RECENT OUTPUT">
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: '#00ff9f',
            lineHeight: 1.5,
            background: '#00ff9f08',
            padding: 8,
            borderLeft: '2px solid #00ff9f',
          }}
        >
          {agent.recentOutput}
        </p>
      </Section>

      {/* Risks */}
      {agent.risks.length > 0 && (
        <Section title="RISKS">
          {agent.risks.map((r, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: '#ffb300',
                padding: '4px 8px',
                background: '#ffb30011',
                borderLeft: '2px solid #ffb300',
                marginBottom: 4,
              }}
            >
              ⚠ {r}
            </div>
          ))}
        </Section>
      )}

      {/* Next action */}
      <Section title="NEXT ACTION">
        <p style={{ margin: 0, fontSize: 11, color: '#00e5ff' }}>→ {agent.nextAction}</p>
      </Section>

      {/* Rendered HTML detail — the main agent spec */}
      {agent.detailHtml && (
        <Section title="AGENT DETAIL">
          <div
            className={styles.detail}
            dangerouslySetInnerHTML={{ __html: agent.detailHtml }}
          />
        </Section>
      )}

      {/* Workflows this agent participates in */}
      {workflows.length > 0 && (
        <Section title="WORKFLOWS">
          {workflows.map(wf => (
            <div key={wf.id} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#4a5680', marginBottom: 4 }}>{wf.name}</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {wf.steps.map((stepId, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      background: stepId === agent.id ? '#00ff9f' : STEP_STATUS_COLOR['pending'],
                      border: stepId === agent.id ? '2px solid #00ff9f' : '1px solid #1a2540',
                    }}
                    title={stepId}
                  />
                ))}
              </div>
            </div>
          ))}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontFamily: 'VT323, monospace',
          fontSize: 13,
          color: '#4a5680',
          letterSpacing: 2,
          marginBottom: 6,
          borderBottom: '1px solid #1a2540',
          paddingBottom: 3,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}
