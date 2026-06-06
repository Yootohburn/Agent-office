// Per-stage mock output generator — uses actual product data for realistic content.
// Phase 2: replace with real LLM calls via Anthropic SDK.

import type { Product } from '../data/types'
import type { PipelineStage } from '../agents/campaignRegistry'

export interface MockRunOutput {
  title:          string
  summary:        string
  content:        string
  risks:          string[]
  recommendation: string
}

const MKT_LABEL: Record<string, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiktok: 'TikTok Shop',
}

export function runMockAgent(stage: PipelineStage, product: Product): MockRunOutput {
  const mkt = MKT_LABEL[product.marketplace] ?? product.marketplace
  const p   = product

  switch (stage) {

    case 'new_product':
      return {
        title:   `รับสินค้าใหม่: ${p.title_th}`,
        summary: `ป้อนข้อมูลสินค้าเข้าระบบแล้ว — ${mkt} ฿${p.price_now} commission ${p.commission_rate}%`,
        content: [
          `Product ID : ${p.product_id}`,
          `ชื่อ       : ${p.title_th}`,
          `ร้านค้า    : ${p.shop_name}`,
          `ราคา       : ฿${p.price_now.toLocaleString()} (ปกติ ฿${p.price_normal.toLocaleString()})`,
          `ลด         : ${p.discount_pct}%`,
          `Commission : ${p.commission_rate}% → ฿${p.est_commission_baht}/ชิ้น`,
          `หมวด       : ${p.category} / ${p.subcategory}`,
        ].join('\n'),
        risks:          [],
        recommendation: 'ส่ง Product Research ยืนยันข้อมูลและประเมินความเสี่ยง',
      }

    case 'verified':
      return {
        title:   `ยืนยันข้อมูลสินค้า: ${p.title_th}`,
        summary: `ตรวจสอบข้อมูลจาก ${mkt} ครบถ้วน — rating ${p.rating} | sold ${p.sold_count.toLocaleString()} ชิ้น`,
        content: [
          '✓ ชื่อสินค้าสอดคล้องกับหมวด ' + p.category,
          `✓ ราคา ฿${p.price_now.toLocaleString()} อยู่ในช่วงที่ลูกค้าจ่ายได้`,
          `✓ Rating ${p.rating} | Sold ${p.sold_count.toLocaleString()} | Review ${p.review_count.toLocaleString()}`,
          `✓ ร้านค้า: ${p.shop_name}`,
          p.rating < 4.0   ? '⚠ Rating ต่ำกว่า 4.0 — ต้องดู review เชิงลบ' : '',
          p.review_count < 100 ? '⚠ Review น้อยกว่า 100 — ความน่าเชื่อถือต่ำ' : '',
        ].filter(Boolean).join('\n'),
        risks: [
          ...(p.rating < 4.0        ? ['Rating ต่ำกว่า 4.0 — ความน่าเชื่อถือต่ำ']   : []),
          ...(p.review_count < 100  ? ['Review count ต่ำกว่า 100 — อาจถูกตั้งคำถาม'] : []),
        ],
        recommendation: 'สินค้าผ่านการยืนยัน — ส่ง Offer Analyst ประเมินความคุ้มค่า',
      }

    case 'scored': {
      const breakEven = p.est_commission_baht > 0
        ? Math.ceil(500 / p.est_commission_baht)
        : '?'
      return {
        title:   `คะแนนความคุ้มค่า: ${p.title_th}`,
        summary: `suitability_score ${p.suitability_score}/100 | est commission ฿${p.est_commission_baht}/ชิ้น`,
        content: [
          `Commission  : ฿${p.est_commission_baht}/ชิ้น (${p.commission_rate}%)`,
          `Content cost: ~฿500 (ประมาณการ)`,
          `Break-even  : ${breakEven} ชิ้น`,
          `ROAS target : 4.0x`,
          `Suitability : ${p.suitability_score}/100`,
          `claim_risk  : ${p.claim_risk}`,
          `return_risk : ${p.return_risk}`,
        ].join('\n'),
        risks: [
          ...(p.est_commission_baht < 20  ? ['Commission ต่ำมาก — ต้องขายจำนวนมากถึง break-even']   : []),
          ...(p.claim_risk === 'high'      ? ['claim_risk สูง — เสี่ยงถูกแบนหรือร้องเรียน']           : []),
          ...(p.suitability_score < 50     ? ['suitability_score ต่ำกว่า 50 — ควรพิจารณาข้ามสินค้า'] : []),
        ],
        recommendation: p.suitability_score >= 70
          ? 'แนะนำเลือกโปรโมท — suitability_score ผ่านเกณฑ์ 70'
          : 'ควรพิจารณาเพิ่มเติม — suitability_score ต่ำกว่าเกณฑ์',
      }
    }

    case 'selected':
      return {
        title:   `เลือกโปรโมท: ${p.title_th}`,
        summary: `Go decision: ${p.suitability_score >= 70 ? '✅ เดินหน้า' : '⚠ เดินหน้าด้วยความระมัดระวัง'}`,
        content: [
          `สินค้า    : ${p.title_th}`,
          `Channel   : ${mkt}`,
          `Commission: ฿${p.est_commission_baht}/ชิ้น`,
          '',
          'เงื่อนไขการโปรโมท:',
          '- ใช้ evidence จากการใช้งานจริงเท่านั้น ห้าม overclaim',
          '- ห้ามใช้: ดีที่สุด / การันตี / ถูกที่สุด',
          '- ต้องผ่าน Human Approval Gate ก่อน publish',
        ].join('\n'),
        risks:          [],
        recommendation: 'ส่ง Content Strategy สร้าง brief และ hook framework',
      }

    case 'brief_ready':
      return {
        title:   `Content Brief: ${p.title_th}`,
        summary: `Hook framework และ platform strategy พร้อม — target ${mkt}`,
        content: [
          `TARGET AUDIENCE: ผู้มีปัญหาที่ ${p.category} แก้ได้`,
          '',
          'HOOK FRAMEWORKS (เลือก 1):',
          `  1. Problem-first : "ปัญหา [ที่ target มี] แก้ได้ด้วยนี้"`,
          `  2. Demo-first    : แสดงผลก่อน แล้วค่อยอธิบาย`,
          `  3. Worth-it      : "฿${p.price_now.toLocaleString()} บาท คุ้มไหม? ดูก่อน"`,
          '',
          `CTA: "ลิงก์ใน bio" / "สั่งได้ที่ ${mkt}"`,
          `PLATFORM: ${mkt} primary | FORMAT: 20–30 วิ short-form`,
          '',
          'CONTENT RULE: ขายจาก evidence ไม่ใช่ adjective',
        ].join('\n'),
        risks:          ['ห้ามใช้คำ: ดีที่สุด, การันตี, ถูกที่สุด, fake discount'],
        recommendation: 'ส่ง Script Writer เขียน script 20–30 วิ',
      }

    case 'script_ready':
      return {
        title:   `Script 25 วิ: ${p.title_th}`,
        summary: 'Script Thai + 4-scene storyboard + caption draft พร้อม',
        content: [
          '[Scene 1 — Hook 0–5 วิ]',
          `"มีปัญหา [ปัญหาที่ target มี] จนเจอ ${p.subcategory} นี้"`,
          `On-screen: ${p.title_th} ฿${p.price_now.toLocaleString()}`,
          '',
          '[Scene 2 — Demo 5–15 วิ]',
          `แสดงการใช้งาน ${p.subcategory} ในสถานการณ์จริง`,
          `"ใช้จริงมาแล้ว — นี่คือสิ่งที่เห็น"`,
          '',
          '[Scene 3 — Social Proof 15–20 วิ]',
          `Rating ${p.rating} ดาว | ${p.review_count.toLocaleString()} รีวิว | sold ${p.sold_count.toLocaleString()} ชิ้น`,
          '',
          '[Scene 4 — CTA 20–25 วิ]',
          `"฿${p.price_now.toLocaleString()} — ลิงก์ใน bio หรือค้นหา ${p.shop_name}"`,
          '',
          `Caption draft: ${p.title_th} ฿${p.price_now.toLocaleString()} 🔗 ลิงก์ใน bio`,
        ].join('\n'),
        risks: [
          'ต้องมี evidence จริงก่อน claim ใดๆ',
          'ห้าม fake personal-use claim',
        ],
        recommendation: 'ส่ง Creative Production สร้าง asset brief และ Canva/CapCut checklist',
      }

    case 'asset_ready':
      return {
        title:   `Creative Brief: ${p.title_th}`,
        summary: 'Canva/CapCut asset checklist พร้อม — thumbnail + overlay + comparison card',
        content: [
          'THUMBNAIL:',
          `  ขนาด: 1080×1920 (9:16 vertical)`,
          `  Text: "฿${p.price_now.toLocaleString()}" (ใหญ่) + ${p.title_th} (สั้น)`,
          `  Badge: -${p.discount_pct}%`,
          '',
          'TEXT OVERLAY:',
          `  Hook line (3–5 คำ ใหญ่)`,
          `  Price badge: ฿${p.price_now.toLocaleString()}`,
          `  Discount badge: -${p.discount_pct}%`,
          '',
          'ASSET CHECKLIST:',
          '  ☐ Thumbnail.png (1080×1920)',
          '  ☐ Hook_text.png',
          '  ☐ Product_comparison.png',
          '  ☐ CTA_card.png',
          '',
          'CapCut cut points: วิที่ 3 (hook) | 10 (demo) | 22 (CTA)',
        ].join('\n'),
        risks: [
          'ห้าม edit ภาพจนดูเกินจริง',
          'ต้องใช้ภาพจากการใช้งานจริงหรือ official product image',
        ],
        recommendation: 'ส่งผู้บริหารอนุมัติก่อน publish — ห้าม bypass Human Approval Gate',
      }

    case 'human_approved':
      return {
        title:   `รอการอนุมัติ: ${p.title_th}`,
        summary: 'คอนเทนต์พร้อม publish — รอ Human Approval Gate',
        content: [
          'COMPLIANCE CHECKLIST:',
          '  ☐ ไม่มีคำ: ดีที่สุด / การันตี / ถูกที่สุด',
          `  ☐ Discount จริง: ฿${p.price_normal.toLocaleString()} → ฿${p.price_now.toLocaleString()} (-${p.discount_pct}%)`,
          '  ☐ ไม่มี fake personal-use claim',
          '  ☐ ไม่มี copied content',
          '  ☐ Evidence-based เท่านั้น',
          `  ☐ claim_risk: ${p.claim_risk} — ${p.claim_risk === 'low' ? '✅ ผ่าน' : '⚠ ต้องตรวจสอบเพิ่ม'}`,
          '',
          '⛔ ระบบล็อก: publish ไม่ได้จนกว่าผู้บริหารอนุมัติ',
        ].join('\n'),
        risks: p.claim_risk !== 'low'
          ? [`claim_risk: ${p.claim_risk} — ต้องตรวจสอบก่อนอนุมัติ`]
          : [],
        recommendation: 'ผู้บริหารตรวจสอบ checklist และกด Approve หรือ Reject',
      }

    case 'published':
      return {
        title:   `โพสต์แล้ว: ${p.title_th}`,
        summary: `คอนเทนต์ publish บน ${mkt} แล้ว — กำลังติดตาม 48 ชม.`,
        content: [
          `Platform : ${mkt}`,
          `Posted   : ${new Date().toLocaleDateString('th-TH')}`,
          `URL      : ${p.product_url}`,
          '',
          `UTM: utm_source=${p.marketplace}&utm_medium=content&utm_campaign=${p.product_id}`,
          '',
          'HASHTAGS:',
          `#${p.category.replace(/\s/g, '')} #${p.marketplace} #รีวิว #ลดราคา #${p.subcategory.replace(/\s/g, '')}`,
          '',
          `PINNED COMMENT: "ลิงก์สั่งซื้อ → ${p.product_url} | ฿${p.price_now.toLocaleString()}"`,
        ].join('\n'),
        risks:          [],
        recommendation: 'ติดตาม Views/CTR/Conversion ใน 48 ชม. แล้วรายงานผลให้ Offer Analyst',
      }

    case 'analyzed':
      return {
        title:   `วิเคราะห์ผล: ${p.title_th}`,
        summary: 'Performance report 48 ชม. (mock) — Phase 2 จะดึงจาก API จริง',
        content: [
          'MOCK PERFORMANCE (48 ชม.):',
          '  Views      : 12,400',
          '  CTR        : 2.8%',
          '  Clicks     : 347',
          '  Orders     : 12',
          `  Revenue    : ฿${(p.price_now * 12).toLocaleString()}`,
          `  Commission : ฿${(p.est_commission_baht * 12).toLocaleString()}`,
          '  ROAS       : 3.2x (mock)',
          '',
          '⚠ ตัวเลขนี้เป็น mock สำหรับ Phase 1',
          `  Phase 2 จะดึงข้อมูลจาก ${mkt} API จริง`,
        ].join('\n'),
        risks:          ['ตัวเลข performance เป็น mock — ไม่ใช่ข้อมูลจริง'],
        recommendation: 'บันทึกบทเรียนและ update suitability model สำหรับ category นี้',
      }

    case 'learned':
      return {
        title:   `บทเรียน: ${p.title_th}`,
        summary: `อัปเดต knowledge base — ${p.category} / ${mkt}`,
        content: [
          'LEARNINGS:',
          `  Category  : ${p.category} — ${p.suitability_score >= 70 ? 'performance ดี' : 'ต้องปรับ approach'}`,
          `  Hook      : ${p.suitability_score >= 70 ? 'problem-first ได้ผล' : 'ลอง demo-first ครั้งหน้า'}`,
          `  Platform  : ${mkt} — ${p.marketplace === 'tiktok' ? 'conversion rate สูง' : 'stable traffic'}`,
          `  Commission: ${p.commission_rate}% → ${p.est_commission_baht >= 50 ? 'margin เพียงพอ' : 'หาสินค้า commission สูงกว่า'}`,
          '',
          `อัปเดต suitability model: ${p.category} / ${mkt}`,
        ].join('\n'),
        risks:          [],
        recommendation: 'ส่งข้อมูลกลับ Product Research — พร้อมรับสินค้าใหม่ cycle ถัดไป',
      }
  }
}
