export interface ContentFramework {
  id: string
  label: string
  hook_pattern: string
  good_for: string[]
  avoid: string[]
}

export const FRAMEWORKS: ContentFramework[] = [
  {
    id: 'daily_problem',
    label: 'ปัญหาจุกจิกทุกวัน',
    hook_pattern: 'คุณเคยเจอปัญหา [X] ไหม? นี่คือสิ่งที่แก้ได้',
    good_for: ['จัดระเบียบบ้าน', 'ทำความสะอาด'],
    avoid: ['อ้างว่าแก้ปัญหาสุขภาพ', 'การันตีผล'],
  },
  {
    id: 'before_after',
    label: 'ก่อนใช้ / หลังใช้',
    hook_pattern: 'ก่อนหน้านี้ [สภาพเดิม] — หลังใช้ [ผลที่เห็น]',
    good_for: ['ทำความสะอาด', 'จัดระเบียบบ้าน', 'อุปกรณ์โต๊ะทำงาน'],
    avoid: ['ผลก่อน/หลังที่เกินจริง', 'claim ทางการแพทย์'],
  },
  {
    id: 'worth_it',
    label: 'คุ้มไหมในงบนี้',
    hook_pattern: '[ราคา] บาท คุ้มจริงไหม? มาดูกัน',
    good_for: ['อุปกรณ์ชาร์จ', 'อุปกรณ์โต๊ะทำงาน', 'แผ่นรองเมาส์'],
    avoid: ['เปรียบราคาปลอม', 'ส่วนลดที่ไม่มีอยู่จริง'],
  },
  {
    id: 'must_have',
    label: 'ของมันต้องมี',
    hook_pattern: 'ถ้าคุณมี [สถานการณ์] อันนี้ต้องมีเลย',
    good_for: ['อุปกรณ์ชาร์จ', 'อุปกรณ์โทรศัพท์'],
    avoid: ['ทุกคนต้องมี (overgeneralizing)', 'claim แบบ absolute'],
  },
  {
    id: 'personal_use',
    label: 'ซื้อเองใช้เอง',
    hook_pattern: 'ซื้อมาใช้เองจริง ๆ นี่คือสิ่งที่เจอ',
    good_for: ['ทุกหมวด'],
    avoid: ['อ้างว่าซื้อเองแต่ไม่ได้ใช้', 'fake testimonial'],
  },
  {
    id: 'comparison',
    label: 'เทียบสองตัว',
    hook_pattern: 'เทียบ [A] กับ [B] ต่างกันอย่างไร?',
    good_for: ['อุปกรณ์ชาร์จ', 'อุปกรณ์โต๊ะทำงาน'],
    avoid: ['เทียบไม่ยุติธรรม', 'ทับแบรนด์คู่แข่งโดยตรง'],
  },
  {
    id: 'quick_test',
    label: 'ทดสอบเร็ว',
    hook_pattern: 'ทดสอบใน [X] วิ — [ผลลัพธ์]',
    good_for: ['ทำความสะอาด', 'อุปกรณ์ชาร์จ'],
    avoid: ['ผลการทดสอบที่ไม่ตรงความเป็นจริง'],
  },
  {
    id: 'cheap_but_good',
    label: 'ของถูกแต่ดี',
    hook_pattern: 'ราคา [X] บาท แต่ทำได้แบบนี้',
    good_for: ['อุปกรณ์ราคาประหยัด', 'แผ่นรองเมาส์', 'กล่องจัดระเบียบ'],
    avoid: ['ถูกที่สุดในโลก (superlative)', 'เปรียบกับ premium brand โดยตรง'],
  },
  {
    id: 'small_room',
    label: 'ห้องเล็กต้องมี',
    hook_pattern: 'ห้องเล็ก condo แบบนี้ต้องใช้ [สินค้า]',
    good_for: ['จัดระเบียบบ้าน', 'ของตกแต่งคอนโด'],
    avoid: ['claim ว่าเพิ่มพื้นที่จริง ๆ'],
  },
  {
    id: 'objection_qa',
    label: 'ถาม-ตอบ objection',
    hook_pattern: 'คนถามว่า [X] — คำตอบคือ [Y]',
    good_for: ['ทุกหมวด'],
    avoid: ['ตอบโดยสร้าง false urgency'],
  },
]

export const CONTENT_RULES = {
  sell_from: [
    'show demo',
    'show before/after',
    'show real use case',
    'answer objection',
    'explain limitations honestly',
  ],
  avoid: [
    'ดีที่สุด',
    'การันตี',
    'หายแน่นอน',
    'ถูกที่สุด',
    'fake discount',
    'fake personal-use claim',
    'copied content',
    'repeated low-quality AI spam',
  ],
} as const
