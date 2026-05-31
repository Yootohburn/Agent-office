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
  if (m.includes('ปัญหา') || m.includes('แก้') || m.includes('ช่วย') || m.includes('แคมเปญ') || m.includes('fix')) return 'problem_solve'
  if (m.includes('ไอเดีย') || m.includes('hook') || m.includes('script') || m.includes('คอนเทนต์') || m.includes('สร้าง') || m.includes('idea')) return 'ideas'
  if (m.includes('เสี่ยง') || m.includes('ตรวจ') || m.includes('risk') || m.includes('ระวัง')) return 'risk'
  if (m.includes('การเงิน') || m.includes('ตัวเลข') || m.includes('roas') || m.includes('กำไร') || m.includes('งบ') || m.includes('เงิน')) return 'finance'
  return 'general'
}

const RESPONSES: Record<DepartmentId, Partial<Record<IntentKey, string>>> = {
  'ceo-director': {
    status:
      `📊 สถานะบริษัทวันนี้:\n\n` +
      `✅ TikTok Earbuds — content กำลังผลิต 70% ดูดี\n` +
      `⚠️ Skincare Travel Pouch — รอ CEO อนุมัติ (ด่วน)\n` +
      `⛔ Lazada Blender — ขาดทุน ${formatTHB(-120)} ต้องตัดสินใจหยุดยิงแอด\n` +
      `✅ Shopee Desk Lamp — research 45% ปกติดี\n\n` +
      `📈 กำไรรวม: ${formatTHB(companySummary.totalNetProfit)} | ROAS ${companySummary.avgRoas}x`,
    next_action:
      `ลำดับความสำคัญสูงสุดของผมตอนนี้:\n\n` +
      `1️⃣ อนุมัติ Skincare Travel Pouch — compliance ผ่านแล้ว รอลายเซ็นอย่างเดียว\n` +
      `2️⃣ ตัดสินใจ Lazada Blender — ขาดทุนอยู่ ต้องหยุดยิงแอดหรือปรับ creative\n` +
      `3️⃣ รีวิว brief TikTok Earbuds ว่า content ตรงทิศทางไหม\n\n` +
      `แนะนำจัดการข้อ 1 ก่อน เพราะ ROAS 7.2x พร้อม scale ทันที`,
    problem_solve:
      `สำหรับแคมเปญที่มีปัญหา:\n\n` +
      `Lazada Blender (ขาดทุน ${formatTHB(-120)}):\n` +
      `→ หยุดยิงแอดก่อนทันที\n` +
      `→ ให้ Finance ดู cost structure ใหม่\n` +
      `→ เปลี่ยน angle: จาก health claims เป็น lifestyle\n\n` +
      `Skincare Pouch (รอนาน):\n` +
      `→ ผมจะอนุมัติภายในวันนี้\n` +
      `→ เตรียม export package ให้พร้อมก่อนเลย`,
    ideas:
      `ไอเดีย strategic direction ใหม่:\n\n` +
      `💡 Bundle campaign: Earbuds + Phone Stand — ราคา bundle ฿799 ดึง AOV ขึ้น\n` +
      `💡 Shopee Flash Sale: โคมไฟ + ที่ชาร์จ — timing เสาร์อาทิตย์\n` +
      `💡 TikTok Series: "unboxing ทุกวัน" 7 วันต่อเนื่อง build audience\n` +
      `💡 Lazada: เปลี่ยน angle blender เป็น smoothie bowl recipe แทน health claims`,
    risk:
      `ความเสี่ยงหลักบริษัทตอนนี้:\n\n` +
      `⛔ Lazada Blender — ขาดทุน ROAS 2.0x ต่ำมาก ควรหยุดก่อน\n` +
      `⚠️ Skincare: compliance claim บางจุดยังเสี่ยง ต้องตรวจซ้ำ\n` +
      `⚠️ เราพึ่ง TikTok มากเกินไป — 69% ของรายได้มาจาก TikTok เดียว\n` +
      `⚠️ Budget concentrated — ควรกระจาย risk ให้ Shopee มากขึ้น`,
    finance:
      `ตัวเลขรวมบริษัทตอนนี้:\n\n` +
      `💰 รายได้รวม: ${formatTHB(companySummary.totalRevenue)}\n` +
      `📈 กำไรสุทธิ: ${formatTHB(companySummary.totalNetProfit)}\n` +
      `📢 ค่าโฆษณา: ${formatTHB(companySummary.totalAdSpend)}\n` +
      `🎯 ROAS เฉลี่ย: ${companySummary.avgRoas}x\n\n` +
      `TikTok ทำ ROAS ดีที่สุด — แนะนำ scale ก่อน\n` +
      `Lazada ขาดทุน — ต้องหยุดหรือ restructure`,
    general:
      `ผม CEO ดูแลทิศทางแคมเปญทั้งหมด ตอนนี้มี 4 แคมเปญที่กำลังดำเนินการ ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ strategy การตัดสินใจ หรือภาพรวมบริษัทครับ`,
  },

  'product-analyst': {
    status:
      `🔬 สถานะ research queue ตอนนี้:\n\n` +
      `✅ TikTok Earbuds X9 — คะแนน 84/100 ส่ง brief ไป Content แล้ว\n` +
      `🔄 Shopee Desk Lamp — กำลัง analyze 45% เหลือ competitor landscape\n` +
      `✅ Lazada Blender — คะแนน 71/100 ส่ง brief แล้ว\n` +
      `✅ Skincare Travel Pouch — คะแนน 77/100 ส่ง brief แล้ว\n\n` +
      `สินค้าถัดไปที่น่าสนใจ: ที่วางโทรศัพท์ magnetic, desk organizer`,
    next_action:
      `ขั้นตอนถัดไปของผม:\n\n` +
      `1️⃣ ทำ competitor analysis Shopee Desk Lamp ให้เสร็จ\n` +
      `   → คู่แข่ง 12 ราย ต้องหา unique angle\n` +
      `   → target: ราคา ฿500–฿1,200, คนทำงานที่บ้าน\n\n` +
      `2️⃣ Scout สินค้าใหม่สำหรับ TikTok\n` +
      `   → ดู trending hashtag #homedecor, #gadget\n` +
      `   → เป้า: commission 8%+, rating 4.5+`,
    ideas:
      `สินค้าน่าสนใจที่ควร scout เพิ่ม:\n\n` +
      `🛍️ TikTok:\n` +
      `→ Magnetic phone stand (trending #WorkFromHome)\n` +
      `→ LED strip light (aesthetic room setup)\n` +
      `→ Mini projector ฿1,500-฿3,000\n\n` +
      `🛍️ Shopee:\n` +
      `→ Ergonomic mouse pad (WFH trend)\n` +
      `→ Cable management set\n\n` +
      `🛍️ Lazada:\n` +
      `→ Air purifier compact ราคา ฿800-฿1,500\n` +
      `→ หลีกเลี่ยง blender หมวดนี้ก่อน (ROAS ต่ำ)`,
    risk:
      `ความเสี่ยงในสาย research:\n\n` +
      `⚠️ Desk Lamp: competitor affiliate มาก 12 ราย — angle ต้องแตกต่างจริงๆ\n` +
      `⚠️ ราคาสินค้าหลายตัวใกล้ ceiling ฿1,500 — conversion อาจต่ำลง\n` +
      `⚠️ Blender category: ตลาด Lazada saturated แล้ว ควรหลีกเลี่ยงไปก่อน`,
    finance:
      `มุมมอง finance จาก research side:\n\n` +
      `Commission ที่ดีที่สุด:\n` +
      `→ TikTok Shop: 8-10% (ดีสุด)\n` +
      `→ Shopee Affiliate: 6-8%\n` +
      `→ Lazada: 5-7%\n\n` +
      `สินค้า sweet spot: ฿200-฿1,500\n` +
      `→ Conversion rate สูงกว่า\n` +
      `→ Ad cost ต่อ order ต่ำกว่า\n\n` +
      `แนะนำ: focus TikTok electronics ต่อไป`,
    problem_solve:
      `วิธีแก้ปัญหาใน research:\n\n` +
      `Desk Lamp (angle ซ้ำกับคู่แข่ง):\n` +
      `→ ลอง angle: ลดไมเกรนจากงาน WFH\n` +
      `→ หรือ: aesthetic desk setup TikTok trend\n` +
      `→ หรือ: bundle กับ phone stand\n\n` +
      `Blender (ROAS ต่ำ):\n` +
      `→ น่าจะมาจาก claim ที่ถูก flag\n` +
      `→ ถ้าแก้ angle เป็น smoothie lifestyle แทน health → น่าจะดีขึ้น`,
    general:
      `ผมดูแล product research ทุกสินค้าก่อนส่ง brief ให้ Content Studio ` +
      `ถามได้ทุกเรื่องเกี่ยวกับสินค้า เทรนด์ commission หรือ competitor landscape ครับ`,
  },

  'content-studio': {
    status:
      `🎬 สถานะ content production:\n\n` +
      `🔄 TikTok Earbuds — script 70% beat 4/5 เสร็จแล้ว เหลือ CTA + caption\n` +
      `⏳ Skincare Pouch — script เสร็จ รอ CEO อนุมัติ\n` +
      `❌ Lazada Blender — ถูก flag จาก Ops เรื่อง health claim ต้องแก้ไข\n\n` +
      `งานถัดไปหลัง Earbuds เสร็จ: โคมไฟ Shopee (รับ brief แล้ว)`,
    ideas:
      `ไอเดีย hook สำหรับ TikTok:\n\n` +
      `🎯 Earbuds format:\n` +
      `→ "POV: ซื้อหูฟัง ฿2,800 แล้วรู้ว่าถูกหลอก"\n` +
      `→ "เปรียบเทียบ 3 รุ่น: แพง กลาง ถูก ผลลัพธ์ช็อกมาก"\n` +
      `→ "ใส่หูฟังตัวนี้แล้วชีวิตเปลี่ยน (ไม่ clickbait)"\n\n` +
      `🎯 Skincare Pouch:\n` +
      `→ "แพ็คของไปทริป 7 ชั่วโมง สิ่งที่ขาดไม่ได้คือ..."\n` +
      `→ "routine ดูแลผิวตอนเดินทาง ใช้แค่ 5 อย่าง"\n\n` +
      `🎯 Desk Lamp:\n` +
      `→ "ก่อน/หลัง setup โต๊ะทำงาน ฿500 เปลี่ยนทุกอย่าง"`,
    next_action:
      `ขั้นตอนถัดไปของทีม:\n\n` +
      `1️⃣ Earbuds: เขียน CTA beat (25-28 วิ) + caption 150 ตัวอักษร\n` +
      `2️⃣ แก้ Lazada Blender: เอา health claim ออก เปลี่ยนเป็น lifestyle angle\n` +
      `3️⃣ รับ brief Shopee Desk Lamp: เริ่ม ideation hook`,
    risk:
      `ความเสี่ยงใน content:\n\n` +
      `⛔ Blender: claim "เพิ่ม metabolism" → ถูก flag แล้ว ต้องลบทันที\n` +
      `⚠️ Skincare: เช็ค ingredient claims อีกรอบก่อน CEO เห็น\n` +
      `⚠️ Earbuds: อย่าเปรียบเทียบ brand จริงในวิดีโอ → legal risk\n` +
      `⚠️ ทุก content: ต้องมี #ad หรือ #โฆษณา ครบทุกชิ้น`,
    finance:
      `มุมมองการเงินจากฝั่ง content:\n\n` +
      `ต้นทุน content ต่อแคมเปญ: ฿150-฿200\n\n` +
      `ROI ดี:\n` +
      `→ TikTok Earbuds: ต้นทุน ฿200, ROAS 4.6x ✅\n` +
      `→ Skincare: ต้นทุน ฿150, ROAS 7.2x ✅✅\n\n` +
      `ROI แย่:\n` +
      `→ Blender: ต้นทุน ฿200, ROAS 2.0x, ขาดทุน ❌\n` +
      `→ ปัญหาน่าจะมาจาก creative ที่ถูก flag ทำให้ reach ต่ำ`,
    problem_solve:
      `วิธีแก้ปัญหา content ที่มีอยู่:\n\n` +
      `Blender (ถูก flag):\n` +
      `→ เอา claim "เพิ่ม metabolism" ออกทั้งหมด\n` +
      `→ เปลี่ยน angle: "smoothie สวยๆ ทำได้ทุกที่"\n` +
      `→ เน้น lifestyle visual ไม่ใช่ health benefit\n` +
      `→ ส่ง Ops ตรวจซ้ำก่อน CEO\n\n` +
      `Earbuds (ใกล้เสร็จ):\n` +
      `→ CTA ต้องชัดเจน: "คลิกลิงก์ในไบโอ + โค้ด SAVE5"`,
    general:
      `ผมดูแลการผลิตคอนเทนต์ทุกชิ้น ตั้งแต่ hook script caption จนถึง UGC brief ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ content strategy, format, หรือไอเดีย TikTok ครับ`,
  },

  'ops-review': {
    status:
      `📋 สถานะ compliance queue:\n\n` +
      `✅ TikTok Earbuds — ผ่าน compliance รอ CEO อนุมัติ\n` +
      `❌ Lazada Blender — flagged: health claim "เพิ่ม metabolism" ส่งกลับ Content แล้ว\n` +
      `⏳ Skincare Pouch — กำลังเตรียม export package\n` +
      `📥 Shopee Desk Lamp — คิวอันดับ 2 (รอ content เสร็จก่อน)`,
    next_action:
      `ขั้นตอนถัดไป:\n\n` +
      `1️⃣ ติดตาม Blender: Content Studio รับ flag แล้วหรือยัง?\n` +
      `2️⃣ เตรียม export package Skincare — ไฟล์, caption, hashtag\n` +
      `3️⃣ ตรวจ Earbuds ซ้ำ 1 รอบก่อนส่ง CEO — ตรวจ disclosure #ad\n` +
      `4️⃣ เตรียม compliance checklist สำหรับ Desk Lamp (คิวถัดไป)`,
    problem_solve:
      `วิธีจัดการ Lazada Blender:\n\n` +
      `ปัญหา: claim "ช่วยเพิ่ม metabolism" → medical claim ที่ไม่มีหลักฐาน\n\n` +
      `ขั้นตอนแก้:\n` +
      `1. Content Studio ลบ/แก้ claim ดังกล่าว\n` +
      `2. เปลี่ยนเป็น lifestyle: "smoothie ทำง่าย พกพาได้ทุกที่"\n` +
      `3. ส่งกลับ Ops ตรวจซ้ำ\n` +
      `4. ถ้าผ่าน → ส่ง CEO approve\n\n` +
      `ETA หลังแก้: 1-2 วันทำการ`,
    risk:
      `ความเสี่ยง compliance ตอนนี้:\n\n` +
      `⛔ Blender: health claim ยังค้างอยู่ → ห้าม publish จนกว่าจะแก้\n` +
      `⚠️ Earbuds: ตรวจ #ad disclosure ใน caption อีกรอบ\n` +
      `⚠️ Skincare: claim เกี่ยวกับ skin ต้องระวัง — "ดูแลผิว" ok แต่ "รักษา" ไม่ได้\n` +
      `⚠️ ทุก Lazada content: ตรวจ price ตรงกับหน้าสินค้าไหม`,
    finance:
      `มุมมองการเงินจาก ops:\n\n` +
      `ต้นทุนที่ซ่อนอยู่:\n` +
      `→ แคมเปญที่ถูก flag ต้องรอ → delay = opportunity cost\n` +
      `→ Blender ถูก flag 1 ครั้ง: delay ~3 วัน → เสีย window ขาย\n\n` +
      `แนะนำ: ลงทุนเวลามากขึ้นใน pre-compliance review\n` +
      `→ ตรวจก่อน submit จะประหยัดเวลามากกว่า`,
    ideas:
      `ไอเดียปรับปรุง compliance process:\n\n` +
      `💡 สร้าง checklist ก่อน submit ให้ Content Studio ใช้\n` +
      `💡 Template caption ที่ผ่าน compliance แล้ว (plug & play)\n` +
      `💡 คำ blacklist ที่ต้องหลีกเลี่ยง: metabolism, รักษา, รับประกัน, ดีที่สุด\n` +
      `💡 Review ทุก platform แยกกัน — Lazada, Shopee, TikTok rules ต่างกัน`,
    general:
      `ผมดูแล compliance และ operations ทุกอย่าง ทุก content ต้องผ่านผมก่อนถึง CEO ` +
      `ถามได้ทุกเรื่องเกี่ยวกับ compliance rules, queue status, หรือ platform policies ครับ`,
  },

  'finance-controller': {
    status:
      `💰 สถานะการเงินบริษัท:\n\n` +
      `รายได้รวม: ${formatTHB(companySummary.totalRevenue)}\n` +
      `กำไรสุทธิ: ${formatTHB(companySummary.totalNetProfit)}\n` +
      `ROAS เฉลี่ย: ${companySummary.avgRoas}x\n` +
      `ค่าโฆษณา: ${formatTHB(companySummary.totalAdSpend)}\n\n` +
      `📊 แยกตาม channel:\n` +
      `→ TikTok: ROAS 5.6x ✅\n` +
      `→ Shopee: ROAS 6.0x ✅\n` +
      `→ Lazada: ขาดทุน ${formatTHB(-120)} ⛔`,
    finance:
      `รายละเอียดการเงินแต่ละ channel:\n\n` +
      `🩵 TikTok:\n` +
      `→ รายได้: ฿7,800 | โฆษณา: ฿1,400 | กำไร: ฿2,650 | ROAS: 5.6x ✅\n\n` +
      `🟠 Shopee:\n` +
      `→ รายได้: ฿2,100 | โฆษณา: ฿350 | กำไร: ฿620 | ROAS: 6.0x ✅\n\n` +
      `🔵 Lazada:\n` +
      `→ รายได้: ฿1,400 | โฆษณา: ฿700 | กำไร: ${formatTHB(-120)} | ROAS: 2.0x ⛔\n\n` +
      `⚠️ Lazada: ค่าโฆษณาสูงกว่าที่ควร → ต้องหยุดยิงทันที`,
    next_action:
      `คำแนะนำ budget ด่วน:\n\n` +
      `1️⃣ หยุด Lazada Blender ทันที → ขาดทุนทุกวัน\n` +
      `2️⃣ เพิ่ม budget TikTok Skincare +20% → ROAS 7.2x คุ้มมาก\n` +
      `3️⃣ ขยาย Shopee Desk Lamp → ROAS 6.0x เสถียร\n` +
      `4️⃣ รอ TikTok Earbuds ผ่าน CEO ก่อน scale\n\n` +
      `ผลลัพธ์คาด: กำไรรวม +฿800-฿1,200 ต่อสัปดาห์`,
    risk:
      `ความเสี่ยงด้านการเงิน:\n\n` +
      `⛔ Lazada Blender: ขาดทุนทุกวันที่ยิงแอดอยู่ → หยุดก่อน\n` +
      `⚠️ TikTok dependency: 69% รายได้มาจาก TikTok — risk ถ้า algorithm เปลี่ยน\n` +
      `⚠️ ยอดรอรับเงิน: ${formatTHB(companySummary.totalPendingPayout)} — ติดตาม payout schedule\n` +
      `⚠️ ถ้า Lazada ขาดทุนต่อเนื่อง 2 สัปดาห์ → ต้องปิด channel ชั่วคราว`,
    problem_solve:
      `แก้ปัญหา Lazada Blender:\n\n` +
      `ตัวเลขปัจจุบัน: รายได้ ฿1,400 vs ค่าโฆษณา ฿700\n` +
      `→ ต้นทุนรวม (โฆษณา + content): ฿900\n` +
      `→ กำไร/ขาดทุน: ${formatTHB(-120)}\n\n` +
      `วิธีแก้:\n` +
      `1. หยุดยิงแอดก่อน 24 ชม.\n` +
      `2. ถ้า organic ยังขายได้ → ลอง creative ใหม่ cost ต่ำกว่า\n` +
      `3. ถ้าไม่ได้ผล → ปิด Lazada channel 2-4 สัปดาห์\n\n` +
      `Target: ROAS 4.0x ขึ้นไปถึงจะ profitable`,
    ideas:
      `ไอเดียเพิ่มรายได้:\n\n` +
      `💡 Flash sale campaign: Shopee ฿9.9 promotion\n` +
      `💡 TikTok bundle: Earbuds + Skincare Pouch ราคา bundle\n` +
      `💡 Retargeting: ยิงแอดหา lookalike audience จาก TikTok buyer\n` +
      `💡 Content upsell: ใน video แนะนำสินค้าที่ 2 (cross-sell)\n\n` +
      `แนะนำ: prioritize TikTok ก่อน ROI ดีสุดตอนนี้`,
    general:
      `ผมดูแลการเงินทุกช่องทาง ตั้งแต่ revenue commission ad spend จนถึง ROAS และ net profit ` +
      `ถามได้ทุกเรื่องเกี่ยวกับตัวเลขการเงิน งบโฆษณา หรือการ scale แคมเปญครับ`,
  },
}

