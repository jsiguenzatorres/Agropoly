import { lazy, Suspense, useEffect } from 'react'
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
        <div className="w-12 h-12 border-2 border-bfa-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-bfa-green-500 text-sm tracking-widest">Cargando tablero…</p>
      </div>
    </div>
  )
}

export function Component() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'multi' ? 'multi' : 'solo'

  const soloGame  = useGameStore(s => s.game)
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

  if (!game) return <LoadingBoard />

  return (
    <GameModeProvider mode={mode}>
      <div className="w-screen h-screen bg-bfa-deep overflow-hidden relative">
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
        <VictoryScreen mode={mode} />
      </div>
    </GameModeProvider>
  )
}
