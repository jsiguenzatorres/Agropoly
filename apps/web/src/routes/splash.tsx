import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RulesModal } from '../components/ui/RulesModal'

// Cinematic intro sequence — CSS-only staggered reveal.
// Total intro time: ~3.5s before the user can act. Click anywhere to skip.

const KEYFRAMES = `
@keyframes splash-glow {
  0%   { opacity: 0; transform: scale(0.5); }
  50%  { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.6; transform: scale(1); }
}
@keyframes splash-rise {
  0%   { opacity: 0; transform: translateY(40px) scale(0.94); filter: blur(8px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes splash-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes splash-particle {
  0%   { transform: translateY(110vh) translateX(var(--px-from, 0)) rotate(0deg); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-15vh) translateX(var(--px-to, 0)) rotate(360deg); opacity: 0; }
}
@keyframes splash-pulse-badge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.3); }
  50%      { box-shadow: 0 0 30px 4px rgba(245,197,24,0.15); }
}
`

const PARTICLE_EMOJI = ['🌽', '☕', '🪙', '🌾', '⭐']

function Particles() {
  const pieces = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: i,
    emoji: PARTICLE_EMOJI[i % PARTICLE_EMOJI.length],
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 6,
    size: 14 + Math.random() * 14,
    pxFrom: `${(Math.random() - 0.5) * 60}vw`,
    pxTo:   `${(Math.random() - 0.5) * 80}vw`,
  })), [])
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`, bottom: 0,
            fontSize: `${p.size}px`,
            opacity: 0,
            animation: `splash-particle ${p.duration}s ${p.delay}s linear infinite`,
            ['--px-from' as string]: p.pxFrom,
            ['--px-to' as string]:   p.pxTo,
          } as React.CSSProperties}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

export function Component() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  const [showRules, setShowRules] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)   // gold flash
    const t2 = setTimeout(() => setPhase(2), 900)   // badge
    const t3 = setTimeout(() => setPhase(3), 1800)  // logo + tagline
    const t4 = setTimeout(() => setPhase(4), 3000)  // buttons
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const skipIntro = () => setPhase(4)

  return (
    <div
      onClick={phase < 4 ? skipIntro : undefined}
      className="min-h-screen bg-bfa-dark flex flex-col items-center justify-center relative overflow-hidden"
      style={{ cursor: phase < 4 ? 'pointer' : 'default' }}
    >
      <style>{KEYFRAMES}</style>

      {/* Particles in background */}
      <Particles />

      {/* Gold flash on phase 1 (radial expanding glow) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(245,197,24,0.25) 0%, transparent 65%)',
          animation: phase >= 1 ? 'splash-glow 1.5s ease-out forwards' : 'none',
          opacity: 0,
        }}
      />

      {/* Green ambient glow always-on */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(46,139,74,0.3)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Badge — phase 2 */}
        {phase >= 2 && (
          <div
            className="bg-bfa-gold-500/10 border border-bfa-gold-500/40 text-bfa-gold-500 font-mono text-[10px] tracking-[4px] uppercase px-5 py-2 rounded-full"
            style={{
              animation: 'splash-rise 0.7s cubic-bezier(0.34,1.56,0.64,1) both, splash-pulse-badge 3s ease-in-out infinite 1s',
            }}
          >
            Banco de Fomento Agropecuario · Est. 1973
          </div>
        )}

        {/* Logo — phase 3 */}
        {phase >= 3 && (
          <h1
            className="font-accent font-black text-[clamp(64px,16vw,120px)] leading-none tracking-[-1px]"
            style={{
              background: 'linear-gradient(90deg, #F5C518 0%, #FDF8EE 30%, #F5C518 50%, #FDF8EE 70%, #F5C518 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'splash-rise 0.9s cubic-bezier(0.34,1.56,0.64,1) both, splash-shimmer 4s linear infinite',
            }}
          >
            AGROPOLY
          </h1>
        )}

        {/* Tagline — phase 3 */}
        {phase >= 3 && (
          <p
            className="font-display italic text-bfa-cream/60 text-xl"
            style={{ animation: 'splash-rise 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.25s both' }}
          >
            Sembrando progreso desde 1973
          </p>
        )}

        {/* Buttons — phase 4, staggered */}
        {phase >= 4 && (
          <div className="flex flex-col gap-3 mt-4 w-72">
            {[
              { label: 'Nueva Partida',     gold: true,  onClick: () => navigate('/lobby') },
              { label: '📖 Cómo Jugar',     gold: false, onClick: () => setShowRules(true) },
              { label: '🏆 Leaderboard',    gold: false, onClick: () => navigate('/leaderboard') },
              { label: '🎖️ Mis Logros',     gold: false, onClick: () => navigate('/achievements') },
              { label: 'Dashboard Analytics', gold: false, onClick: () => navigate('/dashboard') },
            ].map((b, i) => (
              <button
                key={b.label}
                onClick={(e) => { e.stopPropagation(); b.onClick() }}
                className={b.gold ? 'btn-gold text-center' : 'btn-secondary text-center'}
                style={{ animation: `splash-rise 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s both` }}
              >
                {b.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer hint */}
        {phase >= 4 && (
          <p
            className="text-bfa-cream/30 text-xs font-mono tracking-widest mt-8"
            style={{ animation: 'splash-rise 0.5s ease-out 0.6s both' }}
          >
            🌾 AGROPOLY BFA — VERSIÓN APEX
          </p>
        )}

        {/* Skip hint during intro */}
        {phase < 4 && (
          <p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-bfa-cream/30 text-xs font-mono tracking-widest"
          >
            click para saltar
          </p>
        )}
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  )
}
