import type { ReactNode } from 'react'
import { channelSummaries, RECOMMENDATION_CONFIG } from '../../agents/financeRegistry'
import { campaigns, CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'
import type { CampaignChannel } from '../../agents/campaignRegistry'

interface Props {
  channelId: CampaignChannel
  onClose: () => void
}

const NEXT_ACTIONS: Record<CampaignChannel, string[]> = {
  tiktok:  ['เพิ่มงบโฆษณา TikTok +฿500 สำหรับแคมเปญ ROAS > 6x', 'ทำ UGC video เพิ่ม 2 คลิปสัปดาห์นี้', 'ทดสอบ hook ใหม่ — ราคา vs ความคุ้มค่า'],
  shopee:  ['ตรวจสอบ Flash Sale วันศุกร์นี้', 'อัปเดตรูปสินค้า + keyword เพิ่ม', 'ขอ official affiliate link ใหม่'],
  lazada:  ['หยุดยิงแอดแคมเปญขาดทุนก่อน', 'วิเคราะห์ CPO — ปรับ target audience', 'รอ commission payout เดือนนี้'],
}

export default function ChannelDetailPanel({ channelId, onClose }: Props) {
  const summary    = channelSummaries.find(s => s.channel === channelId)
  const cfg        = CHANNEL_CONFIG[channelId]
  const channelCampaigns = campaigns.filter(c => c.channel === channelId)
  const nextActions = NEXT_ACTIONS[channelId] ?? []

  if (!summary) return null

  const isLoss    = summary.netProfit < 0
  const roasColor = summary.roas >= 4 ? '#00ff9f' : summary.roas >= 2 ? '#ffb300' : '#ff5252'
  const recCfg    = RECOMMENDATION_CONFIG[summary.recommendation]

  return (
    <div style={{ fontFamily: 'Share Tech Mono, monospace' }}>

      {/* Close */}
      <button
        onClick={onClose}
        style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#4a5680', background: 'none', border: '1px solid #1a2540', padding: '2px 8px', cursor: 'pointer', marginBottom: 12, letterSpacing: 1 }}
      >
        ✕ ปิด
      </button>

      {/* Channel header */}
      <div style={{ borderBottom: '1px solid #1a2540', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 22, color: cfg.color, lineHeight: 1, marginBottom: 6 }}>
          ▶ {cfg.label.toUpperCase()}
        </div>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: recCfg.color, background: `${recCfg.color}14`, padding: '2px 10px', border: `1px solid ${recCfg.color}44`, letterSpacing: 1 }}>
          {recCfg.label}
        </span>
      </div>

      {/* Net profit highlight */}
      <div style={{
        background: isLoss ? '#ff525211' : '#00ff9f11',
        border: `1px solid ${isLoss ? '#ff525244' : '#00ff9f44'}`,
        padding: '10px 14px', marginBottom: 12, textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: '#4a5680', marginBottom: 2 }}>กำไรสุทธิช่องทางนี้</div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 32, color: isLoss ? '#ff5252' : '#00ff9f', lineHeight: 1 }}>
          {formatTHB(summary.netProfit)}
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: roasColor, marginTop: 3 }}>
          ROAS {summary.roas}x
        </div>
      </div>

      {/* Full P&L */}
      <PanelSection title="P&L ช่องทางนี้">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <MetricRow label="รายได้รวม"       value={formatTHB(summary.revenue)}       color="#e8eaf6" />
          <MetricRow label="ค่าคอมมิชชั่น"   value={formatTHB(summary.commission)}    color="#00e5ff" />
          <MetricRow label="ค่าโฆษณา"        value={formatTHB(summary.adSpend)}       color="#ffb300" />
          <MetricRow label="ต้นทุนคอนเทนต์"  value={formatTHB(summary.contentCost)}   color="#ffb300" />
          <div style={{ borderTop: '1px solid #1a2540', margin: '3px 0' }} />
          <MetricRow label="กำไรสุทธิ"       value={formatTHB(summary.netProfit)}     color={isLoss ? '#ff5252' : '#00ff9f'} bold />
          <MetricRow label="ROAS"             value={`${summary.roas}x`}               color={roasColor} bold />
          {summary.pendingPayout > 0 && (
            <MetricRow label="ยอดรอรับเงิน"  value={formatTHB(summary.pendingPayout)} color="#8892b0" />
          )}
        </div>
      </PanelSection>

      {/* Diagnosis */}
      {summary.warnings.length > 0 && (
        <PanelSection title="การวินิจฉัย">
          {summary.warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: isLoss ? '#ff5252' : '#ffb300', background: isLoss ? '#ff525211' : '#ffb30011', padding: '4px 8px', borderLeft: `2px solid ${isLoss ? '#ff5252' : '#ffb300'}`, marginBottom: 3, lineHeight: 1.5, fontFamily: 'Sarabun, sans-serif' }}>
              ⚠ {w}
            </div>
          ))}
        </PanelSection>
      )}

      {/* Campaign breakdown */}
      {channelCampaigns.length > 0 && (
        <PanelSection title={`แคมเปญ (${channelCampaigns.length})`}>
          {channelCampaigns.map(c => {
            const cLoss    = c.finance.netProfit < 0
            const cRoasClr = c.finance.roas >= 4 ? '#00ff9f' : c.finance.roas >= 2 ? '#ffb300' : '#ff5252'
            return (
              <div key={c.id} style={{ marginBottom: 7, background: '#060d1a', border: `1px solid ${cLoss ? '#ff525222' : '#1a2540'}`, padding: '6px 8px' }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#e8eaf6', marginBottom: 3, lineHeight: 1.3 }}>{c.name}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 10, color: '#4a5680' }}>รายได้ <span style={{ color: '#e8eaf6' }}>{formatTHB(c.finance.revenue)}</span></span>
                  <span style={{ fontSize: 10, color: '#4a5680' }}>กำไร <span style={{ color: cLoss ? '#ff5252' : '#00ff9f' }}>{formatTHB(c.finance.netProfit)}</span></span>
                  <span style={{ fontSize: 10, color: '#4a5680' }}>ROAS <span style={{ color: cRoasClr }}>{c.finance.roas}x</span></span>
                </div>
              </div>
            )
          })}
        </PanelSection>
      )}

      {/* Next finance actions */}
      <PanelSection title="Next Actions">
        {nextActions.map((action, i) => (
          <div key={i} style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#00e5ff', padding: '4px 0', borderBottom: i < nextActions.length - 1 ? '1px solid #1a2540' : 'none', lineHeight: 1.5 }}>
            {i + 1}. {action}
          </div>
        ))}
      </PanelSection>

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

function MetricRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 10, color: '#4a5680' }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: bold ? 15 : 13, color, letterSpacing: 0.5 }}>{value}</span>
    </div>
  )
}
