import type { ChannelFinanceSummary } from '../../agents/financeRegistry'
import { CHANNEL_CONFIG, formatTHB } from '../../agents/campaignRegistry'

interface Props {
  summary: ChannelFinanceSummary
  /** compact — show only 4 key metrics + status badge. Used in overview view. */
  compact?: boolean
  onSelect?: () => void
  isSelected?: boolean
}

const COMPACT_BADGE: Record<ChannelFinanceSummary['recommendation'], { label: string; color: string }> = {
  scale:    { label: 'ดี ↑',    color: '#00ff9f' },
  maintain: { label: 'ปกติ',    color: '#00e5ff' },
  stop:     { label: 'ขาดทุน', color: '#ff5252' },
  review:   { label: 'ระวัง',   color: '#ffb300' },
}

export default function RevenueByChannel({ summary, compact = false, onSelect, isSelected = false }: Props) {
  const cfg    = CHANNEL_CONFIG[summary.channel]
  const isLoss = summary.netProfit < 0
  const roasColor = summary.roas >= 4 ? '#00ff9f' : summary.roas >= 2 ? '#ffb300' : '#ff5252'

  if (compact) {
    const badge = COMPACT_BADGE[summary.recommendation]
    return (
      <div style={{
        background: '#0c1425',
        border: `1px solid ${isLoss ? '#ff525244' : '#1a2540'}`,
        borderTop: `3px solid ${cfg.color}`,
        padding: '10px 12px',
        flex: 1,
        minWidth: 0,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: cfg.color, letterSpacing: 1 }}>
            {cfg.label.toUpperCase()}
          </div>
          <span style={{
            fontFamily: 'VT323, monospace',
            fontSize: 11,
            color: badge.color,
            background: `${badge.color}18`,
            padding: '1px 7px',
            border: `1px solid ${badge.color}44`,
            letterSpacing: 1,
          }}>
            {badge.label}
          </span>
        </div>

        {/* 4 compact rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CompactRow label="รายได้"   value={formatTHB(summary.revenue)}   color="#e8eaf6" />
          <CompactRow label="ค่าโฆษณา" value={formatTHB(summary.adSpend)}   color="#ffb300" />
          <div style={{ borderTop: '1px solid #1a2540', margin: '2px 0' }} />
          <CompactRow label="กำไรสุทธิ" value={formatTHB(summary.netProfit)} color={isLoss ? '#ff5252' : '#00ff9f'} bold />
          <CompactRow label="ROAS"      value={`${summary.roas}x`}           color={roasColor} />
        </div>
      </div>
    )
  }

  // ── Full mode (การเงิน view) ──────────────────────────────────
  return (
    <div
      onClick={onSelect}
      style={{
        background: isSelected ? '#0f1a2e' : '#0c1425',
        border: isSelected ? `1px solid ${cfg.color}66` : `1px solid ${isLoss ? '#ff525244' : '#1a2540'}`,
        borderTop: isSelected ? `3px solid ${cfg.color}` : `3px solid ${cfg.color}`,
        padding: 12,
        flex: 1,
        minWidth: 0,
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'background 0.1s',
      }}
    >
      {/* Channel header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: cfg.color, letterSpacing: 1 }}>
          {cfg.label.toUpperCase()}
        </div>
        <span style={{
          fontFamily: 'VT323, monospace',
          fontSize: 11,
          color: COMPACT_BADGE[summary.recommendation].color,
          background: `${COMPACT_BADGE[summary.recommendation].color}18`,
          padding: '2px 8px',
          border: `1px solid ${COMPACT_BADGE[summary.recommendation].color}44`,
          letterSpacing: 1,
        }}>
          {COMPACT_BADGE[summary.recommendation].label}
        </span>
      </div>

      {/* All 7 finance rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FullRow label="รายได้"          value={formatTHB(summary.revenue)}       color="#e8eaf6" />
        <FullRow label="ค่าคอมมิชชั่น"   value={formatTHB(summary.commission)}    color="#00e5ff" />
        <FullRow label="ค่าโฆษณา"        value={formatTHB(summary.adSpend)}       color="#ffb300" />
        <FullRow label="ต้นทุนคอนเทนต์"  value={formatTHB(summary.contentCost)}   color="#ffb300" />
        <div style={{ borderTop: '1px solid #1a2540', marginTop: 3, paddingTop: 3 }} />
        <FullRow label="กำไรสุทธิ"       value={formatTHB(summary.netProfit)}     color={isLoss ? '#ff5252' : '#00ff9f'} bold />
        <FullRow label="ROAS"             value={`${summary.roas}x`}               color={roasColor} />
        <FullRow label="ยอดรอรับเงิน"    value={formatTHB(summary.pendingPayout)} color="#8892b0" />
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

      {onSelect && (
        <div style={{ marginTop: 8, fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: isSelected ? cfg.color : '#2a3560', textAlign: 'center', letterSpacing: 1 }}>
          {isSelected ? '▶ ดูรายละเอียด' : '→ คลิกเพื่อดูรายละเอียด'}
        </div>
      )}
    </div>
  )
}

function CompactRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: '#4a5680' }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: bold ? 15 : 13, color, letterSpacing: 0.5 }}>{value}</span>
    </div>
  )
}

function FullRow({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#4a5680' }}>{label}</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: bold ? 15 : 13, color, letterSpacing: 0.5 }}>{value}</span>
    </div>
  )
}
