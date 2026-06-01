import type { PipelineStage, Campaign } from './campaignRegistry'

export type WorkflowAction =
  | 'run_next_step'
  | 'reject'
  | 'request_approval'
  | 'approve'

export interface ActionButton {
  action: WorkflowAction
  label: string
  color: string
}

export const STAGE_ACTIONS: Record<PipelineStage, ActionButton[]> = {
  new_product: [
    { action: 'run_next_step', label: 'ตรวจสอบข้อมูลสินค้า', color: '#00e5ff' },
  ],
  verified: [
    { action: 'run_next_step', label: 'ประเมินคะแนนสินค้า', color: '#ffb300' },
  ],
  scored: [
    { action: 'run_next_step', label: 'เลือกสินค้านี้',   color: '#00ff9f' },
    { action: 'reject',        label: 'ข้ามสินค้านี้',    color: '#ff5252' },
  ],
  selected: [
    { action: 'run_next_step', label: 'สร้าง Content Brief', color: '#ff9800' },
  ],
  brief_ready: [
    { action: 'run_next_step', label: 'เขียน Script', color: '#ff4081' },
  ],
  script_ready: [
    { action: 'run_next_step', label: 'สร้างชิ้นงาน Creative', color: '#a855f7' },
  ],
  asset_ready: [
    { action: 'request_approval', label: 'ส่งให้ผู้บริหารอนุมัติ', color: '#00ff9f' },
  ],
  human_approved: [
    { action: 'approve', label: 'อนุมัติ — โพสต์ได้เลย', color: '#00ff9f' },
    { action: 'reject',  label: 'ส่งกลับแก้ไข',           color: '#ff5252' },
  ],
  published: [
    { action: 'run_next_step', label: 'วิเคราะห์ผลลัพธ์', color: '#00ff9f' },
  ],
  analyzed: [
    { action: 'run_next_step', label: 'บันทึกบทเรียน', color: '#00e5ff' },
  ],
  learned: [],
}

