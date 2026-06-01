import { CHANNEL_CONFIG, PIPELINE_STAGES, getStageIndex, formatTHB } from '../../agents/campaignRegistry'
import type { Campaign, PipelineStage } from '../../agents/campaignRegistry'
import { STAGE_OWNER } from '../../agents/agentTaskRouter'
import type { Agent } from '../../agents/agentRegistry'

interface Props {
  campaigns: Campaign[]
  agents: Agent[]
  selectedCampaignId: string | null
  onSelectCampaign: (id: string) => void
}

// Campaigns that need attention float to the top
function urgencyScore(c: Campaign): number {
  if (c.finance.netProfit < 0) return 3
  if (c.stage === 'human_approved') return 2
  if (c.financeWarnings.length > 0) return 1
  return 0
}

const STAGE_FALLBACK: Record<PipelineStage, string> = {
  new_product:    'รับสินค้าใหม่เข้าระบบ',
  verified:       'ยืนยันข้อมูลสินค้า',
  scored:         'ประเมินคะแนนสินค้า',
  selected:       'เลือกสินค้าโปรโมท',
  brief_ready:    'สร้าง Content Brief',
  script_ready:   'เขียน Script และ Storyboard',
  asset_ready:    'ผลิต Creative Assets',
  human_approved: 'รอผู้บริหารอนุมัติ',
  published:      'โพสต์และติดตามผล',
  analyzed:       'วิเคราะห์ผลลัพธ์',
  learned:        'บันทึกบทเรียน',
}

function getNextAction(campaign: Campaign, agents: Agent[]): string {
  const ownerDeptId = STAGE_OWNER[campaign.stage]
  const ownerAgent  = agents.find(a => a.id === ownerDeptId)
  if (ownerAgent?.currentCampaignId === campaign.id) {
    const t = ownerAgent.nextAction
    return t.length > 68 ? t.substring(0, 68) + '…' : t
  }
  return STAGE_FALLBACK[campaign.stage]
}

export default function CampaignFocusSection({ campaigns, agents, selectedCampaignId, onSelectCampaign }: Props) {
  const sorted = [...campaigns].sort((a, b) => urgencyScore(b) - urgencyScore(a))

  return (
    <div style={{ background: '#0a0e1a', border: '1px solid #1a2540', padding: 12 }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#00ff9f', letterSpacing: 2, marginBottom: 10 }}>
        ▶ แคมเปญที่ต้องโฟกัสวันนี้
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {sorted.map(campaign => {
          const isSelected  = selectedCampaignId === campaign.id
          const channelCfg  = CHANNEL_CONFIG[campaign.channel]
          const activeIdx   = getStageIndex(campaign.stage)
          const isLoss      = campaign.finance.netProfit < 0
          const hasWarning  = campaign.financeWarnings.length > 0
          const leftBorder  = isLoss ? '#ff5252' : hasWarning ? '#ffb300' : channelCfg.color
          const roasColor   = campaign.finance.roas >= 4 ? '#00ff9f' : campaign.finance.roas >= 2 ? '#ffb300' : '#ff5252'
          const ownerAgent  = agents.find(a => a.id === STAGE_OWNER[campaign.stage])
          const nextAction  = getNextAction(campaign, agents)

          return (
            <div
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign.id)}
              style={{
                background: isSelected ? '#0f1a2e' : '#0c1425',
                border: `1px solid ${isSelected ? '#00ff9f33' : isLoss ? '#ff525222' : '#1a2540'}`,
                borderLeft: `3px solid ${leftBorder}`,
                padding: '9px 12px',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 10,
                alignItems: 'start',
              }}
            >
              {/* Left: name, pipeline, next action */}
              <div style={{ minWidth: 0 }}>

                {/* Name + channel badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#e8eaf6', lineHeight: 1 }}>
                    {campaign.name}
                  </span>
                  <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: channelCfg.color, background: `${channelCfg.color}22`, padding: '0 5px', letterSpacing: 1, flexShrink: 0 }}>
                    {channelCfg.label}
                  </span>
                </div>

                {/* Stage mini-bar + stage label + owner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ display: 'flex', gap: 1, width: 72, flexShrink: 0 }}>
                    {PIPELINE_STAGES.map((stage, i) => (
                      <div
                        key={stage.id}
                        title={stage.label}
                        style={{
                          flex: 1,
                          height: 4,
                          background: i < activeIdx
                            ? `${channelCfg.color}55`
                            : i === activeIdx
                            ? channelCfg.color
                            : '#1a2540',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#4a5680', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {PIPELINE_STAGES[activeIdx]?.label ?? '—'}
                  </span>
                  {ownerAgent && (
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#2a3560', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      · {ownerAgent.thaiName.split('/')[0].trim()}
                    </span>
                  )}
                </div>

                {/* Next action */}
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#00e5ff', lineHeight: 1.4 }}>
                  → {nextAction}
                </div>

              </div>

              {/* Right: profit + ROAS + warning icon */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: isLoss ? '#ff5252' : '#00ff9f', lineHeight: 1 }}>
                  {formatTHB(campaign.finance.netProfit)}
                </div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: roasColor, marginTop: 2 }}>
                  ROAS {campaign.finance.roas}x
                </div>
                {hasWarning && (
                  <div style={{ fontSize: 10, color: isLoss ? '#ff5252' : '#ffb300', marginTop: 3 }}>
                    {isLoss ? '⛔' : '⚠'}
                  </div>
                )}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
