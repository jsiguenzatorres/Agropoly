// Historias del Campo BFA — public chapters featuring each mascot. Reads
// content from /api/historias (editable by BFA via /admin/historias). Each
// chapter has 6 scenes; navigation: prev/next scene, prev/next chapter, jump
// to chapter list, narration via Web Speech.

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { listHistorias, type Historia } from '../lib/historias-api'
import { mascotForToken, type MascotId } from '../lib/mascot-dialogues'
import { speak, stopSpeech } from '../lib/speech'

const MASCOT_EMOJI: Record<string, string> = {
  maicita: '🌽', don_cafe: '☕', la_vaquita: '🐄', don_fomento: '🚜', la_canche: '🌿', la_tormenta: '⛈️',
}

const SCENES = ['bienvenida', 'origen', 'rubro', 'desafios', 'bfa', 'reto'] as const
type SceneKey = typeof SCENES[number]

const SCENE_LABEL: Record<SceneKey, string> = {
  bienvenida: 'Bienvenida',
  origen:     'Mi origen',
  rubro:      'Mi rubro',
  desafios:   'Mis desafíos',
  bfa:        'Apoyo del BFA',
  reto:       'Reto al jugador',
}

const SCENE_ICON: Record<SceneKey, string> = {
  bienvenida: '👋', origen: '🗺️', rubro: '📊', desafios: '⚠️', bfa: '🏦', reto: '🎲',
}

export function Component() {
  const query = useQuery<Historia[]>({
    queryKey: ['historias'],
    queryFn:  listHistorias,
    staleTime: 5 * 60 * 1000,
  })

  const [activeMascota, setActiveMascota] = useState<string | null>(null)
  const [sceneIdx, setSceneIdx]           = useState(0)

  useEffect(() => () => stopSpeech(), [])

  if (query.isLoading) return <CenteredMsg msg="Cargando historias…" />
  if (query.isError || !query.data) return <CenteredMsg msg="No se pudieron cargar las historias. Revisá que el servidor esté corriendo." />

  const historias = query.data
  const active = historias.find(h => h.mascotaId === activeMascota) ?? null

  return (
    <div className="min-h-screen bg-bfa-dark relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_10%,rgba(46,139,74,0.25)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo-bfa.png" alt="BFA" className="h-10 sm:h-12 w-auto shrink-0" style={{ filter: 'drop-shadow(0 2px 6px rgba(245,197,24,0.25))' }} />
            <div>
              <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Conocé al campo</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-bfa-gold-500">📖 Historias del Campo</h1>
            </div>
          </div>
          <Link to="/" className="btn-secondary text-xs sm:text-sm px-3 py-2">Inicio</Link>
        </header>

        {!active ? (
          <ChapterPicker historias={historias} onPick={id => { setActiveMascota(id); setSceneIdx(0) }} />
        ) : (
          <Chapter
            historia={active}
            sceneIdx={sceneIdx}
            setSceneIdx={setSceneIdx}
            onBackToList={() => { stopSpeech(); setActiveMascota(null) }}
            onPrevChapter={() => {
              stopSpeech()
              const i = historias.findIndex(h => h.mascotaId === active.mascotaId)
              setActiveMascota(historias[(i - 1 + historias.length) % historias.length].mascotaId)
              setSceneIdx(0)
            }}
            onNextChapter={() => {
              stopSpeech()
              const i = historias.findIndex(h => h.mascotaId === active.mascotaId)
              setActiveMascota(historias[(i + 1) % historias.length].mascotaId)
              setSceneIdx(0)
            }}
          />
        )}
      </div>
    </div>
  )
}

