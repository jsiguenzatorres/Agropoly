export const tokens = {
  color: {
    brand: {
      green: {
        100: '#E8F5E9',
        300: '#4CAF70',
        500: '#2E8B4A',
        700: '#1B6B2F',
        900: '#0D2B14',
      },
      gold:  {
        100: '#FFF9C4',
        500: '#F5C518',
        700: '#E8A020',
        900: '#B8860B',
      },
      earth: { 500: '#7B5228', 700: '#5D3E2A' },
      cream: '#FDF8EE',
      dark:  '#060E08',
    },
    group: {
      0: { hex: '#8B1A8B', name: 'Occidente I',  glow: 'rgba(139,26,139,0.5)'  },
      1: { hex: '#009FDF', name: 'Occidente II', glow: 'rgba(0,159,223,0.5)'   },
      2: { hex: '#D6006E', name: 'Centro Norte', glow: 'rgba(214,0,110,0.5)'   },
      3: { hex: '#E8610C', name: 'Paracentral',  glow: 'rgba(232,97,12,0.5)'   },
      4: { hex: '#C0392B', name: 'Oriente I',    glow: 'rgba(192,57,43,0.5)'   },
      5: { hex: '#D4AC00', name: 'Oriente II',   glow: 'rgba(212,172,0,0.5)'   },
      6: { hex: '#00913A', name: 'Gran S.S.',    glow: 'rgba(0,145,58,0.5)'    },
      7: { hex: '#00297A', name: 'Casa Matriz',  glow: 'rgba(0,41,122,0.5)'    },
    } as const,
    token: {
      maiz:    { hex: '#F5C518', glow: 'rgba(245,197,24,0.6)',   emoji: '🌽' },
      cafe:    { hex: '#8B5E3C', glow: 'rgba(139,94,60,0.6)',    emoji: '☕' },
      vaca:    { hex: '#00AEEF', glow: 'rgba(0,174,239,0.6)',    emoji: '🐄' },
      tractor: { hex: '#F7941D', glow: 'rgba(247,148,29,0.6)',   emoji: '🚜' },
      milpa:   { hex: '#4CAF70', glow: 'rgba(76,175,112,0.6)',   emoji: '🌿' },
      pez:     { hex: '#6B9FE4', glow: 'rgba(107,159,228,0.6)',  emoji: '🐟' },
    } as const,
    state: {
      success: '#4CAF70',
      danger:  '#E57373',
      warning: '#FFC107',
      neutral: '#9E9E9E',
    },
  },
  typography: {
    fontFamily: {
      display: "'Playfair Display', Georgia, serif",
      accent:  "'Cinzel Decorative', serif",
      body:    "'DM Sans', system-ui, sans-serif",
      mono:    "'Space Mono', 'Courier New', monospace",
    },
  },
  animation: {
    duration: {
      instant:   '50ms',
      fast:      '150ms',
      normal:    '300ms',
      slow:      '600ms',
      cinematic: '1200ms',
      epic:      '2400ms',
    },
    easing: {
      bounce:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      snap:    'cubic-bezier(0.0, 0.0, 0.2, 1)',
    },
  },
  mascots: {
    don_fomento: { voiceId: '', emoji: '👴', color: '#2E8B4A' },
    maicita:     { voiceId: '', emoji: '👧', color: '#4CAF70' },
    don_cafe:    { voiceId: '', emoji: '👨‍💼', color: '#8B5E3C' },
    la_canche:   { voiceId: '', emoji: '🤠', color: '#F7941D' },
    la_vaquita:  { voiceId: '', emoji: '🐄', color: '#F5C518' },
    la_tormenta: { voiceId: '', emoji: '⛈', color: '#009FDF' },
  } as const,
} as const

export type GroupIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type TokenId = keyof typeof tokens.color.token
export type MascotId = keyof typeof tokens.mascots
