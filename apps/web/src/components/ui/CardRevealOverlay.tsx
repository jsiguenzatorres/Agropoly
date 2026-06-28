import { useEffect, useMemo, useState } from 'react'
import { useGameSource } from '../../store/useGameSource'
import { speak, stopSpeech } from '../../lib/speech'
import { sfx } from '../../lib/sfx'
import type { Card } from '@agropoly/game-engine'

const KEYFRAMES = `
@keyframes card-enter {
  0%   { opacity: 0; transform: translate(-50%, -30%) scale(0.4) rotateY(180deg); }
  60%  { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotateY(180deg); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1)   rotateY(180deg); }
}
@keyframes card-flip {
  0%   { transform: translate(-50%, -50%) scale(1) rotateY(180deg); }
  50%  { transform: translate(-50%, -50%) scale(1.06) rotateY(90deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotateY(0deg); }
}
@keyframes card-exit {
  0%   { opacity: 1; transform: translate(-50%, -50%) scale(1) rotateY(0deg); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.6) rotateY(0deg) translateY(100px); }
}
@keyframes coin-rain {
  0%   { transform: translateY(-30vh) translateX(var(--cx,0)) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translateY(60vh) translateX(var(--cx-end,0)) rotate(720deg); opacity: 0; }
}
@keyframes lightning-strike {
  0%, 100% { opacity: 0; }
  20%, 60% { opacity: 1; }
}
@keyframes typewriter-caret {
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
}
@keyframes ring-pulse {
  0%   { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}
`

// Visual effect type derived from card.effect.action
type EffectKind = 'coin-rain' | 'lightning' | 'sparkles' | 'jail' | 'compass' | 'hammers' | 'none'

function effectKindForCard(card: Card): EffectKind {
  switch (card.effect.action) {
    case 'collect':
    case 'collect_from_players':       return 'coin-rain'
    case 'pay':
    case 'pay_per_building':           return 'hammers'
    case 'go_to_jail':                 return 'jail'
    case 'move':
    case 'move_relative':              return 'compass'
    case 'jail_free':                  return 'sparkles'
    default:                           return 'none'
  }
}

function CoinRain() {
  const coins = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    cx: `${(Math.random() - 0.5) * 8}vw`,
    cxEnd: `${(Math.random() - 0.5) * 18}vw`,
    delay: Math.random() * 0.8,
    duration: 1.4 + Math.random() * 1.2,
    emoji: Math.random() > 0.4 ? '🪙' : '💰',
  })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {coins.map(c => (
        <div
          key={c.id}
          style={{
            position: 'absolute',
            left: `${c.left}%`,
            top: 0,
            fontSize: '28px',
            animation: `coin-rain ${c.duration}s ${c.delay}s ease-in infinite`,
            ['--cx' as string]: c.cx,
            ['--cx-end' as string]: c.cxEnd,
          } as React.CSSProperties}
        >
          {c.emoji}
        </div>
      ))}
    </div>
  )
}

function LightningBurst() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 40%, rgba(255,255,200,0.6) 0%, transparent 35%)',
        animation: 'lightning-strike 0.8s ease-out 2 alternate',
        pointerEvents: 'none',
      }}
    />
  )
}

