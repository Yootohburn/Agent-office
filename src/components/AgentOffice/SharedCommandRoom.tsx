import { useState, useEffect } from 'react'
import type { Agent, DepartmentId } from '../../agents/agentRegistry'
import AgentHotspot from './AgentHotspot'

interface Props {
  agents:          Agent[]
  selectedAgentId: DepartmentId | null
  onSelectAgent:   (id: DepartmentId) => void
}

// ── Scene position config ────────────────────────────────────────────────────
// Percentage values relative to the scene container.
// y = vertical % from top of scene. Adjust to match background art desk positions.
// At 35% the hotspot content (status→task→sprite) places the character feet
// at roughly 60-65% of the container, aligning with the front-of-desk chair area.
const AGENT_SCENE_POSITIONS: Record<DepartmentId, { x: number; y: number }> = {
  'product-research':    { x: 17, y: 12 },
  'offer-analyst':       { x: 50, y: 12 },
  'content-strategy':    { x: 83, y: 12 },
  'script-writer':       { x: 17, y: 50 },
  'creative-production': { x: 50, y: 50 },
  'social-performance':  { x: 83, y: 50 },
}

// ── Sprite paths ─────────────────────────────────────────────────────────────
// OfficeAgentSprite handles onError — no broken icon if file is missing.
const AGENT_SPRITE_PATHS: Partial<Record<DepartmentId, string>> = {
  'product-research':    '/assets/pixel-office/agents/product-research.png',
  'offer-analyst':       '/assets/pixel-office/agents/offer-profit-analyst.png',
  'content-strategy':    '/assets/pixel-office/agents/content-strategy.png',
  'script-writer':       '/assets/pixel-office/agents/script-storyboard.png',
  'creative-production': '/assets/pixel-office/agents/creative-production.png',
  'social-performance':  '/assets/pixel-office/agents/social-performance.png',
}

const BG_IMAGE_URL = '/assets/pixel-office/backgrounds/shared-command-room.png'

// ── CSS fallback background ──────────────────────────────────────────────────
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

  // Silently probe background image availability
  useEffect(() => {
    const img = new Image()
    img.onload  = () => setBgReady(true)
    img.onerror = () => setBgReady(false)
    img.src     = BG_IMAGE_URL
  }, [])

  return (
    <div style={{
      position:   'relative',
      zIndex:     0,
      flex:       1,
      minHeight:  0,
      width:      '100%',
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

      {/* Ambient glow — center desk area */}
      {!bgReady && (
        <div style={{
          position:     'absolute',
          inset:        0,
          background:   'radial-gradient(ellipse 70% 50% at 50% 45%, #0a1828 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
      )}

      {/* Row divider + labels */}
      {!bgReady && <>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#0e1628', pointerEvents: 'none' }}/>
        {ROW_LABELS.map((label, i) => (
          <div key={i} style={{
            position:    'absolute',
            top:         i === 0 ? 6 : 'calc(50% + 6px)',
            left:        14,
            fontFamily:  'Share Tech Mono, monospace',
            fontSize:    8,
            color:       '#1a2540',
            letterSpacing: 2,
            pointerEvents: 'none',
          }}>
            {label}
          </div>
        ))}
      </>}

      {/* Office banner */}
      <div style={{
        position:    'absolute',
        bottom:      8,
        left:        '50%',
        transform:   'translateX(-50%)',
        fontFamily:  'Share Tech Mono, monospace',
        fontSize:    8,
        color:       '#1a2540',
        letterSpacing: 2,
        pointerEvents: 'none',
        whiteSpace:  'nowrap',
      }}>
        ── AGENT OFFICE · COMMAND ROOM · FLOOR 1 ──
      </div>

      {/* 6 agent hotspots */}
      {agents.map(agent => {
        const pos = AGENT_SCENE_POSITIONS[agent.id]
        if (!pos) return null
        return (
          <AgentHotspot
            key={agent.id}
            agent={agent}
            selected={selectedAgentId === agent.id}
            onClick={() => onSelectAgent(agent.id)}
            spriteSrc={AGENT_SPRITE_PATHS[agent.id]}
            x={pos.x}
            y={pos.y}
          />
        )
      })}

    </div>
  )
}
