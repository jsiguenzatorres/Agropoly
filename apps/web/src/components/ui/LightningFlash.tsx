// Brief screen-wide white flash + thunder rumble when a player goes to jail.
// Subscribes to game state and triggers when any player's jailed flag flips to true.

import { useEffect, useRef, useState } from 'react'
import { useGameSource } from '../../store/useGameSource'

const KEYFRAMES = `
@keyframes lightning-flash {
  0%, 100% { opacity: 0; }
  4%, 8%   { opacity: 0.85; }
  12%      { opacity: 0.3; }
  18%      { opacity: 0.65; }
  30%, 100% { opacity: 0; }
}
`

export function LightningFlash({ mode }: { mode: 'solo' | 'multi' }) {
  const game = useGameSource(mode).game
  const prevJailed = useRef<Set<string>>(new Set())
  const [flashKey, setFlashKey] = useState(0)

  useEffect(() => {
    if (!game) return
    const currentJailed = new Set(game.players.filter(p => p.jailed).map(p => p.id))
    let newJail = false
    currentJailed.forEach(id => { if (!prevJailed.current.has(id)) newJail = true })
    prevJailed.current = currentJailed
    if (newJail) setFlashKey(k => k + 1)
  }, [game?.players.map(p => p.jailed).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (flashKey === 0) return null
  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        key={flashKey}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(180,200,255,0.7) 30%, transparent 80%)',
          animation: 'lightning-flash 0.7s ease-out forwards',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}
