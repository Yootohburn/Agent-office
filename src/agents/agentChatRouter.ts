/**
 * Mock chat response router for Phase 1.
 * Routes user messages to realistic Thai responses by agent role + intent.
 * Replace getMockResponse() body with a real fetch() call to enable live LLM later.
 */
import type { DepartmentId } from './agentRegistry'
import { agents } from './agentRegistry'
import { campaigns, formatTHB } from './campaignRegistry'
import { companySummary } from './financeRegistry'

export interface MockResponse {
  text: string
  intent: string
  mockDelay: number
}

type IntentKey = 'status' | 'next_action' | 'problem_solve' | 'ideas' | 'risk' | 'finance' | 'general'

function detectIntent(msg: string): IntentKey {
  const m = msg.toLowerCase()
  if (m.includes('สรุป') || m.includes('สถานะ') || m.includes('ตอนนี้') || m.includes('overview')) return 'status'
  if (m.includes('ถัดไป') || m.includes('ขั้นตอน') || m.includes('แนะนำ') || m.includes('ต่อไป')) return 'next_action'
  if (m.includes('ปัญหา') || m.includes('แก้') || m.includes('ช่วย') || m.includes('สินค้า') || m.includes('fix')) return 'problem_solve'
  if (m.includes('ไอเดีย') || m.includes('hook') || m.includes('script') || m.includes('คอนเทนต์') || m.includes('สร้าง') || m.includes('idea')) return 'ideas'
  if (m.includes('เสี่ยง') || m.includes('ตรวจ') || m.includes('risk') || m.includes('ระวัง')) return 'risk'
  if (m.includes('การเงิน') || m.includes('ตัวเลข') || m.includes('roas') || m.includes('กำไร') || m.includes('งบ') || m.includes('เงิน')) return 'finance'
  return 'general'
}

