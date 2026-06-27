import { lazy, Suspense } from 'react'

const GameScene = lazy(() => import('../components/three/GameScene'))

function LoadingBoard() {
  return (
    <div className="flex items-center justify-center h-full bg-bfa-deep">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-bfa-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-bfa-green-500 text-sm tracking-widest">Cargando tablero...</p>
      </div>
    </div>
  )
}

export function Component() {
  return (
    <div className="w-screen h-screen bg-bfa-deep overflow-hidden relative">
      <Suspense fallback={<LoadingBoard />}>
        <GameScene />
      </Suspense>

      {/* HUD overlay */}
      <div className="absolute top-4 left-4 glass-card px-3 py-2 pointer-events-none">
        <p className="font-mono text-bfa-gold-500 text-xs tracking-widest">AGROPOLY BFA</p>
      </div>
    </div>
  )
}
