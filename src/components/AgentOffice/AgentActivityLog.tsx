import { mockActivityLog } from '../../agents/agentSessionStore'
import { campaigns, PIPELINE_STAGES, PLATFORM_CONFIG, getStageIndex } from '../../agents/campaignRegistry'

const TYPE_COLOR = {
  info:    '#8892b0',
  warning: '#ffb300',
  error:   '#ff5252',
  success: '#00ff9f',
  system:  '#00e5ff',
}

export default function AgentActivityLog() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: '100%' }}>
      {/* Active campaigns summary */}
      <div style={{ background: '#0c1425', border: '1px solid #1a2540', padding: 12, overflowY: 'auto' }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#00ff9f', letterSpacing: 2, marginBottom: 10, borderBottom: '1px solid #1a2540', paddingBottom: 6 }}>
          ▶ CAMPAIGNS IN MOTION
        </div>

        {campaigns.map(campaign => {
          const platformCfg = PLATFORM_CONFIG[campaign.platform]
          const activeIdx = getStageIndex(campaign.stage)

          return (
            <div key={campaign.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: '#e8eaf6' }}>
                  {campaign.name}
                </span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: platformCfg.color, padding: '1px 5px', background: `${platformCfg.color}22` }}>
                  {platformCfg.label}
                </span>
              </div>

              {/* Mini pipeline dots */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                {PIPELINE_STAGES.map((stage, i) => (
                  <div
                    key={stage.id}
                    title={stage.label}
                    style={{
                      flex: 1,
                      height: 6,
                      background: i < activeIdx
                        ? `${platformCfg.color}55`
                        : i === activeIdx
                        ? platformCfg.color
                        : '#1a2540',
                    }}
                  />
                ))}
              </div>

              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: platformCfg.color }}>
                {PIPELINE_STAGES[activeIdx]?.label} — {campaign.progress}%
              </div>

              {campaign.riskFlag && (
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#ffb300', marginTop: 2 }}>
                  ⚠ {campaign.riskFlag.substring(0, 60)}{campaign.riskFlag.length > 60 ? '...' : ''}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* System Console */}
      <div style={{ background: '#060d1a', border: '1px solid #1a2540', padding: 12, overflowY: 'auto', fontFamily: 'Share Tech Mono, monospace' }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#00e5ff', letterSpacing: 2, marginBottom: 10, borderBottom: '1px solid #1a2540', paddingBottom: 6 }}>
          ▶ SYSTEM CONSOLE
        </div>

        {[...mockActivityLog].reverse().map(entry => (
          <div key={entry.id} style={{ marginBottom: 6, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 9, color: '#1a2540', minWidth: 52, paddingTop: 1, flexShrink: 0 }}>
              [{entry.timestamp}]
            </span>
            <span style={{ fontSize: 9, color: TYPE_COLOR[entry.type], minWidth: 80, paddingTop: 1, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.agentName.split(' ')[0]}
            </span>
            <span style={{ fontSize: 9, color: '#4a5680', lineHeight: 1.4 }}>
              {entry.message}
            </span>
          </div>
        ))}

        <div style={{ fontSize: 9, color: '#00ff9f', marginTop: 8, animation: 'blink 1s step-end infinite' }}>█</div>
      </div>
    </div>
  )
}
