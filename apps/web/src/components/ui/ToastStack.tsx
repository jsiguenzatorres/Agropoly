import { useEffect } from 'react'
import { useToastStore, type ToastKind } from '../../store/toastStore'

const KEYFRAMES = `
@keyframes toast-in {
  0%   { opacity: 0; transform: translateY(20px) scale(0.92); }
  60%  { opacity: 1; transform: translateY(-4px) scale(1.04); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-coin {
  0%   { opacity: 0; transform: translate(-50%, 30px) scale(0.7); }
  20%  { opacity: 1; transform: translate(-50%, -10px) scale(1.1); }
  80%  { opacity: 1; transform: translate(-50%, -40px) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -80px) scale(0.95); }
}
`

const STYLE: Record<ToastKind, { bg: string; fg: string; border: string }> = {
  info:      { bg: 'rgba(13,43,20,0.92)',    fg: '#FDF8EE', border: 'rgba(245,232,200,0.25)' },
  success:   { bg: 'rgba(46,139,74,0.92)',   fg: '#FDF8EE', border: 'rgba(76,175,112,0.6)'  },
  warning:   { bg: 'rgba(232,160,32,0.92)',  fg: '#0D2B14', border: 'rgba(245,197,24,0.7)'  },
  error:     { bg: 'rgba(192,57,43,0.92)',   fg: '#FDF8EE', border: 'rgba(231,76,60,0.7)'   },
  money_in:  { bg: 'transparent',            fg: '#4CAF70', border: 'transparent' },
  money_out: { bg: 'transparent',            fg: '#E74C3C', border: 'transparent' },
}

export function ToastStack() {
  const toasts = useToastStore(s => s.toasts)
  const pop    = useToastStore(s => s.pop)

  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => pop(t.id), t.ttl))
    return () => { timers.forEach(clearTimeout) }
  }, [toasts, pop])

  // Coin toasts spawn center-bottom and float up
  const coinToasts = toasts.filter(t => t.kind === 'money_in' || t.kind === 'money_out')
  const regularToasts = toasts.filter(t => t.kind !== 'money_in' && t.kind !== 'money_out')

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Regular toasts — bottom-left stack */}
      <div style={{
        position: 'fixed', zIndex: 75, bottom: '160px', left: '12px',
        display: 'flex', flexDirection: 'column-reverse', gap: '8px',
        pointerEvents: 'none',
      }}>
        {regularToasts.map(t => {
          const s = STYLE[t.kind]
          return (
            <div
              key={t.id}
              style={{
                background: s.bg, color: s.fg,
                border: `1px solid ${s.border}`,
                padding: '8px 14px', borderRadius: '10px',
                fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                maxWidth: '300px',
                animation: 'toast-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
                backdropFilter: 'blur(4px)',
              }}
            >
              {t.text}
            </div>
          )
        })}
      </div>

      {/* Money coins — center-bottom, float up */}
      <div style={{
        position: 'fixed', zIndex: 76, bottom: '180px', left: '50%',
        pointerEvents: 'none',
      }}>
        {coinToasts.map(t => (
          <div
            key={t.id}
            style={{
              position: 'absolute', left: '0',
              transform: 'translateX(-50%)',
              color: STYLE[t.kind].fg,
              fontWeight: 700, fontSize: '22px',
              fontFamily: 'Playfair Display, Georgia, serif',
              textShadow: `0 2px 12px ${STYLE[t.kind].fg}40, 0 0 30px ${STYLE[t.kind].fg}30`,
              animation: 'toast-coin 2s ease-out both',
              whiteSpace: 'nowrap',
            }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </>
  )
}
