/** Revenue channels — Shopee, Lazada, TikTok only. No "multi". */
export type CampaignChannel = 'shopee' | 'lazada' | 'tiktok'

export type PipelineStage =
  | 'new_product'
  | 'verified'
  | 'scored'
  | 'selected'
  | 'brief_ready'
  | 'script_ready'
  | 'asset_ready'
  | 'human_approved'
  | 'published'
  | 'analyzed'
  | 'learned'

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'new_product',    label: 'รับสินค้าใหม่'          },
  { id: 'verified',       label: 'ยืนยันข้อมูลสินค้า'     },
  { id: 'scored',         label: 'ประเมินคะแนน'            },
  { id: 'selected',       label: 'เลือกโปรโมท'            },
  { id: 'brief_ready',    label: 'Brief พร้อม'             },
  { id: 'script_ready',   label: 'Script พร้อม'            },
  { id: 'asset_ready',    label: 'ชิ้นงานพร้อม'           },
  { id: 'human_approved', label: 'รอผู้บริหารอนุมัติ'     },
  { id: 'published',      label: 'โพสต์แล้ว'              },
  { id: 'analyzed',       label: 'วิเคราะห์ผลลัพธ์'       },
  { id: 'learned',        label: 'บันทึกบทเรียน'          },
]

export interface CampaignFinance {
  revenue: number
  commission: number
  adSpend: number
  contentCost: number
  netProfit: number
  roas: number
  conversionRate: number
  costPerOrder: number
  pendingPayout: number
}

export interface ProductScores {
  demo_score: number
  price_score: number
  commission_score: number
  impulse_score: number
  risk_score: number
  content_angle_score: number
  platform_fit_score: number
  final_score: number
}

export interface AgentOutput {
  id: string
  campaignId: string
  agentId: string
  stage: PipelineStage
  title: string
  summary: string
  content: string
  risks: string[]
  recommendation: string
  createdAt: string
}

export interface AgentTask {
  id: string
  campaignId: string
  agentId: string
  stage: PipelineStage
  status: 'pending' | 'in_progress' | 'done' | 'rejected'
  input: string
  output: string
  risk: string
  nextAction: string
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: string
  name: string
  channel: CampaignChannel
  /** marketplace is an alias for channel — same field */
  marketplace: CampaignChannel
  category: string
  subcategory: string
  targetPrice: string
  stage: PipelineStage
  progress: number
  assignedAgentId: string
  brief: string
  finance: CampaignFinance
  notes: string
  financeWarnings: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskMessage: string
  outputs: AgentOutput[]
  commission_rate: number
  est_commission_baht: number
  claim_risk: 'low' | 'medium' | 'high'
  return_risk: 'low' | 'medium' | 'high'
  suitability_score: number
  scores: ProductScores
}

