import { useState, useEffect } from 'react'
import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentHotspot from './AgentHotspot'
import type { AgentSceneConfig } from './AgentHotspot'

interface Props {
  agents:          Agent[]
  selectedAgentId: DepartmentId | null
  onSelectAgent:   (id: DepartmentId) => void
}

// ── Per-agent scene position config ─────────────────────────────────────────
// x       — horizontal center %, matching desk center in the background image
// y       — vertical %, where the sprite BOTTOM (feet) should appear
//           The hotspot uses `bottom: ${100-y}%` so its lowest element sits
//           at y% from top. Sprite feet land ~4-6% above that due to the
//           name/progress labels rendered below the sprite image.
// scale   — 1.0 = 200px sprite height (the default). Increase to enlarge.
// offsetX — additional horizontal shift in % (positive = right)
// offsetY — additional vertical shift in % (positive = lower on screen)
// anchor  — 'bottom-center': sprite feet anchor at y%. Only supported value.
//
// Tune per-agent if a PNG has large transparent padding shifting the character.
const AGENT_SCENE_CONFIG: Record<DepartmentId, AgentSceneConfig> = {
  'product-research':    { x: 17, y: 63, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
  'offer-analyst':       { x: 50, y: 63, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
  'content-strategy':    { x: 83, y: 63, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
  'script-writer':       { x: 17, y: 94, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
  'creative-production': { x: 50, y: 94, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
  'social-performance':  { x: 83, y: 94, scale: 1, offsetX: 0, offsetY: 0, anchor: 'bottom-center' },
}

// ── Sprite paths ─────────────────────────────────────────────────────────────
const AGENT_SPRITE_PATHS: Partial<Record<DepartmentId, string>> = {
  'product-research':    '/assets/pixel-office/agents/product-research.png',
  'offer-analyst':       '/assets/pixel-office/agents/offer-profit-analyst.png',
  'content-strategy':    '/assets/pixel-office/agents/content-strategy.png',
  'script-writer':       '/assets/pixel-office/agents/script-storyboard.png',
  'creative-production': '/assets/pixel-office/agents/creative-production.png',
  'social-performance':  '/assets/pixel-office/agents/social-performance.png',
}

const BG_IMAGE_URL = '/assets/pixel-office/backgrounds/shared-command-room.png'

const FALLBACK_BG = '#06090f'
const GRID_LINES  = `
  repeating-linear-gradient(0deg,   transparent 0px, transparent 59px, #0c1220 60px),
  repeating-linear-gradient(90deg,  transparent 0px, transparent 79px, #0c1220 80px)
`

const ROW_LABELS: [string, string] = [
  'ROW A — วิจัย · วิเคราะห์ · กลยุทธ์',
  'ROW B — สคริปต์ · ผลิตงาน · โซเชียล',
]

export default function SharedCommandRoom({ agents, selectedAgentId, onSelectAgent }: Props) {
  const [bgReady, setBgReady] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload  = () => setBgReady(true)
    img.onerror = () => setBgReady(false)
    img.src     = BG_IMAGE_URL
  }, [])

  return (
    // zIndex:0 creates a stacking context that contains ALL child z-indices.
    // This ensures hotspots (z-index ≤ 10 inside) never compete with the
    // app header/nav (z-index 100) in the outer stacking context.
    <div style={{
      position:   'relative',
      zIndex:     0,
      flex:       1,
      minHeight:  0,
      width:      '100%',
      // overflow:hidden clips all positioned children to this container's bounds.
      // Hotspot drop-shadow filter has been removed; boxShadow on the sprite
      // container is used instead (boxShadow is always clipped by its own element).
      overflow:   'hidden',
      background: FALLBACK_BG,
      ...(bgReady ? {
        backgroundImage:    `url(${BG_IMAGE_URL})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center top',
        backgroundRepeat:   'no-repeat',
      } : {}),
    }}>

      {/* CSS grid overlay — only when no BG image */}
      {!bgReady && (
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: GRID_LINES,
          opacity:         0.35,
          pointerEvents:   'none',
        }}/>
      )}

      {!bgReady && (
        <div style={{
          position:      'absolute',
          inset:         0,
          background:    'radial-gradient(ellipse 70% 50% at 50% 45%, #0a1828 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
      )}

      {!bgReady && <>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#0e1628', pointerEvents: 'none' }}/>
        {ROW_LABELS.map((label, i) => (
          <div key={i} style={{
            position:      'absolute',
            top:           i === 0 ? 6 : 'calc(50% + 6px)',
            left:          14,
            fontFamily:    'Share Tech Mono, monospace',
            fontSize:      8,
            color:         '#1a2540',
            letterSpacing: 2,
            pointerEvents: 'none',
          }}>
            {label}
          </div>
        ))}
      </>}

      {/* Office banner */}
      <div style={{
        position:      'absolute',
        bottom:        8,
        left:          '50%',
        transform:     'translateX(-50%)',
        fontFamily:    'Share Tech Mono, monospace',
        fontSize:      8,
        color:         '#1a2540',
        letterSpacing: 2,
        pointerEvents: 'none',
        whiteSpace:    'nowrap',
        zIndex:        5,
      }}>
        ── AGENT OFFICE · COMMAND ROOM · FLOOR 1 ──
      </div>

      {/* 6 agent hotspots */}
      {agents.map(agent => {
        const cfg = AGENT_SCENE_CONFIG[agent.id]
        if (!cfg) return null
        return (
          <AgentHotspot
            key={agent.id}
            agent={agent}
            selected={selectedAgentId === agent.id}
            onClick={() => onSelectAgent(agent.id)}
            spriteSrc={AGENT_SPRITE_PATHS[agent.id]}
            sceneConfig={cfg}
          />
        )
      })}

    </div>
  )
}
