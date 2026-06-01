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

  if (spriteSrc && !imgFailed) {
    return (
      <img
        src={spriteSrc}
        alt={agentId}
        onError={() => setImgFailed(true)}
        style={{
          height,
          width:           'auto',
          imageRendering:  'pixelated',
          display:         'block',
          opacity:         isIdle ? 0.4 : 1,
        }}
      />
    )
  }

  // CSS fallback — PixelAgentAvatar scaled up, no broken icon shown
  return (
    <div style={{ opacity: isIdle ? 0.4 : 1 }}>
      <PixelAgentAvatar agentId={agentId} status={status} scale={2.8} />
    </div>
  )
}
