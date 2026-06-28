import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAchievementsWithStatus, getStatsForView } from '../lib/achievements'

export function Component() {
  const navigate = useNavigate()
  const entries = useMemo(() => getAllAchievementsWithStatus(), [])
  const stats   = useMemo(() => getStatsForView(), [])

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center p-6 pt-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(46,139,74,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-3xl flex flex-col gap-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/logo-bfa.png" alt="BFA" className="h-12 w-auto shrink-0" style={{ filter: 'drop-shadow(0 2px 6px rgba(245,197,24,0.25))' }} />
            <div>
              <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Mi Progreso</p>
              <h2 className="font-display font-bold text-3xl text-bfa-gold-500">🏆 Mis Logros</h2>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm">
            Inicio
          </button>
        </header>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Logros" value={`${stats.unlocked} / ${stats.total}`} />
          <Stat label="Partidas" value={String(stats.games)} />
          <Stat label="Victorias" value={String(stats.wins)} />
          <Stat label="Hoteles" value={String(stats.counters.hotelsTotal)} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map(a => (
            <div
              key={a.id}
              className={`glass-card p-4 flex flex-col items-center text-center gap-2 transition-all ${
                a.unlocked
                  ? 'border-bfa-gold-500/40 bg-bfa-gold-500/5'
                  : 'opacity-50 grayscale'
              }`}
            >
              <div className={`text-4xl ${a.unlocked ? '' : 'opacity-30'}`}>
                {a.unlocked ? a.icon : '🔒'}
              </div>
              <p className={`font-display font-bold text-sm ${a.unlocked ? 'text-bfa-gold-500' : 'text-bfa-cream/40'}`}>
                {a.title}
              </p>
              <p className="text-bfa-cream/60 text-[11px] leading-snug">
                {a.description}
              </p>
              {a.unlocked && a.unlockedAt && (
                <p className="text-bfa-cream/30 text-[9px] font-mono mt-auto">
                  {new Date(a.unlockedAt).toLocaleDateString('es-SV')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card p-3 text-center">
      <p className="text-bfa-gold-500 font-display font-bold text-xl">{value}</p>
      <p className="text-bfa-cream/50 text-[10px] font-mono uppercase tracking-widest">{label}</p>
    </div>
  )
}