export const STAGE_PROGRESS: Record<PipelineStage, number> = {
  new_product:    9,
  verified:       18,
  scored:         27,
  selected:       36,
  brief_ready:    45,
  script_ready:   55,
  asset_ready:    64,
  human_approved: 73,
  published:      82,
  analyzed:       91,
  learned:        100,
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
    case 'new_product':
      return {
        title: `รับสินค้าใหม่ — ${campaign.name}`,
        summary: `บันทึกสินค้าใหม่เข้าระบบ channel: ${campaign.channel.toUpperCase()}`,
        content: `📦 รับสินค้าใหม่เข้าระบบ\n\nชื่อ: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\nราคา: ${campaign.targetPrice}\nหมวด: ${campaign.category}\n\nสถานะ: รอ Product Research ตรวจสอบข้อมูล`,
        risks: [],
        recommendation: 'ส่งให้ Product Research ตรวจสอบ shop, rating, sold_count, review_count',
      }

    case 'verified':
      return {
        title: `ยืนยันข้อมูลสินค้า — ${campaign.name}`,
        summary: `ตรวจสอบข้อมูลครบถ้วน — พร้อมส่ง Offer Analyst`,
        content: `✅ ผลการตรวจสอบข้อมูลสินค้า\n\nสินค้า: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\nราคา: ${campaign.targetPrice}\nหมวด: ${campaign.category}\n\n✓ Shop rating ผ่าน\n✓ Review count ผ่านเกณฑ์\n✓ Sold count ผ่านเกณฑ์\n✓ Category อยู่ใน approved list\n✓ ราคาอยู่ใน impulse buy range\n\nข้อมูลครบถ้วน พร้อมส่ง Offer Analyst ให้คะแนน`,
        risks: [],
        recommendation: 'ส่ง Offer Analyst ประเมินคะแนนและความคุ้มค่า',
      }

    case 'scored':
      return {
        title: `ผลการให้คะแนน — ${campaign.name}`,
        summary: `final_score ${campaign.scores.final_score}/100 | suitability ${campaign.suitability_score}/100`,
        content: `📊 ผลการประเมินคะแนน\n\nสินค้า: ${campaign.name}\n\nคะแนนรายมิติ:\n• demo_score: ${campaign.scores.demo_score}/10\n• price_score: ${campaign.scores.price_score}/10\n• commission_score: ${campaign.scores.commission_score}/10\n• impulse_score: ${campaign.scores.impulse_score}/10\n• risk_score: ${campaign.scores.risk_score}/10 (ยิ่งต่ำยิ่งดี)\n• content_angle_score: ${campaign.scores.content_angle_score}/10\n• platform_fit_score: ${campaign.scores.platform_fit_score}/10\n\nfinal_score: ${campaign.scores.final_score}/100\nsuitability_score: ${campaign.suitability_score}/100\nROAS ประมาณ: ${campaign.finance.roas}x\nclaim_risk: ${campaign.claim_risk} | return_risk: ${campaign.return_risk}`,
        risks: campaign.finance.roas < 4 ? [`ROAS ${campaign.finance.roas}x ต่ำกว่าเป้า 5.0x — ต้องพิจารณาก่อนเลือก`] : [],
        recommendation: campaign.suitability_score >= 75 ? 'สินค้านี้ผ่านเกณฑ์ — แนะนำเลือกโปรโมท' : 'suitability_score ต่ำ — พิจารณาข้ามสินค้านี้',
      }

    case 'selected':
      return {
        title: `เลือกโปรโมท — ${campaign.name}`,
        summary: `ยืนยันเลือกสินค้านี้ — สร้าง Content Brief`,
        content: `✅ เลือกสินค้านี้เพื่อโปรโมท\n\nสินค้า: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\nROAS ประมาณ: ${campaign.finance.roas}x\nclaim_risk: ${campaign.claim_risk}\n\nเหตุผลที่เลือก:\n• suitability_score ${campaign.suitability_score}/100 ผ่านเกณฑ์\n• content angle ชัดเจน\n• ราคาดึงดูดสำหรับ impulse buy\n\nขั้นตอนถัดไป: Content Strategy สร้าง brief`,
        risks: [],
        recommendation: 'ส่ง Content Strategy เพื่อเลือก hook framework และสร้าง brief',
      }

    case 'brief_ready':
      return {
        title: `Content Brief — ${campaign.name}`,
        summary: `Brief ครบชุด — hook framework พร้อม`,
        content: `📋 Content Brief\n\nสินค้า: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\n\nHook Framework: ${campaign.category === 'จัดระเบียบบ้าน' ? 'ปัญหาจุกจิกทุกวัน' : campaign.category === 'ทำความสะอาด' ? 'before_after' : 'worth_it'}\n\nAngle: ${campaign.brief}\n\nกลุ่มเป้าหมาย: คนไทยอายุ 20–35 ที่ใช้ ${campaign.channel.toUpperCase()}\nFormat: VDO 25 วิ TikTok-style\nCTA: "ลิงก์ในไบโอ + โค้ดส่วนลด"\n\nข้อจำกัด:\n• ห้าม claim สุขภาพหรือการแพทย์\n• ต้องมี #ad หรือ #โฆษณา\n• ราคาต้องตรงกับหน้าสินค้าจริง`,
        risks: [],
        recommendation: 'ส่ง Script Writer เขียน script 20–30 วิ พร้อม storyboard',
      }

    case 'script_ready':
      return {
        title: `Script 25 วิ — ${campaign.name}`,
        summary: `Script ครบ 5 scenes พร้อม storyboard`,
        content: `🎬 Script 25 วินาที\n\nสินค้า: ${campaign.name}\n\n[0–3s] Hook: "คุณเคยเจอปัญหา [X] ไหม? นี่คือสิ่งที่แก้ได้"\n[3–8s] Setup: แสดงปัญหาก่อนใช้สินค้า\n[8–18s] Demo: แสดงสินค้าและวิธีใช้จริง\n[18–22s] Proof: rating/review — "${campaign.finance.roas}x ROAS | 4.5+ ดาว"\n[22–25s] CTA: "ลิงก์ซื้อในไบโอ เช็คโค้ดส่วนลดด้วยนะ #ad"\n\nCaption: "${campaign.name} ราคา ${campaign.targetPrice} — ลิงก์ซื้อใน comment"\nHashtag: #สินค้าดี #${campaign.channel} #review #ad\n\nOn-screen text ครบทุก scene`,
        risks: [],
        recommendation: 'ส่ง Creative Production สร้าง Canva brief และ asset checklist',
      }

    case 'asset_ready':
      return {
        title: `Creative Assets — ${campaign.name}`,
        summary: `Canva brief + CapCut checklist ครบชุด`,
        content: `🎨 Creative Assets Package\n\nสินค้า: ${campaign.name}\n\n✓ Thumbnail layout (Canva template)\n✓ Comparison card design\n✓ Caption overlay สำหรับทุก scene\n✓ CapCut edit checklist\n✓ Asset list: ภาพสินค้า + lifestyle shot\n✓ On-screen text สำเร็จรูป\n\nไฟล์พร้อมส่งผู้บริหารอนุมัติ`,
        risks: [],
        recommendation: 'ส่งให้ผู้บริหารอนุมัติ — รอ human approval ก่อน publish',
      }

    case 'human_approved':
      return {
        title: `Human Approval — ${campaign.name}`,
        summary: `รอผู้บริหารอนุมัติ — ห้าม publish ก่อนได้รับอนุมัติ`,
        content: `👔 Human Approval Gate\n\nสินค้า: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\nROAS ประมาณ: ${campaign.finance.roas}x\nclaim_risk: ${campaign.claim_risk}\n\nสรุปแพ็กเกจ:\n✓ Product Research: ผ่าน\n✓ Offer Analysis: ผ่าน (score ${campaign.suitability_score}/100)\n✓ Content Brief: ครบ\n✓ Script: ผ่าน review\n✓ Creative Assets: ครบ\n\nรอผู้บริหารอนุมัติและกดโพสต์`,
        risks: campaign.claim_risk !== 'low' ? [`claim_risk: ${campaign.claim_risk} — ตรวจสอบ claim ก่อน publish`] : [],
        recommendation: 'ผู้บริหารตรวจสอบ script + creative ก่อนอนุมัติ',
      }

    case 'published':
      return {
        title: `Post Published — ${campaign.name}`,
        summary: `โพสต์แล้ว — กำลังติดตามผล`,
        content: `📱 โพสต์สำเร็จ\n\nสินค้า: ${campaign.name}\nChannel: ${campaign.channel.toUpperCase()}\n\nโพสต์ช่วง prime time แล้ว\nPinned comment: "ลิงก์ซื้อด้านล่าง โค้ดส่วนลดด้วยนะ 🛒"\nUTM link: ติดแล้ว\n\nผลเบื้องต้น (24h):\n• รายได้: ฿${campaign.finance.revenue.toLocaleString()}\n• ROAS: ${campaign.finance.roas}x\n• Conversion: ${campaign.finance.conversionRate}%`,
        risks: [],
        recommendation: 'รอ 48 ชั่วโมงแล้วรัน performance analysis',
      }

    case 'analyzed':
      return {
        title: `Performance Report — ${campaign.name}`,
        summary: `ROAS ${campaign.finance.roas}x | Conversion ${campaign.finance.conversionRate}%`,
        content: `📊 Performance Analysis (48h)\n\nสินค้า: ${campaign.name}\n\n📱 ${campaign.channel.toUpperCase()} Results:\n• รายได้: ฿${campaign.finance.revenue.toLocaleString()}\n• ค่าโฆษณา: ฿${campaign.finance.adSpend.toLocaleString()}\n• Commission: ฿${campaign.finance.commission.toLocaleString()}\n• กำไรสุทธิ: ฿${campaign.finance.netProfit.toLocaleString()}\n• ROAS: ${campaign.finance.roas}x\n• Conversion rate: ${campaign.finance.conversionRate}%\n• Cost per order: ฿${campaign.finance.costPerOrder}\n\n${campaign.finance.roas >= 5 ? '🟢 แนะนำ scale — เพิ่มงบ 50%' : campaign.finance.roas >= 4 ? '🟡 Maintain — รักษางบเดิม' : '🔴 พิจารณาหยุดหรือปรับ creative'}`,
        risks: campaign.finance.roas < 4 ? [`ROAS ${campaign.finance.roas}x ต่ำกว่าเป้า — ต้องปรับ creative`] : [],
        recommendation: 'บันทึกบทเรียนและส่ง Product Research เพื่อ learning loop',
      }

    case 'learned':
      return {
        title: `บันทึกบทเรียน — ${campaign.name}`,
        summary: `Learning บันทึกเรียบร้อย — วงจรครบ`,
        content: `📚 Learning Loop Complete\n\nสินค้า: ${campaign.name}\n\nบทเรียนที่บันทึก:\n• ROAS: ${campaign.finance.roas}x (${campaign.finance.roas >= 5 ? 'ดีกว่าเป้า' : 'ต่ำกว่าเป้า'})\n• claim_risk level: ${campaign.claim_risk}\n• suitability_score: ${campaign.suitability_score}/100\n• Conversion: ${campaign.finance.conversionRate}%\n\nสรุป:\n${campaign.finance.roas >= 5 ? `✅ สินค้าหมวด "${campaign.category}" ทำงานได้ดี — เพิ่ม weight ใน scoring` : `⚠️ สินค้าหมวด "${campaign.category}" ต้องปรับ strategy`}\n\nส่งข้อมูลกลับ Product Research เพื่อ improve next batch`,
        risks: [],
        recommendation: 'วงจรครบแล้ว — Product Research รับข้อมูลเพื่อพัฒนา batch ถัดไป',
      }
  }
}
