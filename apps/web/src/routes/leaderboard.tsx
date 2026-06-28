import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchLeaderboard, type LeaderboardEntry } from '../lib/sessions-api'

export function Component() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard(50).then(data => {
      if (data.length === 0) setError('Sin partidas registradas aún')
      setEntries(data)
    }).catch(e => setError((e as Error).message))
  }, [])

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center p-6 pt-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(46,139,74,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Hall of Fame</p>
            <h2 className="font-display font-bold text-3xl text-bfa-gold-500">🏆 Leaderboard</h2>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary text-sm">
            Inicio
          </button>
        </header>

        {entries === null && (
          <p className="text-bfa-cream/40 text-center font-mono text-sm py-12">Cargando…</p>
        )}

        {entries !== null && entries.length === 0 && (
          <div className="glass-card p-8 text-center flex flex-col gap-3">
            <p className="text-bfa-cream/70">{error ?? 'Sin datos'}</p>
            <button onClick={() => navigate('/lobby')} className="btn-gold mx-auto">
              Jugar primera partida
            </button>
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-[40px_40px_1fr_60px_60px_80px] sm:grid-cols-[40px_40px_1fr_60px_60px_80px_80px_80px] gap-2 px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-bfa-cream/50 border-b border-white/10 bg-white/5">
              <span>#</span>
              <span></span>
              <span>Jugador</span>
              <span className="text-right">Wins</span>
              <span className="text-right">Games</span>
              <span className="text-right">% Win</span>
              <span className="hidden sm:inline text-right">Prom ƒ</span>
              <span className="hidden sm:inline text-right">Mejor ƒ</span>
            </div>
            <div className="divide-y divide-white/5">
              {entries.map((e, i) => {
                const winRate = e.games > 0 ? Math.round((e.wins / e.games) * 100) : 0
                const isTop = i < 3
                return (
                  <div
                    key={e.name}
                    className={`grid grid-cols-[40px_40px_1fr_60px_60px_80px] sm:grid-cols-[40px_40px_1fr_60px_60px_80px_80px_80px] gap-2 px-4 py-3 items-center text-sm transition-colors ${
                      isTop ? 'bg-bfa-gold-500/5' : 'hover:bg-white/3'
                    }`}
                  >
                    <span className={`font-mono ${i === 0 ? 'text-bfa-gold-500 font-bold' : 'text-bfa-cream/40'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                      style={{
                        background: avatarColor(e.name),
                        color: '#FDF8EE',
                        border: '1.5px solid rgba(245,197,24,0.4)',
                      }}
                      title={e.name}
                    >
                      {e.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-bfa-cream font-bold truncate">{e.name}</span>
                    <span className="text-right font-mono text-bfa-gold-500">{e.wins}</span>
                    <span className="text-right font-mono text-bfa-cream/60">{e.games}</span>
                    <span className="text-right font-mono text-bfa-cream/60">{winRate}%</span>
                    <span className="hidden sm:inline text-right font-mono text-bfa-cream/50">
                      ƒ{e.avg_net_worth.toLocaleString()}
                    </span>
                    <span className="hidden sm:inline text-right font-mono text-bfa-cream/70">
                      ƒ{e.best_net_worth.toLocaleString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <p className="text-center text-bfa-cream/30 text-xs font-mono">
          Solo jugadores humanos · ordenado por wins y patrimonio promedio
        </p>
      </div>
    </div>
  )
}

// Hash a name → consistent HSL color for avatar background
function avatarColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  const hue = h % 360
  return `hsl(${hue}, 55%, 32%)`
}
