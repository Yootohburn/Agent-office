import type { ReactNode } from 'react'
import type { Campaign } from '../../agents/campaignRegistry'
import { PIPELINE_STAGES, CHANNEL_CONFIG, getStageIndex, formatTHB } from '../../agents/campaignRegistry'
import { STAGE_OWNER } from '../../agents/agentTaskRouter'
import { getAgentById } from '../../agents/agentRegistry'

interface Props {
  campaign: Campaign
  onClose: () => void
}

export default function CampaignDetailPanel({ campaign, onClose }: Props) {
  const channelCfg   = CHANNEL_CONFIG[campaign.channel]
  const activeIdx    = getStageIndex(campaign.stage)
  const ownerAgent   = getAgentById(STAGE_OWNER[campaign.stage])
  const isLoss       = campaign.finance.netProfit < 0
  const roasColor    = campaign.finance.roas >= 4 ? '#00ff9f' : campaign.finance.roas >= 2 ? '#ffb300' : '#ff5252'

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>

      {/* Close */}
      <button
        onClick={onClose}
        style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#4a5680', background: 'none', border: '1px solid #1a2540', padding: '2px 8px', cursor: 'pointer', marginBottom: 12, letterSpacing: 1 }}
      >
        ✕ ปิด
      </button>

      {/* Campaign header */}
      <div style={{ borderBottom: '1px solid #1a2540', paddingBottom: 10, marginBottom: 14 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: channelCfg.color, lineHeight: 1.2, marginBottom: 5 }}>
          ▶ {campaign.name}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: channelCfg.color, background: `${channelCfg.color}22`, padding: '1px 7px', letterSpacing: 1 }}>
            {channelCfg.label}
          </span>
          <span style={{ fontSize: 11, color: '#4a5680' }}>{campaign.category}</span>
          <span style={{ fontSize: 11, color: '#4a5680' }}>{campaign.targetPrice}</span>
        </div>
      </div>

      {/* Pipeline progress */}
      <PanelSection title="สถานะ PIPELINE">
        <div style={{ display: 'flex', gap: 1, marginBottom: 5 }}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div
              key={stage.id}
              title={stage.label}
              style={{
                flex: 1,
                height: 8,
                background: i < activeIdx
                  ? `${channelCfg.color}55`
                  : i === activeIdx
                  ? channelCfg.color
                  : '#1a2540',
              }}
            />
          ))}
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: channelCfg.color }}>
          {PIPELINE_STAGES[activeIdx]?.label ?? '—'} · {campaign.progress}%
        </div>
        {ownerAgent && (
          <div style={{ fontSize: 11, color: '#4a5680', marginTop: 3 }}>
            รับผิดชอบ: <span style={{ color: '#8892b0' }}>{ownerAgent.thaiName}</span>
          </div>
        )}
      </PanelSection>

      {/* Net profit highlight */}
      <div style={{
        background: isLoss ? '#ff525211' : '#00ff9f11',
        border: `1px solid ${isLoss ? '#ff525244' : '#00ff9f44'}`,
        padding: '10px 14px',
        marginBottom: 14,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: '#4a5680', marginBottom: 2 }}>กำไรสุทธิ</div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 28, color: isLoss ? '#ff5252' : '#00ff9f', lineHeight: 1 }}>
          {formatTHB(campaign.finance.netProfit)}
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: roasColor, marginTop: 3 }}>
          ROAS {campaign.finance.roas}x
        </div>
      </div>

      {/* Finance metrics grid */}
      <PanelSection title="ตัวเลขการเงิน">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <MetricChip label="รายได้"          value={formatTHB(campaign.finance.revenue)}     color="#e8eaf6" />
          <MetricChip label="ค่าโฆษณา"        value={formatTHB(campaign.finance.adSpend)}     color="#ffb300" />
          <MetricChip label="ค่าคอมมิชชั่น"  value={formatTHB(campaign.finance.commission)}  color="#00e5ff" />
          <MetricChip label="ต้นทุนคอนเทนต์" value={formatTHB(campaign.finance.contentCost)} color="#ffb300" />
        </div>
      </PanelSection>

      {/* Finance warnings */}
      {campaign.financeWarnings.length > 0 && (
        <PanelSection title="Finance Warning">
          {campaign.financeWarnings.map((w, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: isLoss ? '#ff5252' : '#ffb300',
                background: isLoss ? '#ff525211' : '#ffb30011',
                padding: '3px 8px',
                borderLeft: `2px solid ${isLoss ? '#ff5252' : '#ffb300'}`,
                marginBottom: 3,
                lineHeight: 1.4,
              }}
            >
              ⚠ {w}
            </div>
          ))}
        </PanelSection>
      )}

      {/* Brief */}
      <PanelSection title="Brief">
        <p style={{ margin: 0, fontSize: 11, color: '#8892b0', lineHeight: 1.5 }}>{campaign.brief}</p>
      </PanelSection>

      {/* Notes */}
      {campaign.notes && (
        <PanelSection title="หมายเหตุ">
          <p style={{ margin: 0, fontSize: 11, color: '#00e5ff', lineHeight: 1.5 }}>{campaign.notes}</p>
        </PanelSection>
      )}

    </div>
  )
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: '#4a5680', letterSpacing: 2, marginBottom: 6, borderBottom: '1px solid #1a2540', paddingBottom: 3 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function MetricChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: '#060d1a', padding: '4px 8px', border: '1px solid #1a2540' }}>
      <div style={{ fontSize: 11, color: '#2a3560', letterSpacing: 1, marginBottom: 1 }}>{label}</div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color }}>{value}</div>
    </div>
  )
}
