import { useState } from 'react'
import { markTutorialCompleted, markTutorialOffered } from '../../lib/stats'

interface Step {
  mascot: 'maicita' | 'don_fomento' | 'la_vaquita'
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    mascot: 'maicita',
    title: '¡Hola! Soy Maicita, vine a ayudarte',
    body: 'He visto que te ha costado ganar. ¡No te preocupes! El juego tiene trucos que solo se aprenden con la práctica. Te voy a dar tres consejos clave.',
  },
  {
    mascot: 'don_fomento',
    title: '1. Comprar siempre que puedas',
    body: 'No dejes pasar propiedades sin dueño si tenés ƒ500+ de balance. Cada propiedad es un activo que rinde renta y aumenta tu patrimonio. Mientras más temprano comprés, más rápido completás un grupo.',
  },
  {
    mascot: 'la_vaquita',
    title: '2. Grupos completos = construcción',
    body: '¡Muuu! Lo más rentable: completar un grupo de propiedades del mismo color. Eso te permite construir Puntos de Atención (casas). Cada PA multiplica fuertemente la renta que cobrás cuando alguien cae.',
  },
  {
    mascot: 'don_fomento',
    title: '3. Reserva de efectivo siempre',
    body: 'Nunca gastes hasta la última moneda. Guardá al menos ƒ200-300 para pagar rentas e impuestos imprevistos. La hipoteca es tu salida de emergencia, no tu primera opción.',
  },
  {
    mascot: 'maicita',
    title: 'Bonus: Modo Educativo',
    body: 'Activá el "Modo Educativo BFA" en el lobby. Vas a aprender conceptos financieros reales mientras jugás: rentabilidad, apalancamiento, diversificación, y más. ¡Es divertido y útil!',
  },
]

const MASCOT_EMOJI = { maicita: '🌽', don_fomento: '👨‍🌾', la_vaquita: '🐄' }
const MASCOT_NAME  = { maicita: 'Maicita', don_fomento: 'Don Fomento', la_vaquita: 'La Vaquita BFA' }

export function TutorialModal({ onClose }: { onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  const step = STEPS[idx]
  const isLast = idx === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      markTutorialCompleted()
      onClose()
    } else {
      setIdx(idx + 1)
    }
  }
  const handleSkip = () => {
    markTutorialOffered()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 95,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '520px', width: '100%',
          background: 'linear-gradient(180deg, rgba(27,107,47,0.96), rgba(13,43,20,0.96))',
          border: '2px solid rgba(245,197,24,0.5)',
          borderRadius: '24px',
          padding: '28px',
          display: 'flex', flexDirection: 'column', gap: '20px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === idx ? 'bg-bfa-gold-500 w-6' : i < idx ? 'bg-bfa-gold-500/40' : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* Mascot */}
        <div className="flex items-center gap-3">
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(245,197,24,0.15)',
            border: '2px solid rgba(245,197,24,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px',
          }}>
            {MASCOT_EMOJI[step.mascot]}
          </div>
          <div>
            <p className="text-bfa-cream/50 text-[10px] font-mono tracking-widest uppercase">
              Tutorial · {idx + 1}/{STEPS.length}
            </p>
            <p className="text-bfa-gold-500 font-bold text-sm">{MASCOT_NAME[step.mascot]} dice:</p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-bfa-gold-500 font-display font-bold text-lg mb-2">
            {step.title}
          </p>
          <p className="text-bfa-cream/85 text-sm leading-relaxed">
            {step.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isLast && (
            <button onClick={handleSkip} className="btn-secondary text-sm py-2 px-4">
              Saltar
            </button>
          )}
          {idx > 0 && !isLast && (
            <button onClick={() => setIdx(idx - 1)} className="btn-secondary text-sm py-2 px-4">
              ← Anterior
            </button>
          )}
          <button onClick={handleNext} className="btn-gold flex-1 text-sm py-2">
            {isLast ? '¡Listo! Vamos a jugar' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}
