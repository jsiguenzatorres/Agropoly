import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokens, type TokenId } from '../lib/design-tokens'
import { useGameStore, type PlayerSetup } from '../store/gameStore'
import { useMultiplayerStore } from '../store/multiplayerStore'
import { createRoom, joinRoomById } from '../lib/colyseus'
import { shouldOfferTutorial, markTutorialOffered } from '../lib/stats'
import { TutorialModal } from '../components/ui/TutorialModal'

const TOKENS: { id: TokenId; label: string }[] = [
  { id: 'maiz',    label: 'La Mazorca' },
  { id: 'cafe',    label: 'El Cafetal' },
  { id: 'vaca',    label: 'La Vaca'    },
  { id: 'tractor', label: 'El Tractor' },
  { id: 'milpa',   label: 'La Milpa'   },
  { id: 'pez',     label: 'El Pez'     },
]

const AI_NAMES = ['Don Fomento', 'Maicita', 'Don Café', 'La Canche', 'La Tormenta']
const AI_TOKENS: TokenId[] = ['cafe', 'vaca', 'tractor', 'milpa', 'pez']

type Mode = 'solo' | 'multi'

export function Component() {
  const navigate = useNavigate()
  const initGame = useGameStore(s => s.initGame)
  const setMpRoom = useMultiplayerStore(s => s.setRoom)

  const [mode, setMode]       = useState<Mode>('solo')
  const [name, setName]       = useState('')
  const [token, setToken]     = useState<TokenId>('maiz')
  const [aiCount, setAiCount] = useState(2)
  const [eduMode, setEduMode] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  // Offer the tutorial automatically after the user has lost 3 games in a row
  useEffect(() => {
    if (shouldOfferTutorial()) {
      setShowTutorial(true)
      markTutorialOffered()
    }
  }, [])

  function handleStartSolo() {
    const humanSetup: PlayerSetup = { name: name.trim(), tokenId: token, isAI: false, difficulty: 'easy' }
    const usedTokens = new Set([token])
    // Mix of difficulties for variety: rotate easy → hard → expert across AI slots
    const difficulties: Array<'easy' | 'hard' | 'expert'> = ['easy', 'hard', 'expert']
    const aiSetups: PlayerSetup[] = Array.from({ length: aiCount }, (_, i) => {
      const aiToken = AI_TOKENS.find(t => !usedTokens.has(t)) ?? AI_TOKENS[i % AI_TOKENS.length]
      usedTokens.add(aiToken)
      return {
        name: AI_NAMES[i] ?? `IA ${i + 1}`,
        tokenId: aiToken,
        isAI: true,
        difficulty: difficulties[i % difficulties.length],
      }
    })
    initGame([humanSetup, ...aiSetups], eduMode)
    navigate('/game')
  }

  async function handleCreateRoom() {
    setError(null); setConnecting(true)
    try {
      const room = await createRoom({ name: name.trim(), tokenId: token, educationalMode: eduMode })
      setMpRoom(room)
      navigate(`/room/${room.roomId}`)
    } catch (e) {
      setError((e as Error).message ?? 'No se pudo crear la sala')
    } finally {
      setConnecting(false)
    }
  }

  async function handleJoinRoom(asSpectator = false) {
    setError(null); setConnecting(true)
    try {
      const room = await joinRoomById(roomCode.trim(), {
        name: name.trim(), tokenId: token, spectator: asSpectator,
      })
      setMpRoom(room, { spectator: asSpectator })
      navigate(asSpectator ? `/game?mode=multi` : `/room/${room.roomId}`)
    } catch (e) {
      setError((e as Error).message ?? 'No se pudo unir a la sala')
    } finally {
      setConnecting(false)
    }
  }

  const canSubmit = name.trim().length > 0 && !connecting

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(46,139,74,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 -mb-1">
          <img src="/logo-bfa.png" alt="BFA" className="h-9 w-auto" style={{ filter: 'drop-shadow(0 2px 6px rgba(245,197,24,0.25))' }} />
          <h2 className="font-display font-bold text-2xl text-bfa-gold-500">Configurar Partida</h2>
        </div>

        {/* Tabs Solo / Multi */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5">
          <button
            onClick={() => setMode('solo')}
            className={`py-2 rounded-lg text-sm font-mono tracking-wider transition-all ${
              mode === 'solo' ? 'bg-bfa-green-500 text-white' : 'text-bfa-cream/50 hover:text-bfa-cream/80'
            }`}
          >
            🎮 SOLO
          </button>
          <button
            onClick={() => setMode('multi')}
            className={`py-2 rounded-lg text-sm font-mono tracking-wider transition-all ${
              mode === 'multi' ? 'bg-bfa-green-500 text-white' : 'text-bfa-cream/50 hover:text-bfa-cream/80'
            }`}
          >
            🌐 MULTIJUGADOR
          </button>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Tu nombre</label>
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bfa-cream placeholder:text-bfa-cream/30 outline-none focus:border-bfa-green-500/50"
            placeholder="Nombre del jugador"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Token */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Tu token</label>
          <div className="grid grid-cols-3 gap-2">
            {TOKENS.map(t => (
              <button
                key={t.id}
                onClick={() => setToken(t.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                  token === t.id
                    ? 'border-bfa-green-500 bg-bfa-green-500/10'
                    : 'border-white/10 bg-white/3 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{tokens.color.token[t.id].emoji}</span>
                <span className="text-[10px] text-bfa-cream/60">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {mode === 'solo' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">
              Jugadores IA: {aiCount}
            </label>
            <input
              type="range" min={1} max={5} value={aiCount}
              onChange={e => setAiCount(Number(e.target.value))}
              className="accent-bfa-green-500"
            />
            <p className="text-xs text-bfa-cream/30">{1 + aiCount} jugadores en total (1 humano + {aiCount} IA)</p>
          </div>
        )}

        {/* Modo educativo */}
        <button
          type="button"
          onClick={() => setEduMode(v => !v)}
          className="flex items-center gap-3 cursor-pointer w-fit text-left"
        >
          <div className={`w-10 h-6 rounded-full transition-colors ${eduMode ? 'bg-bfa-green-500' : 'bg-white/20'} relative`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${eduMode ? 'left-5' : 'left-1'}`} />
          </div>
          <span className="text-sm text-bfa-cream/70">Modo Educativo BFA</span>
        </button>

        {error && (
          <p className="text-red-400 text-xs font-mono">{error}</p>
        )}

        {mode === 'solo' ? (
          <button className="btn-gold mt-2" disabled={!canSubmit} onClick={handleStartSolo}>
            Iniciar Partida ƒ1,500
          </button>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            <button className="btn-gold" disabled={!canSubmit} onClick={handleCreateRoom}>
              {connecting ? '…' : '✨ Crear Sala'}
            </button>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-bfa-cream/30 font-mono">o</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <input
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-bfa-cream placeholder:text-bfa-cream/30 outline-none focus:border-bfa-green-500/50 font-mono tracking-wider text-center uppercase"
              placeholder="Código de sala"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
            />
            <button
              className="btn-secondary"
              disabled={!canSubmit || roomCode.trim().length === 0}
              onClick={() => handleJoinRoom(false)}
            >
              {connecting ? '…' : '🚪 Unirse a Sala'}
            </button>
            <button
              className="btn-secondary opacity-80 text-sm"
              disabled={!canSubmit || roomCode.trim().length === 0}
              onClick={() => handleJoinRoom(true)}
              title="Solo observar la partida (facilitadores BFA)"
            >
              {connecting ? '…' : '👁️ Espectador'}
            </button>
          </div>
        )}
      </div>
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  )
}
