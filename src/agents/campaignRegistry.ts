/** Revenue channels — Shopee, Lazada, TikTok only. No "multi". */
export type CampaignChannel = 'shopee' | 'lazada' | 'tiktok'

export type PipelineStage =
  | 'campaign_brief'
  | 'product_research'
  | 'content_creation'
  | 'review_compliance'
  | 'ceo_approval'
  | 'export_publish'
  | 'performance_feedback'
  | 'finance_review'

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'campaign_brief',       label: 'บรีฟแคมเปญ'         },
  { id: 'product_research',     label: 'วิเคราะห์สินค้า'    },
  { id: 'content_creation',     label: 'ผลิตคอนเทนต์'       },
  { id: 'review_compliance',    label: 'ตรวจสอบความเสี่ยง'  },
  { id: 'ceo_approval',         label: 'CEO อนุมัติ'         },
  { id: 'export_publish',       label: 'พร้อมส่งออก'         },
  { id: 'performance_feedback', label: 'วิเคราะห์ผลลัพธ์'   },
  { id: 'finance_review',       label: 'Finance Review'      },
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

export interface Campaign {
  id: string
  name: string
  channel: CampaignChannel
  category: string
  targetPrice: string
  stage: PipelineStage
  progress: number
  assignedAgentId: string
  brief: string
  finance: CampaignFinance
  notes: string
  financeWarnings: string[]
}

export const campaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Wireless Earbuds ใต้ 500 บาท',
    channel: 'tiktok',
    category: 'Electronics',
    targetPrice: '< ฿500',
    stage: 'content_creation',
    progress: 70,
    assignedAgentId: 'content-studio',
    brief: 'TikTok impulse buy. Hook: เปิดโปงว่าหูฟังแพงโดนหลอก. Target: Gen Z 18–25. Format: POV unboxing.',
    finance: {
      revenue:        4200,
      commission:     357,
      adSpend:        900,
      contentCost:    200,
      netProfit:      1450,
      roas:           4.6,
      conversionRate: 1.8,
      costPerOrder:   65,
      pendingPayout:  357,
    },
    notes: 'เทรนด์ RISING — ควรโพสต์ภายใน 48 ชม. Commission 8.5% ใน TikTok Shop.',
    financeWarnings: [],
  },
  {
    id: 'camp-002',
    name: 'โคมไฟตั้งโต๊ะ Home Office',
    channel: 'shopee',
    category: 'Home & Office',
    targetPrice: '฿500–฿1,200',
    stage: 'product_research',
    progress: 45,
    assignedAgentId: 'product-analyst',
    brief: 'Shopee affiliate. Target: คนทำงานที่บ้าน. Angle: ถนอมสายตา + ดีไซน์โต๊ะสวย.',
    finance: {
      revenue:        2100,
      commission:     147,
      adSpend:        350,
      contentCost:    150,
      netProfit:      620,
      roas:           6.0,
      conversionRate: 2.1,
      costPerOrder:   28,
      pendingPayout:  147,
    },
    notes: 'คู่แข่ง affiliate 12 ราย — ต้องหา angle ที่ต่าง. Commission 7%.',
    financeWarnings: ['ควรเพิ่มงบ — ROAS 6.0x สูงกว่าเป้า'],
  },
  {
    id: 'camp-003',
    name: 'Portable Blender',
    channel: 'lazada',
    category: 'Kitchen & Health',
    targetPrice: '฿700–฿1,500',
    stage: 'review_compliance',
    progress: 75,
    assignedAgentId: 'ops-review',
    brief: 'Lazada affiliate. Target: คนรักสุขภาพ. Angle: smoothie ทำง่ายพกพาได้.',
    finance: {
      revenue:        1400,
      commission:     84,
      adSpend:        700,
      contentCost:    200,
      netProfit:      -120,
      roas:           2.0,
      conversionRate: 0.8,
      costPerOrder:   88,
      pendingPayout:  84,
    },
    notes: 'Commission 6%. สคริปต์เขียนเสร็จแล้ว กำลัง compliance review.',
    financeWarnings: [
      'ค่าโฆษณาสูงกว่ากำไร — ขาดทุน ฿120',
      'ROAS ต่ำกว่าเป้าหมาย (2.0x vs เป้า 4.0x)',
      'แคมเปญนี้ควรหยุดยิงแอดหรือแก้ creative ก่อน',
    ],
  },
  {
    id: 'camp-004',
    name: 'Skincare Travel Pouch',
    channel: 'tiktok',
    category: 'Beauty & Travel',
    targetPrice: '฿400–฿900',
    stage: 'ceo_approval',
    progress: 90,
    assignedAgentId: 'ceo-director',
    brief: 'TikTok. Angle: routine ดูแลผิวตอนเดินทาง. Target: ผู้หญิง 22–35.',
    finance: {
      revenue:        3600,
      commission:     360,
      adSpend:        500,
      contentCost:    150,
      netProfit:      1200,
      roas:           7.2,
      conversionRate: 2.4,
      costPerOrder:   41,
      pendingPayout:  360,
    },
    notes: 'Compliance ผ่านแล้ว รอ CEO อนุมัติ.',
    financeWarnings: ['ควรเพิ่มงบ — ROAS 7.2x สูงมาก คุ้มค่าขยายสเกล'],
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
