// 2D story-mode intro shown before the game starts. The BFA presents each player,
// drops their ƒ1,500 starting credit (animated coin/bill flying in), and the player's
// personal mascot voices an aspiration.
//
// Auto-advances through scenes; skip button bottom-right closes it immediately.

import { useEffect, useMemo, useState } from 'react'
import type { Player } from '@agropoly/game-engine'
import { mascotForToken } from '../../lib/mascot-dialogues'
import { aspirationFor, TOKEN_EMOJI, TOKEN_NICKNAME } from '../../lib/intro-script'
import { sfx } from '../../lib/sfx'
import { speak, hasSpanishVoice } from '../../lib/speech'

const KEYFRAMES = `
@keyframes intro-fade-in   { from { opacity: 0; } to { opacity: 1; } }
@keyframes intro-fade-out  { from { opacity: 1; } to { opacity: 0; } }
@keyframes intro-slide-in  {
  0%   { opacity: 0; transform: translateX(-80px) scale(0.85); }
  60%  { opacity: 1; transform: translateX(10px)  scale(1.04); }
  100% { opacity: 1; transform: translateX(0)     scale(1);    }
}
@keyframes intro-bill-fly {
  0%   { opacity: 0; transform: translate(0, -40vh) rotate(-25deg) scale(0.4); }
  40%  { opacity: 1; transform: translate(var(--bx, 0), -10vh) rotate(0deg)   scale(0.9); }
  80%  { opacity: 1; transform: translate(var(--bx, 0), 12vh)  rotate(15deg)  scale(0.7); }
  100% { opacity: 0; transform: translate(var(--bx, 0), 18vh)  rotate(20deg)  scale(0.6); }
}
@keyframes intro-bfa-pulse {
  0%, 100% { box-shadow: 0 0 30px 4px rgba(245,197,24,0.4); }
  50%      { box-shadow: 0 0 60px 12px rgba(245,197,24,0.6); }
}
@keyframes intro-title-glow {
  0%, 100% { text-shadow: 0 0 12px rgba(245,197,24,0.4); }
  50%      { text-shadow: 0 0 32px rgba(245,197,24,0.8); }
}
@keyframes intro-aspiration-pop {
  0%   { opacity: 0; transform: translateY(20px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0)    scale(1);    }
}
`

interface Props {
  players: Player[]
  onDone: () => void
}

type Scene =
  | { kind: 'title' }
  | { kind: 'player'; player: Player; aspiration: string }
  | { kind: 'final' }

const SCENE_DURATION: Record<Scene['kind'], number> = {
  title:  3000,
  player: 4500,
  final:  2500,
}

