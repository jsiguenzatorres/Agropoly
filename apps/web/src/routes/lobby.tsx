import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { tokens, type TokenId } from '../lib/design-tokens'
import { useGameStore, type PlayerSetup } from '../store/gameStore'

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

export function Component() {
  const navigate = useNavigate()
  const initGame = useGameStore(s => s.initGame)

  const [name, setName]       = useState('')
  const [token, setToken]     = useState<TokenId>('maiz')
  const [aiCount, setAiCount] = useState(2)
  const [eduMode, setEduMode] = useState(false)

  const totalPlayers = 1 + aiCount

  function handleStart() {
    const humanSetup: PlayerSetup = { name: name.trim(), tokenId: token, isAI: false, difficulty: 'easy' }

    const usedTokens = new Set([token])
    const aiSetups: PlayerSetup[] = Array.from({ length: aiCount }, (_, i) => {
      const aiToken = AI_TOKENS.find(t => !usedTokens.has(t)) ?? AI_TOKENS[i % AI_TOKENS.length]
      usedTokens.add(aiToken)
      return {
        name: AI_NAMES[i] ?? `IA ${i + 1}`,
        tokenId: aiToken,
        isAI: true,
        difficulty: i === 0 ? 'hard' : 'easy',
      }
    })

    initGame([humanSetup, ...aiSetups], eduMode)
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-bfa-dark flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(46,139,74,0.2)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md glass-card p-8 flex flex-col gap-6">
        <h2 className="font-display font-bold text-2xl text-bfa-gold-500">Configurar Partida</h2>

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

        {/* Jugadores IA */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">
            Jugadores IA: {aiCount}
          </label>
          <input
            type="range" min={1} max={5} value={aiCount}
            onChange={e => setAiCount(Number(e.target.value))}
            className="accent-bfa-green-500"
          />
          <p className="text-xs text-bfa-cream/30">{totalPlayers} jugadores en total (1 humano + {aiCount} IA)</p>
        </div>

        {/* Modo educativo */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setEduMode(v => !v)}
            className={`w-10 h-6 rounded-full transition-colors ${eduMode ? 'bg-bfa-green-500' : 'bg-white/20'} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${eduMode ? 'left-5' : 'left-1'}`} />
          </div>
          <span className="text-sm text-bfa-cream/70">Modo Educativo BFA</span>
        </label>

        <button
          className="btn-gold mt-2"
          disabled={!name.trim()}
          onClick={handleStart}
        >
          Iniciar Partida ƒ1,500
        </button>
      </div>
    </div>
  )
}
