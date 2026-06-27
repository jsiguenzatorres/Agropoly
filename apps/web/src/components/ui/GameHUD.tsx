import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useNavigate } from 'react-router-dom'

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
  const { game, pending, lastDice, pendingCard, pendingAmount,
    rollDice, confirmBuy, skipBuy, confirmRent, confirmTax,
    drawCard, applyCard, payJailFine, rollForJail, endTurn, reset,
  } = useGameStore()
  const navigate = useNavigate()

  const player = game?.players[game.currentPlayerIndex] ?? null

  // AI auto-play
  useEffect(() => {
    if (!game || !player?.isAI || pending === 'game_over') return
    const delay = pending === 'roll' ? 1200 : 900
    const t = setTimeout(() => {
      const space = game.board[player.position]
      if      (pending === 'roll')       rollDice()
      else if (pending === 'buy')        player.balance >= (space?.price ?? Infinity) ? confirmBuy() : skipBuy()
      else if (pending === 'pay_rent')   confirmRent()
      else if (pending === 'pay_tax')    confirmTax()
      else if (pending === 'cosecha' || pending === 'riesgo') drawCard()
      else if (pending === 'apply_card') applyCard()
      else if (pending === 'jail_choice') player.jailFreeCards > 0 ? payJailFine() : rollForJail()
      else if (pending === 'end')        endTurn()
    }, delay)
    return () => clearTimeout(t)
  }, [pending, game?.currentPlayerIndex]) // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Buttons */}
        {isHuman && (
          <div className="flex flex-col gap-2 w-full">

            {pending === 'roll' && (
              <button onClick={rollDice} className="btn-gold w-full">
                🎲 Lanzar Dados
              </button>
            )}

            {pending === 'buy' && space && (
              <>
                <button onClick={confirmBuy} disabled={player.balance < space.price} className="btn-gold w-full">
                  🏠 Comprar por ƒ{space.price}
                </button>
                <button onClick={skipBuy} className="btn-secondary w-full">
                  Pasar
                </button>
              </>
            )}

            {pending === 'pay_rent' && (
              <button onClick={confirmRent} className="btn-primary w-full">
                💸 Pagar renta ƒ{pendingAmount}
              </button>
            )}

            {pending === 'pay_tax' && (
              <button onClick={confirmTax} className="btn-primary w-full">
                🧾 Pagar impuesto ƒ{pendingAmount}
              </button>
            )}

            {(pending === 'cosecha' || pending === 'riesgo') && (
              <button onClick={drawCard} className="btn-gold w-full">
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
                <button onClick={payJailFine} disabled={player.balance < 50} className="btn-gold w-full">
                  💰 Pagar fianza ƒ50
                </button>
                <button onClick={rollForJail} className="btn-secondary w-full">
                  🎲 Intentar dobles
                </button>
              </>
            )}

            {pending === 'end' && (
              <button onClick={endTurn} className="btn-primary w-full">
                ✓ Terminar turno
              </button>
            )}

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