export function StoryIntro({ players, onDone }: Props) {
  // Build scene list once
  const scenes = useMemo<Scene[]>(() => {
    const arr: Scene[] = [{ kind: 'title' }]
    players.forEach(p => {
      arr.push({ kind: 'player', player: p, aspiration: aspirationFor(p.tokenId) })
    })
    arr.push({ kind: 'final' })
    return arr
  }, [players])

  const [idx, setIdx] = useState(0)
  const [exiting, setExiting] = useState(false)
  const scene = scenes[idx]

  useEffect(() => {
    if (!scene) { onDone(); return }
    const dur = SCENE_DURATION[scene.kind]
    const t = setTimeout(() => {
      if (idx === scenes.length - 1) {
        setExiting(true)
        setTimeout(onDone, 500)
      } else {
        setIdx(idx + 1)
      }
    }, dur)
    return () => clearTimeout(t)
  }, [idx, scene, scenes.length, onDone])

  const skip = () => {
    setExiting(true)
    setTimeout(onDone, 350)
  }

  if (!scene) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'radial-gradient(ellipse at center, rgba(27,107,47,0.95) 0%, rgba(6,14,8,0.98) 75%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          animation: exiting ? 'intro-fade-out 0.45s ease forwards' : 'intro-fade-in 0.4s ease forwards',
        }}
      >
        {/* Ambient gold particles */}
        <AmbientGoldDots />

        {/* Scene content */}
        {scene.kind === 'title' && <TitleScene />}
        {scene.kind === 'player' && <PlayerScene scene={scene} />}
        {scene.kind === 'final' && <FinalScene />}

        {/* Progress dots */}
        <div style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: '6px',
        }}>
          {scenes.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? '24px' : '8px', height: '4px',
              borderRadius: '2px',
              background: i <= idx ? '#F5C518' : 'rgba(245,232,200,0.25)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={skip}
          style={{
            position: 'absolute', bottom: '20px', right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(245,232,200,0.2)',
            color: 'rgba(245,232,200,0.6)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
        >
          SALTAR INTRO →
        </button>
      </div>
    </>
  )
}

function AmbientGoldDots() {
  const dots = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top:  Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 4,
  })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {dots.map(d => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.left}%`, top: `${d.top}%`,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: '#F5C518',
            opacity: 0.5,
            boxShadow: '0 0 8px #F5C518',
            animation: `intro-fade-in 1.5s ${d.delay}s ease`,
          }}
        />
      ))}
    </div>
  )
}

function TitleScene() {
  useEffect(() => {
    speak('AGROPOLY BFA. El sueño productivo de El Salvador.', { rate: 0.95 })
    try { sfx.win() } catch { /* user gesture needed first */ }
  }, [])
  return (
    <div style={{ textAlign: 'center', animation: 'intro-fade-in 0.6s ease' }}>
      <p style={{
        color: 'rgba(245,232,200,0.55)',
        fontSize: '13px',
        fontFamily: 'monospace',
        letterSpacing: '0.4em',
        margin: 0,
      }}>
        BANCO DE FOMENTO AGROPECUARIO · 1973
      </p>
      <h1 style={{
        color: '#F5C518',
        fontFamily: 'Cinzel Decorative, Playfair Display, Georgia, serif',
        fontWeight: 900,
        fontSize: 'clamp(56px, 10vw, 120px)',
        margin: '12px 0',
        letterSpacing: '0.02em',
        animation: 'intro-title-glow 2.5s ease-in-out infinite',
      }}>
        AGROPOLY
      </h1>
      <p style={{
        color: '#FDF8EE',
        fontFamily: 'Playfair Display, Georgia, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(18px, 2.5vw, 26px)',
        margin: '8px 0 0',
        opacity: 0.8,
      }}>
        El sueño productivo de El Salvador
      </p>
    </div>
  )
}

function PlayerScene({ scene }: { scene: Extract<Scene, { kind: 'player' }> }) {
  const { player, aspiration } = scene
  const mascot = mascotForToken(player.tokenId)
  const mascotName: Record<string, string> = {
    don_fomento: 'Don Fomento',
    maicita:     'Maicita',
    la_vaquita:  'La Vaquita BFA',
    don_cafe:    'Don Café',
    la_canche:   'La Canche',
    la_tormenta: 'La Tormenta',
  }

  useEffect(() => {
    // Narrate: "<Player>, La Mazorca. Crédito BFA: ƒ1500"
    const text = `${player.name}, ${TOKEN_NICKNAME[player.tokenId]}. Crédito BFA: ${player.balance} fomentos.`
    speak(text, { rate: 1.0 })
    // Coin/win SFX when the bill arrives (~1.5s in)
    setTimeout(() => { try { sfx.passGo() } catch { /* user gesture */ } }, 1400)
  }, [player.name, player.tokenId, player.balance])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
      maxWidth: '600px', padding: '0 24px', textAlign: 'center',
    }}>
      {/* BFA header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,197,24,0.18), rgba(245,197,24,0.06))',
        border: '2px solid rgba(245,197,24,0.55)',
        borderRadius: '12px',
        padding: '8px 18px',
        animation: 'intro-bfa-pulse 2.2s ease-in-out infinite',
      }}>
        <p style={{
          color: '#F5C518', fontFamily: 'monospace',
          fontSize: '11px', letterSpacing: '0.3em',
          margin: 0,
        }}>
          🏦 BANCO DE FOMENTO AGROPECUARIO
        </p>
      </div>

      {/* Token + name */}
      <div style={{
        fontSize: '120px',
        animation: 'intro-slide-in 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
      }}>
        {TOKEN_EMOJI[player.tokenId]}
      </div>
      <div>
        <p style={{
          color: '#F5C518', fontWeight: 800,
          fontSize: '36px', fontFamily: 'Playfair Display, Georgia, serif',
          margin: 0, lineHeight: 1.1,
        }}>
          {player.name}
        </p>
        <p style={{
          color: 'rgba(245,232,200,0.7)', fontSize: '15px',
          fontFamily: 'monospace', letterSpacing: '0.15em',
          margin: '4px 0 0',
        }}>
          {TOKEN_NICKNAME[player.tokenId].toUpperCase()} · {mascotName[mascot] ?? mascot}
        </p>
      </div>

      {/* Falling bill */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        fontSize: '52px',
        animation: 'intro-bill-fly 2.4s ease-in-out 0.3s forwards',
        ['--bx' as string]: '0px',
        opacity: 0,
        pointerEvents: 'none',
      } as React.CSSProperties}>
        💵
      </div>

      {/* Credit amount */}
      <div style={{
        marginTop: '10px',
        background: 'rgba(13,43,20,0.85)',
        border: '2px dashed rgba(245,197,24,0.55)',
        borderRadius: '12px',
        padding: '12px 26px',
        animation: 'intro-aspiration-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.6s both',
      }}>
        <p style={{
          color: 'rgba(245,232,200,0.55)', fontFamily: 'monospace',
          fontSize: '10px', letterSpacing: '0.25em', margin: 0,
        }}>
          CRÉDITO INICIAL BFA
        </p>
        <p style={{
          color: '#F5C518', fontWeight: 800,
          fontSize: '40px', fontFamily: 'Playfair Display, Georgia, serif',
          margin: '2px 0 0', lineHeight: 1,
        }}>
          ƒ{player.balance.toLocaleString()}
        </p>
      </div>

      {/* Aspiration */}
      <div style={{
        marginTop: '10px',
        animation: 'intro-aspiration-pop 0.5s ease-out 2.4s both',
      }}>
        <p style={{
          color: '#FDF8EE',
          fontStyle: 'italic',
          fontSize: '16px',
          fontFamily: 'Playfair Display, Georgia, serif',
          margin: 0,
          opacity: 0.92,
          maxWidth: '480px',
          lineHeight: 1.4,
        }}>
          {aspiration}
        </p>
      </div>
    </div>
  )
}

function FinalScene() {
  useEffect(() => {
    speak('¡Que comience la partida!', { rate: 1.0, pitch: 1.15 })
    try { sfx.win() } catch { /* user gesture */ }
  }, [])
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        color: '#F5C518',
        fontFamily: 'Cinzel Decorative, Playfair Display, Georgia, serif',
        fontWeight: 900,
        fontSize: 'clamp(40px, 7vw, 80px)',
        margin: 0,
        letterSpacing: '0.04em',
        animation: 'intro-title-glow 1.8s ease-in-out infinite',
      }}>
        ¡QUE COMIENCE LA PARTIDA!
      </p>
      <p style={{
        color: '#FDF8EE',
        fontFamily: 'monospace',
        fontSize: '13px',
        letterSpacing: '0.3em',
        margin: '20px 0 0',
        opacity: 0.65,
      }}>
        SEMBRANDO PROGRESO DESDE 1973
      </p>
      {!hasSpanishVoice() && (
        <p style={{
          position: 'absolute', bottom: '70px', left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(245,232,200,0.4)',
          fontSize: '10px', fontFamily: 'monospace',
          letterSpacing: '0.15em',
          textAlign: 'center', width: '90%',
        }}>
          (instala una voz en español en tu sistema para escuchar la narración)
        </p>
      )}
    </div>
  )
}
