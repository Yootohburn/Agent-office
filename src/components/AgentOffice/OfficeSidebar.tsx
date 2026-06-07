import { useState } from 'react'
import { CHANNEL_CONFIG, PIPELINE_STAGES, formatTHB } from '../../agents/campaignRegistry'
import type { Campaign } from '../../agents/campaignRegistry'
import { STAGE_OWNER } from '../../agents/agentTaskRouter'
import { computeQueueStatus } from '../../services/agentContextBuilder'
import type { QueueStatus } from '../../services/agentContextBuilder'

type FilterKey = 'all' | 'urgent' | 'needs_review' | 'working' | 'losing' | 'ready'

const FILTERS: { id: FilterKey; label: string }[] = [
  { id: 'all',          label: 'ทั้งหมด'    },
  { id: 'urgent',       label: 'เร่งด่วน'  },
  { id: 'needs_review', label: 'รอรีวิว'   },
  { id: 'working',      label: 'ทำงานอยู่' },
  { id: 'losing',       label: 'ขาดทุน'    },
  { id: 'ready',        label: 'พร้อมถัดไป'},
]

const STATUS_BADGE: Record<QueueStatus, { label: string; color: string }> = {
  urgent:          { label: 'เร่งด่วน',   color: '#ff5252' },
  needs_review:    { label: 'รอรีวิว',    color: '#ff9800' },
  working:         { label: 'ทำงานอยู่',  color: '#00e5ff' },
  blocked:         { label: 'ติดขัด',     color: '#ff5252' },
  ready_next_step: { label: 'พร้อมถัดไป', color: '#00ff9f' },
  profitable:      { label: 'กำลังดี',    color: '#00ff9f' },
  losing_money:    { label: 'ขาดทุน',     color: '#ff5252' },
  idle:            { label: 'รอ',         color: '#4a5680' },
}

const STAGE_LABEL: Record<string, string> = Object.fromEntries(
  PIPELINE_STAGES.map(s => [s.id, s.label])
)

const OWNER_SHORT: Record<string, string> = {
  'product-research':    'ฝ่ายวิจัย',
  'offer-analyst':       'ฝ่ายวิเคราะห์',
  'content-strategy':    'ฝ่ายกลยุทธ์',
  'script-writer':       'ฝ่ายสคริปต์',
  'creative-production': 'ฝ่ายผลิตงาน',
  'social-performance':  'ฝ่ายโซเชียล',
}

const STAGE_NEXT_HINT: Partial<Record<string, string>> = {
  new_product:    'ตรวจสอบข้อมูลสินค้า',
  verified:       'ประเมินคะแนน',
  scored:         'เลือกสินค้า',
  selected:       'สร้าง Content Brief',
  brief_ready:    'เขียน Script',
  script_ready:   'สร้างชิ้นงาน',
  asset_ready:    'ส่งขออนุมัติ',
  human_approved: 'รออนุมัติโพสต์',
  published:      'วิเคราะห์ผลลัพธ์',
  analyzed:       'บันทึกบทเรียน',
}

function urgencyOrder(s: QueueStatus): number {
  const ORDER: Record<QueueStatus, number> = {
    urgent: 0, needs_review: 1, blocked: 2, working: 3,
    ready_next_step: 4, profitable: 5, losing_money: 6, idle: 7,
  }
  return ORDER[s] ?? 8
}

interface Props {
  campaigns:          Campaign[]
  selectedCampaignId: string | null
  onSelectCampaign:   (id: string) => void
  onNewProduct?:      () => void
}

