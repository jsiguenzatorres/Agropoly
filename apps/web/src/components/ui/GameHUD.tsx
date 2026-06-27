import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useNavigate } from 'react-router-dom'
import { sfx } from '../../lib/sfx'
import { DIALOGUES } from '../../lib/mascot-dialogues'
import { canBuild, checkGroupOwnership, HOTEL_LEVEL } from '@agropoly/game-engine'

const GROUP_NAMES: Record<number, string> = {
  0: 'Occidente I', 1: 'Occidente II', 2: 'Centro Norte',
  3: 'Paracentral', 4: 'Oriente I', 5: 'Oriente II',
  6: 'Gran S.S.', 7: 'Casa Matriz',
}

function Die({ value }: { value: number }) {
  const dots: Record<number, string> = {
    1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
  }
  return <span className="text-3xl">{dots[value] ?? '?'}</span>
}

export function GameHUD() {
  const { game, pending, lastDice, pendingCard, pendingAmount, isMoving,
    rollDice, confirmBuy, skipBuy, confirmRent, confirmTax,
    drawCard, applyCard, payJailFine, rollForJail, endTurn, reset,
    showMascot, build,
  } = useGameStore()
  const navigate = useNavigate()

  const player = game?.players[game?.currentPlayerIndex ?? 0] ?? null
  const locked = isMoving

  // SFX on game over
  useEffect(() => { if (pending === 'game_over') sfx.win() }, [pending])

  // Mascot trigger — fires whenever pending action or active player changes
  useEffect(() => {
    if (!game || !player) return
    if (!player.isAI) {
      if      (pending === 'roll')        showMascot(DIALOGUES.roll_human())
      else if (pending === 'buy')         showMascot(DIALOGUES.buy())
      else if (pending === 'pay_rent')    showMascot(DIALOGUES.pay_rent())
      else if (pending === 'pay_tax')     showMascot(DIALOGUES.pay_tax())
      else if (pending === 'cosecha')     showMascot(DIALOGUES.cosecha())
      else if (pending === 'riesgo')      showMascot(DIALOGUES.riesgo())
      else if (pending === 'jail_choice') showMascot(DIALOGUES.jail())
    } else if (pending === 'cosecha' || pending === 'riesgo') {
      if (Math.random() < 0.4) showMascot(pending === 'cosecha' ? DIALOGUES.cosecha() : DIALOGUES.riesgo())
    }
    if (pending === 'game_over') {
      const winner = game.players.find(p => !p.bankrupt)
      if (winner) showMascot(DIALOGUES.win(winner.name))
    }
  }, [pending, game?.currentPlayerIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // AI auto-play — waits until animation finishes
  useEffect(() => {
    if (!game || !player?.isAI || pending === 'game_over' || isMoving) return
    const delay = pending === 'roll' ? 1400 : 900
    const t = setTimeout(() => {
      const space = game.board[player.position]
      if      (pending === 'roll')       rollDice()
      else if (pending === 'buy')        player.balance >= (space?.price ?? Infinity) ? confirmBuy() : skipBuy()
      else if (pending === 'pay_rent')   confirmRent()
      else if (pending === 'pay_tax')    confirmTax()
      else if (pending === 'cosecha' || pending === 'riesgo') drawCard()
      else if (pending === 'apply_card') applyCard()
      else if (pending === 'jail_choice') player.jailFreeCards > 0 ? payJailFine() : rollForJail()
      else if (pending === 'end') {
        // AI greedy build: keep reserve of 200 ƒ, build cheapest available property first
        // Loop until no more builds possible (each build mutates state, so re-query store)
        let safety = 20
        while (safety-- > 0) {
          const { game: g } = useGameStore.getState()
          if (!g) break
          const p = g.players[g.currentPlayerIndex]
          if (!p) break
          const buildable = p.properties
            .map(id => g.board[id])
            .filter(sp => canBuild(sp.id, p.id, g.board, g.players).canBuild)
            .sort((a, b) => a.hcost - b.hcost)
          if (!buildable.length || p.balance - buildable[0].hcost < 200) break
          build(buildable[0].id)
        }
        endTurn()
      }
    }, delay)
    return () => clearTimeout(t)
  }, [pending, game?.currentPlayerIndex, isMoving]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!game || !player) return null
  const space = game.board[player.position]
  const alive = game.players.filter(p => !p.bankrupt)

  const isHuman = !player.isAI

  return (
    <>
      {/* Scoreboard — top left */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        {game.players.map((p, i) => (
          <div
            key={p.id}
            className={`glass-card px-3 py-1.5 flex items-center gap-2 text-xs transition-all ${
              i === game.currentPlayerIndex
                ? 'border-bfa-gold-500/60 bg-bfa-gold-500/10'
                : 'opacity-50'
            } ${p.bankrupt ? 'line-through opacity-20' : ''}`}
          >
            <span className="font-mono text-bfa-gold-500 font-bold w-20 truncate">{p.name}</span>
            <span className="text-bfa-cream/70">ƒ{p.balance}</span>
            {p.jailed && <span title="En Emergencia">🔒</span>}
          </div>
        ))}
      </div>

      {/* Dice display — top right */}
      {lastDice && (
        <div className="absolute top-4 right-4 glass-card px-4 py-3 flex flex-col items-center gap-1 z-20">
          <div className="flex gap-2">
            <Die value={lastDice.d1} />
            <Die value={lastDice.d2} />
          </div>
          <p className="font-mono text-bfa-gold-500 text-xs">
            = {lastDice.d1 + lastDice.d2}
            {lastDice.doubles && ' 🎯 Dobles'}
          </p>
        </div>
      )}

      {/* Action panel — bottom center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 w-full max-w-sm px-4">

        {/* Space info */}
        {space && (
          <div className="glass-card px-4 py-2 text-center w-full">
            <p className="text-bfa-gold-500 font-display font-bold text-sm">{space.name}</p>
            {space.type === 'prop' && (
              <p className="text-bfa-cream/50 text-xs">{GROUP_NAMES[space.group]} · ƒ{space.price}</p>
            )}
          </div>
        )}

        {/* Turn indicator */}
        <p className="text-bfa-cream/60 text-xs font-mono tracking-wider">
          {player.isAI ? '🤖' : '👤'} {player.name} · ƒ{player.balance}
        </p>

        {/* Animation indicator */}
        {locked && (
          <div className="glass-card px-4 py-1.5 text-center">
            <p className="text-bfa-gold-500 font-mono text-xs tracking-widest animate-pulse">
              moviendo…
            </p>
          </div>
        )}

        {/* Buttons */}
        {isHuman && !locked && (
          <div className="flex flex-col gap-2 w-full">

            {pending === 'roll' && (
              <button onClick={() => { sfx.dice(); rollDice() }} className="btn-gold w-full">
                🎲 Lanzar Dados
              </button>
            )}

            {pending === 'buy' && space && (
              <>
                <button
                  onClick={() => { sfx.buy(); confirmBuy() }}
                  disabled={player.balance < space.price}
                  className="btn-gold w-full"
                >
                  🏠 Comprar por ƒ{space.price}
                </button>
                <button onClick={skipBuy} className="btn-secondary w-full">Pasar</button>
              </>
            )}

            {pending === 'pay_rent' && (
              <button onClick={() => { sfx.rent(); confirmRent() }} className="btn-primary w-full">
                💸 Pagar renta ƒ{pendingAmount}
              </button>
            )}

            {pending === 'pay_tax' && (
              <button onClick={() => { sfx.tax(); confirmTax() }} className="btn-primary w-full">
                🧾 Pagar impuesto ƒ{pendingAmount}
              </button>
            )}

            {(pending === 'cosecha' || pending === 'riesgo') && (
              <button onClick={() => { sfx.card(); drawCard() }} className="btn-gold w-full">
                {pending === 'cosecha' ? '🌾 Robar Tarjeta Cosecha' : '⚡ Robar Tarjeta Riesgo'}
              </button>
            )}

            {pending === 'apply_card' && pendingCard && (
              <div className="glass-card p-4 w-full flex flex-col gap-3">
                <div className="text-center">
                  <p className="text-2xl">{pendingCard.icon}</p>
                  <p className="text-bfa-gold-500 font-bold text-sm">{pendingCard.title}</p>
                  <p className="text-bfa-cream/70 text-xs mt-1">{pendingCard.text}</p>
                </div>
                <button onClick={applyCard} className="btn-gold w-full">Aceptar</button>
              </div>
            )}

            {pending === 'jail_choice' && (
              <>
                <button
                  onClick={() => { sfx.jail(); payJailFine() }}
                  disabled={player.balance < 50}
                  className="btn-gold w-full"
                >
                  💰 Pagar fianza ƒ50
                </button>
                <button onClick={() => { sfx.dice(); rollForJail() }} className="btn-secondary w-full">
                  🎲 Intentar dobles
                </button>
              </>
            )}

            {pending === 'end' && (() => {
              // Propiedades del jugador donde puede construir o ya tiene buildings
              const ownedProps = player.properties
                .map(id => game.board[id])
                .filter(sp => sp && sp.type === 'prop' && checkGroupOwnership(player.id, sp.group, game.board))
                .sort((a, b) => a.group - b.group || a.id - b.id)

              return (
                <>
                  {ownedProps.length > 0 && (
                    <div className="glass-card p-3 w-full flex flex-col gap-2 max-h-56 overflow-y-auto">
                      <p className="text-bfa-gold-500 font-display text-xs tracking-wider text-center">
                        🏗️ CONSTRUIR
                      </p>
                      {ownedProps.map(sp => {
                        const r = canBuild(sp.id, player.id, game.board, game.players)
                        const lvl = sp.buildings ?? 0
                        const icon = lvl >= HOTEL_LEVEL ? '🏨'
                          : lvl > 0 ? '🏠'.repeat(lvl) : '·'
                        return (
                          <button
                            key={sp.id}
                            onClick={() => { sfx.buy(); build(sp.id) }}
                            disabled={!r.canBuild}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-bfa-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                            title={r.canBuild ? `Construir por ƒ${sp.hcost}` : (r.reason ?? '')}
                          >
                            <span className="text-bfa-cream/80 truncate flex-1 text-left">{sp.name}</span>
                            <span className="font-mono text-bfa-gold-500 mx-2 w-12 text-center">{icon}</span>
                            <span className="font-mono text-bfa-cream/60">ƒ{sp.hcost}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                  <button onClick={endTurn} className="btn-primary w-full">
                    ✓ Terminar turno
                  </button>
                </>
              )
            })()}

            {pending === 'game_over' && (
              <div className="glass-card p-4 w-full flex flex-col gap-3 text-center">
                <p className="text-bfa-gold-500 font-display font-bold text-lg">
                  🏆 {alive[0]?.name ?? '—'} ganó!
                </p>
                <button onClick={() => { reset(); navigate('/') }} className="btn-gold w-full">
                  Volver al inicio
                </button>
              </div>
            )}
          </div>
        )}

        {/* AI turn indicator */}
        {!isHuman && pending !== 'game_over' && (
          <div className="glass-card px-6 py-3 text-center animate-pulse">
            <p className="text-bfa-cream/60 text-sm">🤖 Turno de {player.name}…</p>
          </div>
        )}
      </div>
    </>
  )
}
