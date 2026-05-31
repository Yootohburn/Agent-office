interface TeamMessage {
  id: string
  time: string
  sender: string
  accent: string
  text: string
}

const TEAM_MESSAGES: TeamMessage[] = [
  { id: '1', time: '09:02', sender: 'Product', accent: '#00e5ff', text: 'Earbuds X9 วิเคราะห์เสร็จแล้ว คะแนน 84/100 ส่ง brief ให้ Content ได้เลย' },
  { id: '2', time: '09:04', sender: 'Content', accent: '#ff9800', text: 'รับ brief แล้วครับ เริ่ม hook ทันที POV format ใช่ไหม?' },
  { id: '3', time: '09:05', sender: 'Product', accent: '#00e5ff', text: 'ใช่ครับ POV unboxing target Gen Z 18-25' },
  { id: '4', time: '09:08', sender: 'Ops', accent: '#ffb300', text: '⚠️ Blender flagged: health claim บรรทัด 3 ส่งกลับ Content แล้วนะครับ' },
  { id: '5', time: '09:10', sender: 'Content', accent: '#ff9800', text: 'รับทราบ จะเปลี่ยน angle เป็น lifestyle ไม่ใช่ health' },
  { id: '6', time: '09:12', sender: 'Ops', accent: '#ffb300', text: '✅ Earbuds ผ่าน compliance ครบ รอ CEO approve ได้เลย' },
  { id: '7', time: '09:13', sender: 'Finance', accent: '#00c8a0', text: 'Lazada ขาดทุน -฿120 แนะนำหยุด ad ก่อน รายงาน CEO แล้ว' },
  { id: '8', time: '09:14', sender: 'CEO', accent: '#00ff9f', text: 'รับทราบ Skincare Pouch กำลัง review อยู่ มีปัญหา disclosure นิดหน่อย' },
  { id: '9', time: '09:16', sender: 'Social', accent: '#ff4081', text: 'Facebook draft Earbuds 3 แบบพร้อมแล้ว จะส่ง Ops ตรวจ' },
  { id: '10', time: '09:17', sender: 'Social', accent: '#ff4081', text: 'IG carousel Skincare 5 slides เสร็จ รอ approve นะครับ ✨' },
]

export default function TeamChatPanel() {
  return (
    <div style={{ background: '#080c18', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '6px 12px 5px', borderBottom: '1px solid #1a2540', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#2a3560', letterSpacing: 2 }}>
          ▶ TEAM CHAT
        </div>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540' }}>
          mock — 6 agents online
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {TEAM_MESSAGES.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540', flexShrink: 0, marginTop: 1 }}>
              {msg.time}
            </span>
            <span style={{
              fontFamily: 'VT323, monospace', fontSize: 12, color: msg.accent,
              background: `${msg.accent}12`, padding: '0px 5px',
              flexShrink: 0, letterSpacing: 0.5, whiteSpace: 'nowrap',
            }}>
              {msg.sender}
            </span>
            <span style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#8892b0', lineHeight: 1.4 }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
