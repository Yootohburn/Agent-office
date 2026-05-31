import { campaigns, PIPELINE_STAGES, PLATFORM_CONFIG, getStageIndex } from '../../agents/campaignRegistry'

interface Props {
  platformFilter: string
}

export default function CampaignPipeline({ platformFilter }: Props) {
  const filtered = platformFilter === 'all'
    ? campaigns
    : campaigns.filter(c => c.platform === platformFilter)

  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: 12 }}>
      {/* Pipeline stage header */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 14,
            color: '#00ff9f',
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          ▶ CAMPAIGN PIPELINE
        </div>

        {/* Stage labels row */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                style={{
                  fontFamily: 'VT323, monospace',
                  fontSize: 10,
                  color: '#2a3560',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  flex: 1,
                  padding: '3px 2px',
                  borderBottom: '1px solid #1a2540',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={stage.label}
              >
                {stage.short.toUpperCase()}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <span style={{ color: '#1a2540', fontSize: 10, flexShrink: 0 }}>›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Campaign rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 ? (
          <div style={{ fontFamily: 'VT323, monospace', color: '#2a3560', fontSize: 14, padding: '8px 0' }}>
            NO CAMPAIGNS FOR THIS FILTER
          </div>
        ) : (
          filtered.map(campaign => {
            const platformCfg = PLATFORM_CONFIG[campaign.platform]
            const activeIdx = getStageIndex(campaign.stage)

            return (
              <div key={campaign.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Campaign name */}
                <div
                  style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 9,
                    color: '#8892b0',
                    minWidth: 160,
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 8,
                  }}
                  title={campaign.name}
                >
                  <span style={{ color: platformCfg.color, marginRight: 4 }}>■</span>
                  {campaign.name}
                </div>

                {/* Stage progress dots */}
                {PIPELINE_STAGES.map((stage, i) => {
                  const isDone   = i < activeIdx
                  const isActive = i === activeIdx

                  return (
                    <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div
                        style={{
                          flex: 1,
                          height: isActive ? 20 : 12,
                          background: isDone
                            ? `${platformCfg.color}44`
                            : isActive
                            ? platformCfg.color
                            : '#1a2540',
                          border: isActive ? `1px solid ${platformCfg.color}` : '1px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          position: 'relative',
                        }}
                        title={stage.label}
                      >
                        {isDone && (
                          <span style={{ fontFamily: 'VT323, monospace', fontSize: 9, color: platformCfg.color }}>✓</span>
                        )}
                        {isActive && (
                          <span style={{ fontFamily: 'VT323, monospace', fontSize: 9, color: '#06090f', fontWeight: 'bold' }}>▶</span>
                        )}
                      </div>
                      {i < PIPELINE_STAGES.length - 1 && (
                        <div
                          style={{
                            width: 2,
                            height: 2,
                            background: isDone ? platformCfg.color : '#1a2540',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                  )
                })}

                {/* Risk flag */}
                <div style={{ minWidth: 16, textAlign: 'center' }}>
                  {campaign.riskFlag && (
                    <span
                      style={{ fontSize: 10, color: '#ffb300' }}
                      title={campaign.riskFlag}
                    >
                      ⚠
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
