import type { PipelineStage, Campaign } from './campaignRegistry'

export type WorkflowAction =
  | 'run_next_step'
  | 'send_to_ceo'
  | 'send_back'
  | 'approve'
  | 'reject'
  | 'mark_ready'
  | 'generate_export'

export interface ActionButton {
  action: WorkflowAction
  label: string
  color: string
}

export const STAGE_ACTIONS: Record<PipelineStage, ActionButton[]> = {
  campaign_brief: [
    { action: 'run_next_step', label: '▶ Run Next Step', color: '#00ff9f' },
  ],
  product_research: [
    { action: 'run_next_step', label: '▶ Run Next Step', color: '#00e5ff' },
    { action: 'send_back',     label: 'ส่งกลับไปแก้',   color: '#ffb300' },
  ],
  content_creation: [
    { action: 'run_next_step', label: '▶ Run Next Step', color: '#ff9800' },
    { action: 'send_back',     label: 'ส่งกลับไปแก้',   color: '#ffb300' },
  ],
  social_adaptation: [
    { action: 'run_next_step', label: '▶ Run Next Step',      color: '#ff4081' },
    { action: 'send_back',     label: 'ส่งกลับไปแก้',         color: '#ffb300' },
  ],
  review_compliance: [
    { action: 'run_next_step', label: '▶ ส่งให้ Agent ถัดไป', color: '#ffb300' },
    { action: 'send_to_ceo',   label: '▶ ส่งให้ CEO อนุมัติ', color: '#00ff9f' },
    { action: 'send_back',     label: 'ส่งกลับไปแก้',         color: '#ff5252' },
  ],
  ceo_approval: [
    { action: 'approve',   label: '✓ อนุมัติ',          color: '#00ff9f' },
    { action: 'reject',    label: '✕ ปฏิเสธ',           color: '#ff5252' },
    { action: 'send_back', label: 'ส่งกลับไปแก้',       color: '#ffb300' },
  ],
  export_publish: [
    { action: 'mark_ready',      label: '▶ Mark Ready to Publish',   color: '#00ff9f' },
    { action: 'generate_export', label: '📦 Generate Export Package', color: '#00e5ff' },
    { action: 'send_back',       label: 'ส่งกลับไปแก้',              color: '#ffb300' },
  ],
  performance_feedback: [
    { action: 'run_next_step', label: '▶ Run Next Step', color: '#ffb300' },
  ],
  finance_review: [
    { action: 'run_next_step', label: '✓ เสร็จสิ้น', color: '#00c8a0' },
  ],
}

export const STAGE_PROGRESS: Record<PipelineStage, number> = {
  campaign_brief:       15,
  product_research:     28,
  content_creation:     42,
  social_adaptation:    55,
  review_compliance:    68,
  ceo_approval:         80,
  export_publish:       90,
  performance_feedback: 95,
  finance_review:       100,
}

interface OutputContent {
  title: string
  summary: string
  content: string
  risks: string[]
  recommendation: string
}

