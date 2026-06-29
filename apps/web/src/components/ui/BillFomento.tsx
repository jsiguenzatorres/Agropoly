// Stylized "Fomento" currency notes — 7 denominations, each tied to a BFA
// agricultural theme. Used in HUD chips, StoryIntro credit cards, and the
// VictoryScreen wealth display.
//
// Each note is pure SVG so it scales crisply at any size. The 3D flip
// (anverso ↔ reverso) is a CSS rotateY toggle via the `flipped` prop.

import { useState } from 'react'

export type Denomination = 1 | 5 | 10 | 20 | 50 | 100 | 500

interface BillProps {
  denomination: Denomination
  size?: 'sm' | 'md' | 'lg'
  flippable?: boolean   // when true, click toggles anverso/reverso
}

const SIZE: Record<NonNullable<BillProps['size']>, { w: number; h: number; fs: number }> = {
  sm: { w: 60, h: 32, fs: 11 },
  md: { w: 120, h: 64, fs: 18 },
  lg: { w: 200, h: 106, fs: 32 },
}

const THEME: Record<Denomination, {
  name:       string
  bgFrom:     string
  bgTo:       string
  text:       string
  textMuted:  string
  illustration: (s: number) => JSX.Element
  reverseScene: (s: number) => JSX.Element
}> = {
  1: {
    name: 'La Mazorca', bgFrom: '#F5C518', bgTo: '#E8A020',
    text: '#4A1B0C', textMuted: '#712B13',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <ellipse cx="14" cy="16" rx="6" ry="10" fill="#FDF8EE" />
        <g fill="#7D5028">
          <circle cx="11" cy="10" r="1.2" /><circle cx="14" cy="9" r="1.2" /><circle cx="17" cy="10" r="1.2" />
          <circle cx="11" cy="14" r="1.2" /><circle cx="14" cy="13" r="1.2" /><circle cx="17" cy="14" r="1.2" />
          <circle cx="11" cy="18" r="1.2" /><circle cx="14" cy="17" r="1.2" /><circle cx="17" cy="18" r="1.2" />
          <circle cx="11" cy="22" r="1.2" /><circle cx="14" cy="21" r="1.2" /><circle cx="17" cy="22" r="1.2" />
        </g>
        <path d="M 8 8 Q 4 4 6 18 Z" fill="#639922" />
        <path d="M 20 8 Q 24 4 22 18 Z" fill="#639922" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`} opacity="0.85">
        <rect x="2" y="22" width="24" height="2" fill="#7D5028" />
        <path d="M 4 22 Q 6 14 8 22" stroke="#639922" strokeWidth="1.2" fill="none" />
        <path d="M 9 22 Q 11 13 13 22" stroke="#639922" strokeWidth="1.2" fill="none" />
        <path d="M 14 22 Q 16 12 18 22" stroke="#639922" strokeWidth="1.2" fill="none" />
        <path d="M 19 22 Q 21 13 23 22" stroke="#639922" strokeWidth="1.2" fill="none" />
        <circle cx="22" cy="6" r="3" fill="#F5C518" />
      </g>
    ),
  },
  5: {
    name: 'Don Café', bgFrom: '#7D5028', bgTo: '#5C3A1E',
    text: '#FDF8EE', textMuted: '#F5C518',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 6 10 L 8 22 Q 10 26 14 26 Q 18 26 20 22 L 22 10 Z" fill="#FDF8EE" />
        <ellipse cx="14" cy="10" rx="8" ry="2" fill="#3C2810" />
        <ellipse cx="14" cy="10" rx="7" ry="1.5" fill="#5C3A1E" />
        <path d="M 22 13 Q 28 14 27 20 Q 26 24 22 23" fill="none" stroke="#FDF8EE" strokeWidth="1.5" />
        <path d="M 11 5 Q 12 8 11 10" stroke="#FDF8EE" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M 14 4 Q 15 7 14 9" stroke="#FDF8EE" strokeWidth="0.8" fill="none" opacity="0.7" />
        <path d="M 17 5 Q 18 8 17 10" stroke="#FDF8EE" strokeWidth="0.8" fill="none" opacity="0.7" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <circle cx="6" cy="20" r="3" fill="#E24B4A" />
        <circle cx="10" cy="22" r="2.5" fill="#E24B4A" />
        <circle cx="14" cy="20" r="3" fill="#E24B4A" />
        <circle cx="18" cy="22" r="2.5" fill="#A32D2D" />
        <circle cx="22" cy="20" r="3" fill="#E24B4A" />
        <path d="M 6 17 Q 6 12 14 12 Q 22 12 22 17" fill="none" stroke="#639922" strokeWidth="1" />
      </g>
    ),
  },
  10: {
    name: 'La Vaquita BFA', bgFrom: '#FDF8EE', bgTo: '#D3D1C7',
    text: '#2C2C2A', textMuted: '#444441',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <ellipse cx="20" cy="18" rx="10" ry="6" fill="#FDF8EE" stroke="#2C2C2A" strokeWidth="0.8" />
        <circle cx="10" cy="12" r="5.5" fill="#FDF8EE" stroke="#2C2C2A" strokeWidth="0.8" />
        <circle cx="8" cy="11" r="0.8" fill="#1A1A1A" />
        <circle cx="12" cy="11" r="0.8" fill="#1A1A1A" />
        <ellipse cx="10" cy="14" rx="2" ry="1" fill="#F4C0D1" />
        <ellipse cx="14" cy="20" rx="1.5" ry="0.8" fill="#1A1A1A" />
        <ellipse cx="22" cy="16" rx="2" ry="1" fill="#1A1A1A" />
        <ellipse cx="26" cy="20" rx="1.5" ry="0.8" fill="#1A1A1A" />
        <path d="M 6 8 L 5 5 L 7 7 Z" fill="#FDF8EE" stroke="#2C2C2A" strokeWidth="0.5" />
        <path d="M 14 8 L 15 5 L 13 7 Z" fill="#FDF8EE" stroke="#2C2C2A" strokeWidth="0.5" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <ellipse cx="14" cy="22" rx="12" ry="2" fill="#97C459" opacity="0.4" />
        <rect x="6" y="14" width="3" height="10" fill="#FDF8EE" />
        <ellipse cx="7.5" cy="14" rx="1.5" ry="2" fill="#F4C0D1" />
        <rect x="20" y="14" width="3" height="10" fill="#FDF8EE" />
        <ellipse cx="21.5" cy="14" rx="1.5" ry="2" fill="#F4C0D1" />
        <path d="M 9 20 Q 14 18 19 20" stroke="#FDF8EE" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  20: {
    name: 'Don Fomento', bgFrom: '#C0DD97', bgTo: '#639922',
    text: '#173404', textMuted: '#27500A',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <rect x="4" y="10" width="14" height="10" fill="#E24B4A" rx="1" />
        <rect x="18" y="13" width="6" height="7" fill="#A32D2D" rx="1" />
        <rect x="6" y="12" width="3" height="3" fill="#85B7EB" rx="0.5" />
        <rect x="11" y="12" width="3" height="3" fill="#85B7EB" rx="0.5" />
        <circle cx="9" cy="22" r="4" fill="#1A1A1A" />
        <circle cx="9" cy="22" r="2" fill="#444441" />
        <circle cx="21" cy="23" r="3" fill="#1A1A1A" />
        <circle cx="21" cy="23" r="1.5" fill="#444441" />
        <rect x="20" y="9" width="1.5" height="4" fill="#1A1A1A" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 2 24 Q 14 18 26 24" fill="#7D5028" />
        <path d="M 4 22 Q 6 16 8 22" stroke="#173404" strokeWidth="1" fill="none" />
        <path d="M 10 22 Q 12 14 14 22" stroke="#173404" strokeWidth="1" fill="none" />
        <path d="M 16 22 Q 18 16 20 22" stroke="#173404" strokeWidth="1" fill="none" />
        <circle cx="22" cy="6" r="2.5" fill="#F5C518" />
      </g>
    ),
  },
  50: {
    name: 'La Milpa', bgFrom: '#639922', bgTo: '#173404',
    text: '#FDF8EE', textMuted: '#C0DD97',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <rect x="2" y="24" width="24" height="2" fill="#7D5028" />
        <path d="M 5 24 Q 7 10 9 24" stroke="#C0DD97" strokeWidth="1.5" fill="none" />
        <path d="M 10 24 Q 12 8 14 24" stroke="#97C459" strokeWidth="1.5" fill="none" />
        <path d="M 15 24 Q 17 10 19 24" stroke="#C0DD97" strokeWidth="1.5" fill="none" />
        <path d="M 20 24 Q 22 9 24 24" stroke="#97C459" strokeWidth="1.5" fill="none" />
        <ellipse cx="14" cy="6" rx="3" ry="2" fill="#F5C518" opacity="0.6" />
        <ellipse cx="6" cy="20" rx="1" ry="0.5" fill="#F5C518" />
        <ellipse cx="20" cy="20" rx="1" ry="0.5" fill="#F5C518" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 2 24 L 26 24" stroke="#7D5028" strokeWidth="2" />
        <path d="M 4 24 L 6 16 L 8 24" fill="#97C459" />
        <path d="M 10 24 L 14 12 L 18 24" fill="#639922" />
        <path d="M 20 24 L 22 16 L 24 24" fill="#97C459" />
        <circle cx="24" cy="5" r="2" fill="#F5C518" />
      </g>
    ),
  },
  100: {
    name: 'El Pez', bgFrom: '#B5D4F4', bgTo: '#185FA5',
    text: '#042C53', textMuted: '#0C447C',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 2 14 Q 12 6 22 14 Q 12 22 2 14 Z" fill="#0C447C" />
        <path d="M 22 14 L 28 8 L 28 20 Z" fill="#0C447C" />
        <circle cx="8" cy="13" r="1.5" fill="#FDF8EE" />
        <circle cx="8" cy="13" r="0.6" fill="#0C447C" />
        <path d="M 12 10 Q 14 12 12 14" stroke="#FDF8EE" strokeWidth="0.5" fill="none" />
        <path d="M 15 10 Q 17 12 15 14" stroke="#FDF8EE" strokeWidth="0.5" fill="none" />
        <path d="M 18 10 Q 20 12 18 14" stroke="#FDF8EE" strokeWidth="0.5" fill="none" />
        <path d="M 12 17 Q 14 15 12 13" stroke="#FDF8EE" strokeWidth="0.5" fill="none" />
        <path d="M 1 13 Q 0 14 1 15" stroke="#185FA5" strokeWidth="0.6" fill="none" />
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 2 22 Q 8 18 14 22 Q 20 18 26 22" stroke="#FDF8EE" strokeWidth="1.5" fill="none" />
        <path d="M 2 18 Q 8 14 14 18 Q 20 14 26 18" stroke="#FDF8EE" strokeWidth="1" fill="none" opacity="0.7" />
        <circle cx="6" cy="8" r="1" fill="#FDF8EE" />
        <circle cx="10" cy="6" r="1.5" fill="#FDF8EE" />
        <circle cx="16" cy="7" r="1" fill="#FDF8EE" />
        <circle cx="22" cy="6" r="1.5" fill="#FDF8EE" />
      </g>
    ),
  },
  500: {
    name: 'Casa Matriz BFA', bgFrom: '#534AB7', bgTo: '#26215C',
    text: '#F5C518', textMuted: '#FDF8EE',
    illustration: (s) => (
      <g transform={`scale(${s})`}>
        <polygon points="3,14 14,4 25,14" fill="#F5C518" />
        <rect x="5" y="14" width="18" height="12" fill="#F5C518" />
        <rect x="12" y="18" width="4" height="8" fill="#26215C" />
        <rect x="7" y="16" width="3" height="3" fill="#26215C" />
        <rect x="18" y="16" width="3" height="3" fill="#26215C" />
        <line x1="14" y1="4" x2="14" y2="1" stroke="#FDF8EE" strokeWidth="0.6" />
        <circle cx="14" cy="1" r="0.8" fill="#FDF8EE" />
        <text x="14" y="24" fontSize="2.5" fill="#FDF8EE" textAnchor="middle" fontFamily="monospace">BFA</text>
      </g>
    ),
    reverseScene: (s) => (
      <g transform={`scale(${s})`}>
        <path d="M 4 12 L 8 18 L 6 18 L 6 24 L 4 24 Z" fill="#FDF8EE" />
        <path d="M 10 10 L 14 18 L 12 18 L 12 24 L 8 24 L 8 18 L 6 18 Z" fill="#F5C518" opacity="0.7" />
        <path d="M 16 8 L 22 18 L 20 18 L 20 24 L 14 24 L 14 18 L 12 18 Z" fill="#FDF8EE" />
        <path d="M 22 12 L 26 18 L 24 18 L 24 24 L 20 24 L 20 18 L 18 18 Z" fill="#F5C518" opacity="0.7" />
      </g>
    ),
  },
}

export function BillFomento({ denomination, size = 'md', flippable = false }: BillProps) {
  const [flipped, setFlipped] = useState(false)
  const dim = SIZE[size]
  const theme = THEME[denomination]
  const scale = dim.h / 32  // illustrations are drawn assuming 32px height base

  const baseStyle: React.CSSProperties = {
    width: dim.w, height: dim.h,
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    cursor: flippable ? 'pointer' : 'default',
  }

  const faceStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    borderRadius: dim.h * 0.08,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)',
  }

  return (
    <div
      style={baseStyle}
      onClick={() => flippable && setFlipped(v => !v)}
      title={`Fomento ${denomination} · ${theme.name}`}
    >
      {/* ANVERSO */}
      <div style={{
        ...faceStyle,
        background: `linear-gradient(135deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)`,
      }}>
        <svg viewBox={`0 0 ${dim.w} ${dim.h}`} width="100%" height="100%" style={{ display: 'block' }}>
          {/* Decorative corner motif */}
          <circle cx={dim.h * 0.12} cy={dim.h * 0.18} r={dim.h * 0.06} fill={theme.textMuted} opacity="0.35" />
          <circle cx={dim.w - dim.h * 0.12} cy={dim.h - dim.h * 0.18} r={dim.h * 0.06} fill={theme.textMuted} opacity="0.35" />
          {/* Denomination */}
          <text x={dim.h * 0.2} y={dim.h * 0.42} fontSize={dim.fs} fontWeight="600" fill={theme.text} fontFamily="serif">
            ƒ{denomination}
          </text>
          <text x={dim.h * 0.2} y={dim.h * 0.62} fontSize={dim.fs * 0.32} fill={theme.text} opacity="0.7" letterSpacing="1">
            FOMENTOS
          </text>
          <text x={dim.h * 0.2} y={dim.h * 0.85} fontSize={dim.fs * 0.28} fill={theme.text} opacity="0.55" fontFamily="monospace">
            BFA · {theme.name.toUpperCase()}
          </text>
          {/* Illustration on the right */}
          <g transform={`translate(${dim.w - dim.h * 1.05}, ${dim.h * 0.08})`}>
            {theme.illustration(scale * 0.85)}
          </g>
        </svg>
      </div>

      {/* REVERSO */}
      <div style={{
        ...faceStyle,
        background: `linear-gradient(135deg, ${theme.bgTo} 0%, ${theme.bgFrom} 100%)`,
        transform: 'rotateY(180deg)',
      }}>
        <svg viewBox={`0 0 ${dim.w} ${dim.h}`} width="100%" height="100%" style={{ display: 'block' }}>
          {/* Central scene */}
          <g transform={`translate(${(dim.w - 28 * scale) / 2}, ${(dim.h - 28 * scale) / 2})`}>
            {theme.reverseScene(scale)}
          </g>
          {/* Lower legend */}
          <text x={dim.w / 2} y={dim.h - dim.h * 0.08} fontSize={dim.fs * 0.28} fill={theme.text} opacity="0.7" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
            BANCO DE FOMENTO AGROPECUARIO
          </text>
          {/* Tiny denomination corners */}
          <text x={dim.h * 0.15} y={dim.h * 0.22} fontSize={dim.fs * 0.42} fill={theme.text} opacity="0.7" fontFamily="serif">ƒ{denomination}</text>
          <text x={dim.w - dim.h * 0.15} y={dim.h - dim.h * 0.12} fontSize={dim.fs * 0.42} fill={theme.text} opacity="0.7" fontFamily="serif" textAnchor="end">ƒ{denomination}</text>
        </svg>
      </div>
    </div>
  )
}

// Break a balance into the largest available denominations.
// E.g. 1500 → [500, 500, 500] · 87 → [50, 20, 10, 5, 1, 1]
const DENOMS: Denomination[] = [500, 100, 50, 20, 10, 5, 1]
export function decomposeBalance(amount: number): Denomination[] {
  const result: Denomination[] = []
  let remaining = Math.max(0, Math.floor(amount))
  for (const d of DENOMS) {
    while (remaining >= d) {
      result.push(d)
      remaining -= d
    }
    if (result.length >= 12) break  // cap so a million-dollar stack doesn't explode the DOM
  }
  return result
}

// Render a fanned-out stack of bills representing a balance.
// Used in StoryIntro PlayerScene to make the "ƒ1,500 starting credit" visual.
export function BillStack({ amount, size = 'sm', maxBills = 6 }: { amount: number; size?: 'sm' | 'md' | 'lg'; maxBills?: number }) {
  const bills = decomposeBalance(amount).slice(0, maxBills)
  return (
    <div style={{ position: 'relative', height: SIZE[size].h + 8, width: SIZE[size].w + (bills.length - 1) * 12 }}>
      {bills.map((d, i) => (
        <div
          key={`${d}-${i}`}
          style={{
            position: 'absolute',
            left: i * 12, top: 0,
            transform: `rotate(${(i - bills.length / 2) * 4}deg)`,
            transformOrigin: 'bottom center',
            zIndex: i,
          }}
        >
          <BillFomento denomination={d} size={size} />
        </div>
      ))}
    </div>
  )
}
