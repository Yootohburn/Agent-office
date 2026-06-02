interface Props {
  name:   string
  nameTh: string
  desc:   string
}

export default function ReservedAgentCard({ name, nameTh, desc }: Props) {
  return (
    <div style={{
      background:  '#06090f',
      border:      '1px dashed #1a2540',
      padding:     '10px 12px',
      display:     'flex',
      flexDirection: 'column',
      gap:         6,
      opacity:     0.6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          fontFamily:  'Share Tech Mono, monospace',
          fontSize:    9,
          color:       '#2a3560',
          background:  '#1a2540',
          padding:     '1px 5px',
          letterSpacing: 1,
        }}>
          RESERVED
        </div>
        <div style={{
          fontFamily:  'Share Tech Mono, monospace',
          fontSize:    9,
          color:       '#2a3560',
          letterSpacing: 0.5,
        }}>
          PHASE 2+
        </div>
      </div>

      <div style={{
        width:      36,
        height:     36,
        border:     '1px dashed #1a2540',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'VT323, monospace',
        fontSize:   20,
        color:      '#1a2540',
      }}>
        ○
      </div>

      <div>
        <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 12, color: '#2a3560', fontWeight: 'bold' }}>
          {nameTh}
        </div>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540', marginTop: 2 }}>
          {name}
        </div>
      </div>

      <div style={{ fontFamily: 'Sarabun, sans-serif', fontSize: 11, color: '#1a2540', lineHeight: 1.4 }}>
        {desc}
      </div>

      <div style={{
        fontFamily:  'Share Tech Mono, monospace',
        fontSize:    9,
        color:       '#1a2540',
        letterSpacing: 1,
        marginTop:   2,
      }}>
        NOT ACTIVE YET
      </div>
    </div>
  )
}
