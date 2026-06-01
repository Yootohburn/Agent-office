import type { AgentStatus } from '../../agents/agentRegistry'

interface Props {
  status: AgentStatus
  accent: string
}

const BADGE_STYLE: React.CSSProperties = {
  position:       'absolute',
  bottom:         10,
  left:           '50%',
  transform:      'translateX(-50%)',
  padding:        '2px 10px',
  display:        'flex',
  alignItems:     'center',
  gap:            5,
  whiteSpace:     'nowrap',
  pointerEvents:  'none',
}

const ICON_STYLE: React.CSSProperties = {
  fontFamily: 'VT323, monospace',
  fontSize:   14,
  lineHeight: 1,
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Sarabun, sans-serif',
  fontSize:   11,
}

export default function StatusOverlay({ status, accent }: Props) {

  if (status === 'working') {
    return (
      <div style={{
        position:      'absolute',
        bottom:        12,
        left:          10,
        display:       'flex',
        alignItems:    'center',
        gap:           4,
        pointerEvents: 'none',
      }}>
        <div style={{
          width:      6,
          height:     6,
          background: accent,
          animation:  'blink 1.5s ease-in-out infinite',
          flexShrink: 0,
        }}/>
        <span style={{
          fontFamily:  'Sarabun, sans-serif',
          fontSize:    10,
          color:       `${accent}99`,
          letterSpacing: 0.3,
        }}>กำลังทำงาน…</span>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div style={{
        ...BADGE_STYLE,
        background: '#00ff9f1a',
        border:     '1px solid #00ff9f44',
      }}>
        <span style={{ ...ICON_STYLE, color: '#00ff9f' }}>✓</span>
        <span style={{ ...LABEL_STYLE, color: '#00ff9fbb' }}>เสร็จแล้ว</span>
      </div>
    )
  }

  if (status === 'needs_review') {
    return (
      <div style={{
        ...BADGE_STYLE,
        background: '#ffb3001a',
        border:     '1px solid #ffb30044',
      }}>
        <span style={{ ...ICON_STYLE, color: '#ffb300' }}>⚠</span>
        <span style={{ ...LABEL_STYLE, color: '#ffb300bb' }}>รอตรวจ</span>
      </div>
    )
  }

  if (status === 'blocked' || status === 'failed') {
    return (
      <>
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    '#ff52520a',
          pointerEvents: 'none',
        }}/>
        <div style={{
          ...BADGE_STYLE,
          background: '#ff52521a',
          border:     '1px solid #ff525244',
        }}>
          <span style={{ ...ICON_STYLE, color: '#ff5252' }}>⛔</span>
          <span style={{ ...LABEL_STYLE, color: '#ff5252bb' }}>
            {status === 'failed' ? 'ล้มเหลว' : 'ติดปัญหา'}
          </span>
        </div>
      </>
    )
  }

  if (status === 'idle') {
    return (
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    '#00000028',
        display:       'flex',
        alignItems:    'flex-end',
        justifyContent: 'center',
        paddingBottom: 14,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily:    'Sarabun, sans-serif',
          fontSize:      10,
          color:         '#4a568077',
          letterSpacing: 1,
        }}>ว่าง</span>
      </div>
    )
  }

  if (status === 'waiting') {
    return (
      <div style={{
        position:      'absolute',
        inset:         0,
        background:    '#00000018',
        display:       'flex',
        alignItems:    'flex-end',
        justifyContent: 'center',
        paddingBottom: 14,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily:    'Sarabun, sans-serif',
          fontSize:      10,
          color:         '#4a568099',
          letterSpacing: 1,
        }}>รอข้อมูล…</span>
      </div>
    )
  }

  return null
}
