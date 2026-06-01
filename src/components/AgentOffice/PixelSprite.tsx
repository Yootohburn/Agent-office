import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'

export interface PixelSpriteProps {
  /** Path to PNG/WebP sprite. If omitted, CSS fallback renders instead. */
  src?: string
  alt: string
  fallbackType: DepartmentId
  accent: string
  status: AgentStatus
  scale?: number
  className?: string
  position?: { top?: number; left?: string }
}

// Role-specific accessory icon (VT323 glyph, consistent with PixelAgentAvatar)
const ROLE_ICON: Record<DepartmentId, string> = {
  'product-research':    '▦',
  'offer-analyst':       '฿',
  'content-strategy':    '⊡',
  'script-writer':       '⊙',
  'creative-production': '◈',
  'social-performance':  '♥',
}

const HAIR   = '#261808'
const HAIR_H = '#3d2610'
const SKIN   = '#c8a070'
const SKIN_S = '#a87848'

export default function PixelSprite({ src, alt, fallbackType, accent, status, scale = 1 }: PixelSpriteProps) {
  const isIdle = status === 'idle' || status === 'waiting'
  const s = (n: number) => Math.round(n * scale)
  const icon = ROLE_ICON[fallbackType]

  // ── Real sprite asset ───────────────────────────────
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          width:           s(44),
          height:          s(50),
          imageRendering:  'pixelated',
          display:         'block',
          opacity:         isIdle ? 0.4 : 1,
        }}
      />
    )
  }

  // ── CSS pixel-art seated back-view character ────────
  // Layout (scale=1): total ~50px tall, 44px wide
  //   8px  hair top
  //  18px  head (back view, ears +4px each side)
  //   4px  neck
  //   4px  collar
  //  16px  shoulders / uniform
  // = 50px
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      width:          s(44),
      opacity:        isIdle ? 0.4 : 1,
      imageRendering: 'pixelated',
      gap:            0,
      position:       'relative',
      userSelect:     'none',
    }}>

      {/* Role icon — top-right accent */}
      <div style={{
        position:   'absolute',
        right:      s(2),
        top:        s(4),
        fontFamily: 'VT323, monospace',
        fontSize:   s(11),
        color:      accent,
        opacity:    0.75,
        lineHeight: 1,
      }}>
        {icon}
      </div>

      {/* Hair top */}
      <div style={{ width: s(30), height: s(8), background: HAIR, position: 'relative', alignSelf: 'center' }}>
        <div style={{ position: 'absolute', top: s(1), left: s(4), width: s(13), height: s(2), background: HAIR_H }}/>
      </div>

      {/* Head (back view) + ears */}
      <div style={{ width: s(30), height: s(18), position: 'relative', alignSelf: 'center' }}>
        {/* Left ear */}
        <div style={{ position: 'absolute', left: s(-4), top: s(3), width: s(4), height: s(8), background: SKIN }}/>
        {/* Right ear */}
        <div style={{ position: 'absolute', right: s(-4), top: s(3), width: s(4), height: s(8), background: SKIN }}/>
        {/* Head */}
        <div style={{ width: '100%', height: '100%', background: SKIN }}/>
        {/* Screen glow tint */}
        <div style={{ position: 'absolute', inset: 0, background: accent, opacity: 0.09 }}/>
        {/* Ear shadow */}
        <div style={{ position: 'absolute', left: s(-3), top: s(4), width: s(2), height: s(6), background: SKIN_S, opacity: 0.5 }}/>
        <div style={{ position: 'absolute', right: s(-3), top: s(4), width: s(2), height: s(6), background: SKIN_S, opacity: 0.5 }}/>
      </div>

      {/* Neck */}
      <div style={{ width: s(10), height: s(4), background: SKIN_S, alignSelf: 'center' }}/>

      {/* Collar flaps */}
      <div style={{ display: 'flex', width: s(30), gap: s(4), justifyContent: 'center', alignSelf: 'center' }}>
        <div style={{ width: s(8), height: s(4), background: accent, opacity: 0.9 }}/>
        <div style={{ width: s(8), height: s(4), background: accent, opacity: 0.9 }}/>
      </div>

      {/* Shoulders / uniform block */}
      <div style={{
        width:    s(44),
        height:   s(16),
        background: accent,
        opacity:  0.85,
        position: 'relative',
      }}>
        {/* Uniform crease */}
        <div style={{ position: 'absolute', top: s(5), left: 0, right: 0, height: s(1), background: '#00000020' }}/>
        {/* Left arm stub */}
        <div style={{ position: 'absolute', left: 0, top: s(4), width: s(6), height: s(10), background: accent, opacity: 0.9 }}/>
        {/* Right arm stub */}
        <div style={{ position: 'absolute', right: 0, top: s(4), width: s(6), height: s(10), background: accent, opacity: 0.9 }}/>
      </div>

    </div>
  )
}