const RESPONSES: Record<DepartmentId, Partial<Record<IntentKey, string>>> = {
  'product-research': {
    status:
      `🔬 สถานะ research queue ตอนนี้:\n\n` +
      `🔄 prod-001 กล่องจัดระเบียบ 6-in-1 — ตรวจสอบอยู่ 72%\n` +
      `✅ prod-002 Spin Mop — ส่ง Offer Analyst แล้ว (review 187 — ใกล้เกณฑ์)\n` +
      `✅ prod-003 ที่ชาร์จ 3-in-1 — วิเคราะห์ครบ score 91/100\n` +
      `✅ prod-004 แผ่นรองเมาส์ RGB — ส่งแล้ว\n\n` +
      `สินค้าที่น่าสนใจถัดไป: กล่องใส่เครื่องสำอางค์, ที่ตั้งโทรศัพท์ magnetic`,
    next_action:
      `ขั้นตอนถัดไปของ Product Research:\n\n` +
      `1️⃣ เสร็จตรวจสอบ prod-001 กล่องจัดระเบียบ\n` +
      `   → ตรวจ seller authenticity + shipping score\n\n` +
      `2️⃣ รับ learning data จาก Social Performance\n` +
      `   → prod-003 ที่ชาร์จ 3-in-1: ROAS 6.1x บันทึก weight\n\n` +
      `3️⃣ Scout สินค้าหมวดถัดไปสำหรับ week หน้า\n` +
      `   → เป้า: 3 SKU ต่อสัปดาห์ ตาม company goals`,
    ideas:
      `สินค้าน่าสนใจที่ควร scout เพิ่ม:\n\n` +
      `🛍️ Shopee:\n` +
      `→ ที่ตั้งโทรศัพท์ magnetic (WFH trend)\n` +
      `→ กล่องเก็บเครื่องสำอางค์ rotating\n` +
      `→ ไฟ LED โต๊ะทำงาน (aesthetic desk setup)\n\n` +
      `🛍️ TikTok Shop:\n` +
      `→ แท่นชาร์จ MagSafe (momentum จาก prod-003)\n` +
      `→ สายชาร์จ braided หลายหัว\n\n` +
      `🛍️ Lazada:\n` +
      `→ ไม้กวาดไฟฟ้า mini handheld\n` +
      `→ ถุงซิปสุญญากาศ (จัดระเบียบ)`,
    risk:
      `ความเสี่ยงใน research pipeline:\n\n` +
      `⚠️ prod-002 review count 187 ใกล้เกณฑ์ขั้นต่ำ 200 — ต้องตรวจ recency\n` +
      `⚠️ prod-002 ROAS est 3.8x ต่ำกว่าเป้า — Offer Analyst กำลังพิจารณา\n` +
      `⚠️ TikTok category อุปกรณ์ชาร์จ — ต้องระวัง overclaim spec ความเร็ว`,
    finance:
      `มุมมองการเงินจาก research:\n\n` +
      `Commission rate ที่ดีที่สุด:\n` +
      `→ TikTok Shop: 8-10% (ดีสุด)\n` +
      `→ Shopee Affiliate: 7-10%\n` +
      `→ Lazada: 6-8%\n\n` +
      `สินค้า sweet spot: ฿150–฿600\n` +
      `→ Impulse buy ง่ายกว่า, ad cost ต่อ order ต่ำ\n\n` +
      `บทเรียนจาก prod-003: TikTok + อุปกรณ์ชาร์จ ROAS 6.1x — ขยายหมวดนี้ต่อ`,
    problem_solve:
      `แก้ปัญหา research:\n\n` +
      `prod-002 Spin Mop (ROAS 3.8x ต่ำ):\n` +
      `→ ถ้าเลือกโปรโมท ต้องลด ad spend ลง 20%\n` +
      `→ เน้น organic content ลด paid dependency\n` +
      `→ เลือก hook ที่ demo ง่ายขึ้น: before_after\n\n` +
      `prod-001 (review count ใกล้เกณฑ์):\n` +
      `→ ตรวจ review recency — ถ้า recent ≥ 90% ผ่านได้`,
    general:
      `ผมดูแล product research ทุกสินค้าก่อนส่ง brief ให้ Offer Analyst ` +
      `ถามได้ทุกเรื่องเกี่ยวกับสินค้า เทรนด์ scoring เกณฑ์คัดกรอง หรือ approved categories ครับ`,
  },

  'offer-analyst': {
    status:
      `📊 สถานะ scoring queue ตอนนี้:\n\n` +
      `🔄 prod-002 Spin Mop — กำลังคำนวณ profit margin 45%\n` +
      `✅ prod-001 กล่องจัดระเบียบ — score 88/100 ส่ง Content Strategy แล้ว\n` +
      `✅ prod-003 ที่ชาร์จ 3-in-1 — score 91/100 ส่งแล้ว\n` +
      `✅ prod-004 แผ่นรองเมาส์ — score 79/100 ส่งแล้ว\n\n` +
      `ROAS เฉลี่ยที่ประมาณ: 4.8x`,
    next_action:
      `ขั้นตอนถัดไปของ Offer Analyst:\n\n` +
      `1️⃣ ให้ suitability_score prod-002 Spin Mop\n` +
      `   → ตรวจ est_commission ฿570 | ROAS 3.8x (ต่ำกว่าเป้า)\n` +
      `   → ตัดสินใจ: เลือกโปรโมทหรือข้าม?\n\n` +
      `2️⃣ เตรียม scoring template สำหรับ batch ถัดไป\n` +
      `   → focus: จัดระเบียบบ้าน + อุปกรณ์ชาร์จ (ผล prod-001, prod-003 ดี)`,
    ideas:
      `ไอเดียปรับ scoring model:\n\n` +
      `💡 เพิ่ม weight ให้ TikTok fit score\n` +
      `   → prod-003 TikTok: platform_fit 9/10 → ROAS 6.1x ✅\n\n` +
      `💡 เพิ่ม weight ให้ demo_score สำหรับ video format\n` +
      `   → สินค้าที่ demo ง่าย → conversion สูงกว่า\n\n` +
      `💡 เพิ่ม penalty ถ้า claim_risk = medium+\n` +
      `   → prod-003 ยังต้องระวัง spec overclaim`,
    risk:
      `ความเสี่ยงใน offer analysis:\n\n` +
      `⚠️ prod-002 ROAS 3.8x ต่ำกว่าเป้า — ต้องพิจารณาก่อนเลือก\n` +
      `⚠️ prod-003 claim_risk medium — spec ความเร็วชาร์จต้องตรวจก่อน claim\n` +
      `⚠️ สินค้าราคา ฿500+ conversion อาจต่ำกว่า ต้องใช้ content ที่ demo ชัดขึ้น`,
    finance:
      `ตัวเลข commission และ profit:\n\n` +
      `📊 ประมาณ commission รวม:\n` +
      `→ prod-001: ฿840 (commission rate 10%)\n` +
      `→ prod-002: ฿570 (rate 10%)\n` +
      `→ prod-003: ฿1,220 (rate 10%)\n` +
      `→ prod-004: ฿630 (rate 10%)\n\n` +
      `กำไรสุทธิรวม: ${formatTHB(companySummary.totalNetProfit)}\n` +
      `ROAS เฉลี่ย: ${companySummary.avgRoas}x\n\n` +
      `แนะนำ: focus สินค้า ROAS > 4.5x ต่อไป`,
    problem_solve:
      `แก้ปัญหา prod-002 Spin Mop (ROAS ต่ำ):\n\n` +
      `ตัวเลข:\n` +
      `→ revenue ฿5,700 | adSpend ฿1,500 | ROAS 3.8x\n` +
      `→ netProfit ฿3,070 (ยังบวก แต่ต่ำกว่าเป้า)\n\n` +
      `ตัวเลือก:\n` +
      `1. ลด adSpend ฿1,500 → ฿1,000 → ROAS จะขึ้นเป็น ~4.8x\n` +
      `2. เปลี่ยน hook เป็น demo ที่ดราม่ากว่า (before/after)\n` +
      `3. ข้ามสินค้านี้ไปก่อน เลือก batch ถัดไป\n\n` +
      `แนะนำ: ลองตัวเลือก 1 ก่อน ถ้าไม่ดีขึ้นค่อยข้าม`,
    general:
      `ผมดูแลการให้คะแนนสินค้าและประเมินความคุ้มค่า ตั้งแต่ commission rate, profit margin, จนถึง return/refund risk ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ scoring, ROAS ประมาณ, หรือการตัดสินใจเลือกสินค้าครับ`,
  },

  'content-strategy': {
    status:
      `🎯 สถานะ content strategy queue:\n\n` +
      `🔄 prod-001 กล่องจัดระเบียบ — เลือก framework ปัญหาจุกจิกทุกวัน 60%\n` +
      `✅ prod-004 แผ่นรองเมาส์ — brief ส่ง Script Writer แล้ว\n` +
      `⏳ prod-002 Spin Mop — รอ Offer Analyst ตัดสินใจก่อน\n\n` +
      `Framework ที่ใช้บ่อยสุดสัปดาห์นี้: worth_it, daily_problem`,
    next_action:
      `ขั้นตอนถัดไปของ Content Strategy:\n\n` +
      `1️⃣ เสร็จ brief prod-001 กล่องจัดระเบียบ\n` +
      `   → hook: "ห้องเล็ก condo แบบนี้ต้องใช้"\n` +
      `   → platform: TikTok + Shopee Video\n\n` +
      `2️⃣ เตรียม brief prod-002 Spin Mop (ถ้า Offer Analyst เลือกโปรโมท)\n` +
      `   → framework: before_after\n` +
      `   → hook: "ก่อนใช้/หลังใช้ — พื้นบ้านสะอาดใน 3 นาที"`,
    ideas:
      `ไอเดีย hook framework:\n\n` +
      `🎯 สำหรับกล่องจัดระเบียบ:\n` +
      `→ "คุณเคยเจอห้องรกแบบนี้ไหม? นี่คือสิ่งที่แก้ได้"\n` +
      `→ "ห้องเล็ก condo แบบนี้ต้องใช้ กล่อง 6-in-1 ฿299"\n` +
      `→ "ก่อนจัด vs หลังจัด — ต่างกันมากขนาดนี้"\n\n` +
      `🎯 สำหรับ Spin Mop:\n` +
      `→ "ทดสอบใน 60 วิ — พื้นสะอาดทันที"\n` +
      `→ "ก่อนใช้ vs หลังใช้ 30 วิ น้ำในถังเปลี่ยนสี"\n\n` +
      `🎯 สำหรับแผ่นรองเมาส์:\n` +
      `→ "฿189 บาท คุ้มจริงไหม? มาดูกัน"`,
    risk:
      `ความเสี่ยงใน content strategy:\n\n` +
      `⚠️ prod-003 ที่ชาร์จ: อย่า claim "ชาร์จเร็วที่สุด" ถ้าไม่มี spec ยืนยัน\n` +
      `⚠️ hook ที่ดราม่าเกินจริงอาจถูก TikTok throttle\n` +
      `⚠️ ทุก content ต้องมี #ad หรือ #โฆษณา ครบ\n` +
      `⚠️ Framework "before_after" — ผลต้องเป็นจริง ห้ามเกินจริง`,
    finance:
      `มุมมองการเงินจาก content strategy:\n\n` +
      `ต้นทุน content per campaign: ฿500–฿800\n\n` +
      `ROI ที่ดีสุด:\n` +
      `→ prod-003 TikTok: ต้นทุน ฿800, ROAS 6.1x ✅\n` +
      `→ prod-001 Shopee: ต้นทุน ฿500, ROAS est 5.2x ✅\n\n` +
      `แนะนำ: framework "worth_it" กับ "daily_problem" ได้ผล ROI ดีสุด`,
    problem_solve:
      `แก้ปัญหา content strategy:\n\n` +
      `ปัญหา: hook "ดีที่สุด" ถูก flag compliance\n` +
      `→ เปลี่ยนเป็น "ลองใช้แล้วชอบมาก" หรือ "คุ้มค่าสำหรับราคานี้"\n\n` +
      `ปัญหา: สินค้า ROAS ต่ำ — content อาจ fit ไม่ดี\n` +
      `→ เปลี่ยน framework: ถ้า "worth_it" ไม่ work ลอง "quick_test"\n` +
      `→ หรือ "objection_qa": ตอบ objection ที่คนสงสัยจริงๆ\n\n` +
      `ปัญหา: ไม่รู้จะ hook ยังไง\n` +
      `→ ดู comment section สินค้าที่ขายดี — คนถามอะไรบ่อย?`,
    general:
      `ผมดูแลกลยุทธ์ content ทั้งหมด ตั้งแต่เลือก hook framework, กลุ่มเป้าหมาย, platform mix, จนถึง CTA ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ content angle, framework selection, หรือ brief structure ครับ`,
  },

  'script-writer': {
    status:
      `🎬 สถานะ script production:\n\n` +
      `⚠️ prod-004 แผ่นรองเมาส์ RGB — script 85% รอ review hook direction\n` +
      `   → ต้องตัดสินใจ: demo-first หรือ problem-first?\n` +
      `⏳ prod-001 กล่องจัดระเบียบ — รอรับ brief จาก Content Strategy\n\n` +
      `งานถัดไปหลัง prod-004: prod-001 กล่องจัดระเบียบ 6-in-1`,
    next_action:
      `ขั้นตอนถัดไป:\n\n` +
      `1️⃣ ได้รับการตัดสินใจ hook direction สำหรับ prod-004\n` +
      `   → ถ้า demo-first: เริ่มด้วยภาพสินค้า RGB สวยๆ\n` +
      `   → ถ้า problem-first: "โต๊ะรกแบบนี้ทำงานไม่ได้เลย"\n\n` +
      `2️⃣ เสร็จ script prod-004 ส่ง Creative Production\n\n` +
      `3️⃣ รับ brief prod-001 กล่องจัดระเบียบ\n` +
      `   → framework: daily_problem | platform: TikTok + Shopee Video`,
    ideas:
      `ไอเดีย script สำหรับสินค้าในคิว:\n\n` +
      `🎬 prod-004 แผ่นรองเมาส์ RGB (demo-first):\n` +
      `→ [0–3s] ภาพ RGB glow บนโต๊ะมืด — สวยมาก\n` +
      `→ [3–8s] "โต๊ะ setup เปลี่ยนทันที ฿189 บาทเท่านั้น"\n` +
      `→ [8–18s] demo วางแผ่น + RGB modes\n` +
      `→ [18–25s] proof: review + ราคา\n\n` +
      `🎬 prod-001 กล่องจัดระเบียบ (problem-first):\n` +
      `→ [0–3s] ห้องรก — "ทนไม่ไหวแล้ว"\n` +
      `→ [3–8s] setup กล่อง 6-in-1\n` +
      `→ [8–18s] demo จัดระเบียบทุก item`,
    risk:
      `ความเสี่ยงใน script:\n\n` +
      `⚠️ prod-004: script 27 วิ อาจเกิน 30 วิ ถ้าเพิ่ม CTA — ต้องตัดฉาก 3\n` +
      `⚠️ ห้ามใช้ spec ที่ไม่แน่ใจ เช่น "ชาร์จเร็วสุด" "ทนทานที่สุด"\n` +
      `⚠️ ทุก script ต้องมี CTA ชัดเจน + #ad\n` +
      `⚠️ Hook 3 วิแรก critical มาก — ต้องไม่ boring`,
    finance:
      `มุมมองการเงินจาก script:\n\n` +
      `ต้นทุน script per campaign: ฿0 (ผลิต in-house)\n\n` +
      `Script ที่ดีลด cost per order:\n` +
      `→ prod-003 TikTok script ดี → CPO ฿41 ✅\n` +
      `→ script ที่ hook อ่อน → CPO สูง\n\n` +
      `เป้า: ทุก script ต้องทำ CPO < ฿150\n` +
      `→ prod-002 CPO ฿157 ยังเกินเป้า — ต้องปรับ script ถ้าเลือกโปรโมท`,
    problem_solve:
      `แก้ปัญหา script:\n\n` +
      `ปัญหา prod-004: script ยาวเกิน (27 วิ)\n` +
      `→ ตัด scene 3 ให้เหลือ 3 วิ (จาก 5 วิ)\n` +
      `→ CTA รวม proof ใน slide เดียวกัน\n` +
      `→ target: 25 วิ พอดี\n\n` +
      `ปัญหา: hook ไม่ดึงดูด\n` +
      `→ ดู top 10 TikTok ในหมวดเดียว\n` +
      `→ hook ที่ work มักเป็น: visual shock, price reveal, problem empathy`,
    general:
      `ผมดูแลการเขียน script และ storyboard ทุกชิ้น 20–30 วิ พร้อม on-screen text และ shot list ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ script format, hook writing, storyboard, หรือ timing ครับ`,
  },

  'creative-production': {
    status:
      `🎨 สถานะ creative production:\n\n` +
      `○ ตอนนี้ idle — รอรับงานจาก Script Writer\n` +
      `✅ prod-003 ที่ชาร์จ 3-in-1 — Canva brief ครบชุดส่ง Social Performance แล้ว\n\n` +
      `กำลังเตรียม:\n` +
      `→ Canva template หมวด desk accessories (prod-004)\n` +
      `→ Asset checklist template สำหรับ Shopee products`,
    next_action:
      `ขั้นตอนถัดไปเมื่อรับงาน:\n\n` +
      `1️⃣ รับ script + storyboard prod-004 จาก Script Writer\n` +
      `2️⃣ สร้าง Canva thumbnail layout\n` +
      `   → Background: desk setup dark + RGB glow\n` +
      `   → Text overlay: ราคา ฿189 + ลด 41%\n\n` +
      `3️⃣ สร้าง comparison card\n` +
      `   → "ก่อน/หลัง" หรือ "คุ้มค่า" card\n\n` +
      `4️⃣ CapCut checklist สำหรับ editor`,
    ideas:
      `ไอเดีย creative production:\n\n` +
      `💡 prod-004 แผ่นรองเมาส์ RGB:\n` +
      `→ Thumbnail: ภาพ RGB glow บนโต๊ะมืด — contrast สูง\n` +
      `→ Text: "฿189 ✨ RGB XXL" ใหญ่ชัด\n` +
      `→ Comparison card: "โต๊ะก่อน vs หลัง"\n\n` +
      `💡 prod-001 กล่องจัดระเบียบ:\n` +
      `→ Thumbnail: ห้องรก → ห้องจัดระเบียบ (split screen)\n` +
      `→ Text: "6-in-1 ฿299 — จัดได้ทุกมุมห้อง"\n` +
      `→ Asset: ภาพห้องคอนโด lifestyle shot`,
    risk:
      `ความเสี่ยงใน creative production:\n\n` +
      `⚠️ ภาพ "ก่อน/หลัง" ต้องไม่เกินจริง — ใช้ภาพสินค้าจริงเท่านั้น\n` +
      `⚠️ Text overlay ราคาต้องตรงกับหน้าสินค้าจริง\n` +
      `⚠️ ห้ามใช้ภาพ copyrighted โดยไม่ได้รับอนุญาต\n` +
      `⚠️ Thumbnail ต้องไม่ clickbait เกินจริง`,
    finance:
      `ต้นทุน creative production:\n\n` +
      `Canva Pro: รวมในต้นทุน content ฿500–฿800/campaign\n\n` +
      `ผลกระทบต่อ ROAS:\n` +
      `→ Thumbnail ที่ดีเพิ่ม CTR 15–30%\n` +
      `→ Comparison card ช่วย conversion\n` +
      `→ prod-003: creative ดี → CTR 3.2% → ROAS 6.1x ✅`,
    problem_solve:
      `แก้ปัญหา creative:\n\n` +
      `ปัญหา: thumbnail CTR ต่ำ\n` +
      `→ ใส่ราคาใหญ่ๆ ใน thumbnail — คนไทยตอบสนองดี\n` +
      `→ ใช้ contrast สูง dark background + bright text\n` +
      `→ เพิ่ม visual proof: "4.8 ⭐ 312 รีวิว"\n\n` +
      `ปัญหา: CapCut edit ไม่ match script\n` +
      `→ ส่ง CapCut checklist ที่ระบุ timecode ชัดเจน\n` +
      `→ แต่ละ scene บอกว่า visual ควรเป็นอะไร`,
    general:
      `ผมดูแลการผลิต creative assets ทุกชิ้น Canva brief, thumbnail, CapCut checklist, comparison card ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ visual design, asset structure, หรือ creative brief ครับ`,
  },

  'social-performance': {
    status:
      `📱 สถานะ social performance:\n\n` +
      `✅ prod-003 ที่ชาร์จ 3-in-1 — วิเคราะห์ครบ 48 ชม\n` +
      `   Views 58,400 | CTR 3.2% | ROAS 6.1x | Conv 4.8%\n` +
      `   pendingPayout ฿600 รอรับจาก TikTok Shop\n\n` +
      `⏳ รอสินค้าถัดไปผ่าน human approval ก่อน publish`,
    next_action:
      `ขั้นตอนถัดไปของ Social Performance:\n\n` +
      `1️⃣ ส่ง performance report prod-003 ให้ Product Research\n` +
      `   → learning: TikTok + charger category = ROAS 6.1x\n\n` +
      `2️⃣ รอ prod-004 แผ่นรองเมาส์ผ่าน human approval\n` +
      `   → เตรียม post checklist: caption, hashtag, UTM, pinned comment\n\n` +
      `3️⃣ เตรียม post schedule สำหรับ batch ถัดไป\n` +
      `   → prime time: 18:00–21:00 weekday, 10:00–12:00 weekend`,
    ideas:
      `ไอเดีย social performance:\n\n` +
      `💡 prod-003 ที่ชาร์จ 3-in-1 (ROAS 6.1x):\n` +
      `→ เพิ่มงบ 50% ทันที — ROAS ยังสูงมาก\n` +
      `→ Retarget ด้วย lookalike audience จาก buyer list\n\n` +
      `💡 prod-004 แผ่นรองเมาส์ (รอโพสต์):\n` +
      `→ โพสต์ TikTok ช่วง 19:00 Tue/Thu — peak gaming audience\n` +
      `→ Pinned comment: "ลิงก์ Shopee ด้านล่าง ฿189 เท่านั้น"\n\n` +
      `💡 Cross-platform:\n` +
      `→ TikTok → repost Shopee Video → reach คนละกลุ่ม`,
    risk:
      `ความเสี่ยง social performance:\n\n` +
      `⚠️ prod-003 pendingPayout ฿600 รอรับ — ติดตาม TikTok Shop schedule\n` +
      `⚠️ TikTok algorithm เปลี่ยนบ่อย — ต้อง test posting time\n` +
      `⚠️ ทุก post ต้องมี #ad ชัดเจน ทั้ง TikTok, Shopee, Lazada\n` +
      `⚠️ Affiliate link ต้องตรวจทุกครั้งก่อน post`,
    finance:
      `ตัวเลข performance ล่าสุด:\n\n` +
      `💰 รายได้รวม: ${formatTHB(companySummary.totalRevenue)}\n` +
      `📈 กำไรสุทธิ: ${formatTHB(companySummary.totalNetProfit)}\n` +
      `📢 ค่าโฆษณา: ${formatTHB(companySummary.totalAdSpend)}\n` +
      `🎯 ROAS เฉลี่ย: ${companySummary.avgRoas}x\n\n` +
      `Best performer: prod-003 TikTok ROAS 6.1x\n` +
      `ต้องปรับ: prod-002 Lazada ROAS 3.8x ต่ำกว่าเป้า`,
    problem_solve:
      `แก้ปัญหา social performance:\n\n` +
      `ปัญหา: CTR ต่ำ\n` +
      `→ ทดสอบ posting time ใหม่\n` +
      `→ เปลี่ยน thumbnail — ราคาต้องเห็นชัดใน 1 วินาที\n` +
      `→ ลอง hook ใหม่ใน caption\n\n` +
      `ปัญหา: Conversion ต่ำแม้ CTR ดี\n` +
      `→ ตรวจ product page — ราคาตรงกับ video ไหม?\n` +
      `→ Pinned comment ต้องมี link + code ชัดเจน\n` +
      `→ ลด friction: ลิงก์ตรงไปหน้าสินค้าเลย ไม่ใช่ home page`,
    general:
      `ผมดูแล social media posting, performance tracking, และ learning loop ทั้งหมด ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ post schedule, performance data, UTM, hashtag, หรือ scaling strategy ครับ`,
  },
}

