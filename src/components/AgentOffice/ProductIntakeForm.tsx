import { useState } from 'react'
import type { ProductIntakeFormData, Marketplace } from '../../data/types'
import { APPROVED_CATEGORIES, AVOID_CATEGORIES }  from '../../agents/productRegistry'

interface Props {
  onSubmit: (data: ProductIntakeFormData) => void
  onCancel: () => void
}

const MARKETPLACE_OPTIONS: { value: Marketplace; label: string; color: string }[] = [
  { value: 'shopee', label: 'Shopee',    color: '#ff5722' },
  { value: 'lazada', label: 'Lazada',    color: '#2979ff' },
  { value: 'tiktok', label: 'TikTok Shop', color: '#00e5ff' },
]

const CAMPAIGN_GOALS = [
  'เพิ่ม affiliate commission',
  'ทดสอบสินค้าใหม่',
  'สร้าง brand awareness',
  'ขยายสเกลสินค้าที่ทำได้ดี',
  'อื่นๆ',
]

const EMPTY: ProductIntakeFormData = {
  title_th:          '',
  title_raw:         '',
  product_url:       '',
  marketplace:       'shopee',
  shop_name:         '',
  category:          '',
  subcategory:       '',
  price_now:         0,
  price_normal:      0,
  commission_rate:   0,
  rating:            0,
  review_count:      0,
  sold_count:        0,
  product_image_url: '',
  notes:             '',
  target_platform:   '',
  campaign_goal:     '',
}

function calcDiscount(priceNow: number, priceNormal: number): number {
  if (priceNormal <= 0 || priceNormal <= priceNow) return 0
  return Math.round((priceNormal - priceNow) / priceNormal * 100)
}

// ── Field styles ──────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  fontFamily:  'Share Tech Mono, monospace',
  fontSize:    11,
  color:       '#c8d6f0',
  background:  '#06090f',
  border:      '1px solid #1a2540',
  padding:     '5px 8px',
  width:       '100%',
  boxSizing:   'border-box',
  outline:     'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily:  'Share Tech Mono, monospace',
  fontSize:    9,
  color:       '#4a5680',
  letterSpacing: 1,
  display:     'block',
  marginBottom: 3,
}

