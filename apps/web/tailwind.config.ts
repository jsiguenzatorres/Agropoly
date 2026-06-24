import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bfa-green':  { 100:'#E8F5E9', 300:'#4CAF70', 500:'#2E8B4A', 700:'#1B6B2F', 900:'#0D2B14' },
        'bfa-gold':   { 100:'#FFF9C4', 500:'#F5C518', 700:'#E8A020', 900:'#B8860B' },
        'bfa-earth':  { 500:'#7B5228', 700:'#5D3E2A' },
        'bfa-cream':  '#FDF8EE',
        'bfa-dark':   '#060E08',
        // Grupos de propiedades
        'group-0':    '#8B1A8B',  // Occidente I
        'group-1':    '#009FDF',  // Occidente II
        'group-2':    '#D6006E',  // Centro Norte
        'group-3':    '#E8610C',  // Paracentral
        'group-4':    '#C0392B',  // Oriente I
        'group-5':    '#D4AC00',  // Oriente II
        'group-6':    '#00913A',  // Gran S.S.
        'group-7':    '#00297A',  // Casa Matriz
      },
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        accent:  ["'Cinzel Decorative'", 'serif'],
        body:    ["'DM Sans'", 'system-ui', 'sans-serif'],
        mono:    ["'Space Mono'", "'Courier New'", 'monospace'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'bounce-in':   'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'coin-fly':    'coinFly 0.8s ease-out forwards',
        'fade-in-up':  'fadeInUp 0.5s ease-out forwards',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float:      { '0%,100%':{ transform:'translateY(0)' },     '50%':{ transform:'translateY(-12px)' } },
        glowPulse:  { '0%,100%':{ boxShadow:'0 0 8px rgba(46,139,74,0.4)' }, '50%':{ boxShadow:'0 0 32px rgba(46,139,74,0.8)' } },
        shimmer:    { '0%':{ backgroundPosition:'-200% 0' },       '100%':{ backgroundPosition:'200% 0' } },
        bounceIn:   { '0%':{ transform:'scale(0)' }, '60%':{ transform:'scale(1.1)' }, '100%':{ transform:'scale(1)' } },
        coinFly:    { '0%':{ transform:'translateY(0) scale(1)', opacity:'1' }, '100%':{ transform:'translateY(-80px) scale(0)', opacity:'0' } },
        fadeInUp:   { '0%':{ transform:'translateY(20px)', opacity:'0' }, '100%':{ transform:'translateY(0)', opacity:'1' } },
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #F5C518 0%, #E8A020 45%, #fff8d0 70%, #F5C518 100%)',
        'bfa-gradient': 'linear-gradient(170deg, #0D2B14 0%, #060E08 100%)',
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config
