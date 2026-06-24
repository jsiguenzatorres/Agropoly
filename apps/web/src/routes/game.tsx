import { Suspense } from 'react'

// Lazy-loaded for performance — Three.js is heavy
const GameScene = () => import('../components/three/GameScene')

export function Component() {
  return (
    <div className="w-screen h-screen bg-bfa-deep overflow-hidden relative">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-bfa-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-bfa-green-500 text-sm tracking-widest">Cargando tablero...</p>
            </div>
          </div>
        }
      >
        {/* GameScene with R3F + HUD overlay */}
        <div className="w-full h-full">
          <p className="text-bfa-cream/50 text-center pt-20 font-display italic text-2xl">
            🎮 GameScene — En construcción
          </p>
          <p className="text-bfa-cream/30 text-center mt-4 font-mono text-sm">
            Implementar: apps/web/src/components/three/GameScene.tsx
          </p>
        </div>
      </Suspense>
    </div>
  )
}
