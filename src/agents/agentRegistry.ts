export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'blocked'
  | 'needs_review'
  | 'done'
  | 'failed'

export type DepartmentId =
  | 'ceo-director'
  | 'product-analyst'
  | 'content-studio'
  | 'social-community-manager'
  | 'ops-review'
  | 'finance-controller'

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
    id: 'ceo-director',
    codeName: 'ceo_agent',
    thaiName: 'CEO / ผู้อำนวยการแคมเปญ',
    title: 'Chief Executive Officer',
    role: 'Sets strategy, approves campaigns, reviews performance',
    status: 'needs_review',
    currentTask: 'กำลังรีวิว Skincare Travel Pouch — รอการอนุมัติขั้นสุดท้าย',
    currentCampaignId: 'camp-004',
    progress: 90,
    recentOutput: 'อนุมัติแคมเปญ TikTok Earbuds แล้ว ตั้งเป้า: 50K views, CTR 2%, conversion 1.8%',
    decisionNeeded: 'อนุมัติหรือส่งกลับ — Ops แจ้งว่ายังมีปัญหา disclosure ใน Lazada draft',
    risks: ['แคมเปญ Lazada Blender กำไรติดลบ — รอ Finance Controller รายงาน'],
    nextAction: 'รีวิว compliance report แล้วอนุมัติหรือส่งกลับ Content Studio',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>CEO เป็นผู้ตัดสินใจขั้นสุดท้ายสำหรับทุกแคมเปญ ไม่มีแพ็กเกจคอนเทนต์ใดไปถึงขั้นโพสต์ได้โดยไม่ผ่านการอนุมัติจาก CEO</p>
      <h3>เป้าหมายบริษัทประจำสัปดาห์ — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>KPI</th><th>เป้าหมาย</th><th>สัปดาห์นี้</th><th>สถานะ</th></tr>
        <tr><td>รายได้รวม</td><td>฿15,000</td><td>฿11,300</td><td class="amber">~ กำลังดำเนินการ</td></tr>
        <tr><td>กำไรสุทธิ</td><td>฿5,000</td><td>฿3,150</td><td class="amber">~ กำลังดำเนินการ</td></tr>
        <tr><td>ROAS เฉลี่ย</td><td>4.0x</td><td>4.6x</td><td class="green">✓ เกินเป้า</td></tr>
        <tr><td>Conversion rate</td><td>1.5%</td><td>1.8%</td><td class="green">✓ เกินเป้า</td></tr>
        <tr><td>แคมเปญที่อนุมัติ</td><td>4</td><td>2</td><td class="amber">~ รออนุมัติ 2</td></tr>
      </table>
      <h3>อำนาจการตัดสินใจ</h3>
      <ul>
        <li>อนุมัติหรือปฏิเสธทุกแคมเปญ</li>
        <li>หยุดแคมเปญในขั้นตอนใดก็ได้</li>
        <li>ปรับลำดับความสำคัญระหว่าง channel</li>
        <li>กำหนดและปรับเป้า KPI รายสัปดาห์</li>
      </ul>
      <h3>สิ่งที่ CEO ไม่ทำ</h3>
      <ul>
        <li>ไม่เขียนสคริปต์หรือสร้างคอนเทนต์</li>
        <li>ไม่วิจัยสินค้ารายชิ้น</li>
        <li>ไม่ดูแล compliance detail — มอบหมายให้ Ops & Review</li>
      </ul>`,
  },
  {
    id: 'product-analyst',
    codeName: 'product_trend_analyst',
    thaiName: 'นักวิเคราะห์สินค้าและเทรนด์',
    title: 'Head of Product Research',
    role: 'Finds opportunities, scores products, studies trends across all channels',
    status: 'working',
    currentTask: 'วิเคราะห์ Home Office Desk Lamp — ช่อง Shopee',
    currentCampaignId: 'camp-002',
    progress: 45,
    recentOutput: 'TikTok Earbuds X9: คะแนน 84/100, commission 8.5%, เทรนด์ RISING ส่ง brief ไป Content Studio แล้ว',
    decisionNeeded: null,
    risks: ['Desk lamp มีคู่แข่ง affiliate 12 ราย — ต้องหา angle ที่แตกต่าง'],
    nextAction: 'ทำ brief Shopee desk lamp ให้เสร็จ แล้ววิเคราะห์ competitor landscape ของ Lazada blender',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>แผนกข่าวกรอง หาสินค้าที่น่าโปรโมต ให้คะแนนตามเกณฑ์ 5 ข้อ และส่ง brief พร้อม angle ที่ชัดเจนไปยัง Content Studio</p>
      <h3>เกณฑ์ให้คะแนนสินค้า</h3>
      <table>
        <tr><th>เกณฑ์</th><th>น้ำหนัก</th><th>ขั้นต่ำ</th></tr>
        <tr><td>Commission rate</td><td>30%</td><td>3% (Shopee/Lazada) / 5% (TikTok)</td></tr>
        <tr><td>คะแนนรีวิว</td><td>20%</td><td>4.0 ดาว</td></tr>
        <tr><td>จำนวนรีวิว</td><td>15%</td><td>50+ รีวิว</td></tr>
        <tr><td>ช่วงราคา</td><td>20%</td><td>฿150–฿2,500 (impulse buy)</td></tr>
        <tr><td>ความแรงของเทรนด์</td><td>15%</td><td>Rising หรือ Emerging</td></tr>
      </table>
      <h3>คิววิจัยปัจจุบัน — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>สินค้า</th><th>Channel</th><th>คะแนน</th><th>สถานะ</th></tr>
        <tr><td>Wireless Earbuds X9</td><td class="cyan">TikTok</td><td class="green">84/100</td><td class="green">✓ ส่ง brief แล้ว</td></tr>
        <tr><td>Desk Lamp Pro</td><td class="green">Shopee</td><td class="amber">กำลังวิเคราะห์</td><td class="amber">วิเคราะห์อยู่</td></tr>
        <tr><td>Portable Blender</td><td>Lazada</td><td class="green">71/100</td><td class="green">✓ ส่ง brief แล้ว</td></tr>
        <tr><td>Skincare Travel Pouch</td><td class="cyan">TikTok</td><td class="green">77/100</td><td class="green">✓ ส่ง brief แล้ว</td></tr>
      </table>
      <h3>สิ่งที่ไม่ทำ</h3>
      <ul>
        <li>ไม่เรียก API จริงใน Phase 1</li>
        <li>ไม่เขียนสคริปต์หรือสร้างคอนเทนต์</li>
        <li>ไม่อนุมัติแคมเปญ — ส่ง brief ให้ CEO ตัดสินใจลำดับความสำคัญ</li>
      </ul>`,
  },
  {
    id: 'content-studio',
    codeName: 'content_studio_agent',
    thaiName: 'ทีมผลิตคอนเทนต์',
    title: 'Creative Director & Content Producer',
    role: 'Creates hooks, scripts, captions, thumbnails, UGC briefs',
    status: 'working',
    currentTask: 'เขียนสคริปต์ TikTok POV สำหรับ Wireless Earbuds X9 — beat 4 จาก 5',
    currentCampaignId: 'camp-001',
    progress: 70,
    recentOutput: 'Hook: "POV: เพิ่งรู้ว่าหูฟัง ฿2,000 โดนหลอก" — สคริปต์ 28 วิ, 4 beats เสร็จแล้ว',
    decisionNeeded: null,
    risks: [],
    nextAction: 'ทำ CTA beat ให้เสร็จ เขียน caption + hashtag ส่งแพ็กเกจทั้งหมดให้ Ops & Review',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>เครื่องยนต์สร้างสรรค์ของบริษัท รับ brief จาก Product Analyst แล้วผลิตแพ็กเกจคอนเทนต์ครบชุด — สคริปต์, hook, caption, thumbnail brief, และ UGC brief</p>
      <h3>กฎ 3 วินาที</h3>
      <p>ทุกคอนเทนต์ต้องเริ่มด้วยกฎนี้: <strong>3 วินาทีแรกตัดสินทุกอย่าง</strong> ถ้า hook ล้มเหลว algorithm จะหยุดส่ง video</p>
      <h3>ประเภทคอนเทนต์ที่ผลิต</h3>
      <table>
        <tr><th>รูปแบบ</th><th>Channel</th><th>ความยาว</th></tr>
        <tr><td>POV / Talking head</td><td class="cyan">TikTok</td><td>15–60 วิ</td></tr>
        <tr><td>Product demo</td><td>ทุก channel</td><td>30–60 วิ</td></tr>
        <tr><td>Unboxing</td><td class="cyan">TikTok / Reels</td><td>30–90 วิ</td></tr>
        <tr><td>Caption + hashtag</td><td>ทุก channel</td><td>—</td></tr>
        <tr><td>UGC creator brief</td><td class="cyan">TikTok</td><td>—</td></tr>
      </table>
      <h3>สคริปต์ที่กำลังทำ — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>วินาที</th><th>Beat</th><th>บทพูด</th></tr>
        <tr><td class="cyan">0–3s</td><td>Hook</td><td>"POV: เพิ่งรู้ว่าหูฟัง ฿2,000 โดนหลอก"</td></tr>
        <tr><td>3–8s</td><td>Problem</td><td>"เทสหูฟัง 9 รุ่นใน 3 เดือน แล้วตัว ฿280 นี้..."</td></tr>
        <tr><td>8–18s</td><td>Demo</td><td>[แสดง noise cancel, แบต, การใส่ — visual beats]</td></tr>
        <tr><td>18–25s</td><td>Proof</td><td>"4.9 ดาว 2,300 รีวิวใน TikTok Shop"</td></tr>
        <tr><td class="amber">25–28s</td><td>CTA</td><td>"ลิงก์ใน bio — ใช้โค้ดลด 5% เพิ่ม"</td></tr>
      </table>
      <h3>สิ่งที่ไม่ทำ</h3>
      <ul>
        <li>ไม่วิจัยสินค้า — ใช้ brief จาก Product Analyst</li>
        <li>ไม่อนุมัติคอนเทนต์ — ส่งให้ Ops & Review แล้วค่อยไป CEO</li>
        <li>ไม่ทำ claim สุขภาพหรือการเงินที่ไม่มีหลักฐาน</li>
      </ul>`,
  },
  {
    id: 'social-community-manager',
    codeName: 'social_studio_agent',
    thaiName: 'ทีมโซเชียลมีเดีย',
    title: 'Social Media & Community Manager',
    role: 'Adapts TikTok content for Facebook/IG, manages community replies',
    status: 'working',
    currentTask: 'ดัดแปลงสคริปต์ TikTok Earbuds เป็นโพสต์ Facebook review 3 แบบ',
    currentCampaignId: 'camp-001',
    progress: 60,
    recentOutput: 'Facebook review post สำหรับ Earbuds เสร็จ 3 แบบ — รอ approval จาก Ops',
    decisionNeeded: null,
    risks: ['TikTok content บางชิ้นต้องปรับ tone สำหรับ Facebook — audience ต่างกัน'],
    nextAction: 'ส่ง Facebook draft ให้ Ops ตรวจ แล้วทำ IG carousel สำหรับ Skincare',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>ดัดแปลง TikTok content ให้เหมาะกับ Facebook, Instagram และ LINE OA เขียนโพสต์ review ตอบ comment และบริหาร community engagement</p>
      <h3>Platform ที่ดูแล</h3>
      <table>
        <tr><th>Platform</th><th>รูปแบบ</th><th>Tone</th></tr>
        <tr><td>Facebook</td><td>โพสต์ review, แชร์</td><td>เป็นกันเอง</td></tr>
        <tr><td>Instagram</td><td>Carousel, Story</td><td>สวยงาม aesthetic</td></tr>
        <tr><td>LINE OA</td><td>Rich message, broadcast</td><td>สั้น กระชับ</td></tr>
      </table>
      <h3>งานปัจจุบัน — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>แคมเปญ</th><th>Platform</th><th>สถานะ</th></tr>
        <tr><td>Earbuds X9</td><td>Facebook</td><td class="amber">กำลังทำ 3 แบบ</td></tr>
        <tr><td>Skincare Pouch</td><td class="cyan">Instagram</td><td class="amber">รอ approve</td></tr>
        <tr><td>Desk Lamp</td><td>LINE OA</td><td>รออยู่ในคิว</td></tr>
      </table>
      <h3>สิ่งที่ไม่ทำ</h3>
      <ul>
        <li>ไม่โพสต์อัตโนมัติใน Phase 1</li>
        <li>ไม่เพิ่ม claim ที่ไม่มีใน TikTok script เดิม</li>
        <li>ไม่จัดการ TikTok โดยตรง — ดูแลแค่ Facebook/IG/LINE</li>
      </ul>`,
  },
  {
    id: 'ops-review',
    codeName: 'ops_review_agent',
    thaiName: 'ทีมตรวจสอบและปฏิบัติการ',
    title: 'Operations Manager & Compliance Officer',
    role: 'Compliance, queue management, packaging, performance tracking',
    status: 'working',
    currentTask: 'ตรวจสอบ compliance ของ Lazada Portable Blender content package',
    currentCampaignId: 'camp-003',
    progress: 75,
    recentOutput: 'Shopee Desk Lamp: คิวอันดับ 2. TikTok Earbuds: ผ่าน compliance พร้อมส่ง CEO',
    decisionNeeded: null,
    risks: ['Lazada Blender: พบ claim "ช่วยเพิ่ม metabolism" ที่ไม่มีหลักฐาน — ส่งกลับ Content Studio'],
    nextAction: 'ส่ง flag ไป Content Studio แล้วเตรียม export package Skincare',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>กระดูกสันหลังของการดำเนินงาน ทุกแพ็กเกจคอนเทนต์ต้องผ่าน Ops & Review ก่อนที่ CEO จะเห็น</p>
      <h3>Compliance checklist (ตรวจทุกแพ็กเกจ)</h3>
      <table>
        <tr><th>การตรวจสอบ</th><th>ถ้าไม่ผ่าน</th></tr>
        <tr><td>Affiliate disclosure (#ad / #sponsored)</td><td class="red">Block — ส่งกลับ Content Studio</td></tr>
        <tr><td>Health / medical claims</td><td class="red">Block — ส่งกลับ Content Studio</td></tr>
        <tr><td>Income / financial guarantees</td><td class="red">Block — ส่งกลับ Content Studio</td></tr>
        <tr><td>ราคาตรงกับหน้าสินค้า</td><td class="red">Block — ตรวจสอบราคา</td></tr>
        <tr><td>คำต้องห้ามตาม platform</td><td class="amber">Flag — แจ้ง CEO ตัดสินใจ</td></tr>
        <tr><td>ความยาว caption</td><td class="amber">Flag — แนะนำตัด</td></tr>
      </table>
      <h3>สถานะคิวปัจจุบัน — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>แคมเปญ</th><th>Channel</th><th>สถานะ</th></tr>
        <tr><td>TikTok Earbuds</td><td class="cyan">TikTok</td><td class="green">✓ ผ่าน — รอ CEO</td></tr>
        <tr><td>Lazada Blender</td><td>Lazada</td><td class="red">⚠ Flagged — health claim</td></tr>
        <tr><td>Skincare Pouch</td><td class="cyan">TikTok</td><td class="amber">เตรียม export</td></tr>
        <tr><td>Desk Lamp</td><td class="green">Shopee</td><td>คิวอันดับ 2</td></tr>
      </table>
      <h3>สิ่งที่ไม่ทำ</h3>
      <ul>
        <li>ไม่เขียนหรือแก้คอนเทนต์ — ส่งกลับ Content Studio</li>
        <li>ไม่อนุมัติแคมเปญ — ส่งให้ CEO</li>
        <li>ไม่โพสต์อัตโนมัติใน Phase 1</li>
      </ul>`,
  },
  {
    id: 'finance-controller',
    codeName: 'finance_ads_controller',
    thaiName: 'ฝ่ายการเงินและงบโฆษณา',
    title: 'Finance & Ads Controller',
    role: 'Tracks revenue, commission, ad spend, profit, ROAS by channel',
    status: 'working',
    currentTask: 'วิเคราะห์ผล Lazada Blender — ROAS 2.0x ต่ำกว่าเป้า กำไรติดลบ',
    currentCampaignId: 'camp-003',
    progress: 60,
    recentOutput: 'รายได้รวมบริษัท: ฿11,300 | กำไรสุทธิ: ฿3,150 | ROAS เฉลี่ย: 4.6x | ค่าโฆษณา: ฿2,450',
    decisionNeeded: 'Lazada Blender: กำไรติดลบ ฿120 — ควรหยุดยิงแอดหรือแก้ creative ก่อน',
    risks: [
      'Lazada Blender: ROAS 2.0x — ต่ำกว่าเป้า 4.0x',
      'ค่าโฆษณา Lazada สูงกว่ากำไร — ขาดทุน ฿120',
    ],
    nextAction: 'รายงาน CEO: หยุดยิงแอด Lazada Blender และเพิ่มงบ TikTok Skincare (ROAS 7.2x)',
    detailHtml: `
      <h3>บทบาทในบริษัท</h3>
      <p>ติดตามเงินเข้า-ออกทุกช่องทาง คำนวณกำไรสุทธิ ROAS และ commission ต่อแคมเปญ แนะนำว่าควรเพิ่มงบหรือหยุดแคมเปญไหน</p>
      <h3>สรุปการเงินบริษัท — ข้อมูลจำลอง</h3>
      <table>
        <tr><th>รายการ</th><th>จำนวน</th></tr>
        <tr><td>รายได้รวม</td><td class="green">฿11,300</td></tr>
        <tr><td>ค่าคอมมิชชั่นรวม</td><td class="green">฿948</td></tr>
        <tr><td>ค่าโฆษณารวม</td><td class="amber">฿2,450</td></tr>
        <tr><td>ต้นทุนคอนเทนต์</td><td class="amber">฿700</td></tr>
        <tr><td>กำไรสุทธิ</td><td class="green">฿3,150</td></tr>
        <tr><td>ROAS เฉลี่ย</td><td class="green">4.6x</td></tr>
        <tr><td>ยอดรอรับเงิน</td><td class="amber">฿948</td></tr>
      </table>
      <h3>ประสิทธิภาพแต่ละ channel</h3>
      <table>
        <tr><th>Channel</th><th>รายได้</th><th>กำไร</th><th>ROAS</th><th>สถานะ</th></tr>
        <tr><td class="cyan">TikTok</td><td>฿7,800</td><td class="green">฿2,650</td><td class="green">5.6x</td><td class="green">✓ ดีมาก</td></tr>
        <tr><td class="green">Shopee</td><td>฿2,100</td><td class="green">฿620</td><td class="green">6.0x</td><td class="green">✓ ดี</td></tr>
        <tr><td>Lazada</td><td>฿1,400</td><td class="red">-฿120</td><td class="red">2.0x</td><td class="red">⚠ ขาดทุน</td></tr>
      </table>
      <h3>คำแนะนำ</h3>
      <ul>
        <li><span class="tag red">หยุด</span> Lazada Blender — ขาดทุน ฿120 ค่าโฆษณาสูงเกินไป</li>
        <li><span class="tag green">เพิ่มงบ</span> TikTok Skincare — ROAS 7.2x ทำกำไรได้ดี</li>
        <li><span class="tag green">เพิ่มงบ</span> Shopee Desk Lamp — ROAS 6.0x เสถียร</li>
      </ul>
      <h3>สิ่งที่ไม่ทำ</h3>
      <ul>
        <li>ไม่เชื่อมต่อ ad account จริงใน Phase 1</li>
        <li>ไม่โอนเงินหรือปรับงบโดยตรง — รายงาน CEO เพื่อตัดสินใจ</li>
        <li>ไม่วิเคราะห์ข้อมูลน้อยกว่า 3 วัน</li>
      </ul>`,
  },
]

export function getAgentById(id: DepartmentId): Agent | undefined {
  return agents.find(a => a.id === id)
}
