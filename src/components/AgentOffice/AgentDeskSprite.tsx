import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'
import DeskSceneSVG from './DeskSceneSVG'
import PixelSprite from './PixelSprite'
import StatusOverlay from './StatusOverlay'

export interface SpritePaths {
  /** Path to agent character sprite (PNG/WebP, transparent bg, 96×96 or 128×128) */
  agent?: string
  /** Path to custom desk sprite — reserved for future use */
  desk?: string
  /**
   * Rendered px width for the image sprite. Default 128.
   * At 128px: sprite desk surface (≈75% down a square sprite) lands at ~96px,
   * which aligns with the SVG desk surface at y=96.
   */
  renderWidth?: number
}

interface Props {
  agentId:          DepartmentId
  agentDisplayName: string
  accent:           string
  status:           AgentStatus
  roomLabel:        string
  spritePaths?:     SpritePaths
}

// CSS fallback sits in the character slot: SVG y=46..96 (50px above desk surface).
// Real image sprites start at top=0 so their built-in desk aligns with the SVG desk
// (sprite desk surface is ~75% down a square image → 128×0.75 ≈ 96px = SVG y=96).
const CSS_FALLBACK_TOP = 46
const SPRITE_CENTER    = '50%'

export default function AgentDeskSprite({
  agentId,
  agentDisplayName,
  accent,
  status,
  roomLabel,
  spritePaths,
}: Props) {
  const hasRealSprite = Boolean(spritePaths?.agent)
  const spriteTop     = hasRealSprite ? 0 : CSS_FALLBACK_TOP

  return (
    <div style={{ position: 'relative', lineHeight: 0 }}>

      {/* ── 1. Room + desk + monitor SVG (no character body) ── */}
      <DeskSceneSVG
        agentId={agentId}
        accent={accent}
        status={status}
        roomLabel={roomLabel}
      />

      {/* ── 2. Character sprite — centered, aligned to desk ── */}
      <div style={{
        position:      'absolute',
        top:           spriteTop,
        left:          SPRITE_CENTER,
        transform:     'translateX(-50%)',
        zIndex:        2,
        pointerEvents: 'none',
      }}>
        <PixelSprite
          src={spritePaths?.agent}
          alt={agentDisplayName}
          fallbackType={agentId}
          accent={accent}
          status={status}
          renderWidth={spritePaths?.renderWidth}
        />
      </div>

      {/* ── 3. Status overlays ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
        <StatusOverlay status={status} accent={accent}/>
      </div>

    </div>
  )
}
