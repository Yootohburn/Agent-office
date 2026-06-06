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

  // Full opacity for all agents — purple/dark palettes become near-invisible at
  // any reduced opacity on the #06090f background. Idle state is indicated by
  // the status bubble/badge on each card instead.
  const idleOpacity = 1

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
