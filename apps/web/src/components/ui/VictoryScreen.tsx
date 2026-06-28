import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNetWorth, HOTEL_LEVEL } from '@agropoly/game-engine'
import type { Player, BoardSpace } from '@agropoly/game-engine'
import { useGameStore } from '../../store/gameStore'
import { useMultiplayerStore } from '../../store/multiplayerStore'
import { GLOSARIO } from '../../lib/glosario'
import { recordResult } from '../../lib/stats'
import { checkGameEndUnlocks } from '../../lib/achievements'
import { dispatchUnlocks } from '../../store/achievementToastStore'
import { track } from '../../lib/analytics'

const TOKEN_EMOJI: Record<string, string> = {
  maiz: '🌽', cafe: '☕', vaca: '🐄', tractor: '🚜', milpa: '🌿', pez: '🐟',
}

const CONFETTI_EMOJIS = ['🌽', '🪙', '🌾', '⭐', '🏆', '💰', '☕', '🌿']

const CONFETTI_KEYFRAMES = `
@keyframes confetti-fall {
  0%   { transform: translate3d(var(--cx, 0px), -10vh, 0) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translate3d(var(--cx-end, 0px), 110vh, 0) rotate(720deg); opacity: 0; }
}
@keyframes victory-enter {
  0%   { opacity: 0; transform: scale(0.85); }
  60%  { opacity: 1; transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}
`

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    cx: `${Math.random() * 100 - 50}vw`,
    cxEnd: `${(Math.random() - 0.5) * 30}vw`,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2.5,
    size: 18 + Math.random() * 16,
    rotate: Math.random() * 360,
    left: Math.random() * 100,
  })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            fontSize: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear infinite`,
            // CSS custom properties pulled into the keyframe transform
            ['--cx' as string]: p.cx,
            ['--cx-end' as string]: p.cxEnd,
            transform: `rotate(${p.rotate}deg)`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

interface PlayerStats {
  player: Player
  netWorth: number
  propCount: number
  houseCount: number
  hotelCount: number
  isWinner: boolean
}

function computeStats(players: Player[], board: BoardSpace[], winnerId: string | null): PlayerStats[] {
  return players.map(p => {
    let propCount = 0, houseCount = 0, hotelCount = 0
    board.forEach(sp => {
      if (sp.ownerId !== p.id) return
      propCount++
      const lvl = sp.buildings ?? 0
      if (lvl >= HOTEL_LEVEL) hotelCount++
      else if (lvl > 0) houseCount += lvl
    })
    return {
      player: p,
      netWorth: getNetWorth(p, board),
      propCount,
      houseCount,
      hotelCount,
      isWinner: p.id === winnerId,
    }
  }).sort((a, b) => b.netWorth - a.netWorth)
}

export function VictoryScreen({ mode }: { mode: 'solo' | 'multi' }) {
  const navigate = useNavigate()

  const soloGame      = useGameStore(s => s.game)
  const soloPending   = useGameStore(s => s.pending)
  const soloReset     = useGameStore(s => s.reset)
  const conceptosVist = useGameStore(s => s.conceptosVistos)

  const multiGame    = useMultiplayerStore(s => s.game)
  const multiPending = useMultiplayerStore(s => s.pending)
  const multiDisc    = useMultiplayerStore(s => s.disconnect)

  const game    = mode === 'multi' ? multiGame    : soloGame
  const pending = mode === 'multi' ? multiPending : soloPending

  const isOver = pending === 'game_over' && !!game

  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!isOver) { setShow(false); return }
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [isOver])

  // Record local stats for adaptive onboarding (solo mode only; multi handled server-side)
  const myId = useMultiplayerStore.getState().mySessionId
  useEffect(() => {
    if (!isOver || !game) return
    const winnerId = game.winner ?? null
    const humanPlayer = mode === 'solo'
      ? game.players.find(p => !p.isAI)
      : game.players.find(p => p.id === myId)
    if (!humanPlayer) return
    const isWinner = humanPlayer.id === winnerId
    recordResult(isWinner)
    // Analytics: game ended event
    const winnerObj = game.players.find(p => p.id === winnerId)
    const survivors = game.players.filter(p => !p.bankrupt).length
    const reason = winnerObj && winnerObj.balance >= 5000
      ? 'wealth'
      : survivors <= 1
        ? 'last_standing'
        : 'timeout'
    track('game_ended', {
      mode,
      reason,
      winnerName: winnerObj?.name ?? null,
      winnerToken: winnerObj?.tokenId ?? null,
      humanWon: isWinner,
      bankruptCount: game.players.filter(p => p.bankrupt).length,
      turns: game.turnCount,
      durationMs: Date.now() - (useGameStore.getState().startedAt || Date.now()),
    })
    // Achievement end-of-game checks
    const myStats = stats.find(s => s.player.id === humanPlayer.id)
    if (myStats) {
      const wasMortgaged = game.board.some(sp => sp.ownerId === humanPlayer.id && sp.mortgaged)
      const unlocks = checkGameEndUnlocks({
        isWinner, netWorth: myStats.netWorth,
        wasMortgaged, hadEduMode: !!game.educationalMode,
      })
      dispatchUnlocks(unlocks)
    }
  }, [isOver, game?.winner]) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo<PlayerStats[]>(() => {
    if (!game) return []
    return computeStats(game.players, game.board, game.winner ?? null)
  }, [game])

  if (!isOver || !game) return null
  const winner = stats.find(s => s.isWinner) ?? stats[0]

  const handleHome = () => {
    if (mode === 'multi') multiDisc()
    else soloReset()
    navigate('/')
  }
  const handleAgain = () => {
    if (mode === 'multi') { multiDisc(); navigate('/lobby') }
    else { soloReset(); navigate('/lobby') }
  }

  return (
    <>
      <style>{CONFETTI_KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'radial-gradient(ellipse at center, rgba(13,43,20,0.92) 0%, rgba(0,0,0,0.94) 75%)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <Confetti />

        <div
          style={{
            position: 'relative', zIndex: 1,
            maxWidth: '560px', width: '100%',
            background: 'linear-gradient(180deg, rgba(27,107,47,0.4) 0%, rgba(13,43,20,0.6) 100%)',
            border: '2px solid rgba(245,197,24,0.5)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,197,24,0.15) inset',
            animation: show ? 'victory-enter 0.6s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}
        >
          {/* Trophy + winner */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '72px', lineHeight: 1, filter: 'drop-shadow(0 0 24px rgba(245,197,24,0.5))' }}>
              🏆
            </div>
            <p style={{
              color: 'rgba(245,232,200,0.6)', fontSize: '11px',
              letterSpacing: '0.25em', fontFamily: 'monospace',
              margin: '12px 0 4px',
            }}>
              GANADOR
            </p>
            <h2 style={{
              color: '#F5C518', fontSize: '32px', fontWeight: 800,
              margin: 0, textShadow: '0 0 24px rgba(245,197,24,0.3)',
            }}>
              {TOKEN_EMOJI[winner.player.tokenId] ?? '🎲'} {winner.player.name}
            </h2>
            <p style={{ color: 'rgba(245,232,200,0.7)', fontSize: '13px', margin: '6px 0 0' }}>
              Patrimonio final: <span style={{ color: '#F5C518', fontWeight: 700 }}>ƒ{winner.netWorth.toLocaleString()}</span>
            </p>
          </div>

          {/* Stats per player */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{
              color: 'rgba(245,232,200,0.5)', fontSize: '10px',
              letterSpacing: '0.2em', fontFamily: 'monospace', margin: 0,
            }}>
              RESULTADO FINAL
            </p>
            {stats.map((s, i) => (
              <div
                key={s.player.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  alignItems: 'center', gap: '10px',
                  padding: '10px 12px',
                  background: s.isWinner ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${s.isWinner ? 'rgba(245,197,24,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  opacity: s.player.bankrupt && !s.isWinner ? 0.5 : 1,
                }}
              >
                <span style={{
                  color: s.isWinner ? '#F5C518' : 'rgba(245,232,200,0.4)',
                  fontFamily: 'monospace', fontWeight: 700, textAlign: 'center',
                }}>
                  #{i + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    color: '#F5C518', fontWeight: 700, fontSize: '14px', margin: 0,
                    textDecoration: s.player.bankrupt ? 'line-through' : 'none',
                  }}>
                    {TOKEN_EMOJI[s.player.tokenId] ?? '·'} {s.player.name}
                  </p>
                  <p style={{
                    color: 'rgba(245,232,200,0.5)', fontSize: '11px',
                    margin: '2px 0 0', fontFamily: 'monospace',
                  }}>
                    {s.propCount} props · {s.houseCount} 🏠 · {s.hotelCount} 🏨
                    {s.player.bankrupt && ' · QUEBRADO'}
                  </p>
                </div>
                <span style={{
                  color: s.isWinner ? '#F5C518' : 'rgba(245,232,200,0.7)',
                  fontFamily: 'monospace', fontWeight: 700, fontSize: '13px',
                }}>
                  ƒ{s.netWorth.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Concepts seen (educational mode only) */}
          {mode === 'solo' && game.educationalMode && conceptosVist.length > 0 && (
            <div style={{
              padding: '10px 12px',
              background: 'rgba(46,139,74,0.1)',
              border: '1px solid rgba(46,139,74,0.3)',
              borderRadius: '10px',
            }}>
              <p style={{ color: '#F5C518', fontSize: '11px', fontWeight: 700,
                          margin: '0 0 6px', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                📚 CONCEPTOS QUE PRACTICASTE ({conceptosVist.length})
              </p>
              <p style={{ color: 'rgba(245,232,200,0.75)', fontSize: '11px',
                          margin: 0, lineHeight: 1.5 }}>
                {conceptosVist.map(id => GLOSARIO[id]?.termino ?? id).join(' · ')}
              </p>
            </div>
          )}

          {/* Meta */}
          <p style={{
            color: 'rgba(245,232,200,0.4)', fontSize: '11px',
            margin: 0, textAlign: 'center', fontFamily: 'monospace',
          }}>
            {game.turnCount} turnos jugados · modo {mode}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={handleHome} className="btn-secondary" style={{ flex: 1 }}>
              Inicio
            </button>
            <button onClick={handleAgain} className="btn-gold" style={{ flex: 1 }}>
              🔄 Nueva partida
            </button>
          </div>

          {/* Brand footer */}
          <div style={{
            marginTop: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: 0.5,
          }}>
            <img src="/logo-bfa.png" alt="BFA" style={{ height: '26px', width: 'auto' }} />
            <span style={{ color: '#FDF8EE', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.2em' }}>
              PRESENTADO POR BFA · EL SALVADOR
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
