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
    message: 'Agent Office v2.4.2 เริ่มทำงาน — AI Affiliate Office พร้อมใช้งาน 6 แผนก',
    type: 'system',
  },
  {
    id: '2',
    timestamp: '09:01:14',
    agentId: 'product-research',
    agentName: 'Research',
    message: '[prod-001] กล่องจัดระเบียบ 6-in-1 ผ่านเกณฑ์: rating 4.8 | sold 1,840 | review 312 — ส่ง Offer Analyst แล้ว',
    type: 'success',
    campaignId: 'prod-001',
  },
  {
    id: '3',
    timestamp: '09:02:30',
    agentId: 'offer-analyst',
    agentName: 'Analyst',
    message: '[prod-001] suitability_score 88/100 | ROAS est 5.2x | claim_risk low — ส่ง brief ให้ Content Strategy แล้ว',
    type: 'success',
    campaignId: 'prod-001',
  },
  {
    id: '4',
    timestamp: '09:04:00',
    agentId: 'content-strategy',
    agentName: 'Strategy',
    message: '[prod-001] เลือก framework "ปัญหาจุกจิกทุกวัน" hook: "ห้องเล็ก condo แบบนี้ต้องใช้" — ส่ง Script Writer แล้ว',
    type: 'info',
    campaignId: 'prod-001',
  },
  {
    id: '5',
    timestamp: '09:05:22',
    agentId: 'product-research',
    agentName: 'Research',
    message: '[prod-002] Spin Mop ตรวจสอบข้อมูลครบ ส่ง Offer Analyst แล้ว (review count 187 — ใกล้เกณฑ์ขั้นต่ำ)',
    type: 'warning',
    campaignId: 'prod-002',
  },
  {
    id: '6',
    timestamp: '09:08:45',
    agentId: 'offer-analyst',
    agentName: 'Analyst',
    message: '[prod-002] ROAS est 3.8x ต่ำกว่าเป้า 5.0x — กำลังพิจารณาว่าคุ้มค่าโปรโมทไหม',
    type: 'warning',
    campaignId: 'prod-002',
  },
  {
    id: '7',
    timestamp: '09:10:00',
    agentId: 'social-performance',
    agentName: 'Social',
    message: '[prod-003] TikTok post ครบ 48 ชม: Views 58,400 | CTR 3.2% | ROAS 6.1x | Conversion 4.8% — แนะนำเพิ่มงบ 50%',
    type: 'success',
    campaignId: 'prod-003',
  },
  {
    id: '8',
    timestamp: '09:12:10',
    agentId: 'script-writer',
    agentName: 'Script',
    message: '[prod-004] script 25 วิ draft เสร็จ — hook "฿189 บาท vs โต๊ะรกแบบนี้" รอ review: demo-first หรือ problem-first?',
    type: 'warning',
    campaignId: 'prod-004',
  },
  {
    id: '9',
    timestamp: '09:13:00',
    agentId: 'product-research',
    agentName: 'Research',
    message: '[prod-003] รับ performance data จาก Social Performance — กำลัง update learning database สำหรับ TikTok Electronics',
    type: 'info',
    campaignId: 'prod-003',
  },
  {
    id: '10',
    timestamp: '09:14:00',
    agentId: 'content-strategy',
    agentName: 'Strategy',
    message: '[prod-004] ยืนยัน framework "worth_it" สำหรับแผ่นรองเมาส์ RGB — brief ส่ง Script Writer แล้ว',
    type: 'success',
    campaignId: 'prod-004',
  },
  {
    id: '11',
    timestamp: '09:15:33',
    agentId: 'social-performance',
    agentName: 'Social',
    message: '[prod-003] pendingPayout ฿600 รอรับเงินจาก TikTok Shop — จะแจ้งเมื่อได้รับ',
    type: 'info',
    campaignId: 'prod-003',
  },
  {
    id: '12',
    timestamp: '09:17:45',
    agentId: 'creative-production',
    agentName: 'Creative',
    message: 'เตรียม Canva brief template หมวด desk accessories ไว้รอรับงาน Script Writer',
    type: 'info',
  },
  {
    id: '13',
    timestamp: '09:19:00',
    agentId: 'offer-analyst',
    agentName: 'Analyst',
    message: '[prod-002] สรุป: ROAS 3.8x ยังอยู่ในเกณฑ์ acceptable — แนะนำเลือกโปรโมทแต่ลด ad spend ลง 20%',
    type: 'info',
    campaignId: 'prod-002',
  },
]