export default function OfficeSidebar({ campaigns, selectedCampaignId, onSelectCampaign, onNewProduct }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all')

  const withStatus = campaigns.map(c => ({ c, status: computeQueueStatus(c) }))

  const filtered = withStatus.filter(({ status }) => {
    if (filter === 'all')          return true
    if (filter === 'urgent')       return status === 'urgent'
    if (filter === 'needs_review') return status === 'needs_review'
    if (filter === 'working')      return status === 'working' || status === 'profitable'
    if (filter === 'losing')       return status === 'losing_money'
    if (filter === 'ready')        return status === 'ready_next_step'
    return true
  })

  const sorted = [...filtered].sort((a, b) => urgencyOrder(a.status) - urgencyOrder(b.status))

  return (
    <div style={{ borderRight: '2px solid #1a2540', background: '#080c18', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid #1a2540', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: '#2a3560', letterSpacing: 2 }}>
            ▶ CAMPAIGN QUEUE
          </div>
          {onNewProduct && (
            <button
              onClick={onNewProduct}
              title="เพิ่มสินค้าใหม่"
              style={{
                fontFamily: 'VT323, monospace', fontSize: 14,
                color: '#00e5ff', background: '#00e5ff11',
                border: '1px solid #00e5ff33', padding: '1px 7px',
                cursor: 'pointer', letterSpacing: 1, lineHeight: 1.4,
              }}
            >
              +
            </button>
          )}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#1a2540', marginTop: 2 }}>
          {campaigns.length} แคมเปญ · sorted by urgency
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '5px 6px', borderBottom: '1px solid #1a2540', flexShrink: 0 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              fontFamily: 'VT323, monospace', fontSize: 11,
              color:      filter === f.id ? '#00ff9f' : '#2a3560',
              background: filter === f.id ? '#00ff9f11' : 'none',
              border:     `1px solid ${filter === f.id ? '#00ff9f44' : '#1a2540'}`,
              padding: '1px 6px', cursor: 'pointer', letterSpacing: 0.5,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Campaign list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
        {sorted.length === 0 && (
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: '#1a2540', textAlign: 'center', marginTop: 20 }}>
            ไม่มีแคมเปญในหมวดนี้
          </div>
        )}

        {sorted.map(({ c, status }) => {
          const cfg        = CHANNEL_CONFIG[c.channel]
          const isSelected = c.id === selectedCampaignId
          const badge      = STATUS_BADGE[status]
          const owner      = OWNER_SHORT[STAGE_OWNER[c.stage]] ?? ''
          const nextHint   = c.next_action ?? STAGE_NEXT_HINT[c.stage] ?? ''

          return (
            <div
              key={c.id}
              onClick={() => onSelectCampaign(c.id)}
              style={{
                padding: '7px 8px', marginBottom: 5,
                background: isSelected ? '#0f1a2e' : '#0c1425',
                border:     `1px solid ${isSelected ? cfg.color : '#1a2540'}`,
                borderLeft: `3px solid ${badge.color}`,
                cursor: 'pointer',
              }}
            >
              {/* Name + channel */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4, marginBottom: 3 }}>
                <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#e8eaf6', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                  {c.name.length > 26 ? c.name.slice(0, 26) + '…' : c.name}
                </div>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 10, color: cfg.color, background: `${cfg.color}18`, padding: '0 4px', flexShrink: 0, letterSpacing: 1 }}>
                  {cfg.label.slice(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Stage + status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560', flex: 1 }}>
                  {STAGE_LABEL[c.stage] ?? c.stage}
                </span>
                <span style={{
                  fontFamily: 'VT323, monospace', fontSize: 9,
                  color: badge.color, background: `${badge.color}18`,
                  padding: '0 4px', border: `1px solid ${badge.color}33`, letterSpacing: 0.5,
                }}>
                  {badge.label}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ background: '#1a2540', height: 2, marginBottom: 3 }}>
                <div style={{ background: cfg.color, height: '100%', width: `${c.progress}%`, transition: 'width 0.4s ease' }} />
              </div>

              {/* Owner agent + profit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#2a3560' }}>
                  {owner}
                </span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: c.finance.netProfit < 0 ? '#ff5252' : '#00ff9f' }}>
                  {formatTHB(c.finance.netProfit)}
                </span>
              </div>

              {/* Next action hint */}
              {nextHint && (
                <div style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
                  color: '#00e5ff', marginTop: 3, lineHeight: 1.3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  → {nextHint.length > 28 ? nextHint.slice(0, 28) + '…' : nextHint}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
