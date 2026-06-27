import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import type { Mood } from '../../lib/mascot-dialogues'

// ─── Bubble pop keyframe ───────────────────────────────────────────────────────
const BUBBLE_POP = `
@keyframes bubble-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  70%  { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}
`

// ─── Mouth paths by mood ───────────────────────────────────────────────────────
const MOUTH_F: Record<Mood, string> = {
  happy:   'M36,82 Q50,93 64,82',
  excited: 'M30,78 Q50,97 70,78',
  sad:     'M37,88 Q50,79 63,88',
  worried: 'M40,87 Q50,81 60,87',
  neutral: 'M40,84 L60,84',
}
const MOUTH_M: Record<Mood, string> = {
  happy:   'M36,77 Q50,87 64,77',
  excited: 'M30,74 Q50,91 70,74',
  sad:     'M37,83 Q50,75 63,83',
  worried: 'M40,82 Q50,76 60,82',
  neutral: 'M40,79 L60,79',
}

// ─── Don Fomento (agricultor sabio) ───────────────────────────────────────────
function DonFomentoSVG({ mood }: { mood: Mood }) {
  const worried = mood === 'worried' || mood === 'sad'
  const squint  = mood === 'happy' || mood === 'excited'
  return (
    <svg width="105" height="158" viewBox="0 0 105 158" xmlns="http://www.w3.org/2000/svg">
      {/* Ground shadow */}
      <ellipse cx="52" cy="155" rx="34" ry="5" fill="rgba(0,0,0,0.22)" />

      {/* Body — BFA green shirt */}
      <path d="M20 102 Q16 150 16 155 L88 155 Q88 150 84 102 Z" fill="#1B6B2F" />
      {/* Shirt collar V */}
      <path d="M40 102 L52 118 L64 102" fill="#145222" />
      {/* BFA lettering */}
      <text x="52" y="140" textAnchor="middle" fill="#F5C518"
        fontSize="13" fontWeight="bold" fontFamily="monospace">BFA</text>
      {/* Belt */}
      <rect x="20" y="112" width="64" height="7" rx="3" fill="#0D3A1A" />
      <rect x="45" y="112" width="14" height="7" rx="2" fill="#C9A864" />

      {/* Neck */}
      <rect x="38" y="94" width="28" height="14" rx="5" fill="#D4956A" />

      {/* Head */}
      <ellipse cx="52" cy="70" rx="32" ry="34" fill="#D4956A" />

      {/* Ears */}
      <ellipse cx="20" cy="72" rx="6" ry="10" fill="#C07B50" />
      <ellipse cx="84" cy="72" rx="6" ry="10" fill="#C07B50" />
      {/* Inner ears */}
      <ellipse cx="20" cy="72" rx="3" ry="6" fill="#B06840" />
      <ellipse cx="84" cy="72" rx="3" ry="6" fill="#B06840" />

      {/* Straw hat — brim */}
      <ellipse cx="52" cy="40" rx="46" ry="9" fill="#C9A864" />
      {/* Hat crown */}
      <rect x="24" y="18" width="56" height="26" rx="9" fill="#D4B473" />
      {/* Hat indent */}
      <rect x="30" y="18" width="44" height="5" rx="3" fill="#BCA05A" />
      {/* BFA band */}
      <rect x="24" y="38" width="56" height="7" rx="3" fill="#1B6B2F" />
      {/* Hatband gold stripe */}
      <rect x="24" y="41" width="56" height="2" rx="1" fill="#F5C518" opacity="0.6" />

      {/* Wrinkles (forehead) */}
      <path d="M36 50 Q52 47 68 50" stroke="#B86A3A" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M38 55 Q52 52 66 55" stroke="#B86A3A" strokeWidth="1.0" fill="none" opacity="0.4" />

      {/* Eyebrows */}
      {worried ? (
        <>
          <path d="M32 60 Q40 55 48 59" stroke="#7A5030" strokeWidth="3.5" fill="none" strokeLinecap="round"
            transform="rotate(10,40,57)" />
          <path d="M56 59 Q64 55 72 60" stroke="#7A5030" strokeWidth="3.5" fill="none" strokeLinecap="round"
            transform="rotate(-10,64,57)" />
        </>
      ) : (
        <>
          <path d="M32 60 Q40 56 48 60" stroke="#7A5030" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M56 60 Q64 56 72 60" stroke="#7A5030" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <ellipse cx="40" cy="68" rx="7" ry={squint ? 4 : 7} fill="white" />
      <ellipse cx="64" cy="68" rx="7" ry={squint ? 4 : 7} fill="white" />
      <circle cx="41" cy="69" r="4.2" fill="#3A1E0A" />
      <circle cx="65" cy="69" r="4.2" fill="#3A1E0A" />
      <circle cx="42.5" cy="67.5" r="1.5" fill="white" />
      <circle cx="66.5" cy="67.5" r="1.5" fill="white" />

      {/* Nose */}
      <path d="M46 76 Q52 81 58 76" stroke="#B06840" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="79" r="2" fill="#B06840" opacity="0.4" />

      {/* Thick mustache */}
      <path d="M28 84 Q40 78 52 82 Q64 78 76 84"
        stroke="#E8DBC8" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M28 84 Q40 78 52 82 Q64 78 76 84"
        stroke="#D0C4A8" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Mouth */}
      <path d={MOUTH_F[mood]} stroke="#8B4A2A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {mood === 'excited' && (
        <path d="M34 82 Q52 94 70 82 Q52 91 34 82 Z" fill="white" opacity="0.85" />
      )}

      {/* Cheek flush (happy/excited) */}
      {(mood === 'happy' || mood === 'excited') && (
        <>
          <ellipse cx="30" cy="76" rx="7" ry="5" fill="#E07A50" opacity="0.25" />
          <ellipse cx="74" cy="76" rx="7" ry="5" fill="#E07A50" opacity="0.25" />
        </>
      )}
    </svg>
  )
}

