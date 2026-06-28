import { useState } from 'react'
import { GLOSARIO, type QuizQuestion } from '../../lib/glosario'

interface Props {
  quiz: QuizQuestion
  onClose: () => void
}

export function QuizModal({ quiz, onClose }: Props) {
  const [picked, setPicked]   = useState<number | null>(null)
  const [revealed, setReveal] = useState(false)
  const concepto = GLOSARIO[quiz.conceptoId]

  const handlePick = (i: number) => {
    if (revealed) return
    setPicked(i)
    setReveal(true)
  }

  const correct = picked === quiz.correcta

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '480px', width: '100%',
          background: 'linear-gradient(180deg, rgba(27,107,47,0.95), rgba(13,43,20,0.95))',
          border: '1px solid rgba(245,197,24,0.4)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(245,232,200,0.5)', fontSize: '11px',
                       letterSpacing: '0.25em', fontFamily: 'monospace', margin: 0 }}>
            QUIZ EDUCATIVO BFA
          </p>
          <p style={{ color: '#F5C518', fontWeight: 700, fontSize: '13px', margin: '4px 0 0' }}>
            Concepto: {concepto?.termino ?? quiz.conceptoId}
          </p>
        </div>

        <p style={{ color: '#FDF8EE', fontSize: '15px', margin: 0, lineHeight: 1.4 }}>
          {quiz.pregunta}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {quiz.opciones.map((opt, i) => {
            const isCorrect = i === quiz.correcta
            const isPicked  = i === picked
            let bg = 'rgba(255,255,255,0.05)'
            let border = 'rgba(255,255,255,0.1)'
            if (revealed) {
              if (isCorrect) { bg = 'rgba(76,175,112,0.18)'; border = 'rgba(76,175,112,0.5)' }
              else if (isPicked && !isCorrect) { bg = 'rgba(192,57,43,0.18)'; border = 'rgba(192,57,43,0.5)' }
            }
            return (
              <button
                key={i}
                onClick={() => handlePick(i)}
                disabled={revealed}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  background: bg,
                  border: `1px solid ${border}`,
                  color: '#FDF8EE', fontSize: '13px',
                  textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: 'rgba(245,197,24,0.15)', color: '#F5C518',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontFamily: 'monospace', fontSize: '12px',
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1 }}>{opt}</span>
                {revealed && isCorrect && <span style={{ color: '#4CAF70' }}>✓</span>}
                {revealed && isPicked && !isCorrect && <span style={{ color: '#C0392B' }}>✗</span>}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div style={{
            padding: '12px',
            background: correct ? 'rgba(76,175,112,0.1)' : 'rgba(232,160,32,0.1)',
            border: `1px solid ${correct ? 'rgba(76,175,112,0.3)' : 'rgba(232,160,32,0.3)'}`,
            borderRadius: '10px',
          }}>
            <p style={{ color: '#F5C518', fontWeight: 700, fontSize: '12px', margin: '0 0 4px' }}>
              {correct ? '¡Correcto!' : '💡 Aprendamos juntos'}
            </p>
            <p style={{ color: 'rgba(245,232,200,0.85)', fontSize: '12px', margin: 0, lineHeight: 1.45 }}>
              {quiz.explicacion}
            </p>
            {concepto?.productoBFA && (
              <p style={{ color: 'rgba(245,197,24,0.7)', fontSize: '11px',
                          margin: '8px 0 0', fontFamily: 'monospace' }}>
                🏦 BFA · {concepto.productoBFA}
              </p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className={revealed ? 'btn-gold' : 'btn-secondary'}
          style={{ width: '100%' }}
        >
          {revealed ? 'Continuar' : 'Saltar'}
        </button>
      </div>
    </div>
  )
}
