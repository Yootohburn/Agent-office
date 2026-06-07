import { submitProduct } from './productIntakeService'
import type { ActivityLogEntry, TeamChatMessage } from '../agents/agentSessionStore'
import type { Campaign } from '../agents/campaignRegistry'
import type { ProductIntakeFormData, Marketplace } from '../data/types'

export interface ParseResult {
  headers: string[]
  rows:    Record<string, string>[]
}

export interface RowValidationError {
  rowNumber: number
  field:     string
  issue:     string
  fix:       string
}

export interface RowValidationResult {
  valid:  boolean
  errors: RowValidationError[]
}

export interface ImportResult {
  imported:    number
  skipped:     number
  campaigns:   Campaign[]
  logEntry:    ActivityLogEntry
  chatMessage: TeamChatMessage
}

const REQUIRED_CHECKS: {
  field:  string
  check:  (v: string) => boolean
  fix:    string
}[] = [
  { field: 'marketplace',     check: v => ['shopee', 'lazada', 'tiktok'].includes(v), fix: 'ต้องเป็น shopee, lazada, หรือ tiktok' },
  { field: 'product_url',     check: v => v.startsWith('http'),                       fix: 'ต้องเป็น URL ที่ขึ้นต้นด้วย http' },
  { field: 'category',        check: v => v.length > 0,                               fix: 'กรอกหมวดหมู่สินค้า' },
  { field: 'price_now',       check: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, fix: 'ต้องเป็นตัวเลขราคา > 0' },
  { field: 'commission_rate', check: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, fix: 'ต้องเป็นตัวเลข % > 0' },
]

// Splits a single CSV line, respecting double-quoted fields.
function splitCSVLine(line: string, sep: string): string[] {
  if (sep === '\t') return line.split('\t')
  const result: string[] = []
  let current  = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === sep && !inQuotes) {
      result.push(current); current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

// Parses CSV or tab-separated text. First row = headers.
export function parseCSV(raw: string): ParseResult {
  const lines = raw.trim().split(/\r?\n/).filter(l => l.trim())
  if (lines.length === 0) return { headers: [], rows: [] }
  const sep     = lines[0].includes('\t') ? '\t' : ','
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i], sep)
    const entry: Record<string, string> = {}
    headers.forEach((h, idx) => { entry[h] = (values[idx] ?? '').trim() })
    rows.push(entry)
  }
  return { headers, rows }
}

export function validateProductRow(row: Record<string, string>, rowNumber: number): RowValidationResult {
  const errors: RowValidationError[] = []
  if (!row['title_th'] && !row['title_raw']) {
    errors.push({ rowNumber, field: 'title_th / title_raw', issue: 'ไม่มีชื่อสินค้า', fix: 'กรอก title_th หรือ title_raw อย่างน้อยหนึ่งอย่าง' })
  }
  for (const req of REQUIRED_CHECKS) {
    const val = row[req.field] ?? ''
    if (!req.check(val)) {
      errors.push({ rowNumber, field: req.field, issue: `"${val}" ไม่ถูกต้อง`, fix: req.fix })
    }
  }
  return { valid: errors.length === 0, errors }
}

function rowToForm(row: Record<string, string>): ProductIntakeFormData {
  const marketplace = row['marketplace'] as Marketplace
  const priceNow    = parseFloat(row['price_now']) || 0
  return {
    title_th:          row['title_th']          || row['title_raw'] || '',
    title_raw:         row['title_raw']         || row['title_th']  || '',
    product_url:       row['product_url']       || '',
    marketplace,
    shop_name:         row['shop_name']         || '',
    category:          row['category']          || '',
    subcategory:       row['subcategory']       || '',
    price_now:         priceNow,
    price_normal:      parseFloat(row['price_normal']) || priceNow,
    commission_rate:   parseFloat(row['commission_rate']) || 0,
    rating:            parseFloat(row['rating'])          || 0,
    review_count:      parseInt(row['review_count'])      || 0,
    sold_count:        parseInt(row['sold_count'])        || 0,
    product_image_url: row['product_image_url'] || '',
    notes:             row['notes']             || '',
    target_platform:   row['target_platform']   || marketplace,
    campaign_goal:     row['campaign_goal']     || '',
  }
}

function nowHMS(): string {
  const n = new Date()
  return [n.getHours(), n.getMinutes(), n.getSeconds()].map(v => String(v).padStart(2, '0')).join(':')
}

function nowHM(): string {
  const n = new Date()
  return [n.getHours(), n.getMinutes()].map(v => String(v).padStart(2, '0')).join(':')
}

export function importProductsFromCSV(
  rows:           Record<string, string>[],
  baseLogCounter: number,
): ImportResult {
  const validIndices:   number[] = []
  const skippedIndices: number[] = []

  rows.forEach((row, i) => {
    const { valid } = validateProductRow(row, i + 2) // row 2 = first data row (row 1 = header)
    if (valid) validIndices.push(i)
    else skippedIndices.push(i)
  })

  const campaigns: Campaign[] = []
  let logCounter = baseLogCounter

  for (const idx of validIndices) {
    const result = submitProduct(rowToForm(rows[idx]), logCounter, 'imported_from_sheet')
    campaigns.push(result.campaign)
    logCounter++
  }

  const imported = validIndices.length
  const skipped  = skippedIndices.length

  const logEntry: ActivityLogEntry = {
    id:        String(baseLogCounter),
    timestamp: nowHMS(),
    agentId:   'system',
    agentName: 'SYSTEM',
    message:   `[CSV IMPORT] นำเข้า ${imported} สินค้า สำเร็จ / ข้าม ${skipped} แถว — product-research รับงานแล้ว`,
    type:      'system',
  }

  const chatMessage: TeamChatMessage = {
    id:            `chat-import-${Date.now()}`,
    timestamp:     nowHM(),
    senderAgentId: 'product-research',
    senderName:    'Research',
    accent:        '#00e5ff',
    message:       `รับสินค้าใหม่จาก CSV import ${imported} รายการ — เริ่มตรวจสอบข้อมูลแล้วครับ`,
  }

  return { imported, skipped, campaigns, logEntry, chatMessage }
}
