import type { ChannelFinanceSummary } from '../../agents/financeRegistry'
import { RECOMMENDATION_CONFIG } from '../../agents/financeRegistry'
import { CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'

interface Props {
  summary: ChannelFinanceSummary
}

export default function RevenueByChannel({ summary }: Props) {
  const cfg = CHANNEL_CONFIG[summary.channel]
  const recCfg = RECOMMENDATION_CONFIG[summary.recommendation]
  const isLoss = summary.netProfit < 0

  return (
    <div
      style={{
        background: '#0c1425',
        border: `1px solid ${isLoss ? '#ff525244' : '#1a2540'}`,
        borderTop: `3px solid ${cfg.color}`,
        padding: 12,
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Channel header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: cfg.color, letterSpacing: 1 }}>
          {cfg.label.toUpperCase()}
        </div>
        <span
          style={{
            fontFamily: 'VT323, monospace',
            fontSize: 11,
            color: recCfg.color,
            background: `${recCfg.color}18`,
            padding: '2px 8px',
            border: `1px solid ${recCfg.color}44`,
            letterSpacing: 1,
          }}
        >
          {recCfg.label}
        </span>
      </div>

      {/* Finance rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FinRow label="รายได้"            value={formatTHB(summary.revenue)}      color="#e8eaf6" />
        <FinRow label="ค่าคอมมิชชั่น"    value={formatTHB(summary.commission)}   color="#00e5ff" />
        <FinRow label="ค่าโฆษณา"         value={formatTHB(summary.adSpend)}      color="#ffb300" />
        <FinRow label="ต้นทุนคอนเทนต์"   value={formatTHB(summary.contentCost)}  color="#ffb300" />
        <div style={{ borderTop: '1px solid #1a2540', marginTop: 3, paddingTop: 3 }} />
        <FinRow
          label="กำไรสุทธิ"
          value={formatTHB(summary.netProfit)}
          color={isLoss ? '#ff5252' : '#00ff9f'}
          bold
        />
        <FinRow
          label="ROAS"
          value={`${summary.roas}x`}
          color={summary.roas >= 4 ? '#00ff9f' : summary.roas >= 2 ? '#ffb300' : '#ff5252'}
        />
        <FinRow label="ยอดรอรับเงิน"     value={formatTHB(summary.pendingPayout)} color="#8892b0" />
      </div>

      {/* Warnings */}
      {summary.warnings.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {summary.warnings.map((w, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 9,
                color: isLoss ? '#ff5252' : '#ffb300',
                background: isLoss ? '#ff525211' : '#ffb30011',
                padding: '3px 6px',
                borderLeft: `2px solid ${isLoss ? '#ff5252' : '#ffb300'}`,
                lineHeight: 1.4,
              }}
            >
              ⚠ {w}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FinRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a5680' }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: bold ? 15 : 13, color, letterSpacing: 0.5 }}>{value}</span>
    </div>
  )
}