export function getInitialGreeting(agentId: DepartmentId): string {
  const agent = agents.find(a => a.id === agentId)
  if (!agent) return 'สวัสดีครับ'
  const campaignName = agent.currentCampaignId
    ? (campaigns.find(c => c.id === agent.currentCampaignId)?.name ?? '')
    : ''

  const greetings: Record<DepartmentId, string> = {
    'product-research':
      `สวัสดีครับ ผม Product Research${campaignName ? ` กำลังตรวจสอบ "${campaignName}"` : ''} อยู่ ` +
      `progress ${agent.progress}% — ถามเรื่อง product research, scoring criteria, หรือ approved categories ได้เลยครับ`,
    'offer-analyst':
      `สวัสดีครับ ผม Offer Analyst${campaignName ? ` กำลังคำนวณ profit margin "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง scoring, ROAS estimate, หรือ commission calculation ได้เลยครับ`,
    'content-strategy':
      `สวัสดีครับ ทีม Content Strategy${campaignName ? ` กำลังเลือก hook framework ของ "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง hook framework, audience selection, หรือ platform mix ได้เลยครับ`,
    'script-writer':
      `สวัสดีครับ ผม Script Writer${campaignName ? ` กำลังเขียน script "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง script format, hook writing, storyboard, หรือ timing ได้ครับ`,
    'creative-production':
      `สวัสดีครับ ทีม Creative Production${campaignName ? ` กำลังเตรียม assets ของ "${campaignName}"` : ' ว่างรอรับงานอยู่'} ` +
      `ถามเรื่อง Canva brief, thumbnail design, หรือ CapCut checklist ได้เลยครับ`,
    'social-performance':
      `สวัสดีครับ ผม Social Performance${campaignName ? ` กำลังวิเคราะห์ "${campaignName}"` : ''} อยู่ ` +
      `รายได้รวมวันนี้ ${formatTHB(companySummary.totalRevenue)} ROAS ${companySummary.avgRoas}x ` +
      `ถามเรื่อง performance data, posting strategy, หรือ scaling ได้เลยครับ`,
  }
  return greetings[agentId]
}

export function getMockResponse(
  agentId: DepartmentId,
  userMessage: string,
  _campaignId?: string,
): MockResponse {
  const intent = detectIntent(userMessage)
  const agentResponses = RESPONSES[agentId]
  const text = agentResponses[intent] ?? agentResponses.general ?? 'ขอโทษครับ ลองถามใหม่อีกครั้งนะครับ'
  return { text, intent, mockDelay: 700 + Math.random() * 800 }
}
