import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'
import DeskSceneSVG from './DeskSceneSVG'
import PixelSprite from './PixelSprite'
import StatusOverlay from './StatusOverlay'

export interface SpritePaths {
  /** Path to agent character sprite (PNG/WebP, transparent bg, 96×96 or 128×128) */
  agent?: string
  /** Path to custom desk sprite — reserved for future use */
  desk?: string
}

interface Props {
  agentId:          DepartmentId
  agentDisplayName: string
  accent:           string
  status:           AgentStatus
  roomLabel:        string
  spritePaths?:     SpritePaths
}

// Character sits at SVG y=46..96 (50px window above desk surface).
// SVG height is fixed at 190px, so top=46px is the head-top position in CSS.
const SPRITE_TOP    = 46
const SPRITE_CENTER = '50%'

export default function AgentDeskSprite({
  agentId,
  agentDisplayName,
  accent,
  status,
  roomLabel,
  spritePaths,
}: Props) {
  return (
    <div style={{ position: 'relative', lineHeight: 0 }}>

      {/* ── 1. Room + desk + monitor SVG (no character body) ── */}
      <DeskSceneSVG
        agentId={agentId}
        accent={accent}
        status={status}
        roomLabel={roomLabel}
      />

      {/* ── 2. Character sprite — centered above desk ── */}
      <div style={{
        position:  'absolute',
        top:       SPRITE_TOP,
        left:      SPRITE_CENTER,
        transform: 'translateX(-50%)',
        zIndex:    2,
        pointerEvents: 'none',
      }}>
        <PixelSprite
          src={spritePaths?.agent}
          alt={agentDisplayName}
          fallbackType={agentId}
          accent={accent}
          status={status}
        />
      </div>

      {/* ── 3. Status overlays ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
        <StatusOverlay status={status} accent={accent}/>
      </div>

    </div>
  )
}
