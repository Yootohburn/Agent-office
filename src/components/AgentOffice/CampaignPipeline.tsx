import { campaigns, PIPELINE_STAGES, CHANNEL_CONFIG, getStageIndex } from '../../agents/campaignRegistry'

export default function CampaignPipeline() {
  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: 12 }}>
      {/* Header */}
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#00ff9f', letterSpacing: 2, marginBottom: 10 }}>
        ▶ CAMPAIGN PIPELINE
      </div>

      {/* Stage header row */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 8, paddingLeft: 168 }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                fontFamily: 'VT323, monospace',
                fontSize: 11,
                color: '#2a3560',
                textAlign: 'center',
                flex: 1,
                padding: '2px 1px',
                letterSpacing: 0.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={stage.label}
            >
              {stage.label}
            </div>
            {i < PIPELINE_STAGES.length - 1 && <span style={{ color: '#1a2540', fontSize: 11, flexShrink: 0 }}>›</span>}
          </div>
        ))}
      </div>

      {/* Campaign rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {campaigns.map(campaign => {
          const channelCfg = CHANNEL_CONFIG[campaign.channel]
          const activeIdx = getStageIndex(campaign.stage)
          const isLosing = campaign.finance.netProfit < 0

          return (
            <div key={campaign.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Campaign name + channel */}
              <div style={{ minWidth: 168, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#8892b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={campaign.name}>
                  <span style={{ color: channelCfg.color, marginRight: 4 }}>■</span>
                  {campaign.name}
                </div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: channelCfg.color, letterSpacing: 0.5 }}>
                  {channelCfg.label} · {campaign.finance.netProfit >= 0 ? '+' : ''}฿{campaign.finance.netProfit.toLocaleString('th-TH')} · ROAS {campaign.finance.roas}x
                </div>
              </div>

              {/* Pipeline dots */}
              {PIPELINE_STAGES.map((stage, i) => {
                const isDone   = i < activeIdx
                const isActive = i === activeIdx
                return (
                  <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                      title={stage.label}
                      style={{
                        flex: 1,
                        height: isActive ? 20 : 10,
                        background: isDone
                          ? `${channelCfg.color}44`
                          : isActive
                          ? isLosing ? '#ff5252' : channelCfg.color
                          : '#1a2540',
                        border: isActive
                          ? `1px solid ${isLosing ? '#ff5252' : channelCfg.color}`
                          : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isDone && <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: channelCfg.color }}>✓</span>}
                      {isActive && <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: isLosing ? '#ff5252' : '#06090f', fontWeight: 'bold' }}>▶</span>}
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && <div style={{ width: 2, height: 2, background: isDone ? channelCfg.color : '#1a2540', flexShrink: 0 }} />}
                  </div>
                )
              })}

              {/* Finance warning icon */}
              <div style={{ minWidth: 14, textAlign: 'center' }}>
                {campaign.financeWarnings.length > 0 && (
                  <span style={{ fontSize: 11, color: isLosing ? '#ff5252' : '#ffb300' }} title={campaign.financeWarnings[0]}>
                    {isLosing ? '⛔' : '⚠'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
