import { mockActivityLog, mockWorkflows } from '../../agents/agentSessionStore'

const TYPE_COLOR = {
  info:    '#8892b0',
  warning: '#ffb300',
  error:   '#ff5252',
  success: '#00ff9f',
  system:  '#00e5ff',
}

const STEP_STATUS_COLOR = {
  pending: '#1a2540',
  active:  '#00ff9f',
  done:    '#00e5ff',
  blocked: '#ff5252',
}

const STEP_STATUS_TEXT = {
  pending: '#4a5680',
  active:  '#00ff9f',
  done:    '#00e5ff',
  blocked: '#ff5252',
}

export default function AgentActivityLog() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        height: '100%',
      }}
    >
      {/* Active Workflows */}
      <div
        style={{
          background: '#0c1425',
          border: '1px solid #1a2540',
          padding: 12,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 14,
            color: '#00ff9f',
            letterSpacing: 2,
            marginBottom: 10,
            borderBottom: '1px solid #1a2540',
            paddingBottom: 6,
          }}
        >
          ▶ ACTIVE WORKFLOWS
        </div>

        {mockWorkflows.map(wf => (
          <div key={wf.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#e8eaf6' }}>
                {wf.name}
              </span>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a5680' }}>
                {wf.startedAt}
              </span>
            </div>

            {wf.steps.map((step, i) => {
              const isActive = i === wf.currentStepIndex
              const isDone = i < wf.currentStepIndex
              const stepStatus = isActive ? 'active' : isDone ? 'done' : 'pending'

              return (
                <div
                  key={step.agentId}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginBottom: 4,
                    padding: '4px 6px',
                    background: isActive ? '#00ff9f08' : 'transparent',
                    borderLeft: `2px solid ${STEP_STATUS_COLOR[stepStatus]}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'VT323, monospace',
                      fontSize: 12,
                      color: STEP_STATUS_TEXT[stepStatus],
                      minWidth: 12,
                    }}
                  >
                    {isDone ? '✓' : isActive ? '▶' : '○'}
                  </span>
                  <div>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: STEP_STATUS_TEXT[stepStatus] }}>
                      {step.agentName}
                    </div>
                    {step.output && (
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a5680', marginTop: 1 }}>
                        {step.output}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* System Console */}
      <div
        style={{
          background: '#060d1a',
          border: '1px solid #1a2540',
          padding: 12,
          overflowY: 'auto',
          fontFamily: 'Share Tech Mono, monospace',
        }}
      >
        <div
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 14,
            color: '#00e5ff',
            letterSpacing: 2,
            marginBottom: 10,
            borderBottom: '1px solid #1a2540',
            paddingBottom: 6,
          }}
        >
          ▶ SYSTEM CONSOLE
        </div>

        {[...mockActivityLog].reverse().map(entry => (
          <div key={entry.id} style={{ marginBottom: 6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, color: '#2a3560', minWidth: 56, paddingTop: 1 }}>
              [{entry.timestamp}]
            </span>
            <span
              style={{
                fontSize: 9,
                color: TYPE_COLOR[entry.type],
                minWidth: 96,
                paddingTop: 1,
              }}
            >
              {entry.agentName}
            </span>
            <span style={{ fontSize: 9, color: '#4a5680', lineHeight: 1.4 }}>
              {entry.message}
            </span>
          </div>
        ))}

        <div style={{ fontSize: 9, color: '#00ff9f', marginTop: 8, animation: 'blink 1s step-end infinite' }}>
          █
        </div>
      </div>
    </div>
  )
}
