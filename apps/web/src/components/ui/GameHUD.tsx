import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useMultiplayerStore } from '../../store/multiplayerStore'
import { useGameSource } from '../../store/useGameSource'
import { sfx } from '../../lib/sfx'
import { DIALOGUES } from '../../lib/mascot-dialogues'
import { EDU_TIPS } from '../../lib/edu-tips'
import { postSoloSession } from '../../lib/sessions-api'
import {
  canBuild, canMortgage, canUnmortgage, canSellBuilding,
  mortgageValue, unmortgageCost, sellBuildingValue,
  HOTEL_LEVEL, AUCTION_MIN_BID, CLIMATE_INFO,
} from '@agropoly/game-engine'
import { TradeComposeModal } from './TradeModal'
import { aiShouldBuy, aiBuildPicks, aiAuctionBid } from '../../lib/ai'
import { isVoiceCommandSupported, startVoiceCommands, type VoiceCommandHandle } from '../../lib/voice-command'
import { toastMoneyIn, toastMoneyOut } from '../../store/toastStore'

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

function BidControls({ minBid, maxBid, onBid, onPass }: {
  minBid: number; maxBid: number; onBid: (n: number) => void; onPass: () => void
}) {
  const [bid, setBid] = useState(minBid)
  useEffect(() => { setBid(minBid) }, [minBid])
  const valid = bid >= minBid && bid <= maxBid
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={minBid}
          max={maxBid}
          value={bid}
          onChange={e => setBid(Number(e.target.value))}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-bfa-cream text-sm font-mono outline-none focus:border-bfa-gold-500/50"
        />
        <span className="text-bfa-cream/40 text-[10px] font-mono whitespace-nowrap">
          min ƒ{minBid} · max ƒ{maxBid}
        </span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => valid && onBid(bid)} disabled={!valid} className="btn-gold flex-1 text-sm py-2">
          💰 Pujar ƒ{bid}
        </button>
        <button onClick={onPass} className="btn-secondary flex-1 text-sm py-2">
          ❌ Pasar
        </button>
      </div>
    </div>
  )
}

