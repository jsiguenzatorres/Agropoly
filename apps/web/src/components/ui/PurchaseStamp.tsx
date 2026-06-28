// Big "COMPRADA" stamp flashes center-screen when a property changes from no owner → owner.
// Includes a Don Fomento thumbs-up emoji + thump sound.

import { useEffect, useRef, useState } from 'react'
import { useGameSource } from '../../store/useGameSource'
import { sfx } from '../../lib/sfx'

const KEYFRAMES = `
@keyframes stamp-drop {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(4) rotate(-25deg); }
  35%  { opacity: 1; transform: translate(-50%, -50%) scale(1.08) rotate(-12deg); }
  45%  { transform: translate(-50%, -50%) scale(0.96) rotate(-12deg); }
  55%  { transform: translate(-50%, -50%) scale(1.04) rotate(-12deg); }
  85%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1) rotate(-12deg); }
}
@keyframes stamp-puff {
  0%   { opacity: 0; transform: translate(var(--x,0), var(--y,0)) scale(0); }
  30%  { opacity: 0.6; transform: translate(calc(var(--x,0) * 1.3), calc(var(--y,0) * 1.3)) scale(1); }
  100% { opacity: 0; transform: translate(calc(var(--x,0) * 2), calc(var(--y,0) * 2)) scale(0.4); }
}
`

interface Props { mode: 'solo' | 'multi' }

interface Stamp { id: number; tileName: string }

export function PurchaseStamp({ mode }: Props) {
  const game = useGameSource(mode).game
  const lastOwners = useRef<Record<number, string | null>>({})
  const [stamps, setStamps] = useState<Stamp[]>([])

  useEffect(() => {
    if (!game) return
    game.board.forEach(sp => {
      const prev = lastOwners.current[sp.id] ?? null
      const cur  = sp.ownerId ?? null
      if (!prev && cur) {
        const id = sp.id + Date.now()
        setStamps(s => [...s, { id, tileName: sp.name }])
        try { sfx.buy() } catch {}
        setTimeout(() => setStamps(s => s.filter(st => st.id !== id)), 1800)
      }
      lastOwners.current[sp.id] = cur
    })
  }, [game?.board.map(s => s.ownerId).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  if (stamps.length === 0) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ position: 'fixed', inset: 0, zIndex: 78, pointerEvents: 'none' }}>
        {stamps.map(s => <StampFlash key={s.id} name={s.tileName} />)}
      </div>
    </>
  )
}

function StampFlash({ name }: { name: string }) {
  const puffs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: `${Math.cos(i * Math.PI / 4) * 80}px`,
    y: `${Math.sin(i * Math.PI / 4) * 80}px`,
  }))
  return (
    <div style={{
      position: 'absolute', top: '45%', left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'stamp-drop 1.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
    }}>
      <div style={{
        background: 'rgba(192,57,43,0.95)',
        color: '#FDF8EE',
        padding: '12px 36px',
        border: '5px double #FDF8EE',
        borderRadius: '6px',
        fontFamily: 'Playfair Display, Georgia, serif',
        fontWeight: 900, fontSize: '36px',
        letterSpacing: '0.15em',
        boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }}>
        COMPRADA
      </div>
      <p style={{
        textAlign: 'center', marginTop: '8px',
        color: '#FDF8EE',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        fontSize: '14px',
        fontWeight: 700,
        textShadow: '0 2px 6px rgba(0,0,0,0.7)',
      }}>
        👍 {name}
      </p>
      {/* Puffs radiating from center */}
      {puffs.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute', top: '20px', left: '50%',
            fontSize: '20px',
            animation: 'stamp-puff 1.2s ease-out forwards',
            ['--x' as string]: p.x,
            ['--y' as string]: p.y,
          } as React.CSSProperties}
        >
          💨
        </div>
      ))}
    </div>
  )
}
