import { useState } from 'react'
import { parseCSV, validateProductRow, importProductsFromCSV } from '../../services/csvImportService'
import type { RowValidationError, ImportResult } from '../../services/csvImportService'

interface Props {
  logCounter: number
  onClose:    () => void
  onConfirm:  (result: ImportResult) => void
}

const SAMPLE_CSV = `marketplace,product_url,title_th,shop_name,category,subcategory,price_now,price_normal,commission_rate,rating,review_count,sold_count,notes
shopee,https://shopee.co.th/item/123,ครีมบำรุงผิวหน้า,Beauty Shop,ความงาม,ครีมบำรุงผิว,299,499,10,4.8,500,2000,
lazada,https://www.lazada.co.th/products/456,กล่องจัดระเบียบ,Storage Store,จัดเก็บของ,กล่องเก็บของ,189,350,8,4.5,200,800,`

type PreviewRow = {
  rowNumber: number
  data:      Record<string, string>
  errors:    RowValidationError[]
  valid:     boolean
}

export default function CSVImportModal({ logCounter, onClose, onConfirm }: Props) {
  const [raw,      setRaw]      = useState('')
  const [preview,  setPreview]  = useState<PreviewRow[] | null>(null)
  const [result,   setResult]   = useState<ImportResult | null>(null)
  const [headers,  setHeaders]  = useState<string[]>([])

  function handleParse() {
    const { headers: h, rows } = parseCSV(raw)
    setHeaders(h)
    const previewRows: PreviewRow[] = rows.map((row, i) => {
      const { valid, errors } = validateProductRow(row, i + 2)
      return { rowNumber: i + 2, data: row, errors, valid }
    })
    setPreview(previewRows)
    setResult(null)
  }

  function handleConfirm() {
    if (!preview) return
    const validRows = preview.filter(r => r.valid).map(r => r.data)
    if (validRows.length === 0) return
    const importResult = importProductsFromCSV(validRows, logCounter)
    setResult(importResult)
    onConfirm(importResult)
  }

  const validCount   = preview?.filter(r => r.valid).length   ?? 0
  const invalidCount = preview?.filter(r => !r.valid).length  ?? 0

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 80, paddingBottom: 20, overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 760,
        background: '#0a0e1a', border: '2px solid #1a2540',
        fontFamily: 'Share Tech Mono, monospace',
        padding: 20,
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #1a2540', paddingBottom: 10 }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: '#00e5ff', letterSpacing: 2 }}>
            นำเข้าจาก Google Sheet / CSV
          </div>
          <button onClick={onClose} style={CLOSE_BTN_STYLE}>✕ ปิด</button>
        </div>

        {result ? (
          // ── Result state ──
          <div>
            <div style={{ background: '#00ff9f11', border: '1px solid #00ff9f44', padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#00ff9f', marginBottom: 6 }}>
                นำเข้าสำเร็จ
              </div>
              <div style={{ fontSize: 12, color: '#8892b0', lineHeight: 1.8 }}>
                <div>นำเข้าแล้ว: <span style={{ color: '#00ff9f' }}>{result.imported} สินค้า</span></div>
                {result.skipped > 0 && <div>ข้ามแถวไม่ผ่านตรวจสอบ: <span style={{ color: '#ffb300' }}>{result.skipped} แถว</span></div>}
                <div style={{ marginTop: 6, color: '#4a5680' }}>sync_status: imported_from_sheet — บันทึกใน localStorage แล้ว</div>
              </div>
            </div>
            <button onClick={onClose} style={{ ...ACTION_BTN_STYLE, color: '#00e5ff', background: '#00e5ff0d', border: '1px solid #00e5ff44' }}>
              ปิดและดูแคมเปญ
            </button>
          </div>
        ) : (
          <>
            {/* Instructions */}
            <div style={{ fontSize: 11, color: '#4a5680', marginBottom: 12, lineHeight: 1.6 }}>
              วางข้อมูล CSV หรือ Tab-Separated จาก Google Sheet ด้านล่าง บรรทัดแรกต้องเป็น headers<br/>
              คอลัมน์บังคับ: <span style={{ color: '#00e5ff' }}>marketplace, product_url, title_th (หรือ title_raw), category, price_now, commission_rate</span>
            </div>

            {/* Sample CSV button */}
            <button
              onClick={() => setRaw(SAMPLE_CSV)}
              style={{ fontSize: 11, color: '#4a5680', background: 'none', border: '1px solid #1a2540', padding: '3px 10px', cursor: 'pointer', marginBottom: 8, fontFamily: 'Share Tech Mono, monospace' }}
            >
              ใส่ตัวอย่าง CSV
            </button>

            {/* Textarea */}
            <textarea
              value={raw}
              onChange={e => { setRaw(e.target.value); setPreview(null) }}
              placeholder={'marketplace,product_url,title_th,...\nshopee,https://...,ชื่อสินค้า,...'}
              rows={7}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#06090f', color: '#8892b0',
                border: '1px solid #1a2540', padding: '8px 10px',
                fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
                resize: 'vertical', outline: 'none', marginBottom: 10,
              }}
            />

            {/* Parse button */}
            <button
              onClick={handleParse}
              disabled={!raw.trim()}
              style={{ ...ACTION_BTN_STYLE, color: '#00e5ff', background: '#00e5ff0d', border: '1px solid #00e5ff44', opacity: raw.trim() ? 1 : 0.4, marginBottom: 16 }}
            >
              ตรวจสอบข้อมูล
            </button>

            {/* Preview table */}
            {preview !== null && (
              <div>
                {/* Summary badges */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#00ff9f', background: '#00ff9f11', padding: '2px 10px', border: '1px solid #00ff9f33' }}>
                    ✅ ผ่าน {validCount} แถว
                  </span>
                  {invalidCount > 0 && (
                    <span style={{ fontSize: 11, color: '#ff5252', background: '#ff525211', padding: '2px 10px', border: '1px solid #ff525233' }}>
                      ❌ ไม่ผ่าน {invalidCount} แถว
                    </span>
                  )}
                </div>

                {/* Row preview */}
                <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid #1a2540', marginBottom: 12 }}>
                  {preview.map(r => (
                    <div
                      key={r.rowNumber}
                      style={{
                        padding: '6px 10px',
                        borderBottom: '1px solid #0e1528',
                        background: r.valid ? '#00ff9f08' : '#ff525208',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: r.errors.length > 0 ? 4 : 0 }}>
                        <span style={{ fontSize: 10, color: '#2a3560', minWidth: 40 }}>แถว {r.rowNumber}</span>
                        <span style={{ fontSize: 11, color: r.valid ? '#00ff9f' : '#ff5252' }}>
                          {r.valid ? '✅' : '❌'}
                        </span>
                        <span style={{ fontSize: 11, color: '#8892b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                          {r.data['title_th'] || r.data['title_raw'] || '(ไม่มีชื่อ)'} — {r.data['marketplace']} ฿{r.data['price_now']}
                        </span>
                      </div>
                      {r.errors.map((e, i) => (
                        <div key={i} style={{ fontSize: 10, color: '#ffb300', paddingLeft: 48, lineHeight: 1.5 }}>
                          <span style={{ color: '#ff5252' }}>{e.field}</span>: {e.issue} → {e.fix}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Column list from parsed headers */}
                {headers.length > 0 && (
                  <div style={{ fontSize: 10, color: '#2a3560', marginBottom: 12 }}>
                    คอลัมน์ที่พบ: {headers.join(' · ')}
                  </div>
                )}

                {/* Confirm button */}
                <button
                  onClick={handleConfirm}
                  disabled={validCount === 0}
                  style={{
                    ...ACTION_BTN_STYLE,
                    color: '#00ff9f', background: '#00ff9f0d', border: '1px solid #00ff9f44',
                    opacity: validCount > 0 ? 1 : 0.4,
                  }}
                >
                  ยืนยันนำเข้า {validCount} สินค้า
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const CLOSE_BTN_STYLE: React.CSSProperties = {
  fontFamily: 'VT323, monospace', fontSize: 12,
  color: '#4a5680', background: 'none',
  border: '1px solid #1a2540', padding: '2px 8px',
  cursor: 'pointer', letterSpacing: 1,
}

const ACTION_BTN_STYLE: React.CSSProperties = {
  fontFamily: 'VT323, monospace', fontSize: 14,
  padding: '7px 18px', cursor: 'pointer',
  letterSpacing: 1, display: 'inline-block',
}
