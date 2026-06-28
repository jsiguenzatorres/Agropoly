// Big-screen reveal when a new climate face rolls: the die spins through random
// faces for ~1s, then locks on the chosen face with a glow + label.

import { useEffect, useRef, useState } from 'react'
import { useGameSource } from '../../store/useGameSource'
import { CLIMATE_INFO, CLIMATE_FACES, type ClimateFace } from '@agropoly/game-engine'

const KEYFRAMES = `
@keyframes climate-die-pop {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4) rotateZ(-90deg); }
  35%  { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotateZ(15deg); }
  50%  { transform: translate(-50%, -50%) scale(1.05) rotateZ(-5deg); }
  65%  { transform: translate(-50%, -50%) scale(1.1) rotateZ(0deg); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotateZ(0deg); }
}
@keyframes climate-die-out {
  0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); filter: blur(8px); }
}
@keyframes climate-aura {
  0%, 100% { box-shadow: 0 0 40px 8px var(--aura, rgba(245,197,24,0.4)); }
  50%      { box-shadow: 0 0 80px 18px var(--aura, rgba(245,197,24,0.6)); }
}
`

const FACE_BG: Record<ClimateFace, string> = {
  sol:      'radial-gradient(circle at 30% 30%, #FFE680 0%, #F5C518 60%, #B8860B 100%)',
  lluvia:   'radial-gradient(circle at 30% 30%, #A8D8E8 0%, #4A90B8 60%, #2A5A7A 100%)',
  tormenta: 'radial-gradient(circle at 30% 30%, #5A5870 0%, #2A2A38 60%, #0D0D14 100%)',
  arcoiris: 'linear-gradient(135deg, #FF6B6B, #FFB347, #FFEB99, #76C893, #4A90B8, #9B72CB)',
}

const FACE_AURA: Record<ClimateFace, string> = {
  sol:      'rgba(245,197,24,0.6)',
  lluvia:   'rgba(100,180,230,0.55)',
  tormenta: 'rgba(80,80,120,0.6)',
  arcoiris: 'rgba(245,197,24,0.6)',
}

interface Props { mode: 'solo' | 'multi' }

export function ClimateDieRoll({ mode }: Props) {
  const game = useGameSource(mode).game
  const [rolling, setRolling] = useState(false)
  const [spinFace, setSpinFace] = useState<ClimateFace>('sol')
  const [exiting, setExiting] = useState(false)
  const lastClimate = useRef<string | null>(null)
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const finalFace = useRef<ClimateFace>('sol')

  useEffect(() => {
    if (!game?.climate) return
    if (game.climate === lastClimate.current) return
    // First-time initialization shouldn't trigger animation (just remember)
    if (lastClimate.current === null) {
      lastClimate.current = game.climate
      return
    }
    lastClimate.current = game.climate
    finalFace.current = game.climate as ClimateFace
    setRolling(true)
    setExiting(false)

    // Spin through random faces for ~1s
    spinInterval.current = setInterval(() => {
      setSpinFace(CLIMATE_FACES[Math.floor(Math.random() * CLIMATE_FACES.length)])
    }, 90)

    const t1 = setTimeout(() => {
      if (spinInterval.current) { clearInterval(spinInterval.current); spinInterval.current = null }
      setSpinFace(finalFace.current)   // lock final face
    }, 950)

    // Show locked face for ~1.2s, then exit
    const t2 = setTimeout(() => setExiting(true), 950 + 1200)
    const t3 = setTimeout(() => setRolling(false), 950 + 1200 + 450)

    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
    }
  }, [game?.climate])

  if (!rolling) return null

  const isFinal = spinFace === finalFace.current && !exiting
  const info = CLIMATE_INFO[spinFace]

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: 'fixed', top: '38%', left: '50%', zIndex: 82,
        pointerEvents: 'none',
      }}>
        <div
          style={{
            background: FACE_BG[spinFace],
            width: '180px', height: '180px',
            borderRadius: '24px',
            border: '4px solid rgba(245,197,24,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '90px',
            transform: 'translate(-50%, -50%)',
            animation: exiting
              ? 'climate-die-out 0.45s ease-in forwards'
              : isFinal
                ? 'climate-die-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, climate-aura 1.5s ease-in-out infinite 0.5s'
                : undefined,
            ['--aura' as string]: FACE_AURA[spinFace],
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          } as React.CSSProperties}
        >
          {info.emoji}
        </div>
      </div>
      {isFinal && (
        <div style={{
          position: 'fixed', top: 'calc(38% + 110px)', left: '50%', zIndex: 82,
          transform: 'translate(-50%, 0)',
          pointerEvents: 'none',
          textAlign: 'center',
          animation: 'climate-die-pop 0.4s ease-out 0.2s both',
        }}>
          <p style={{
            color: '#F5C518', fontWeight: 800, fontSize: '28px',
            fontFamily: 'Playfair Display, Georgia, serif',
            margin: 0,
            textShadow: '0 2px 14px rgba(0,0,0,0.7)',
          }}>
            {info.label}
          </p>
          <p style={{
            color: '#FDF8EE', fontSize: '14px',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            margin: '4px 0 0',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          }}>
            COSECHAS ×{info.multiplier}
          </p>
        </div>
      )}
    </>
  )
}
