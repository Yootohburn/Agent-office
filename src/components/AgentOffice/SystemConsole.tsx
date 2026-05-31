import { mockActivityLog } from '../../agents/agentSessionStore'

const TYPE_COLOR: Record<string, string> = {
  system:  '#2a3560',
  info:    '#00e5ff',
  success: '#00ff9f',
  warning: '#ffb300',
  error:   '#ff5252',
}

const TYPE_PREFIX: Record<string, string> = {
  system:  'SYS',
  info:    'INF',
  success: 'OK ',
  warning: 'WRN',
  error:   'ERR',
}

export default function SystemConsole() {
  const recent = [...mockActivityLog].reverse().slice(0, 12)

  return (
    <div style={{ background: '#06090f', borderRight: '1px solid #1a2540', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '6px 12px 5px', borderBottom: '1px solid #1a2540', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#2a3560', letterSpacing: 2 }}>
          ▶ SYSTEM LOG
        </div>
        <div style={{ width: 5, height: 5, background: '#00ff9f', animation: 'blink 1s step-end infinite' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {recent.map(entry => (
          <div key={entry.id} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 9, color: '#1a2540', flexShrink: 0, letterSpacing: 0.5, marginTop: 1 }}>
              {entry.timestamp}
            </span>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: TYPE_COLOR[entry.type], flexShrink: 0, letterSpacing: 1, marginTop: 0 }}>
              [{TYPE_PREFIX[entry.type]}]
            </span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: `${TYPE_COLOR[entry.type]}bb`, lineHeight: 1.4 }}>
              {entry.message.length > 80 ? entry.message.slice(0, 80) + '…' : entry.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