const sectionStyle: React.CSSProperties = {
  fontFamily:    'VT323, monospace',
  fontSize:      11,
  color:         '#2a3560',
  letterSpacing: 2,
  borderBottom:  '1px solid #1a2540',
  paddingBottom: 4,
  marginBottom:  10,
  marginTop:     14,
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductIntakeForm({ onSubmit, onCancel }: Props) {
  const [form,   setForm]   = useState<ProductIntakeFormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductIntakeFormData, string>>>({})

  const discount     = calcDiscount(form.price_now, form.price_normal)
  const estCommission = Math.round(form.price_now * form.commission_rate / 100)

  function set<K extends keyof ProductIntakeFormData>(field: K, value: ProductIntakeFormData[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!form.title_th.trim())      errs.title_th       = 'กรอกชื่อสินค้า'
    if (!form.product_url.trim())   errs.product_url    = 'กรอก URL สินค้า'
    if (!form.category.trim())      errs.category       = 'เลือกหมวดหมู่'
    if (form.price_now <= 0)        errs.price_now      = 'ราคา > 0'
    if (form.commission_rate <= 0)  errs.commission_rate = 'commission > 0'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form })
  }

  const isRiskyCategory = AVOID_CATEGORIES.some(cat =>
    form.category.toLowerCase().includes(cat.toLowerCase()) ||
    cat.toLowerCase().includes(form.category.toLowerCase())
  )

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background:    '#080c18',
        border:        '1px solid #1a2540',
        borderLeft:    '3px solid #00e5ff',
        padding:       '14px 16px',
        display:       'flex',
        flexDirection: 'column',
        gap:           0,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#00e5ff', letterSpacing: 2 }}>
          + เพิ่มสินค้าใหม่เข้าระบบ
        </div>
        <button
          type="button"
          onClick={onCancel}
          style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: '#4a5680', background: 'none', border: '1px solid #1a2540', padding: '2px 8px', cursor: 'pointer', letterSpacing: 1 }}
        >
          ✕ ยกเลิก
        </button>
      </div>

      {/* SECTION: สินค้า */}
      <div style={sectionStyle}>สินค้า</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>ชื่อสินค้า (ภาษาไทย) *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.title_th ? '#ff5252' : '#1a2540' }}
            value={form.title_th}
            onChange={e => set('title_th', e.target.value)}
            placeholder="เช่น กล่องจัดระเบียบ 6-in-1"
          />
          {errors.title_th && <span style={{ fontSize: 9, color: '#ff5252' }}>{errors.title_th}</span>}
        </div>

        <div>
          <label style={labelStyle}>ชื่อสินค้า (ภาษาอังกฤษ)</label>
          <input
            style={inputStyle}
            value={form.title_raw}
            onChange={e => set('title_raw', e.target.value)}
            placeholder="Storage Box 6-in-1"
          />
        </div>

        <div>
          <label style={labelStyle}>ร้านค้า</label>
          <input
            style={inputStyle}
            value={form.shop_name}
            onChange={e => set('shop_name', e.target.value)}
            placeholder="ชื่อร้านค้า"
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>URL สินค้า *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.product_url ? '#ff5252' : '#1a2540' }}
            value={form.product_url}
            onChange={e => set('product_url', e.target.value)}
            placeholder="https://shopee.th/..."
          />
          {errors.product_url && <span style={{ fontSize: 9, color: '#ff5252' }}>{errors.product_url}</span>}
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>URL รูปภาพสินค้า</label>
          <input
            style={inputStyle}
            value={form.product_image_url}
            onChange={e => set('product_image_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* SECTION: ช่องทาง */}
      <div style={sectionStyle}>ช่องทาง</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {MARKETPLACE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => set('marketplace', opt.value)}
            style={{
              flex:        1,
              fontFamily:  'VT323, monospace',
              fontSize:    14,
              color:       form.marketplace === opt.value ? opt.color : '#4a5680',
              background:  form.marketplace === opt.value ? `${opt.color}14` : 'transparent',
              border:      `1px solid ${form.marketplace === opt.value ? opt.color + '66' : '#1a2540'}`,
              padding:     '5px',
              cursor:      'pointer',
              letterSpacing: 1,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* SECTION: หมวดหมู่ */}
      <div style={sectionStyle}>หมวดหมู่</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={labelStyle}>หมวดหมู่หลัก *</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            <option value="">— เลือกหมวด —</option>
            <optgroup label="✅ แนะนำ">
              {APPROVED_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
            <optgroup label="⚠ ระวัง">
              {AVOID_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
          </select>
          {errors.category && <span style={{ fontSize: 9, color: '#ff5252' }}>{errors.category}</span>}
          {isRiskyCategory && form.category && (
            <div style={{ fontSize: 9, color: '#ffb300', marginTop: 2 }}>
              ⚠ หมวดนี้มีความเสี่ยงสูง — ต้องผ่าน compliance check เพิ่มเติม
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>หมวดหมู่ย่อย</label>
          <input
            style={inputStyle}
            value={form.subcategory}
            onChange={e => set('subcategory', e.target.value)}
            placeholder="เช่น กล่องเก็บของ"
          />
        </div>
      </div>

      {/* SECTION: ราคาและค่าคอม */}
      <div style={sectionStyle}>ราคาและค่าคอมมิชชั่น</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={labelStyle}>ราคาปัจจุบัน (฿) *</label>
          <input
            style={{ ...inputStyle, borderColor: errors.price_now ? '#ff5252' : '#1a2540' }}
            type="number" min="0" step="1"
            value={form.price_now || ''}
            onChange={e => set('price_now', parseFloat(e.target.value) || 0)}
            placeholder="299"
          />
          {errors.price_now && <span style={{ fontSize: 9, color: '#ff5252' }}>{errors.price_now}</span>}
        </div>

        <div>
          <label style={labelStyle}>ราคาปกติ (฿)</label>
          <input
            style={inputStyle}
            type="number" min="0" step="1"
            value={form.price_normal || ''}
            onChange={e => set('price_normal', parseFloat(e.target.value) || 0)}
            placeholder="450"
          />
        </div>

        <div>
          <label style={labelStyle}>ส่วนลด (คำนวณอัตโนมัติ)</label>
          <div style={{
            ...inputStyle,
            color: discount > 0 ? '#00ff9f' : '#4a5680',
            background: '#030507',
          }}>
            {discount > 0 ? `-${discount}%` : '—'}
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, color: errors.commission_rate ? '#ff5252' : '#4a5680' }}>
            commission rate (%) *
          </label>
          <input
            style={{ ...inputStyle, borderColor: errors.commission_rate ? '#ff5252' : '#1a2540' }}
            type="number" min="0" step="0.1"
            value={form.commission_rate || ''}
            onChange={e => set('commission_rate', parseFloat(e.target.value) || 0)}
            placeholder="10"
          />
          {errors.commission_rate && <span style={{ fontSize: 9, color: '#ff5252' }}>{errors.commission_rate}</span>}
        </div>

        <div style={{ gridColumn: '2 / -1' }}>
          <label style={labelStyle}>est. commission/ชิ้น (คำนวณอัตโนมัติ)</label>
          <div style={{
            ...inputStyle,
            color: estCommission > 0 ? '#00e5ff' : '#4a5680',
            background: '#030507',
          }}>
            {estCommission > 0 ? `฿${estCommission}` : '—'}
          </div>
        </div>
      </div>

      {/* SECTION: ข้อมูลสินค้า */}
      <div style={sectionStyle}>ข้อมูลสินค้า</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={labelStyle}>rating (0–5)</label>
          <input
            style={inputStyle}
            type="number" min="0" max="5" step="0.1"
            value={form.rating || ''}
            onChange={e => set('rating', parseFloat(e.target.value) || 0)}
            placeholder="4.8"
          />
        </div>
        <div>
          <label style={labelStyle}>จำนวนรีวิว</label>
          <input
            style={inputStyle}
            type="number" min="0" step="1"
            value={form.review_count || ''}
            onChange={e => set('review_count', parseInt(e.target.value) || 0)}
            placeholder="312"
          />
        </div>
        <div>
          <label style={labelStyle}>ยอดขาย (ชิ้น)</label>
          <input
            style={inputStyle}
            type="number" min="0" step="1"
            value={form.sold_count || ''}
            onChange={e => set('sold_count', parseInt(e.target.value) || 0)}
            placeholder="1840"
          />
        </div>
      </div>

      {/* SECTION: แคมเปญ */}
      <div style={sectionStyle}>แคมเปญ</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={labelStyle}>Platform เป้าหมาย</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.target_platform}
            onChange={e => set('target_platform', e.target.value)}
          >
            <option value="">— เหมือน marketplace —</option>
            <option value="tiktok">TikTok</option>
            <option value="shopee">Shopee Video</option>
            <option value="lazada">Lazada Live</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube Shorts</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>เป้าหมายแคมเปญ</label>
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.campaign_goal}
            onChange={e => set('campaign_goal', e.target.value)}
          >
            <option value="">— เลือกเป้าหมาย —</option>
            {CAMPAIGN_GOALS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>หมายเหตุ</label>
          <textarea
            style={{ ...inputStyle, minHeight: 52, resize: 'vertical' }}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="ข้อสังเกตพิเศษ ความเสี่ยง หรือ context เพิ่มเติม"
          />
        </div>
      </div>

      {/* Submit row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            fontFamily: 'VT323, monospace', fontSize: 14,
            color: '#4a5680', background: 'none',
            border: '1px solid #1a2540', padding: '7px 16px', cursor: 'pointer', letterSpacing: 1,
          }}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          style={{
            fontFamily: 'VT323, monospace', fontSize: 14,
            color: '#00e5ff', background: '#00e5ff14',
            border: '1px solid #00e5ff55', padding: '7px 20px', cursor: 'pointer', letterSpacing: 1,
          }}
        >
          + เพิ่มสินค้าและสร้างแคมเปญ
        </button>
      </div>
    </form>
  )
}