export const campaigns: Campaign[] = [
  {
    id: 'prod-001',
    name: 'กล่องจัดระเบียบ 6-in-1 ชั้นวาง condo',
    channel: 'shopee',
    marketplace: 'shopee',
    category: 'จัดระเบียบบ้าน',
    subcategory: 'กล่องเก็บของ',
    targetPrice: '฿299',
    stage: 'brief_ready',
    progress: 45,
    assignedAgentId: 'content-strategy',
    brief: 'สินค้าจัดระเบียบบ้านสำหรับห้องเล็ก/คอนโด กล่อง 6-in-1 ราคา ฿299 ลด 33% rating 4.8 ดาว sold 1,840 ชิ้น hook: "ห้องเล็ก condo แบบนี้ต้องใช้ — ปัญหาจุกจิกทุกวัน"',
    finance: {
      revenue:        8400,
      commission:     840,
      adSpend:        1200,
      contentCost:    500,
      netProfit:      6540,
      roas:           5.2,
      conversionRate: 3.2,
      costPerOrder:   65,
      pendingPayout:  0,
    },
    notes: 'สินค้าหมวดจัดระเบียบบ้าน เหมาะกับ hook "ปัญหาจุกจิกทุกวัน" และ "ห้องเล็กต้องมี" ROAS 5.2x สูงกว่าเป้า',
    financeWarnings: [],
    riskLevel: 'low',
    riskMessage: '',
    outputs: [],
    commission_rate: 0.10,
    est_commission_baht: 840,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 88,
    scores: {
      demo_score: 9,
      price_score: 8,
      commission_score: 7,
      impulse_score: 8,
      risk_score: 2,
      content_angle_score: 9,
      platform_fit_score: 8,
      final_score: 84,
    },
  },
  {
    id: 'prod-002',
    name: 'ไม้ถูพื้น Spin Mop พร้อมถัง 360°',
    channel: 'lazada',
    marketplace: 'lazada',
    category: 'ทำความสะอาด',
    subcategory: 'ไม้ถู',
    targetPrice: '฿590',
    stage: 'scored',
    progress: 27,
    assignedAgentId: 'offer-analyst',
    brief: 'ไม้ถูพื้น Spin Mop พร้อมถัง 360° ราคา ฿590 ลด 34% rating 4.6 ดาว sold 920 ชิ้น ต้องประเมิน ROAS ก่อนเลือกโปรโมท',
    finance: {
      revenue:        5700,
      commission:     570,
      adSpend:        1500,
      contentCost:    600,
      netProfit:      3070,
      roas:           3.8,
      conversionRate: 2.1,
      costPerOrder:   157,
      pendingPayout:  0,
    },
    notes: 'ROAS 3.8x ต่ำกว่าเป้า 5.0x — Offer Analyst กำลังประเมินว่าคุ้มค่าโปรโมทไหม',
    financeWarnings: ['ROAS ต่ำกว่าเป้า (3.8x vs เป้า 5.0x) — ต้องพิจารณาก่อนเลือกโปรโมท'],
    riskLevel: 'low',
    riskMessage: '',
    outputs: [],
    commission_rate: 0.10,
    est_commission_baht: 570,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 74,
    scores: {
      demo_score: 8,
      price_score: 7,
      commission_score: 6,
      impulse_score: 6,
      risk_score: 2,
      content_angle_score: 8,
      platform_fit_score: 7,
      final_score: 74,
    },
  },
  {
    id: 'prod-003',
    name: 'ที่ชาร์จ 3-in-1 MagSafe-style แท่นชาร์จไร้สาย',
    channel: 'tiktok',
    marketplace: 'tiktok',
    category: 'อุปกรณ์อิเล็กทรอนิกส์',
    subcategory: 'อุปกรณ์ชาร์จ',
    targetPrice: '฿390',
    stage: 'published',
    progress: 82,
    assignedAgentId: 'social-performance',
    brief: 'ที่ชาร์จ 3-in-1 MagSafe-style ราคา ฿390 ลด 34% rating 4.7 ดาว sold 3,210 ชิ้น TikTok post เผยแพร่แล้ว กำลังวิเคราะห์ผล 48 ชม.',
    finance: {
      revenue:        12200,
      commission:     1220,
      adSpend:        2000,
      contentCost:    800,
      netProfit:      9220,
      roas:           6.1,
      conversionRate: 4.8,
      costPerOrder:   41,
      pendingPayout:  600,
    },
    notes: 'ROAS 6.1x สูงกว่าเป้า — Social Performance กำลังวิเคราะห์ผล ต้องตรวจสอบ spec ความเร็วชาร์จก่อน claim',
    financeWarnings: ['ควรเพิ่มงบ — ROAS 6.1x สูงกว่าเป้า คุ้มค่าขยายสเกล'],
    riskLevel: 'medium',
    riskMessage: 'ตรวจสอบ spec ความเร็วชาร์จก่อน claim',
    outputs: [],
    commission_rate: 0.10,
    est_commission_baht: 1220,
    claim_risk: 'medium',
    return_risk: 'low',
    suitability_score: 91,
    scores: {
      demo_score: 9,
      price_score: 8,
      commission_score: 9,
      impulse_score: 9,
      risk_score: 4,
      content_angle_score: 9,
      platform_fit_score: 9,
      final_score: 91,
    },
  },
  {
    id: 'prod-004',
    name: 'แผ่นรองเมาส์ RGB XXL 80×30 cm',
    channel: 'shopee',
    marketplace: 'shopee',
    category: 'อุปกรณ์คอมพิวเตอร์',
    subcategory: 'แผ่นรองเมาส์',
    targetPrice: '฿189',
    stage: 'script_ready',
    progress: 55,
    assignedAgentId: 'script-writer',
    brief: 'แผ่นรองเมาส์ RGB XXL 80×30 cm ราคา ฿189 ลด 41% rating 4.5 ดาว sold 1,150 ชิ้น hook: "฿189 บาท คุ้มจริงไหม?" script 25 วิ TikTok กำลัง review',
    finance: {
      revenue:        6300,
      commission:     630,
      adSpend:        1500,
      contentCost:    550,
      netProfit:      3880,
      roas:           4.2,
      conversionRate: 2.9,
      costPerOrder:   65,
      pendingPayout:  0,
    },
    notes: 'Script 25 วิ TikTok กำลัง review — hook บรรทัดแรกยังไม่ตัดสินใจว่า demo-first หรือ problem-first',
    financeWarnings: [],
    riskLevel: 'low',
    riskMessage: '',
    outputs: [],
    commission_rate: 0.10,
    est_commission_baht: 630,
    claim_risk: 'low',
    return_risk: 'low',
    suitability_score: 79,
    scores: {
      demo_score: 7,
      price_score: 9,
      commission_score: 6,
      impulse_score: 8,
      risk_score: 2,
      content_angle_score: 7,
      platform_fit_score: 8,
      final_score: 79,
    },
  },
]

export const CHANNEL_CONFIG: Record<CampaignChannel, { label: string; color: string; flag: string }> = {
  shopee: { label: 'Shopee', color: '#ff5722', flag: '🟠' },
  lazada: { label: 'Lazada', color: '#2979ff', flag: '🔵' },
  tiktok: { label: 'TikTok', color: '#00e5ff', flag: '🩵' },
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id)
}

export function getCampaignsByChannel(channel: CampaignChannel): Campaign[] {
  return campaigns.filter(c => c.channel === channel)
}

export function getStageIndex(stage: PipelineStage): number {
  return PIPELINE_STAGES.findIndex(s => s.id === stage)
}

export function formatTHB(amount: number): string {
  const abs = Math.abs(amount)
  const formatted = abs.toLocaleString('th-TH')
  return amount < 0 ? `-฿${formatted}` : `฿${formatted}`
}