export const initialTeamChat: TeamChatMessage[] = [
  {
    id: 'tc-1',
    timestamp: '09:01',
    senderAgentId: 'product-research',
    senderName: 'Research',
    accent: '#00e5ff',
    message: 'prod-001 กล่องจัดระเบียบ 6-in-1 ผ่านทุกเกณฑ์ rating 4.8 sold 1,840 ส่ง Analyst ได้เลยครับ',
    campaignId: 'prod-001',
  },
  {
    id: 'tc-2',
    timestamp: '09:02',
    senderAgentId: 'offer-analyst',
    senderName: 'Analyst',
    accent: '#ffb300',
    message: 'รับแล้วครับ prod-001 score 88/100 ROAS 5.2x claim_risk low — ส่ง Content Strategy ได้เลย',
    campaignId: 'prod-001',
  },
  {
    id: 'tc-3',
    timestamp: '09:04',
    senderAgentId: 'content-strategy',
    senderName: 'Strategy',
    accent: '#ff9800',
    message: 'รับ brief แล้วครับ เลือก framework "ปัญหาจุกจิกทุกวัน" — hook "ห้องเล็ก condo แบบนี้ต้องใช้" ส่ง Script ได้เลย',
    campaignId: 'prod-001',
  },
  {
    id: 'tc-4',
    timestamp: '09:06',
    senderAgentId: 'offer-analyst',
    senderName: 'Analyst',
    accent: '#ffb300',
    message: '⚠ prod-002 Spin Mop ROAS 3.8x ต่ำกว่าเป้า 5.0x — กำลังพิจารณาว่าควรเลือกโปรโมทหรือข้าม',
    campaignId: 'prod-002',
  },
  {
    id: 'tc-5',
    timestamp: '09:10',
    senderAgentId: 'social-performance',
    senderName: 'Social',
    accent: '#00ff9f',
    message: '✅ prod-003 ที่ชาร์จ 3-in-1 ครบ 48 ชม: Views 58,400 ROAS 6.1x Conversion 4.8% — แนะนำเพิ่มงบ 50% ทันที',
    campaignId: 'prod-003',
  },
  {
    id: 'tc-6',
    timestamp: '09:12',
    senderAgentId: 'script-writer',
    senderName: 'Script',
    accent: '#ff4081',
    message: '⚠ prod-004 script 25 วิ draft เสร็จแล้ว รอ review — hook บรรทัดแรก: demo-first หรือ problem-first?',
    campaignId: 'prod-004',
  },
  {
    id: 'tc-7',
    timestamp: '09:13',
    senderAgentId: 'product-research',
    senderName: 'Research',
    accent: '#00e5ff',
    message: 'รับ learning data prod-003 แล้วครับ TikTok Electronics category ทำได้ดีมาก จะ update weight ใน scoring model',
    campaignId: 'prod-003',
  },
  {
    id: 'tc-8',
    timestamp: '09:15',
    senderAgentId: 'content-strategy',
    senderName: 'Strategy',
    accent: '#ff9800',
    message: 'prod-004 แผ่นรองเมาส์ RGB ยืนยัน framework "worth_it" — hook "฿189 บาท คุ้มจริงไหม?" ส่ง Script Writer แล้ว',
    campaignId: 'prod-004',
  },
  {
    id: 'tc-9',
    timestamp: '09:17',
    senderAgentId: 'creative-production',
    senderName: 'Creative',
    accent: '#a855f7',
    message: 'เตรียม Canva brief template สำหรับ desk accessories ไว้แล้วครับ รอรับ script จาก Script Writer',
  },
  {
    id: 'tc-10',
    timestamp: '09:19',
    senderAgentId: 'social-performance',
    senderName: 'Social',
    accent: '#00ff9f',
    message: 'prod-003 pendingPayout ฿600 รอรับจาก TikTok Shop — จะแจ้งทีมเมื่อได้รับเงินครับ ✨',
    campaignId: 'prod-003',
  },
]
