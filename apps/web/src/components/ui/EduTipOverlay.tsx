import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export function EduTipOverlay() {
  const eduTipSeq    = useGameStore(s => s.eduTipSeq)
  const eduTip       = useGameStore(s => s.eduTip)
  const dismissEduTip = useGameStore(s => s.dismissEduTip)

  const [tip, setTip]   = useState<typeof eduTip>(null)
  const [shown, setShown] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearAll = () => timers.current.forEach(clearTimeout)

  useEffect(() => {
    if (!eduTip) return
    clearAll(); timers.current = []

    setShown(false)
    setTip(eduTip)

    timers.current.push(setTimeout(() => setShown(true), 20))
    // 8s window — gives time to read the BFA lesson before pressing the action button
    timers.current.push(setTimeout(() => {
      setShown(false)
      timers.current.push(setTimeout(() => dismissEduTip(), 450))
    }, 8000))

    return clearAll
  }, [eduTipSeq]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = () => {
    clearAll(); timers.current = []
    setShown(false)
    timers.current.push(setTimeout(() => dismissEduTip(), 450))
  }

  if (!tip) return null

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        top: '64px',
        left: '50%',
        zIndex: 55,
        transform: shown
          ? 'translate(-50%, 0) scale(1)'
          : 'translate(-50%, -40px) scale(0.92)',
        opacity: shown ? 1 : 0,
        transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: shown ? 'auto' : 'none',
        cursor: 'pointer',
        maxWidth: '420px',
        width: 'calc(100vw - 32px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(27,107,47,0.96), rgba(13,43,20,0.96))',
          border: '1px solid rgba(245,197,24,0.5)',
          borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.1) inset',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{
          flexShrink: 0, width: '40px', height: '40px',
          background: 'rgba(245,197,24,0.15)',
          border: '1px solid rgba(245,197,24,0.3)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px',
        }}>
          {tip.icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            gap: '8px', marginBottom: '2px',
          }}>
            <p style={{
              color: '#F5C518', fontWeight: 700, fontSize: '13px',
              letterSpacing: '0.02em', margin: 0,
            }}>
              {tip.title}
            </p>
            <span style={{
              color: 'rgba(245,232,200,0.5)', fontSize: '9px',
              fontFamily: 'monospace', letterSpacing: '0.15em',
              flexShrink: 0,
            }}>
              BFA · TIP
            </span>
          </div>
          <p style={{
            color: 'rgba(245,232,200,0.85)', fontSize: '12px',
            lineHeight: 1.4, margin: 0,
          }}>
            {tip.body}
          </p>
        </div>
      </div>
    </div>
  )
}