export function getInitialGreeting(agentId: DepartmentId): string {
  const agent = agents.find(a => a.id === agentId)
  if (!agent) return 'สวัสดีครับ'
  const campaignName = agent.currentCampaignId
    ? (campaigns.find(c => c.id === agent.currentCampaignId)?.name ?? '')
    : ''

  const greetings: Record<DepartmentId, string> = {
    'ceo-director':
      `สวัสดีครับ ผม CEO${campaignName ? ` กำลังดูแล "${campaignName}" อยู่` : ''} ` +
      `ตอนนี้ progress ${agent.progress}% — มีอะไรให้ช่วยไหมครับ?`,
    'product-analyst':
      `สวัสดีครับ ผม Product Analyst${campaignName ? ` กำลัง research "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง product research, trends, หรือ scoring ได้เลยครับ`,
    'content-studio':
      `สวัสดีครับ ทีม Content Studio${campaignName ? ` กำลังผลิต content สำหรับ "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง hook, script, ไอเดีย TikTok ได้เลยครับ`,
    'ops-review':
      `สวัสดีครับ ผม Ops & Review${campaignName ? ` กำลังตรวจ compliance ของ "${campaignName}"` : ''} อยู่ ` +
      `ถามเรื่อง compliance, queue, หรือ platform rules ได้ครับ`,
    'finance-controller':
      `สวัสดีครับ ผม Finance Controller กำลังวิเคราะห์ ROAS และ P&L อยู่ ` +
      `รายได้รวมวันนี้ ${formatTHB(companySummary.totalRevenue)} กำไรสุทธิ ${formatTHB(companySummary.totalNetProfit)} ` +
      `ถามเรื่องตัวเลขได้เลยครับ`,
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