export function GameHUD({ mode = 'solo' }: { mode?: 'solo' | 'multi' }) {
  const src = useGameSource(mode)
  const { game, pending, lastDice, pendingCard, pendingAmount, isMoving,
    rollDice, confirmBuy, skipBuy, confirmRent, confirmTax,
    drawCard, applyCard, payJailFine, rollForJail, endTurn,
    build, sellBuilding, mortgage, unmortgage,
    placeBid, passAuction, auction,
    useJailFreeCard,
  } = src
  // Mascot/EduTip state lives only in the local gameStore — both modes use it
  const showMascot = useGameStore(s => s.showMascot)
  const showEduTip = useGameStore(s => s.showEduTip)

  const player = game?.players[game?.currentPlayerIndex ?? 0] ?? null
  const locked = isMoving
  // Spectators never have a turn — always view-only
  const isSpectator = mode === 'multi' && useMultiplayerStore.getState().isSpectator
  // In multi mode, "isHuman" means "this is MY turn"; in solo, !player.isAI
  const isMyTurn = isSpectator ? false : (mode === 'multi'
    ? !!(player && src.mySessionId && player.id === src.mySessionId)
    : !!(player && !player.isAI))
  const [showTrade, setShowTrade] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const voiceHandle = useRef<VoiceCommandHandle | null>(null)

  // Money toast: track human player balance delta across turns
  const humanPlayer = game?.players.find(p => mode === 'multi' ? p.id === src.mySessionId : !p.isAI)
  const prevBalance = useRef<number | null>(null)
  useEffect(() => {
    if (!humanPlayer) return
    const prev = prevBalance.current
    if (prev !== null && humanPlayer.balance !== prev) {
      const delta = humanPlayer.balance - prev
      if (delta > 0) toastMoneyIn(delta)
      else if (delta < 0) toastMoneyOut(-delta)
    }
    prevBalance.current = humanPlayer.balance
  }, [humanPlayer?.balance]) // eslint-disable-line react-hooks/exhaustive-deps

  // Voice commands: lifecycle bound to voiceOn toggle
  useEffect(() => {
    if (!voiceOn) {
      voiceHandle.current?.stop(); voiceHandle.current = null
      return
    }
    voiceHandle.current = startVoiceCommands(intent => {
      const s = src
      if (intent === 'roll' && s.pending === 'roll')   s.rollDice()
      else if (intent === 'end'  && s.pending === 'end')  s.endTurn()
      else if (intent === 'buy'  && s.pending === 'buy')  s.confirmBuy()
      else if (intent === 'pass' && s.pending === 'buy')  s.skipBuy()
    })
    return () => { voiceHandle.current?.stop(); voiceHandle.current = null }
  }, [voiceOn]) // eslint-disable-line react-hooks/exhaustive-deps

  // SFX on game over + persist solo session to server
  useEffect(() => {
    if (pending !== 'game_over') return
    sfx.win()
    if (mode === 'solo') {
      const s = useGameStore.getState()
      if (s.game && s.sessionId) {
        postSoloSession(s.game, s.sessionId, s.startedAt)
      }
    }
  }, [pending, mode])

  // Mascot trigger — fires whenever pending action or active player changes
  // La Vaquita BFA owns the GO event; La Tormenta only appears in Riesgo events
  const lastPosition = useRef<number>(0)
  useEffect(() => {
    if (!game || !player) return
    // Pass GO detection (La Vaquita)
    const passedGoForMascot = player.position < lastPosition.current
    lastPosition.current = player.position
    if (passedGoForMascot) { showMascot(DIALOGUES.go_pass()); return }

    if (isMyTurn) {
      if      (pending === 'roll')        showMascot(DIALOGUES.roll_human())
      else if (pending === 'buy')         showMascot(DIALOGUES.buy())
      else if (pending === 'pay_rent')    showMascot(DIALOGUES.pay_rent())
      else if (pending === 'pay_tax')     showMascot(DIALOGUES.pay_tax())
      else if (pending === 'cosecha')     showMascot(DIALOGUES.cosecha())
      else if (pending === 'riesgo')      showMascot(DIALOGUES.riesgo())
      else if (pending === 'jail_choice') showMascot(DIALOGUES.jail())
      else if (pending === 'auction')     showMascot(DIALOGUES.auction_start())
    } else if (pending === 'cosecha' || pending === 'riesgo') {
      if (Math.random() < 0.4) showMascot(pending === 'cosecha' ? DIALOGUES.cosecha() : DIALOGUES.riesgo())
    }
    if (pending === 'game_over') {
      const winner = game.players.find(p => !p.bankrupt)
      if (winner) showMascot(DIALOGUES.win(winner.name))
    }
  }, [pending, game?.currentPlayerIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Educational mode: BFA tips on key events ────────────────────────────────
  // Track each player's previous position to detect "passed GO"
  const prevPositions = useRef<Record<string, number>>({})
  useEffect(() => {
    if (!game?.educationalMode || !player) return

    // "Passed GO" detection: position decreased (wrap-around) or landed on 0
    const prev = prevPositions.current[player.id] ?? 0
    const passedGo = (player.position < prev || (player.position === 0 && prev !== 0))
    prevPositions.current[player.id] = player.position

    if (passedGo)                       { showEduTip(EDU_TIPS.go_pass()); return }
    if (pending === 'buy'      && Math.random() < 0.6) showEduTip(EDU_TIPS.buy())
    else if (pending === 'pay_rent' && Math.random() < 0.5) showEduTip(EDU_TIPS.pay_rent())
    else if (pending === 'pay_tax'  && Math.random() < 0.7) showEduTip(EDU_TIPS.pay_tax())
    else if (pending === 'cosecha'  && Math.random() < 0.5) showEduTip(EDU_TIPS.cosecha())
    else if (pending === 'riesgo'   && Math.random() < 0.6) showEduTip(EDU_TIPS.riesgo())
    else if (pending === 'jail_choice')                     showEduTip(EDU_TIPS.jail())
  }, [pending, game?.currentPlayerIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // AI auto-play — waits until animation finishes; only in solo mode
  useEffect(() => {
    if (mode !== 'solo') return
    if (!game || !player?.isAI || pending === 'game_over' || isMoving) return
    const delay = pending === 'roll' ? 1400 : 900
    const t = setTimeout(() => {
      const space = game.board[player.position]
      if      (pending === 'roll')       rollDice()
      else if (pending === 'buy')        space && aiShouldBuy(player, space, game.board) ? confirmBuy() : skipBuy()
      else if (pending === 'pay_rent')   confirmRent()
      else if (pending === 'pay_tax')    confirmTax()
      else if (pending === 'cosecha' || pending === 'riesgo') drawCard()
      else if (pending === 'apply_card') applyCard()
      else if (pending === 'jail_choice') player.jailFreeCards > 0 ? useJailFreeCard() : rollForJail()
      else if (pending === 'end') {
        // Difficulty-aware build loop (uses aiBuildPicks). Re-query store after each build.
        let safety = 20
        while (safety-- > 0) {
          const { game: g } = useGameStore.getState()
          if (!g) break
          const p = g.players[g.currentPlayerIndex]
          if (!p) break
          const picks = aiBuildPicks(p, g.board, g.players)
          if (picks.length === 0) break
          build(picks[0])
        }
        endTurn()
      }
    }, delay)
    return () => clearTimeout(t)
  }, [pending, game?.currentPlayerIndex, isMoving]) // eslint-disable-line react-hooks/exhaustive-deps

  // AI auction bidder — solo mode only. Triggers whenever the bidder changes.
  // Uses difficulty-aware aiAuctionBid (easy=conservative, hard=normal, expert=aggressive on completing groups).
  useEffect(() => {
    if (mode !== 'solo') return
    if (!game || !auction || pending !== 'auction') return
    const bidder = game.players.find(p => p.id === auction.currentBidderId)
    if (!bidder?.isAI || bidder.bankrupt) return
    const space = game.board[auction.spaceId]
    if (!space) return
    const t = setTimeout(() => {
      const bid = aiAuctionBid(bidder, space, auction.currentBid, game.board)
      if (bid !== null) placeBid(bid)
      else passAuction()
    }, 700)
    return () => clearTimeout(t)
  }, [pending, auction?.currentBidderId, auction?.currentBid]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!game || !player) return null
  const space = game.board[player.position]

  const isHuman = isMyTurn

  return (
    <>
      {/* Scoreboard — top: column on desktop, horizontal scroll on mobile */}
      <div className="absolute top-2 left-2 right-2 sm:right-auto sm:top-4 sm:left-4 flex flex-row sm:flex-col gap-1.5 sm:gap-2 z-20 overflow-x-auto sm:overflow-visible scrollbar-hide">
        {game.players.map((p, i) => (
          <div
            key={p.id}
            className={`glass-card px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs transition-all shrink-0 ${
              i === game.currentPlayerIndex
                ? 'border-bfa-gold-500/60 bg-bfa-gold-500/10'
                : 'opacity-50'
            } ${p.bankrupt ? 'line-through opacity-20' : ''}`}
          >
            <span className="font-mono text-bfa-gold-500 font-bold max-w-[60px] sm:w-20 truncate">{p.name}</span>
            {p.isAI && (
              <span className="text-[8px] sm:text-[9px] font-mono text-bfa-cream/40 uppercase">
                {p.difficulty === 'easy' ? 'EZ' : p.difficulty === 'hard' ? 'HARD' : 'EXP'}
              </span>
            )}
            <span className="text-bfa-cream/70 whitespace-nowrap">ƒ{p.balance}</span>
            {p.jailed && <span title="En Emergencia">🔒</span>}
          </div>
        ))}
      </div>

      {/* Spectator indicator */}
      {isSpectator && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 glass-card px-3 py-1 text-[10px] sm:text-xs font-mono text-bfa-amber border border-bfa-amber/40 bg-bfa-amber/10">
          👁️ MODO ESPECTADOR
        </div>
      )}

      {/* Voice toggle — top left below scoreboard on mobile, hidden if not supported */}
      {isVoiceCommandSupported() && (
        <button
          onClick={() => setVoiceOn(v => !v)}
          className={`absolute top-12 left-2 sm:top-4 sm:left-72 z-20 glass-card px-2 py-1 text-[10px] sm:text-xs font-mono transition-all ${
            voiceOn ? 'border-bfa-gold-500/60 text-bfa-gold-500 bg-bfa-gold-500/10 animate-pulse' : 'text-bfa-cream/50'
          }`}
          title='Comandos: "lanzar dados", "comprar", "pasar", "terminar turno"'
        >
          {voiceOn ? '🎙️ ON' : '🎙️ off'}
        </button>
      )}

      {/* Dice + climate display — top right (smaller on mobile) */}
      {lastDice && (
        <div className="absolute top-12 right-2 sm:top-4 sm:right-4 glass-card px-3 py-2 sm:px-4 sm:py-3 flex flex-col items-center gap-0.5 sm:gap-1 z-20">
          <div className="flex gap-1 sm:gap-2 items-center">
            <Die value={lastDice.d1} />
            <Die value={lastDice.d2} />
            {game.climate && (
              <span className="text-2xl sm:text-3xl ml-1" title={`${CLIMATE_INFO[game.climate].label} · cosechas ×${CLIMATE_INFO[game.climate].multiplier}`}>
                {CLIMATE_INFO[game.climate].emoji}
              </span>
            )}
          </div>
          <p className="font-mono text-bfa-gold-500 text-[10px] sm:text-xs">
            = {lastDice.d1 + lastDice.d2}
            {lastDice.doubles && ' 🎯'}
            {game.climate && ` · ${CLIMATE_INFO[game.climate].label} ×${CLIMATE_INFO[game.climate].multiplier}`}
          </p>
        </div>
      )}

      {/* Action panel — bottom center */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 sm:gap-3 w-full max-w-sm px-3 sm:px-4">

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

        {/* Auction panel — visible to everyone when an auction is running */}
        {pending === 'auction' && auction && (() => {
          const auctionSpace = game.board[auction.spaceId]
          const bidder       = game.players.find(p => p.id === auction.currentBidderId)
          const highBidder   = auction.highBidderId ? game.players.find(p => p.id === auction.highBidderId) : null
          const isMyBidTurn  = mode === 'multi'
            ? bidder?.id === src.mySessionId
            : !!bidder && !bidder.isAI
          const minBid = auction.currentBid + AUCTION_MIN_BID
          return (
            <div className="glass-card p-3 w-full flex flex-col gap-2">
              <p className="text-bfa-gold-500 font-display text-sm tracking-wider text-center">
                🔨 SUBASTA · {auctionSpace?.name}
              </p>
              <p className="text-center text-bfa-cream/70 text-xs font-mono">
                Precio base ƒ{auctionSpace?.price ?? 0}
                {highBidder
                  ? <> · Mejor oferta <span className="text-bfa-gold-500">ƒ{auction.currentBid}</span> ({highBidder.name})</>
                  : <> · sin ofertas</>}
              </p>
              <p className="text-center text-bfa-cream/50 text-xs font-mono">
                Turno: <span className="text-bfa-gold-500">{bidder?.name ?? '—'}</span>
                {' · '}{auction.participants.length} aún en subasta
              </p>
              {isMyBidTurn && bidder && (
                <BidControls
                  minBid={minBid}
                  maxBid={bidder.balance}
                  onBid={amount => placeBid(amount)}
                  onPass={passAuction}
                />
              )}
              {!isMyBidTurn && (
                <p className="text-center text-bfa-cream/40 text-xs animate-pulse font-mono">
                  Esperando a {bidder?.name ?? '...'}
                </p>
              )}
            </div>
          )
        })()}

        {/* Buttons */}
        {isHuman && !locked && pending !== 'auction' && (
          <div className="flex flex-col gap-2 w-full">

            {pending === 'roll' && (
              <button onClick={() => { sfx.dice(); rollDice() }} className="btn-gold w-full">
                🎲 Lanzar Dados
              </button>
            )}

            {pending === 'buy' && space && (
              <>
                <button
                  onClick={() => { sfx.buy(); confirmBuy(); showMascot(DIALOGUES.property_bought()) }}
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
                {player.jailFreeCards > 0 && (
                  <button
                    onClick={() => { sfx.jail(); useJailFreeCard() }}
                    className="btn-gold w-full"
                  >
                    🎟️ Usar Carta Libre ({player.jailFreeCards})
                  </button>
                )}
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
              // All player-owned properties (incl. station/utility for mortgage)
              const ownedProps = player.properties
                .map(id => game.board[id])
                .filter(sp => sp && (sp.type === 'prop' || sp.type === 'station' || sp.type === 'utility'))
                .sort((a, b) => a.group - b.group || a.id - b.id)

              return (
                <>
                  {ownedProps.length > 0 && (
                    <div className="glass-card p-3 w-full flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                      <p className="text-bfa-gold-500 font-display text-xs tracking-wider text-center">
                        🏘️ TUS PROPIEDADES
                      </p>
                      {ownedProps.map(sp => {
                        const lvl = sp.buildings ?? 0
                        const buildR     = sp.type === 'prop' ? canBuild(sp.id, player.id, game.board, game.players) : { canBuild: false }
                        const sellR      = sp.type === 'prop' ? canSellBuilding(sp.id, player.id, game.board) : { canDo: false }
                        const mortR      = canMortgage(sp.id, player.id, game.board)
                        const unmortR    = canUnmortgage(sp.id, player.id, game.board, game.players)
                        const stateIcon  = sp.mortgaged ? '🔓' : (lvl >= HOTEL_LEVEL ? '🏨' : lvl > 0 ? '🏠'.repeat(lvl) : '·')

                        return (
                          <div
                            key={sp.id}
                            className={`flex flex-col gap-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 ${
                              sp.mortgaged ? 'opacity-60' : ''
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-bfa-cream/80 truncate flex-1">{sp.name}</span>
                              <span className="font-mono text-bfa-gold-500 w-14 text-center text-[10px]">{stateIcon}</span>
                            </div>
                            <div className="flex gap-1">
                              {/* Build */}
                              {buildR.canBuild && (
                                <button
                                  onClick={() => {
                                    sfx.buy(); build(sp.id)
                                    // If this build creates a hotel (level 5), La Vaquita reacts
                                    if (lvl + 1 >= HOTEL_LEVEL) showMascot(DIALOGUES.hotel_built())
                                    if (game.educationalMode && Math.random() < 0.4) showEduTip(EDU_TIPS.build())
                                  }}
                                  className="flex-1 px-2 py-1 rounded bg-bfa-green-500/20 hover:bg-bfa-green-500/30 text-bfa-green-300 text-[10px] font-mono"
                                  title={`Construir por ƒ${sp.hcost}`}
                                >
                                  🔨 +ƒ{sp.hcost}
                                </button>
                              )}
                              {/* Sell building */}
                              {sellR.canDo && (
                                <button
                                  onClick={() => sellBuilding(sp.id)}
                                  className="flex-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-bfa-cream/70 text-[10px] font-mono"
                                  title={`Vender mejora por ƒ${sellBuildingValue(sp)}`}
                                >
                                  💸 -ƒ{sellBuildingValue(sp)}
                                </button>
                              )}
                              {/* Mortgage */}
                              {mortR.canDo && (
                                <button
                                  onClick={() => mortgage(sp.id)}
                                  className="flex-1 px-2 py-1 rounded bg-bfa-amber/15 hover:bg-bfa-amber/25 text-bfa-amber text-[10px] font-mono"
                                  title={`Hipotecar por ƒ${mortgageValue(sp)}`}
                                >
                                  🏦 +ƒ{mortgageValue(sp)}
                                </button>
                              )}
                              {/* Unmortgage */}
                              {sp.mortgaged && (
                                <button
                                  onClick={() => unmortgage(sp.id)}
                                  disabled={!unmortR.canDo}
                                  className="flex-1 px-2 py-1 rounded bg-bfa-gold-500/15 hover:bg-bfa-gold-500/25 disabled:opacity-30 text-bfa-gold-500 text-[10px] font-mono"
                                  title={`Deshipotecar por ƒ${unmortgageCost(sp)}`}
                                >
                                  ✅ -ƒ{unmortgageCost(sp)}
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {mode === 'multi' && (
                    <button
                      onClick={() => setShowTrade(true)}
                      className="btn-secondary w-full text-sm py-2"
                    >
                      💱 Proponer Trade
                    </button>
                  )}
                  <button onClick={endTurn} className="btn-primary w-full">
                    ✓ Terminar turno
                  </button>
                </>
              )
            })()}

          </div>
        )}

        {/* AI turn indicator */}
        {!isHuman && pending !== 'game_over' && (
          <div className="glass-card px-6 py-3 text-center animate-pulse">
            <p className="text-bfa-cream/60 text-sm">🤖 Turno de {player.name}…</p>
          </div>
        )}
      </div>

      {/* Trade composer modal (multi only) */}
      {mode === 'multi' && showTrade && player && (() => {
        const others = game.players.filter(p => p.id !== player.id && !p.bankrupt)
        if (others.length === 0) { setShowTrade(false); return null }
        return (
          <TradeComposeModal
            me={player}
            others={others}
            board={game.board}
            onClose={() => setShowTrade(false)}
          />
        )
      })()}
    </>
  )
}
