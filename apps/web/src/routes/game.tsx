import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useMultiplayerStore } from '../store/multiplayerStore'
import { GameModeProvider } from '../store/GameModeContext'
import { GameHUD } from '../components/ui/GameHUD'
import { MascotOverlay } from '../components/ui/MascotOverlay'
import { EduTipOverlay } from '../components/ui/EduTipOverlay'
import { VictoryScreen } from '../components/ui/VictoryScreen'
import { QuizModal } from '../components/ui/QuizModal'
import { TradeIncomingModal, TradeWaitingModal } from '../components/ui/TradeModal'
import { AchievementToast } from '../components/ui/AchievementToast'
import { ChatPanel } from '../components/ui/ChatPanel'
import { ToastStack } from '../components/ui/ToastStack'
import { LogPanel } from '../components/ui/LogPanel'
import { LightningFlash } from '../components/ui/LightningFlash'
import { CardRevealOverlay } from '../components/ui/CardRevealOverlay'
import { TileEffectFX } from '../components/ui/TileEffectFX'
import { PurchaseStamp } from '../components/ui/PurchaseStamp'
import { MoneyFlowLayer } from '../components/ui/MoneyFlowLayer'
import { PropertyInspector } from '../components/ui/PropertyInspector'
import { Celebrations } from '../components/ui/Celebrations'
import { ClimateDieRoll } from '../components/ui/ClimateDieRoll'
import { StoryIntro } from '../components/ui/StoryIntro'

const GameScene = lazy(() => import('../components/three/GameScene'))

function ActiveQuizModal() {
  const quiz    = useGameStore(s => s.pendingQuiz)
  const dismiss = useGameStore(s => s.dismissQuiz)
  if (!quiz) return null
  return <QuizModal quiz={quiz} onClose={dismiss} />
}

function ActiveTradeModal() {
  const offer       = useMultiplayerStore(s => s.tradeOffer)
  const mySessionId = useMultiplayerStore(s => s.mySessionId)
  const game        = useMultiplayerStore(s => s.game)
  if (!offer || !game) return null
  if (offer.toId === mySessionId) {
    return <TradeIncomingModal offer={offer} players={game.players} board={game.board} />
  }
  if (offer.fromId === mySessionId) {
    return <TradeWaitingModal fromId={offer.fromId} toId={offer.toId} players={game.players} />
  }
  return null
}

function LoadingBoard() {
  return (
    <div className="flex items-center justify-center h-full bg-bfa-deep">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/widget-bfa.png"
          alt="BFA"
          className="w-16 h-16"
          style={{
            animation: 'bfa-pulse 1.4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 16px rgba(245,197,24,0.4))',
          }}
        />
        <p className="font-mono text-bfa-green-500 text-sm tracking-widest">Cargando tablero…</p>
      </div>
      <style>{`@keyframes bfa-pulse {
        0%, 100% { transform: scale(1);    opacity: 0.85; }
        50%      { transform: scale(1.12); opacity: 1;    }
      }`}</style>
    </div>
  )
}

export function Component() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'multi' ? 'multi' : 'solo'

  const soloGame  = useGameStore(s => s.game)
  const soloGameId = useGameStore(s => s.gameId)
  const multiGame = useMultiplayerStore(s => s.game)
  const connected = useMultiplayerStore(s => s.connected)
  const game = mode === 'multi' ? multiGame : soloGame

  const navigate = useNavigate()

  useEffect(() => {
    if (mode === 'multi' && !connected) {
      navigate('/lobby', { replace: true })
    } else if (mode === 'solo' && !soloGame) {
      navigate('/lobby', { replace: true })
    }
  }, [mode, connected, soloGame, navigate])

  // Story intro: show once per fresh partida. We track the most recently introduced gameId
  // so it doesn't replay on re-renders, but DOES replay on a new "Nueva partida".
  const lastIntroGameId = useRef<number>(-1)
  const [showIntro, setShowIntro] = useState(false)
  useEffect(() => {
    if (!game) return
    const id = mode === 'solo' ? soloGameId : 0  // multi: only on join (no gameId equivalent yet)
    if (id !== lastIntroGameId.current && mode === 'solo') {
      lastIntroGameId.current = id
      setShowIntro(true)
    }
  }, [game, soloGameId, mode])

  if (!game) return <LoadingBoard />

  return (
    <GameModeProvider mode={mode}>
      <div className="w-screen h-screen bg-bfa-deep overflow-hidden relative">
        {showIntro && <StoryIntro players={game.players} onDone={() => setShowIntro(false)} />}
        {/* Canvas: full bleed on desktop, vertically constrained on mobile so the board
            sits between the scoreboard (top) and action panel (bottom) without gaps */}
        <div className="absolute inset-x-0 top-12 bottom-44 sm:inset-0">
          <Suspense fallback={<LoadingBoard />}>
            <GameScene />
          </Suspense>
        </div>
        <GameHUD mode={mode} />
        <MascotOverlay />
        <EduTipOverlay />
        <ActiveQuizModal />
        {mode === 'multi' && <ActiveTradeModal />}
        {mode === 'multi' && <ChatPanel />}
        <AchievementToast />
        <ToastStack />
        <LogPanel />
        <LightningFlash mode={mode} />
        <CardRevealOverlay mode={mode} />
        <TileEffectFX mode={mode} />
        <PurchaseStamp mode={mode} />
        <MoneyFlowLayer />
        <PropertyInspector mode={mode} />
        <Celebrations mode={mode} />
        <ClimateDieRoll mode={mode} />
        <VictoryScreen mode={mode} />
      </div>
    </GameModeProvider>
  )
}