// ─── Maicita (estudiante alegre) ───────────────────────────────────────────────
function MaicitaSVG({ mood }: { mood: Mood }) {
  const worried = mood === 'worried' || mood === 'sad'
  const excited = mood === 'excited'
  return (
    <svg width="100" height="158" viewBox="0 0 100 158" xmlns="http://www.w3.org/2000/svg">
      {/* Ground shadow */}
      <ellipse cx="50" cy="155" rx="30" ry="5" fill="rgba(0,0,0,0.22)" />

      {/* Body — yellow dress */}
      <path d="M22 100 Q18 148 16 155 L84 155 Q82 148 78 100 Z" fill="#F5C518" />
      {/* Green apron */}
      <path d="M34 104 Q50 98 66 104 L62 132 Q50 137 38 132 Z" fill="#1B6B2F" />
      {/* BFA badge */}
      <rect x="42" y="108" width="16" height="12" rx="3" fill="#0D3A1A" />
      <text x="50" y="118" textAnchor="middle" fill="#F5C518" fontSize="7" fontWeight="bold" fontFamily="monospace">BFA</text>
      {/* Dress ruffles */}
      <path d="M22 120 Q30 115 38 120 Q46 115 54 120 Q62 115 70 120 Q78 115 78 120"
        stroke="#E8B010" strokeWidth="2.5" fill="none" />

      {/* Neck */}
      <rect x="36" y="92" width="28" height="14" rx="5" fill="#C8845A" />

      {/* Head */}
      <ellipse cx="50" cy="65" rx="30" ry="32" fill="#C8845A" />

      {/* Ears */}
      <ellipse cx="20" cy="66" rx="6" ry="9" fill="#B0704A" />
      <ellipse cx="80" cy="66" rx="6" ry="9" fill="#B0704A" />
      <ellipse cx="20" cy="66" rx="3" ry="5" fill="#9A6038" />
      <ellipse cx="80" cy="66" rx="3" ry="5" fill="#9A6038" />

      {/* Hair top */}
      <path d="M20 52 Q50 28 80 52 Q74 40 50 35 Q26 40 20 52 Z" fill="#1C0E06" />

      {/* Left braid */}
      <path d="M22 54 Q14 68 16 92 Q20 98 26 94 Q22 70 28 54 Z" fill="#1C0E06" />
      {/* Left braid weave */}
      <path d="M15 64 Q23 62 21 70 Q14 72 15 64" fill="#2C1810" />
      <path d="M15 76 Q23 74 21 82 Q14 84 15 76" fill="#2C1810" />

      {/* Right braid */}
      <path d="M78 54 Q86 68 84 92 Q80 98 74 94 Q78 70 72 54 Z" fill="#1C0E06" />
      {/* Right braid weave */}
      <path d="M85 64 Q77 62 79 70 Q86 72 85 64" fill="#2C1810" />
      <path d="M85 76 Q77 74 79 82 Q86 84 85 76" fill="#2C1810" />

      {/* Corn decorations on braids */}
      <ellipse cx="16" cy="70" rx="5" ry="4" fill="#F5C518" />
      <ellipse cx="16" cy="80" rx="5" ry="4" fill="#F5C518" />
      <ellipse cx="84" cy="70" rx="5" ry="4" fill="#F5C518" />
      <ellipse cx="84" cy="80" rx="5" ry="4" fill="#F5C518" />
      {/* Corn dots */}
      <circle cx="14" cy="69" r="1.5" fill="#D4A010" />
      <circle cx="18" cy="71" r="1.5" fill="#D4A010" />
      <circle cx="14" cy="81" r="1.5" fill="#D4A010" />
      <circle cx="18" cy="79" r="1.5" fill="#D4A010" />
      <circle cx="86" cy="69" r="1.5" fill="#D4A010" />
      <circle cx="82" cy="71" r="1.5" fill="#D4A010" />
      <circle cx="86" cy="81" r="1.5" fill="#D4A010" />
      <circle cx="82" cy="79" r="1.5" fill="#D4A010" />

      {/* Hair ribbon */}
      <path d="M28 50 Q50 43 72 50" stroke="#F5C518" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Eyebrows */}
      {worried ? (
        <>
          <path d="M30 52 Q38 47 46 51" stroke="#1C0E06" strokeWidth="2.8" fill="none" strokeLinecap="round"
            transform="rotate(12,38,49)" />
          <path d="M54 51 Q62 47 70 52" stroke="#1C0E06" strokeWidth="2.8" fill="none" strokeLinecap="round"
            transform="rotate(-12,62,49)" />
        </>
      ) : (
        <>
          <path d="M30 52 Q38 47 46 51" stroke="#1C0E06" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M54 51 Q62 47 70 52" stroke="#1C0E06" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <ellipse cx="37" cy="61" rx="7" ry={excited ? 8 : 7} fill="white" />
      <ellipse cx="63" cy="61" rx="7" ry={excited ? 8 : 7} fill="white" />
      <circle cx="38" cy="62" r="4.5" fill="#1A0A00" />
      <circle cx="64" cy="62" r="4.5" fill="#1A0A00" />
      <circle cx="39.5" cy="60.5" r="1.6" fill="white" />
      <circle cx="65.5" cy="60.5" r="1.6" fill="white" />
      {/* Eyelashes (excited) */}
      {excited && (
        <>
          <line x1="30" y1="55" x2="32" y2="52" stroke="#1C0E06" strokeWidth="1.5" />
          <line x1="37" y1="53" x2="37" y2="50" stroke="#1C0E06" strokeWidth="1.5" />
          <line x1="44" y1="55" x2="46" y2="52" stroke="#1C0E06" strokeWidth="1.5" />
          <line x1="56" y1="55" x2="54" y2="52" stroke="#1C0E06" strokeWidth="1.5" />
          <line x1="63" y1="53" x2="63" y2="50" stroke="#1C0E06" strokeWidth="1.5" />
          <line x1="70" y1="55" x2="68" y2="52" stroke="#1C0E06" strokeWidth="1.5" />
        </>
      )}

      {/* Nose */}
      <circle cx="50" cy="69" r="3.5" fill="#A06038" opacity="0.6" />

      {/* Freckles */}
      <circle cx="35" cy="72" r="2" fill="#A06038" opacity="0.4" />
      <circle cx="41" cy="74" r="2" fill="#A06038" opacity="0.4" />
      <circle cx="59" cy="74" r="2" fill="#A06038" opacity="0.4" />
      <circle cx="65" cy="72" r="2" fill="#A06038" opacity="0.4" />

      {/* Mouth */}
      <path d={MOUTH_M[mood]} stroke="#8B3020" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      {excited && (
        <path d="M34 78 Q50 90 66 78 Q50 87 34 78 Z" fill="white" opacity="0.9" />
      )}

      {/* Cheek blush */}
      {(mood === 'happy' || mood === 'excited') && (
        <>
          <ellipse cx="30" cy="72" rx="7" ry="5" fill="#E05A3A" opacity="0.22" />
          <ellipse cx="70" cy="72" rx="7" ry="5" fill="#E05A3A" opacity="0.22" />
        </>
      )}
    </svg>
  )
}

// ─── Speech bubble ─────────────────────────────────────────────────────────────
function SpeechBubble({ text, tailRight }: { text: string; tailRight: boolean }) {
  return (
    <>
      <style>{BUBBLE_POP}</style>
    <div
      style={{
        animation: 'bubble-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        transformOrigin: tailRight ? 'right bottom' : 'left bottom',
        position: 'relative', maxWidth: '200px',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '18px',
        padding: '10px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(4px)',
      }}>
        <p style={{
          color: '#1A2E1A',
          fontSize: '13px',
          fontWeight: 600,
          lineHeight: 1.4,
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
        }}>{text}</p>
      </div>
      {/* Tail */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        ...(tailRight
          ? { right: '-9px', borderLeft: '10px solid rgba(255,255,255,0.97)' }
          : { left: '-9px', borderRight: '10px solid rgba(255,255,255,0.97)' }),
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        width: 0, height: 0,
      }} />
    </div>
    </>
  )
}