function PulseRings() {
  return (
    <>
      {[0, 0.3, 0.6].map(d => (
        <div
          key={d}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '460px', height: '460px',
            border: '2px solid rgba(245,197,24,0.4)',
            borderRadius: '50%',
            animation: `ring-pulse 2s ${d}s ease-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

interface Props { mode: 'solo' | 'multi' }

type Phase = 'idle' | 'enter' | 'flip' | 'shown' | 'exit'

export function CardRevealOverlay({ mode }: Props) {
  const game        = useGameSource(mode).game
  const pending     = useGameSource(mode).pending
  const pendingCard = useGameSource(mode).pendingCard

  const [phase, setPhase] = useState<Phase>('idle')
  const [typedText, setTypedText] = useState('')
  const [card, setCard] = useState<Card | null>(null)

  // Trigger: pending becomes 'apply_card' and we have a pendingCard
  useEffect(() => {
    if (pending !== 'apply_card' || !pendingCard) {
      setPhase('idle')
      setCard(null)
      setTypedText('')
      stopSpeech()
      return
    }
    setCard(pendingCard)
    setPhase('enter')
    sfx.card()

    const t1 = setTimeout(() => setPhase('flip'), 700)
    const t2 = setTimeout(() => {
      setPhase('shown')
      // Narrate once revealed
      speak(`${pendingCard.title}. ${pendingCard.text}`, { rate: 1.05 })
    }, 1500)

    // Typewriter for the body text once visible
    let typeTimer: ReturnType<typeof setInterval> | null = null
    const t3 = setTimeout(() => {
      const fullText = pendingCard.text
      let i = 0
      typeTimer = setInterval(() => {
        i++
        setTypedText(fullText.slice(0, i))
        if (i >= fullText.length && typeTimer) clearInterval(typeTimer)
      }, 28)
    }, 1500)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      if (typeTimer) clearInterval(typeTimer)
      stopSpeech()
    }
  }, [pending, pendingCard?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!card || phase === 'idle') return null

  const isCosecha = card.type === 'cosecha'
  const accentColor = isCosecha ? '#1B6B2F' : '#4A1A4A'
  const accentEdge  = isCosecha ? '#2E8B4A' : '#7A2E7A'
  const fxKind = effectKindForCard(card)

  // Active animation based on phase
  const animation =
    phase === 'enter' ? 'card-enter 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards'
  : phase === 'flip'  ? 'card-flip 0.8s cubic-bezier(0.4,0,0.2,1) forwards'
  : phase === 'exit'  ? 'card-exit 0.5s ease-in forwards'
  : undefined

  const facingFront = phase === 'shown' || phase === 'exit'

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 95,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 80%)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onClick={() => game && setPhase('exit')}
      >
        {/* FX layers — coins, lightning, rings — only when shown */}
        {phase === 'shown' && fxKind === 'coin-rain'  && <CoinRain />}
        {phase === 'shown' && fxKind === 'jail'       && <LightningBurst />}
        {phase === 'shown' && fxKind === 'sparkles'   && <PulseRings />}
        {phase === 'shown' && fxKind === 'lightning'  && <LightningBurst />}

        {/* 3D card container */}
        <div
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '340px', height: '480px',
            perspective: '1500px',
            pointerEvents: 'none',
            animation,
            transformStyle: 'preserve-3d',
          }}
          onAnimationEnd={(e) => {
            // Don't react to FX child animations
            if ((e.target as HTMLElement).dataset?.role !== 'card') return
            if (phase === 'exit') {
              setPhase('idle')
              setCard(null)
              setTypedText('')
            }
          }}
          data-role="card"
        >
          {/* Card BACK (visible during entry until flip completes) */}
          <div
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${accentColor} 0%, #0D2B14 100%)`,
              border: `3px solid ${accentEdge}`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,197,24,0.2)',
              display: facingFront ? 'none' : 'flex',
              alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              gap: '20px',
              backfaceVisibility: 'hidden',
            }}
          >
            <p style={{
              color: '#F5C518', fontWeight: 700, fontSize: '24px',
              letterSpacing: '0.3em', fontFamily: 'Playfair Display, Georgia, serif',
              transform: 'rotateY(180deg)',
            }}>
              {isCosecha ? 'COSECHA' : 'RIESGO'}
            </p>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              background: 'rgba(245,197,24,0.08)',
              border: '2px solid rgba(245,197,24,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '54px',
              transform: 'rotateY(180deg)',
            }}>
              🏦
            </div>
            <p style={{
              color: 'rgba(245,232,200,0.5)', fontSize: '11px',
              letterSpacing: '0.25em', fontFamily: 'monospace',
              transform: 'rotateY(180deg)',
            }}>
              BANCO DE FOMENTO AGROPECUARIO
            </p>
          </div>

          {/* Card FRONT (visible after flip) */}
          <div
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #FDF8EE 0%, #F0E8D0 100%)',
              border: `4px solid ${accentEdge}`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 80px rgba(245,197,24,0.3)',
              display: facingFront ? 'flex' : 'none',
              flexDirection: 'column',
              padding: '24px',
              gap: '16px',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Header band */}
            <div style={{
              background: accentColor,
              margin: '-24px -24px 0',
              padding: '12px 24px',
              borderRadius: '16px 16px 0 0',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#F5C518', fontWeight: 700, fontSize: '16px',
                letterSpacing: '0.2em', fontFamily: 'Playfair Display, Georgia, serif',
                margin: 0,
              }}>
                {isCosecha ? '🌽 COSECHA' : '⚡ RIESGO'}
              </p>
            </div>

            {/* Big icon */}
            <div style={{
              fontSize: '88px',
              textAlign: 'center',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',
            }}>
              {card.icon}
            </div>

            {/* Title */}
            <p style={{
              color: '#0D2B14',
              fontWeight: 700, fontSize: '22px',
              textAlign: 'center',
              fontFamily: 'Playfair Display, Georgia, serif',
              margin: 0,
              lineHeight: 1.2,
            }}>
              {card.title}
            </p>

            {/* Body — typewriter */}
            <p style={{
              color: '#3A3A3A',
              fontSize: '14px',
              textAlign: 'center',
              lineHeight: 1.5,
              fontFamily: 'DM Sans, system-ui, sans-serif',
              margin: 0,
              flex: 1,
            }}>
              {typedText}
              {typedText.length < card.text.length && (
                <span style={{ animation: 'typewriter-caret 0.8s steps(1) infinite', color: accentColor }}>▎</span>
              )}
            </p>

            {/* Hint */}
            <p style={{
              color: 'rgba(13,43,20,0.4)',
              fontSize: '10px',
              textAlign: 'center',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              margin: 0,
            }}>
              CLICK PARA CONTINUAR
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
