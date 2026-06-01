export interface ActivityLogEntry {
  id: string
  timestamp: string
  agentId: string
  agentName: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success' | 'system'
  campaignId?: string
}

export interface TeamChatMessage {
  id: string
  timestamp: string
  senderAgentId: string
  senderName: string
  accent: string
  message: string
  campaignId?: string
}

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '09:00:01',
    agentId: 'system',
    agentName: 'SYSTEM',
    message: 'Agent Office v2.4 เริ่มทำงาน — AI Affiliate Content Company พร้อมใช้งาน 6 แผนก',
    type: 'system',
  },
  {
    id: '2',
    timestamp: '09:01:14',
    agentId: 'ceo-director',
    agentName: 'CEO',
    message: 'ตั้งลำดับความสำคัญประจำสัปดาห์: TikTok Electronics → Shopee Home Office → Lazada Kitchen → TikTok Beauty',
    type: 'info',
  },
  {
    id: '3',
    timestamp: '09:02:30',
    agentId: 'product-analyst',
    agentName: 'Product Analyst',
    message: '[camp-001] TikTok Earbuds วิเคราะห์เสร็จ คะแนน 84/100 commission 8.5% เทรนด์ RISING ส่ง brief ไป Content Studio แล้ว',
    type: 'success',
    campaignId: 'camp-001',
  },
  {
    id: '4',
    timestamp: '09:04:00',
    agentId: 'content-studio',
    agentName: 'Content Studio',
    message: '[camp-001] เริ่มเขียนสคริปต์ TikTok Earbuds Hook: "POV: เพิ่งรู้ว่าหูฟัง ฿2,000 โดนหลอก" Format: POV unboxing',
    type: 'info',
    campaignId: 'camp-001',
  },
  {
    id: '5',
    timestamp: '09:05:22',
    agentId: 'product-analyst',
    agentName: 'Product Analyst',
    message: '[camp-003] Lazada Blender วิเคราะห์เสร็จ คะแนน 71/100 ส่ง brief แล้ว เริ่มวิเคราะห์ Shopee Desk Lamp',
    type: 'success',
    campaignId: 'camp-003',
  },
  {
    id: '6',
    timestamp: '09:08:45',
    agentId: 'ops-review',
    agentName: 'Ops & Review',
    message: '[camp-003] FLAGGED: "ช่วยเพิ่ม metabolism" — claim สุขภาพไม่มีหลักฐาน ในสคริปต์ Lazada Blender บรรทัดที่ 3 ส่งกลับ Content Studio',
    type: 'warning',
    campaignId: 'camp-003',
  },
  {
    id: '7',
    timestamp: '09:12:10',
    agentId: 'ops-review',
    agentName: 'Ops & Review',
    message: '[camp-001] TikTok Earbuds compliance: ผ่านทุกข้อ แพ็กเกจพร้อมส่ง CEO อนุมัติ',
    type: 'success',
    campaignId: 'camp-001',
  },
  {
    id: '8',
    timestamp: '09:13:00',
    agentId: 'finance-controller',
    agentName: 'Finance Controller',
    message: 'รายงานประจำวัน: รายได้รวม ฿11,300 | กำไร ฿3,150 | ROAS เฉลี่ย 4.6x | Lazada Blender ขาดทุน ฿120 — แจ้ง CEO',
    type: 'warning',
  },
  {
    id: '9',
    timestamp: '09:14:00',
    agentId: 'ceo-director',
    agentName: 'CEO',
    message: '[camp-004] ได้รับแพ็กเกจ Skincare Travel Pouch กำลังรีวิว — มีปัญหา disclosure เล็กน้อยใน draft',
    type: 'info',
    campaignId: 'camp-004',
  },
  {
    id: '10',
    timestamp: '09:15:33',
    agentId: 'finance-controller',
    agentName: 'Finance Controller',
    message: '[camp-004] TikTok Skincare ROAS 7.2x — แนะนำเพิ่มงบโฆษณา รายงาน CEO เพื่อขออนุมัติงบเพิ่ม',
    type: 'success',
    campaignId: 'camp-004',
  },
  {
    id: '11',
    timestamp: '09:16:10',
    agentId: 'social-community-manager',
    agentName: 'Social Studio',
    message: '[camp-001] เริ่มดัดแปลง TikTok Earbuds script → Facebook review post 3 แบบ: เปรียบเทียบ, unboxing, Q&A',
    type: 'info',
    campaignId: 'camp-001',
  },
  {
    id: '12',
    timestamp: '09:17:45',
    agentId: 'social-community-manager',
    agentName: 'Social Studio',
    message: '[camp-004] IG carousel Skincare Pouch: 5 slides เสร็จแล้ว — รอ Ops ตรวจ disclosure #ad',
    type: 'success',
    campaignId: 'camp-004',
  },
  {
    id: '13',
    timestamp: '09:19:00',
    agentId: 'ops-review',
    agentName: 'Ops & Review',
    message: '[camp-001] Social Studio: Facebook draft ผ่าน compliance — เตรียม export ร่วมกับ TikTok package',
    type: 'success',
    campaignId: 'camp-001',
  },
]