// ─── Main overlay — CSS-transition approach (works in Strict Mode) ────────────
const IDLE_KEYFRAMES = `
@keyframes mascot-idle {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
`

export function MascotOverlay() {
  const mascotSeq     = useGameStore(s => s.mascotSeq)
  const mascot        = useGameStore(s => s.mascot)
  const dismissMascot = useGameStore(s => s.dismissMascot)

  const [line, setLine]   = useState<typeof mascot>(null)
  const [shown, setShown] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearAll = () => timers.current.forEach(clearTimeout)

  useEffect(() => {
    if (!mascot) return
    clearAll(); timers.current = []

    setShown(false)        // reset to hidden first
    setLine(mascot)        // update content

    // one frame later: trigger CSS transition into view
    timers.current.push(setTimeout(() => setShown(true), 20))

    // auto-hide after 4.5 s
    timers.current.push(setTimeout(() => {
      setShown(false)
      timers.current.push(setTimeout(() => dismissMascot(), 450))
    }, 4500))

    return clearAll
  }, [mascotSeq]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = () => {
    clearAll(); timers.current = []
    setShown(false)
    timers.current.push(setTimeout(() => dismissMascot(), 450))
  }

  if (!line) return null

  const isRight = line.id === 'don_fomento'

  return (
    <>
      <style>{IDLE_KEYFRAMES}</style>
      {/* Outer: entry/exit via opacity + transform CSS transition */}
      <div
        onClick={handleDismiss}
        style={{
          position: 'fixed', zIndex: 60,
          bottom: '16px',
          [isRight ? 'right' : 'left']: '12px',
          cursor: 'pointer', userSelect: 'none' as const,
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0px)' : 'translateY(130px)',
          transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: shown ? 'auto' : 'none',
        }}
      >
        {/* Inner: idle bob animation — separate from the entry transform */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: '10px',
          flexDirection: isRight ? 'row-reverse' : 'row',
          animation: shown ? 'mascot-idle 3s ease-in-out infinite 0.55s' : 'none',
        }}>
          {line.id === 'don_fomento'
            ? <DonFomentoSVG mood={line.mood} />
            : <MaicitaSVG    mood={line.mood} />
          }
          <SpeechBubble text={line.text} tailRight={isRight} />
        </div>
      </div>
    </>
  )
}
