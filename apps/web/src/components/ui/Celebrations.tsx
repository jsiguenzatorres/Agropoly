// Contextual celebrations: detects mid-game milestones and triggers themed banner +
// firework burst overlay. Independent of the AchievementToast system (which only fires
// once-per-account-lifetime). These fire every time the event happens.

import { useEffect, useMemo, useRef, useState } from 'react'
import { BOARD_DATA } from '@agropoly/game-engine'
import { useGameSource } from '../../store/useGameSource'
import { sfx } from '../../lib/sfx'

const KEYFRAMES = `
@keyframes celebration-banner {
  0%   { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0.6); }
  20%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.08); }
  35%  { transform: translateX(-50%) translateY(0) scale(1); }
  85%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); }
}
@keyframes celebration-firework {
  0%   { opacity: 0; transform: translate(0,0) scale(0); }
  20%  { opacity: 1; transform: translate(var(--dx,0), var(--dy,0)) scale(1.2); }
  100% { opacity: 0; transform: translate(calc(var(--dx,0) * 1.7), calc(var(--dy,0) * 1.7)) scale(0.4); }
}
`

const GROUP_NAMES: Record<number, string> = {
  0: 'Occidente I', 1: 'Occidente II', 2: 'Centro Norte',
  3: 'Paracentral', 4: 'Oriente I', 5: 'Oriente II',
  6: 'Gran S.S.',  7: 'Casa Matriz',
}
const GROUP_COLOR: Record<number, string> = {
  0: '#8B1A8B', 1: '#009FDF', 2: '#D6006E', 3: '#E8610C',
  4: '#C0392B', 5: '#D4AC00', 6: '#00913A', 7: '#00297A',
}

type EventKind = 'hotel' | 'group' | 'first-prop'

interface CelebrationEvent {
  id: number
  kind: EventKind
  title: string
  subtitle: string
  color: string
  emoji: string
}

let counter = 0

interface Props { mode: 'solo' | 'multi' }

export function Celebrations({ mode }: Props) {
  const game = useGameSource(mode).game
  const [active, setActive] = useState<CelebrationEvent | null>(null)
  const lastBuildings = useRef<Record<number, number>>({})
  const lastOwnedGroups = useRef<Set<number>>(new Set())
  const propCountSeen = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!game) return

    // 1. Hotel built (any player's tile transitions to buildings=5)
    let hotelFired = false
    game.board.forEach(sp => {
      const prev = lastBuildings.current[sp.id] ?? 0
      const cur  = sp.buildings ?? 0
      if (cur === 5 && prev < 5 && !hotelFired) {
        hotelFired = true
        const ownerName = game.players.find(p => p.id === sp.ownerId)?.name ?? '—'
        fire({
          id: ++counter, kind: 'hotel',
          title: '🏨 ¡CENTRO DE SERVICIO BFA!',
          subtitle: `${ownerName} construyó en ${sp.name}`,
          color: GROUP_COLOR[sp.group] ?? '#F5C518',
          emoji: '🏨',
        })
      }
      lastBuildings.current[sp.id] = cur
    })

    // 2. Group completed (player owns all props of a group)
    const groupOwners: Record<number, Set<string>> = {}
    game.board.forEach(sp => {
      if (sp.type !== 'prop' || !sp.ownerId) return
      if (!groupOwners[sp.group]) groupOwners[sp.group] = new Set()
      groupOwners[sp.group].add(sp.ownerId)
    })
    Object.entries(groupOwners).forEach(([gStr, owners]) => {
      const g = Number(gStr)
      const groupProps = BOARD_DATA.filter(sp => sp.group === g && sp.type === 'prop')
      const allMineId = owners.size === 1 ? [...owners][0] : null
      if (allMineId && groupProps.every(gp => game.board[gp.id]?.ownerId === allMineId)) {
        if (!lastOwnedGroups.current.has(g) && !hotelFired) {
          const owner = game.players.find(p => p.id === allMineId)
          fire({
            id: ++counter, kind: 'group',
            title: '🎯 ¡GRUPO COMPLETO!',
            subtitle: `${owner?.name} controla ${GROUP_NAMES[g]} · renta x2`,
            color: GROUP_COLOR[g] ?? '#F5C518',
            emoji: '🎉',
          })
          lastOwnedGroups.current.add(g)
        }
      } else {
        lastOwnedGroups.current.delete(g)
      }
    })

    // 3. First-ever property for a player (no celebration if they already had one)
    game.players.forEach(p => {
      const prev = propCountSeen.current[p.id] ?? 0
      if (prev === 0 && p.properties.length === 1 && !hotelFired) {
        fire({
          id: ++counter, kind: 'first-prop',
          title: '🏠 ¡PRIMERA PROPIEDAD!',
          subtitle: `${p.name} empieza su patrimonio BFA`,
          color: '#F5C518',
          emoji: '🌱',
        })
      }
      propCountSeen.current[p.id] = p.properties.length
    })

    function fire(ev: CelebrationEvent) {
      setActive(ev)
      try {
        if (ev.kind === 'hotel') sfx.hotel()
        else if (ev.kind === 'group') sfx.passGo()
        else sfx.achievement()
      } catch {}
      setTimeout(() => setActive(a => a?.id === ev.id ? null : a), 2800)
    }
  }, [game?.board.map(s => s.buildings).join(','), game?.players.map(p => p.properties.length).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <Banner ev={active} />
      <Fireworks color={active.color} emoji={active.emoji} />
    </>
  )
}

function Banner({ ev }: { ev: CelebrationEvent }) {
  return (
    <div
      style={{
        position: 'fixed', top: '35vh', left: '50%', zIndex: 79,
        animation: 'celebration-banner 2.8s cubic-bezier(0.34,1.56,0.64,1) forwards',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(13,43,20,0.96), rgba(27,107,47,0.96))',
        border: `3px solid ${ev.color}`,
        borderRadius: '16px',
        padding: '20px 36px',
        boxShadow: `0 20px 60px ${ev.color}50, 0 0 0 1px ${ev.color}40 inset`,
        textAlign: 'center',
        minWidth: '320px',
      }}>
        <p style={{
          color: ev.color,
          fontWeight: 800,
          fontSize: '28px',
          fontFamily: 'Playfair Display, Georgia, serif',
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          letterSpacing: '0.02em',
        }}>
          {ev.title}
        </p>
        <p style={{
          color: '#FDF8EE',
          fontSize: '14px',
          marginTop: '4px',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          margin: '4px 0 0',
        }}>
          {ev.subtitle}
        </p>
      </div>
    </div>
  )
}

function Fireworks({ color, emoji }: { color: string; emoji: string }) {
  const sparks = useMemo(() => {
    const arr = []
    for (let burst = 0; burst < 3; burst++) {
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2
        const dist = 100 + Math.random() * 80
        arr.push({
          id: burst * 100 + i,
          burst,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          delay: burst * 0.25 + Math.random() * 0.1,
          dur: 1.1 + Math.random() * 0.5,
          char: i % 4 === 0 ? emoji : '✨',
        })
      }
    }
    return arr
  }, [emoji])

  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%', zIndex: 78,
      pointerEvents: 'none',
    }}>
      {sparks.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            fontSize: '20px',
            color,
            animation: `celebration-firework ${s.dur}s ${s.delay}s ease-out forwards`,
            ['--dx' as string]: s.dx,
            ['--dy' as string]: s.dy,
            textShadow: `0 0 12px ${color}`,
          } as React.CSSProperties}
        >
          {s.char}
        </div>
      ))}
    </div>
  )
}