export function generateMockOutput(stage: PipelineStage, campaign: Campaign): OutputContent {
  switch (stage) {
    case 'campaign_brief':
      return {
        title: `บรีฟแคมเปญ — ${campaign.name}`,
        summary: `CEO ตั้ง brief สำหรับ ${campaign.name} ช่อง ${campaign.channel.toUpperCase()}`,
        content: `🎯 เป้าหมาย: สร้าง content affiliate สำหรับ ${campaign.name}\n📦 ช่องทาง: ${campaign.channel.toUpperCase()}\n💰 ราคาเป้าหมาย: ${campaign.targetPrice}\n👥 Brief: ${campaign.brief}\n📋 ลำดับความสำคัญ: สูง`,
        risks: [],
        recommendation: 'ส่งให้นักวิเคราะห์สินค้าดำเนินการต่อ',
      }

    case 'product_research':
      return {
        title: `รายงานวิเคราะห์สินค้า — ${campaign.name}`,
        summary: `คะแนนโอกาส 84/100 เทรนด์กำลังเติบโต`,
        content: `📊 ผลการวิเคราะห์สินค้า\n\n• คะแนนโอกาส: 84/100\n• มุมขาย: เปรียบเทียบของแพงกับราคาจริง\n• กลุ่มลูกค้า: Gen Z และ Millennial 18–30 ปี\n• Platform fit: TikTok ★★★★★ | Shopee ★★★☆☆\n• คู่แข่ง affiliate: 8 ราย (ไม่มีใครใช้ angle นี้)\n• commission rate: ${campaign.channel === 'tiktok' ? '8.5%' : campaign.channel === 'shopee' ? '7%' : '6%'}\n• เทรนด์: RISING ↑ (เพิ่ม 34% ใน 2 สัปดาห์)`,
        risks: ['คู่แข่ง 2 รายกำลังทำ content ที่คล้ายกัน ควรเร่งผลิต'],
        recommendation: 'ส่ง brief ให้ Content Studio ผลิต TikTok POV ทันที',
      }

    case 'content_creation':
      return {
        title: `แพ็กเกจคอนเทนต์ — ${campaign.name}`,
        summary: `สคริปต์ 28 วิ, 3 hooks, caption พร้อมแล้ว`,
        content: `🎬 แพ็กเกจคอนเทนต์ครบชุด\n\nHook 1: "POV: เพิ่งรู้ว่าของแพงโดนหลอก"\nHook 2: "เทสมาแล้ว 9 รุ่น ตัวนี้ถูกที่สุดแต่ดีสุด"\nHook 3: "ทำไมคนรีวิวถึงไม่บอกราคาจริง?"\n\n📝 สคริปต์หลัก (28 วินาที):\n0–3s: Hook + facial expression\n3–8s: Problem — ของแพงทำไมไม่ดีกว่า?\n8–18s: Demo — noise cancel, แบต 24 ชม, ฟอร์ม\n18–25s: Proof — 4.9 ดาว 2,300 รีวิว\n25–28s: CTA + ลิงก์ใน bio\n\n📱 Caption: "หูฟัง ฿280 vs ฿2,000 ผลต่างทำให้ช็อค 😮 #หูฟัง #tiktokshop"\n🏷️ Hashtags: #หูฟัง #ของดีราคาถูก #tiktokshop #review\n🖼️ Cover text: "หูฟัง ฿280 เทียบ ฿2,000"`,
        risks: [],
        recommendation: 'ส่งให้ Social Studio ปรับสำหรับ Facebook และ Instagram',
      }

    case 'social_adaptation':
      return {
        title: `Social Media Package — ${campaign.name}`,
        summary: `Facebook post 3 แบบ, IG carousel, TikTok caption พร้อมแล้ว`,
        content: `📱 แพ็กเกจ Social Media\n\n📘 Facebook Post:\n"รีวิวจริง ไม่ได้รับของฟรี 🎧 ลิงก์ซื้อใน comment นะครับ #ad"\n\n📸 IG Caption:\n"✨ Honest review: หูฟังราคาประหยัดที่ทำให้ตกใจ 🎧 [link in bio] #ad"\n\n🎵 TikTok Caption:\n"หูฟัง ฿280 vs ฿2,000 ผลต่างทำให้ช็อค 😮 comment 'ลิงก์' รับได้เลย"\n\n📌 Pinned Comment: "ลิงก์ซื้อด้านล่างเลยครับ ใช้โค้ด SAVE5 ลด 5% เพิ่ม 🛒"\n\n#️⃣ Hashtag Set: #หูฟัง #review #tiktokshop #ของดีราคาถูก #ad\n\nCTA อ่อน: "comment 'ลิงก์' ถ้าสนใจนะครับ"`,
        risks: ['Facebook reach ลด 15% จากสัปดาห์ที่แล้ว — ต้องทดสอบ boost post'],
        recommendation: 'ส่งให้ Ops ตรวจ compliance และ disclosure #ad',
      }

    case 'review_compliance':
      return {
        title: `Compliance Report — ${campaign.name}`,
        summary: `ผ่าน 5/6 รายการ — มีข้อสังเกต 1 จุด`,
        content: `✅ ผลการตรวจสอบ Compliance\n\n✓ Affiliate disclosure (#ad) — ผ่าน\n✓ Health claim check — ไม่มี claim สุขภาพ\n✓ Financial guarantee check — ไม่มีการรับประกันรายได้\n✓ ราคาตรงกับหน้าสินค้า — ตรวจแล้ว ถูกต้อง\n✓ คำต้องห้าม — ไม่พบ\n⚠️ Caption IG ยาว 142 ตัวอักษร (เกิน 125 ที่แนะนำ) — แนะนำตัด\n\nสรุป: ผ่าน compliance — พร้อมส่ง CEO อนุมัติ`,
        risks: campaign.financeWarnings.length > 0 ? [campaign.financeWarnings[0]] : ['IG caption ยาวเกิน — ควรตัดให้สั้นลง'],
        recommendation: 'ส่ง CEO เพื่ออนุมัติขั้นสุดท้ายก่อนโพสต์',
      }

    case 'ceo_approval':
      return {
        title: `CEO Review — ${campaign.name}`,
        summary: `อนุมัติ — พร้อมโพสต์`,
        content: `👔 CEO Decision: ✅ อนุมัติ\n\nเหตุผล:\n• Content quality ดี — hook ชัดเจน\n• Compliance ผ่านครบ\n• ROAS ประมาณการ ${campaign.finance.roas}x — คุ้มค่า\n• กลุ่มเป้าหมายตรงกับ brief\n\nลำดับความสำคัญ: สูง\nกำหนดโพสต์: ภายใน 24 ชั่วโมง\nงบโฆษณา: ฿${campaign.finance.adSpend.toLocaleString()} ตามแผน\n\naction ถัดไป: Ops เตรียม export package`,
        risks: [],
        recommendation: 'เตรียม export package และโพสต์ตามกำหนด',
      }

    case 'export_publish':
      return {
        title: `Export Package — ${campaign.name}`,
        summary: `แพ็กเกจครบชุด พร้อมโพสต์`,
        content: `📦 Export Package Summary\n\nไฟล์/คอนเทนต์ที่รวมไว้:\n✓ TikTok script (28 วิ) — .txt\n✓ TikTok caption + hashtags — .txt\n✓ Facebook post (3 แบบ) — .txt\n✓ IG caption — .txt\n✓ Pinned comment text — .txt\n✓ Affiliate link + promo code — .txt\n\n📋 Posting Checklist:\n☐ ตรวจลิงก์ affiliate ใช้งานได้\n☐ ตั้งค่า TikTok Shop product link\n☐ เพิ่ม #ad ใน caption\n☐ โพสต์ TikTok ช่วง 18:00–21:00\n☐ โพสต์ Facebook หลัง TikTok 2 ชม\n☐ Boost Facebook post\n☐ ติด pinned comment ทันทีหลังโพสต์`,
        risks: [],
        recommendation: 'โพสต์ช่วง prime time แล้วติดตามผล 24 ชม',
      }

    case 'performance_feedback':
      return {
        title: `Performance Report — ${campaign.name}`,
        summary: `Views ดี CTR อยู่ในเกณฑ์ — รอส่ง Finance`,
        content: `📊 ผลลัพธ์หลังโพสต์ 24 ชั่วโมง\n\n📱 TikTok:\n• Views: 42,300\n• Likes: 1,240\n• Comments: 89\n• CTR link: 2.1%\n• Conversion: ${campaign.finance.conversionRate}%\n\n📘 Facebook:\n• Reach: 3,200\n• Engagement rate: 4.8%\n• Link clicks: 156\n\nรายได้เบื้องต้น:\n• commission ประมาณ: ฿${campaign.finance.commission.toLocaleString()}\n• ROAS: ${campaign.finance.roas}x`,
        risks: campaign.finance.roas < 3 ? ['ROAS ต่ำกว่าเป้า — แนะนำปรับ creative'] : [],
        recommendation: 'ส่ง Finance Controller วิเคราะห์ ROAS',
      }

    case 'finance_review':
      return {
        title: `Finance Analysis — ${campaign.name}`,
        summary: `ROAS ${campaign.finance.roas}x — ${campaign.finance.roas >= 4 ? 'แนะนำขยายสเกล' : campaign.finance.roas >= 2 ? 'แนะนำ maintain' : 'แนะนำหยุด'}`,
        content: `💰 รายงานการเงินฉบับสมบูรณ์\n\nรายได้: ฿${campaign.finance.revenue.toLocaleString()}\nค่าโฆษณา: ฿${campaign.finance.adSpend.toLocaleString()}\nค่าคอนเทนต์: ฿${campaign.finance.contentCost.toLocaleString()}\ncommission: ฿${campaign.finance.commission.toLocaleString()}\nกำไรสุทธิ: ฿${campaign.finance.netProfit.toLocaleString()}\nROAS: ${campaign.finance.roas}x\nConversion rate: ${campaign.finance.conversionRate}%\n\nคำแนะนำ:\n${campaign.finance.roas >= 5 ? '🟢 ขยายสเกล — เพิ่มงบโฆษณา 2x ทันที' : campaign.finance.roas >= 4 ? '🟢 ขยายสเกล — เพิ่มงบ 50%' : campaign.finance.roas >= 2 ? '🟡 Maintain — รักษางบเดิม' : '🔴 หยุด — ขาดทุน ควรหยุดยิงแอดทันที'}`,
        risks: campaign.finance.netProfit < 0 ? ['ขาดทุน — ควรหยุดยิงแอดทันที'] : [],
        recommendation: campaign.finance.roas >= 4 ? 'ขยายสเกล — เพิ่มงบโฆษณา' : campaign.finance.roas >= 2 ? 'Maintain และติดตามผล' : 'หยุดยิงแอดและ review creative',
      }
  }
}
