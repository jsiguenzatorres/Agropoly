import { useEffect, useState } from 'react'
import { useAchievementToastStore } from '../../store/achievementToastStore'
import { sfx } from '../../lib/sfx'

const KEYFRAMES = `
@keyframes achievement-slide-in {
  0%   { opacity: 0; transform: translateX(120%) scale(0.9); }
  60%  { opacity: 1; transform: translateX(-8px) scale(1.04); }
  100% { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes achievement-slide-out {
  0%   { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(120%); }
}
@keyframes achievement-glow {
  0%, 100% { box-shadow: 0 8px 32px rgba(245,197,24,0.35), 0 0 0 1px rgba(245,197,24,0.25) inset; }
  50%      { box-shadow: 0 8px 48px rgba(245,197,24,0.55), 0 0 0 1px rgba(245,197,24,0.4) inset; }
}
`

export function AchievementToast() {
  const queue = useAchievementToastStore(s => s.queue)
  const pop   = useAchievementToastStore(s => s.pop)
  const current = queue[0]
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!current) return
    setExiting(false)
    try { sfx.achievement() } catch { /* audio context may be locked */ }
    const t1 = setTimeout(() => setExiting(true), 4200)
    const t2 = setTimeout(() => { pop(); setExiting(false) }, 4700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [current?.ts]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed', zIndex: 80,
          top: '20px', right: '20px',
          maxWidth: '320px',
          background: 'linear-gradient(135deg, rgba(27,107,47,0.96), rgba(13,43,20,0.96))',
          border: '1px solid rgba(245,197,24,0.45)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: '14px',
          animation: exiting
            ? 'achievement-slide-out 0.45s ease-in forwards'
            : 'achievement-slide-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards, achievement-glow 2.5s ease-in-out infinite 0.6s',
        }}
      >
        <div style={{
          width: '52px', height: '52px', borderRadius: '12px',
          background: 'rgba(245,197,24,0.18)',
          border: '2px solid rgba(245,197,24,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px',
          flexShrink: 0,
        }}>
          {current.icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            color: 'rgba(245,232,200,0.5)',
            fontSize: '10px', letterSpacing: '0.18em',
            fontFamily: 'monospace', margin: 0,
          }}>
            🏆 LOGRO DESBLOQUEADO
          </p>
          <p style={{ color: '#F5C518', fontWeight: 700, fontSize: '14px', margin: '2px 0 0' }}>
            {current.title}
          </p>
          <p style={{ color: 'rgba(245,232,200,0.7)', fontSize: '11px', margin: '2px 0 0', lineHeight: 1.35 }}>
            {current.description}
          </p>
        </div>
      </div>
    </>
  )
}