export const initialTeamChat: TeamChatMessage[] = [
  { id: 'tc-1', timestamp: '09:02', senderAgentId: 'product-analyst',          senderName: 'Product',  accent: '#00e5ff', message: 'Earbuds X9 วิเคราะห์เสร็จแล้ว คะแนน 84/100 ส่ง brief ให้ Content ได้เลย',              campaignId: 'camp-001' },
  { id: 'tc-2', timestamp: '09:04', senderAgentId: 'content-studio',            senderName: 'Content',  accent: '#ff9800', message: 'รับ brief แล้วครับ เริ่ม hook ทันที POV format ใช่ไหม?',                              campaignId: 'camp-001' },
  { id: 'tc-3', timestamp: '09:05', senderAgentId: 'product-analyst',          senderName: 'Product',  accent: '#00e5ff', message: 'ใช่ครับ POV unboxing target Gen Z 18-25',                                              campaignId: 'camp-001' },
  { id: 'tc-4', timestamp: '09:08', senderAgentId: 'ops-review',               senderName: 'Ops',      accent: '#ffb300', message: '⚠ Blender flagged: health claim บรรทัด 3 ส่งกลับ Content แล้วนะครับ',                campaignId: 'camp-003' },
  { id: 'tc-5', timestamp: '09:10', senderAgentId: 'content-studio',            senderName: 'Content',  accent: '#ff9800', message: 'รับทราบ จะเปลี่ยน angle เป็น lifestyle ไม่ใช่ health',                               campaignId: 'camp-003' },
  { id: 'tc-6', timestamp: '09:12', senderAgentId: 'ops-review',               senderName: 'Ops',      accent: '#ffb300', message: '✅ Earbuds ผ่าน compliance ครบ รอ CEO approve ได้เลย',                                campaignId: 'camp-001' },
  { id: 'tc-7', timestamp: '09:13', senderAgentId: 'finance-controller',        senderName: 'Finance',  accent: '#00c8a0', message: 'Lazada ขาดทุน -฿120 แนะนำหยุด ad ก่อน รายงาน CEO แล้ว',                             campaignId: 'camp-003' },
  { id: 'tc-8', timestamp: '09:14', senderAgentId: 'ceo-director',             senderName: 'CEO',      accent: '#00ff9f', message: 'รับทราบ Skincare Pouch กำลัง review อยู่ มีปัญหา disclosure นิดหน่อย',                campaignId: 'camp-004' },
  { id: 'tc-9', timestamp: '09:16', senderAgentId: 'social-community-manager', senderName: 'Social',   accent: '#ff4081', message: 'Facebook draft Earbuds 3 แบบพร้อมแล้ว จะส่ง Ops ตรวจ',                               campaignId: 'camp-001' },
  { id: 'tc-10',timestamp: '09:17', senderAgentId: 'social-community-manager', senderName: 'Social',   accent: '#ff4081', message: 'IG carousel Skincare 5 slides เสร็จ รอ approve นะครับ ✨',                            campaignId: 'camp-004' },
]
