import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Component() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(46,139,74,0.3)_0%,transparent_70%)]" />

      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-700 ${
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Badge */}
        <div className="bg-bfa-gold-500/10 border border-bfa-gold-500/40 text-bfa-gold-500 font-mono text-[10px] tracking-[4px] uppercase px-5 py-2 rounded-full">
          Banco de Fomento Agropecuario · Est. 1973
        </div>

        {/* Logo */}
        <h1 className="font-display font-black text-[clamp(64px,16vw,120px)] leading-none tracking-[-3px] bg-gold-shimmer bg-clip-text text-transparent">
          AGROPOLY
        </h1>

        <p className="font-display italic text-bfa-cream/60 text-xl">
          Sembrando progreso desde 1973
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4 w-72">
          <button className="btn-gold text-center" onClick={() => navigate('/lobby')}>
            Nueva Partida
          </button>
          <button className="btn-secondary text-center" onClick={() => navigate('/dashboard')}>
            Dashboard Analytics
          </button>
        </div>

        {/* Mascot hint */}
        <p className="text-bfa-cream/30 text-xs font-mono tracking-widest mt-8">
          🌾 AGROPOLY BFA — VERSIÓN APEX
        </p>
      </div>
    </div>
  )
}
