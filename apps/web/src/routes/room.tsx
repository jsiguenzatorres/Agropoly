import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMultiplayerStore } from '../store/multiplayerStore'

export function Component() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const game        = useMultiplayerStore(s => s.game)
  const phase       = useMultiplayerStore(s => s.phase)
  const isHost      = useMultiplayerStore(s => s.isHost)
  const connected   = useMultiplayerStore(s => s.connected)
  const startGame   = useMultiplayerStore(s => s.startGame)
  const disconnect  = useMultiplayerStore(s => s.disconnect)

  useEffect(() => {
    if (!connected) navigate('/lobby', { replace: true })
  }, [connected, navigate])

  useEffect(() => {
    if (phase === 'playing') navigate('/game?mode=multi', { replace: true })
  }, [phase, navigate])

  if (!connected) return null

  const players = game?.players ?? []
  const canStart = isHost && players.length >= 2

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(46,139,74,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-6">
        <div>
          <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Sala</p>
          <p className="font-display font-bold text-2xl text-bfa-gold-500 tracking-wider select-all">{roomId}</p>
          <p className="text-xs text-bfa-cream/40 mt-1">Comparte este código con tus amigos</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">
            Jugadores ({players.length})
          </p>
          <div className="flex flex-col gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-mono text-bfa-gold-500 font-bold flex-1 truncate">{p.name}</span>
                <span className="text-xs text-bfa-cream/40 font-mono">{p.tokenId}</span>
                {p.id === game?.players[0].id && (
                  <span className="text-[9px] font-mono tracking-wider text-bfa-green-500 px-1.5 py-0.5 rounded bg-bfa-green-500/10">
                    HOST
                  </span>
                )}
              </div>
            ))}
            {players.length < 2 && (
              <p className="text-xs text-bfa-cream/30 italic text-center mt-2">
                Esperando al menos un jugador más…
              </p>
            )}
          </div>
        </div>

        {isHost ? (
          <button onClick={startGame} disabled={!canStart} className="btn-gold mt-2">
            🎲 Iniciar Partida
          </button>
        ) : (
          <p className="text-center text-bfa-cream/40 text-sm font-mono">
            Esperando al host…
          </p>
        )}

        <button
          onClick={() => { disconnect(); navigate('/lobby') }}
          className="btn-secondary text-sm"
        >
          Salir
        </button>
      </div>
    </div>
  )
}