function ChapterPicker({ historias, onPick }: { historias: Historia[]; onPick: (id: string) => void }) {
  return (
    <>
      <p className="text-bfa-cream/60 text-sm sm:text-base mb-6 max-w-2xl">
        Cada mascota representa un rubro real del agro salvadoreño y un producto BFA que lo respalda.
        Tocá un capítulo para conocer su historia, sus desafíos y cómo el banco le acompaña.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {historias.map(h => (
          <button
            key={h.mascotaId}
            onClick={() => onPick(h.mascotaId)}
            className="glass-card p-5 text-left hover:bg-white/10 transition-colors border border-white/10 hover:border-bfa-gold-500/40"
          >
            <div className="text-5xl mb-2">{MASCOT_EMOJI[h.mascotaId] ?? '🌱'}</div>
            <h3 className="font-display font-bold text-bfa-gold-500 text-lg mb-1">{h.nombre}</h3>
            <p className="text-bfa-cream/70 text-xs uppercase tracking-wider font-mono mb-2">{h.rubro}</p>
            <p className="text-bfa-cream/80 text-sm italic line-clamp-2">{h.saludo}</p>
            {h.pendingReview && (
              <p className="mt-3 text-[10px] text-bfa-amber/80 font-mono uppercase tracking-wider">⚠ Contenido provisional</p>
            )}
          </button>
        ))}
      </div>
    </>
  )
}

interface ChapterProps {
  historia:      Historia
  sceneIdx:      number
  setSceneIdx:   (i: number) => void
  onBackToList:  () => void
  onPrevChapter: () => void
  onNextChapter: () => void
}

