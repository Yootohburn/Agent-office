export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'needs_review'
  | 'done'
  | 'failed'

export type DepartmentId =
  | 'product-research'
  | 'offer-analyst'
  | 'content-strategy'
  | 'script-writer'
  | 'creative-production'
  | 'social-performance'

export interface Agent {
  id: DepartmentId
  /** English code name — used in code/routing */
  codeName: string
  /** Thai display name — shown in UI */
  thaiName: string
  /** English subtitle — shown in UI below Thai name */
  title: string
  role: string
  status: AgentStatus
  currentTask: string
  currentCampaignId: string | null
  progress: number
  recentOutput: string
  decisionNeeded: string | null
  risks: string[]
  nextAction: string
  detailHtml: string
}

export const agents: Agent[] = [
  {
    id: 'product-research',
    codeName: 'product_research_agent',
    thaiName: 'ฝ่ายวิจัยสินค้า',
    title: 'Head of Product Research',
    role: 'Finds, collects and normalises product opportunities from Shopee, Lazada, TikTok',
    status: 'working',
    currentTask: 'ตรวจสอบข้อมูล shop rating และ review count กล่องจัดระเบียบ 6-in-1',
    currentCampaignId: 'prod-001',
    progress: 72,
    recentOutput: 'prod-003 ที่ชาร์จ 3-in-1: suitability_score 91/100 ROAS 6.1x — ส่ง report ให้ Social Performance แล้ว',
    decisionNeeded: null,
    risks: ['review count prod-002 อยู่ที่ 187 ใกล้เกณฑ์ขั้นต่ำ 200 — ต้องตรวจสอบ recency'],
    nextAction: 'ส่ง product card ให้ Offer Analyst ประเมินกำไร',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>รวบรวมและคัดกรองสินค้าที่มีโอกาสสร้างรายได้ ตรวจสอบข้อมูล shop, rating, sold_count, review_count และ category fit ก่อนส่งต่อให้ Offer Analyst ให้คะแนน</p>
      <h3>เกณฑ์คัดกรองสินค้า</h3>
      <table>
        <tr><th>เกณฑ์</th><th>ขั้นต่ำ</th></tr>
        <tr><td>Rating</td><td>4.3 ดาวขึ้นไป</td></tr>
        <tr><td>Review count</td><td>100+ รีวิว</td></tr>
        <tr><td>Sold count</td><td>500+ ชิ้น</td></tr>
        <tr><td>ราคา</td><td>฿150–฿2,000 (impulse buy range)</td></tr>
        <tr><td>Category fit</td><td>ต้องอยู่ใน approved categories</td></tr>
      </table>
      <h3>สินค้าในคิววิจัย</h3>
      <table>
        <tr><th>สินค้า</th><th>Channel</th><th>สถานะ</th></tr>
        <tr><td>กล่องจัดระเบียบ 6-in-1</td><td class="green">Shopee</td><td class="amber">กำลังตรวจสอบ</td></tr>
        <tr><td>Spin Mop พร้อมถัง</td><td>Lazada</td><td class="green">✓ ส่ง Offer Analyst แล้ว</td></tr>
        <tr><td>ที่ชาร์จ 3-in-1</td><td class="cyan">TikTok</td><td class="green">✓ วิเคราะห์ครบ</td></tr>
        <tr><td>แผ่นรองเมาส์ RGB XXL</td><td class="green">Shopee</td><td class="green">✓ ส่งแล้ว</td></tr>
      </table>`,
  },
  {
    id: 'offer-analyst',
    codeName: 'offer_analyst_agent',
    thaiName: 'ฝ่ายวิเคราะห์กำไรและข้อเสนอ',
    title: 'Offer Analyst & Profit Evaluator',
    role: 'Scores commission potential, profit margin, and return/refund risk',
    status: 'working',
    currentTask: 'คำนวณ est_commission และ profit margin Spin Mop',
    currentCampaignId: 'prod-002',
    progress: 45,
    recentOutput: 'prod-001 กล่องจัดระเบียบ: suitability_score 88/100 ROAS est 5.2x — ส่ง brief ให้ Content Strategy',
    decisionNeeded: null,
    risks: ['prod-002 ROAS 3.8x ต่ำกว่าเป้า 5.0x — ต้องประเมินว่าคุ้มค่าโปรโมทไหม'],
    nextAction: 'ให้คะแนน suitability_score และส่ง brief',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>รับ product card จาก Product Research แล้วให้คะแนน 7 มิติ รวมเป็น final_score ตัดสินว่าสินค้าคุ้มค่าโปรโมทหรือไม่ และส่ง brief พร้อม angle ให้ Content Strategy</p>
      <h3>เกณฑ์ให้คะแนน (7 มิติ)</h3>
      <table>
        <tr><th>มิติ</th><th>คะแนน max</th></tr>
        <tr><td>demo_score — โชว์ได้ดีแค่ไหน</td><td>10</td></tr>
        <tr><td>price_score — ราคาดึงดูดแค่ไหน</td><td>10</td></tr>
        <tr><td>commission_score — commission rate</td><td>10</td></tr>
        <tr><td>impulse_score — ซื้อแบบ impulse ได้ไหม</td><td>10</td></tr>
        <tr><td>risk_score — ความเสี่ยง (น้อย = ดี)</td><td>10 (ยิ่งต่ำยิ่งดี)</td></tr>
        <tr><td>content_angle_score — หา angle ได้ง่ายแค่ไหน</td><td>10</td></tr>
        <tr><td>platform_fit_score — fit กับ platform ไหม</td><td>10</td></tr>
      </table>`,
  },
  {
    id: 'content-strategy',
    codeName: 'content_strategy_agent',
    thaiName: 'ฝ่ายกลยุทธ์คอนเทนต์',
    title: 'Content Strategy Director',
    role: 'Selects audience, angle, hook framework, platform mix and CTA',
    status: 'working',
    currentTask: 'เลือก hook framework: ปัญหาจุกจิกทุกวัน สำหรับกล่อง 6-in-1',
    currentCampaignId: 'prod-001',
    progress: 60,
    recentOutput: 'prod-004 แผ่นรองเมาส์: เลือก framework "worth_it" — hook "฿189 บาท คุ้มจริงไหม?" ส่ง Script Writer แล้ว',
    decisionNeeded: null,
    risks: [],
    nextAction: 'ส่ง brief ให้ Script Writer',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>รับ brief จาก Offer Analyst แล้วเลือก hook framework, กลุ่มเป้าหมาย, platform mix, tone และ CTA ที่เหมาะสม ส่ง brief ครบชุดให้ Script Writer</p>
      <h3>Framework ที่ใช้บ่อย</h3>
      <table>
        <tr><th>Framework</th><th>เหมาะกับ</th></tr>
        <tr><td>daily_problem</td><td>จัดระเบียบ, ทำความสะอาด</td></tr>
        <tr><td>before_after</td><td>ทำความสะอาด, จัดระเบียบ</td></tr>
        <tr><td>worth_it</td><td>อุปกรณ์ชาร์จ, แผ่นรองเมาส์</td></tr>
        <tr><td>cheap_but_good</td><td>ของราคาประหยัด</td></tr>
        <tr><td>small_room</td><td>ของตกแต่งคอนโด</td></tr>
      </table>`,
  },
  {
    id: 'script-writer',
    codeName: 'script_writer_agent',
    thaiName: 'ฝ่ายสคริปต์และสตอรี่บอร์ด',
    title: 'Script Writer & Storyboard Artist',
    role: 'Creates 20–30 second Thai video scripts with scene-by-scene storyboard',
    status: 'needs_review',
    currentTask: 'เขียน script 25 วิ TikTok พร้อม storyboard แผ่นรองเมาส์ RGB',
    currentCampaignId: 'prod-004',
    progress: 85,
    recentOutput: 'script prod-004: Hook "฿189 บาท vs โต๊ะรกแบบนี้" — 5 scenes พร้อม on-screen text ครบ',
    decisionNeeded: 'hook บรรทัดแรกต้อง demo-first หรือ problem-first?',
    risks: ['script ยาว 27 วิ ถ้าเพิ่ม CTA อาจเกิน 30 วิ — ต้องตัดฉาก 3 ให้สั้นลง'],
    nextAction: 'รอ review script ก่อนส่ง Creative Production',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>รับ brief จาก Content Strategy แล้วเขียน script ภาษาไทย 20–30 วิ พร้อม storyboard scene ต่อ scene, on-screen text, caption draft และ shot list ห้าม overclaim หรือ hallucinate spec</p>
      <h3>โครงสร้าง script มาตรฐาน</h3>
      <table>
        <tr><th>วินาที</th><th>Beat</th><th>เนื้อหา</th></tr>
        <tr><td class="cyan">0–3s</td><td>Hook</td><td>ดึงดูดความสนใจทันที</td></tr>
        <tr><td>3–8s</td><td>Problem/Setup</td><td>สร้าง context หรือปัญหา</td></tr>
        <tr><td>8–20s</td><td>Demo</td><td>แสดงสินค้าจริง</td></tr>
        <tr><td>20–25s</td><td>Proof</td><td>rating/review/social proof</td></tr>
        <tr><td class="amber">25–30s</td><td>CTA</td><td>ลิงก์ + โค้ดส่วนลด</td></tr>
      </table>`,
  },
  {
    id: 'creative-production',
    codeName: 'creative_production_agent',
    thaiName: 'ฝ่ายผลิตชิ้นงาน',
    title: 'Creative Production Lead',
    role: 'Prepares Canva/CapCut-ready creative briefs, thumbnails, asset checklists',
    status: 'idle',
    currentTask: 'รอรับงานจาก Script Writer',
    currentCampaignId: null,
    progress: 0,
    recentOutput: 'prod-003 ที่ชาร์จ 3-in-1: Canva brief ครบชุด thumbnail + comparison card + caption overlay ส่ง Social Performance แล้ว',
    decisionNeeded: null,
    risks: [],
    nextAction: 'เตรียม Canva brief template สำหรับสินค้าหมวด desk accessories',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>รับ script + storyboard จาก Script Writer แล้วสร้าง creative brief ครบชุดสำหรับ Canva/CapCut: thumbnail layout, image/video asset structure, comparison card, on-screen text overlay และ edit-ready checklist</p>
      <h3>ชิ้นงานที่ผลิต</h3>
      <table>
        <tr><th>ชิ้นงาน</th><th>รายละเอียด</th></tr>
        <tr><td>Canva brief</td><td>Layout สำเร็จรูปสำหรับ thumbnail และ comparison card</td></tr>
        <tr><td>CapCut checklist</td><td>Shot list + transition + on-screen text</td></tr>
        <tr><td>Asset list</td><td>ภาพสินค้า, lifestyle shot, รีวิว screenshot</td></tr>
        <tr><td>Caption overlay</td><td>ข้อความ on-screen สำหรับแต่ละ scene</td></tr>
      </table>`,
  },
  {
    id: 'social-performance',
    codeName: 'social_performance_agent',
    thaiName: 'ฝ่ายโซเชียลและวิเคราะห์ผล',
    title: 'Social Media & Performance Analyst',
    role: 'Manages posting, hashtag sets, UTM tracking, and performance feedback loop',
    status: 'done',
    currentTask: 'วิเคราะห์ผล TikTok post ที่ชาร์จ 3-in-1 ครบ 48 ชั่วโมงแล้ว',
    currentCampaignId: 'prod-003',
    progress: 100,
    recentOutput: 'prod-003: Views 58,400 | CTR 3.2% | ROAS 6.1x | Conversion 4.8% — แนะนำเพิ่มงบ 50%',
    decisionNeeded: null,
    risks: [],
    nextAction: 'ส่ง performance report ให้ Product Research เพื่อ learning loop',
    detailHtml: `
      <h3>บทบาท</h3>
      <p>เตรียม post versions สำหรับแต่ละ platform จัดการ hashtag set, pinned comment text, UTM links ติดตาม performance หลังโพสต์ แล้วส่ง learning กลับ Product Research</p>
      <h3>ตัวชี้วัดที่ติดตาม</h3>
      <table>
        <tr><th>KPI</th><th>เป้า</th></tr>
        <tr><td>Views (TikTok 48h)</td><td>30,000+</td></tr>
        <tr><td>CTR</td><td>2.0%+</td></tr>
        <tr><td>Conversion rate</td><td>2.0%+</td></tr>
        <tr><td>ROAS</td><td>5.0x+</td></tr>
        <tr><td>Cost per order</td><td>< ฿150</td></tr>
      </table>`,
  },
]

export function getAgentById(id: DepartmentId): Agent | undefined {
  return agents.find(a => a.id === id)
}
