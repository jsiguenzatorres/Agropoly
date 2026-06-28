import { lazy, Suspense, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useMultiplayerStore } from '../store/multiplayerStore'
import { GameModeProvider } from '../store/GameModeContext'
import { GameHUD } from '../components/ui/GameHUD'
import { MascotOverlay } from '../components/ui/MascotOverlay'
import { EduTipOverlay } from '../components/ui/EduTipOverlay'

const GameScene = lazy(() => import('../components/three/GameScene'))

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
        <Suspense fallback={<LoadingBoard />}>
          <GameScene />
        </Suspense>
        <GameHUD mode={mode} />
        <MascotOverlay />
        <EduTipOverlay />
      </div>
    </GameModeProvider>
  )
}