function Chapter({ historia, sceneIdx, setSceneIdx, onBackToList, onPrevChapter, onNextChapter }: ChapterProps) {
  const sceneKey = SCENES[sceneIdx]
  const mascot   = mascotForToken(historia.mascotaId.replace('don_cafe', 'cafe').replace('la_vaquita', 'vaca').replace('don_fomento', 'tractor').replace('la_canche', 'milpa').replace('la_tormenta', 'pez').replace('maicita', 'maiz'))
  const emoji    = MASCOT_EMOJI[historia.mascotaId] ?? '🌱'

  const contentRef = useRef<HTMLDivElement>(null)

  // GSAP fade-in on scene change + narration per scene
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-scene-content]',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
    }, contentRef)
    narrate(historia, sceneKey)
    return () => { ctx.revert(); stopSpeech() }
  }, [sceneIdx, historia.mascotaId, sceneKey])

  const prevScene = () => { if (sceneIdx > 0)              setSceneIdx(sceneIdx - 1) }
  const nextScene = () => { if (sceneIdx < SCENES.length - 1) setSceneIdx(sceneIdx + 1) }

  return (
    <div ref={contentRef} className="glass-card p-6 sm:p-8 relative">
      {/* Chapter header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="text-5xl">{emoji}</div>
        <div className="flex-1">
          <p className="text-xs text-bfa-cream/50 font-mono uppercase tracking-wider">Capítulo</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-bfa-gold-500">{historia.nombre}</h2>
          <p className="text-bfa-cream/60 text-sm">{historia.rubro} · {historia.zona}</p>
        </div>
        <button onClick={onBackToList} className="text-xs font-mono text-bfa-cream/50 hover:text-bfa-cream transition-colors">← Volver</button>
      </div>

      {/* Scene progress dots */}
      <div className="flex gap-2 mb-6 justify-center">
        {SCENES.map((s, i) => (
          <button
            key={s}
            onClick={() => setSceneIdx(i)}
            title={SCENE_LABEL[s]}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              i === sceneIdx
                ? 'bg-bfa-gold-500 text-bfa-dark font-bold'
                : 'bg-white/5 text-bfa-cream/50 hover:bg-white/10'
            }`}
          >
            <span className="mr-1">{SCENE_ICON[s]}</span>{SCENE_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Scene content */}
      <div data-scene-content className="min-h-[260px]">
        <SceneView scene={sceneKey} historia={historia} mascotId={mascot} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 gap-2">
        <button onClick={onPrevChapter} className="btn-secondary text-xs sm:text-sm">← Mascota anterior</button>
        <div className="flex gap-2">
          <button onClick={prevScene}  disabled={sceneIdx === 0}                   className="btn-secondary text-xs sm:text-sm disabled:opacity-30">‹ Escena</button>
          <span className="text-bfa-cream/40 text-xs font-mono self-center min-w-[40px] text-center">{sceneIdx + 1}/{SCENES.length}</span>
          <button onClick={nextScene}  disabled={sceneIdx === SCENES.length - 1}   className="btn-secondary text-xs sm:text-sm disabled:opacity-30">Escena ›</button>
        </div>
        <button onClick={onNextChapter} className="btn-gold text-xs sm:text-sm">Siguiente mascota →</button>
      </div>

      {historia.pendingReview && (
        <p className="mt-4 text-[10px] text-bfa-amber/80 font-mono uppercase tracking-wider text-center">
          ⚠ Contenido pendiente de validación BFA — los datos aquí son provisionales.
        </p>
      )}
    </div>
  )
}

function SceneView({ scene, historia, mascotId }: { scene: SceneKey; historia: Historia; mascotId: MascotId }) {
  switch (scene) {
    case 'bienvenida':
      return (
        <div className="text-center py-6">
          <p className="text-3xl sm:text-4xl font-display font-bold text-bfa-cream italic leading-snug max-w-2xl mx-auto">
            "{historia.saludo}"
          </p>
          <p className="text-bfa-cream/40 text-sm font-mono mt-4">— {historia.nombre}</p>
        </div>
      )
    case 'origen':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs font-mono text-bfa-gold-500 uppercase tracking-wider mb-2">Mi zona</p>
            <p className="font-display text-xl text-bfa-cream mb-3">{historia.zona}</p>
            <p className="text-bfa-cream/80 text-base leading-relaxed">{historia.origen}</p>
          </div>
          <MapSV zona={historia.zona} mascotId={mascotId} />
        </div>
      )
    case 'rubro':
      return (
        <div className="space-y-5">
          <p className="text-bfa-cream/85 text-base leading-relaxed max-w-3xl">{historia.rubroDescripcion}</p>
          <div className="glass-card border border-bfa-gold-500/30 p-5 max-w-md mx-auto">
            <p className="text-xs font-mono text-bfa-cream/60 uppercase tracking-wider">{historia.rubroStatLabel}</p>
            <p className="font-display font-bold text-3xl text-bfa-gold-500 my-2">{historia.rubroStatValue}</p>
            <p className="text-bfa-cream/60 text-sm italic">{historia.rubroStatNote}</p>
          </div>
        </div>
      )
    case 'desafios':
      return (
        <div>
          <p className="text-bfa-cream/70 text-sm mb-4">Esto es lo que enfrento cada ciclo:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {historia.desafios.map((d, i) => (
              <div key={i} className="flex items-start gap-3 glass-card p-3 border border-bfa-amber/20">
                <span className="text-bfa-amber text-lg shrink-0">⚠</span>
                <p className="text-bfa-cream/90 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case 'bfa':
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo-bfa.png" alt="BFA" className="h-10 w-auto" />
            <p className="text-xs font-mono text-bfa-cream/50 uppercase tracking-widest">Producto BFA que me apoya</p>
          </div>
          <div className="glass-card border border-bfa-green-500/40 p-5 bg-gradient-to-br from-bfa-green-500/10 to-transparent">
            <p className="font-display font-bold text-xl sm:text-2xl text-bfa-gold-500 mb-3">{historia.bfaProducto}</p>
            <p className="text-bfa-cream/85 text-base leading-relaxed">{historia.bfaDescripcion}</p>
          </div>
        </div>
      )
    case 'reto':
      return (
        <div className="text-center py-6">
          <div className="text-4xl mb-4">🎲</div>
          <p className="text-bfa-cream/50 text-xs font-mono uppercase tracking-widest mb-3">Reflexión para tu próxima partida</p>
          <p className="text-xl sm:text-2xl font-display italic text-bfa-cream leading-snug max-w-2xl mx-auto">
            "{historia.retoJugador}"
          </p>
        </div>
      )
  }
}

// Simple stylized SV map highlighting a region by name.
function MapSV({ zona }: { zona: string; mascotId: MascotId }) {
  // Crude region detection from zona text
  const z = zona.toLowerCase()
  const highlight =
    /occident|santa ana|sonsonate|ahuachap/.test(z) ? 'occidente' :
    /orient|usulut|san miguel|la uni|moraz/.test(z) ? 'oriente' :
    /caba|chala|moraz|familia/.test(z)              ? 'norte'    :
    /lempa|costa|valle/.test(z)                     ? 'costa'    : 'centro'

  const regionStyle = (r: string) => ({
    fill: r === highlight ? '#F5C518' : 'rgba(46,139,74,0.4)',
    stroke: r === highlight ? '#F5C518' : 'rgba(46,139,74,0.7)',
    strokeWidth: 0.8,
    filter: r === highlight ? 'drop-shadow(0 0 6px rgba(245,197,24,0.6))' : undefined,
    transition: 'all 0.4s ease',
  })

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 240 140" width="100%" style={{ maxWidth: 320 }}>
        {/* Stylized regions — not topographically accurate, just visual cues */}
        <path d="M 20 70 L 50 50 L 80 65 L 75 95 L 40 100 Z" style={regionStyle('occidente')} />
        <text x="48" y="82" textAnchor="middle" fill="rgba(245,232,200,0.85)" fontSize="7" fontFamily="monospace">OCCIDENTE</text>

        <path d="M 80 65 L 130 55 L 135 90 L 75 95 Z" style={regionStyle('centro')} />
        <text x="105" y="78" textAnchor="middle" fill="rgba(245,232,200,0.85)" fontSize="7" fontFamily="monospace">CENTRO</text>

        <path d="M 130 55 L 180 60 L 200 80 L 180 100 L 135 90 Z" style={regionStyle('oriente')} />
        <text x="165" y="80" textAnchor="middle" fill="rgba(245,232,200,0.85)" fontSize="7" fontFamily="monospace">ORIENTE</text>

        <path d="M 50 50 L 130 35 L 180 40 L 180 60 L 130 55 L 80 65 L 50 50 Z" style={regionStyle('norte')} />
        <text x="115" y="47" textAnchor="middle" fill="rgba(245,232,200,0.85)" fontSize="7" fontFamily="monospace">NORTE</text>

        <path d="M 40 100 L 75 95 L 135 90 L 180 100 L 170 115 L 110 120 L 60 115 Z" style={regionStyle('costa')} />
        <text x="105" y="112" textAnchor="middle" fill="rgba(245,232,200,0.85)" fontSize="7" fontFamily="monospace">COSTA / BAJO LEMPA</text>

        <text x="120" y="135" textAnchor="middle" fill="rgba(245,232,200,0.4)" fontSize="6" fontFamily="monospace">EL SALVADOR · Esquema</text>
      </svg>
    </div>
  )
}

function narrate(historia: Historia, scene: SceneKey) {
  // Pick one of the texts per scene
  const text =
    scene === 'bienvenida' ? historia.saludo :
    scene === 'origen'     ? historia.origen :
    scene === 'rubro'      ? `${historia.rubroDescripcion} ${historia.rubroStatLabel}: ${historia.rubroStatValue}.` :
    scene === 'desafios'   ? `Mis desafíos: ${historia.desafios.slice(0, 3).join('. ')}.` :
    scene === 'bfa'        ? `${historia.bfaProducto}. ${historia.bfaDescripcion}` :
    scene === 'reto'       ? historia.retoJugador :
    ''
  if (text) setTimeout(() => speak(text, { rate: 1.0 }), 250)
}

function CenteredMsg({ msg }: { msg: string }) {
  return (
    <div className="min-h-screen bg-bfa-dark flex items-center justify-center">
      <p className="text-bfa-cream/60 font-mono text-sm">{msg}</p>
    </div>
  )
}
