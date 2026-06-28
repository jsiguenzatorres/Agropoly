// Burst of themed emojis raining over the board when a player lands on a tile.
// HTML overlay (not WebGL) — simple, performant, runs on top of the 3D canvas.

import { useEffect, useRef, useState } from 'react'
import { BOARD_DATA } from '@agropoly/game-engine'
import { useGameSource } from '../../store/useGameSource'
import { sfx } from '../../lib/sfx'

const KEYFRAMES = `
@keyframes tile-fx-fall {
  0%   { opacity: 0; transform: translateY(-20vh) translateX(var(--dx,0)) rotate(0deg); }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(80vh) translateX(calc(var(--dx,0) * 1.5)) rotate(540deg); }
}
@keyframes tile-fx-burst {
  0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
  20%  { opacity: 1; transform: translate(var(--dx,0), var(--dy,0)) scale(1.2); }
  100% { opacity: 0; transform: translate(calc(var(--dx,0) * 1.6), calc(var(--dy,0) * 1.6 - 60px)) scale(0.4); }
}
`

interface Burst {
  id: number
  kind: 'cosecha' | 'riesgo' | 'go' | 'tax' | 'jail' | 'prop' | 'free' | 'station' | 'utility'
}

const EMOJIS_BY_KIND: Record<Burst['kind'], string[]> = {
  cosecha:  ['🌽', '🌾', '🌱', '🪙'],
  riesgo:   ['⚡', '⛈', '💥'],
  go:       ['✨', '🪙', '🌟', '💰'],
  tax:      ['💸', '🧾'],
  jail:     ['⚡', '🚨', '⛓'],
  prop:     ['✨', '⭐'],
  free:     ['🌾', '🎉', '✨'],
  station:  ['🛤', '✨'],
  utility:  ['⚙', '✨'],
}

interface Particle {
  id: number
  emoji: string
  left: number   // vw
  delay: number
  duration: number
  dx: string
  size: number
  fall: boolean  // true = falls from top; false = burst from center
}

function buildParticles(kind: Burst['kind']): Particle[] {
  const emojis = EMOJIS_BY_KIND[kind]
  const burst = kind === 'go' || kind === 'prop'
  const count = kind === 'cosecha' || kind === 'go' ? 22 : kind === 'riesgo' || kind === 'jail' ? 10 : 14
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: burst ? 50 + (Math.random() - 0.5) * 40 : 10 + Math.random() * 80,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.4,
    dx: `${(Math.random() - 0.5) * (burst ? 60 : 12)}vw`,
    size: 22 + Math.random() * 14,
    fall: !burst,
  }))
}

interface Props { mode: 'solo' | 'multi' }

export function TileEffectFX({ mode }: Props) {
  const game = useGameSource(mode).game
  const [bursts, setBursts] = useState<Burst[]>([])
  const lastPos = useRef<Record<string, number>>({})
  let nextId = useRef(1)

  useEffect(() => {
    if (!game) return
    game.players.forEach(p => {
      const prev = lastPos.current[p.id]
      if (prev !== undefined && prev !== p.position) {
        const space = BOARD_DATA[p.position]
        if (!space) return
        const kind = (space.type === 'gotojail' ? 'jail' : space.type) as Burst['kind']
        if (!EMOJIS_BY_KIND[kind]) return
        const id = nextId.current++
        setBursts(bs => [...bs, { id, kind }])
        setTimeout(() => setBursts(bs => bs.filter(b => b.id !== id)), 2800)
        // Themed sound when applicable (only the most distinctive ones)
        if (kind === 'go')       try { sfx.passGo() } catch {}
        else if (kind === 'jail') try { sfx.bankruptcy() } catch {}
      }
      lastPos.current[p.id] = p.position
    })
  }, [game?.players.map(p => p.position).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (bursts.length === 0) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 68, pointerEvents: 'none', overflow: 'hidden' }}>
        {bursts.map(b => (
          <BurstLayer key={b.id} kind={b.kind} />
        ))}
      </div>
    </>
  )
}

function BurstLayer({ kind }: { kind: Burst['kind'] }) {
  const particles = useRef<Particle[]>(buildParticles(kind))
  return (
    <>
      {particles.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}vw`,
            top: p.fall ? '0' : '50%',
            fontSize: `${p.size}px`,
            animation: p.fall
              ? `tile-fx-fall ${p.duration}s ${p.delay}s ease-in forwards`
              : `tile-fx-burst ${p.duration}s ${p.delay}s cubic-bezier(0.22,1,0.36,1) forwards`,
            ['--dx' as string]: p.dx,
            ['--dy' as string]: `${(Math.random() - 0.5) * 30}vh`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </>
  )
}
