import { lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { GameHUD } from '../components/ui/GameHUD'

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
  const game = useGameStore(s => s.game)
  const navigate = useNavigate()

  // Si llegamos a /game sin inicializar, volver al lobby
  useEffect(() => {
    if (!game) navigate('/lobby', { replace: true })
  }, [game, navigate])

  if (!game) return <LoadingBoard />

  return (
    <div className="w-screen h-screen bg-bfa-deep overflow-hidden relative">
      <Suspense fallback={<LoadingBoard />}>
        <GameScene />
      </Suspense>
      <GameHUD />
    </div>
  )
}
