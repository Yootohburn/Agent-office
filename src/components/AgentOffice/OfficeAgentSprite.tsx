import { useState } from 'react'
import type { DepartmentId, AgentStatus } from '../../agents/agentRegistry'
import PixelAgentAvatar from './PixelAgentAvatar'

interface Props {
  agentId:    DepartmentId
  status:     AgentStatus
  spriteSrc?: string
  height?:    number
}

export default function OfficeAgentSprite({ agentId, status, spriteSrc, height = 88 }: Props) {
  const [imgFailed, setImgFailed] = useState(false)
  const isIdle = status === 'idle' || status === 'waiting'

  // Derive fallback avatar scale from the target height.
  // PixelAgentAvatar renders at 50px tall at scale=1.
  const fallbackScale = Math.max(1.5, height / 50)

  // 0.85 keeps idle agents clearly visible while still looking "inactive".
  // Lower values (0.4, 0.65) made dark-palette agents (e.g. creative-production
  // with #a855f7 purple) nearly invisible against the #06090f background.
  const idleOpacity = 0.85

  if (spriteSrc && !imgFailed) {
    return (
      <img
        src={spriteSrc}
        alt={agentId}
        onError={() => setImgFailed(true)}
        style={{
          height,
          width:           'auto',
          maxWidth:        '100%',
          imageRendering:  'pixelated',
          objectFit:       'contain',
          objectPosition:  'bottom center',
          display:         'block',
          opacity:         isIdle ? idleOpacity : 1,
        }}
      />
    )
  }

  return (
    <div style={{ opacity: isIdle ? idleOpacity : 1 }}>
      <PixelAgentAvatar agentId={agentId} status={status} scale={fallbackScale} />
    </div>
  )
}
