// Procedural tile textures — each board space gets a Canvas-rendered texture
// stamping the BFA content (group banner, name, price, icon).
// Cached by space id so we only render each texture once per session.

import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'
import { BOARD_DATA } from '@agropoly/game-engine'

const GROUP_COLOR: Record<number, string> = {
  0: '#8B1A8B', 1: '#009FDF', 2: '#D6006E', 3: '#E8610C',
  4: '#C0392B', 5: '#D4AC00', 6: '#00913A', 7: '#00297A',
}
const SPACE_BG: Record<string, string> = {
  go:       '#F5C518',
  jail:     '#E8A020',
  free:     '#2E8B4A',
  gotojail: '#C0392B',
  tax:      '#7B5228',
  cosecha:  '#1B6B2F',
  riesgo:   '#4A1A4A',
  station:  '#3A3A3A',
  utility:  '#5A5A5A',
}
const SPACE_ICON: Record<string, string> = {
  go:       '➤',
  jail:     '⛔',
  free:     '🌾',
  gotojail: '🚨',
  tax:      '💸',
  cosecha:  '🌽',
  riesgo:   '⚡',
  station:  '🛤',
  utility:  '⚙',
}

const TEXTURE_W   = 256
const TEXTURE_H   = 384   // tiles are taller than wide (vertical bias)
const BANNER_H    = 88    // top color banner

const cache = new Map<number, CanvasTexture>()

// Build the texture for one space id (called once per id and cached).
export function getTileTexture(id: number, _side: 'top' | 'bottom' | 'left' | 'right' | 'corner'): CanvasTexture {
  const cacheKey = id  // texture content doesn't change with side; rotation is applied via UVs
  const cached = cache.get(cacheKey)
  if (cached) return cached

  const space = BOARD_DATA[id]
  const canvas = document.createElement('canvas')
  canvas.width = TEXTURE_W
  canvas.height = TEXTURE_H
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'

  // Base background — cream parchment look
  ctx.fillStyle = '#FDF8EE'
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H)
  // Subtle vignette
  const vig = ctx.createRadialGradient(TEXTURE_W / 2, TEXTURE_H / 2, 80, TEXTURE_W / 2, TEXTURE_H / 2, 280)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = vig
  ctx.fillRect(0, 0, TEXTURE_W, TEXTURE_H)

  // Border
  ctx.strokeStyle = '#0D2B14'
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, TEXTURE_W - 4, TEXTURE_H - 4)

  // ── Property tiles: banner + name + price ─────────────────────────────
  if (space.type === 'prop') {
    const color = GROUP_COLOR[space.group] ?? '#444'
    // Banner
    ctx.fillStyle = color
    ctx.fillRect(8, 8, TEXTURE_W - 16, BANNER_H)
    // Banner shadow lip
    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillRect(8, 8 + BANNER_H - 6, TEXTURE_W - 16, 6)

    // Name (centered, may wrap)
    ctx.fillStyle = '#0D2B14'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const nameLines = wrapText(ctx, space.name, TEXTURE_W - 40, 'bold 30px "Playfair Display", Georgia, serif')
    const lineH = 36
    const startY = BANNER_H + 60
    nameLines.forEach((line, i) => {
      ctx.font = 'bold 30px "Playfair Display", Georgia, serif'
      ctx.fillText(line, TEXTURE_W / 2, startY + i * lineH)
    })

    // Decorative divider
    ctx.strokeStyle = 'rgba(13,43,20,0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(50, TEXTURE_H - 110)
    ctx.lineTo(TEXTURE_W - 50, TEXTURE_H - 110)
    ctx.stroke()

    // "Precio" label
    ctx.font = 'normal 16px "Space Mono", monospace'
    ctx.fillStyle = 'rgba(13,43,20,0.55)'
    ctx.fillText('PRECIO', TEXTURE_W / 2, TEXTURE_H - 78)

    // Price value
    ctx.font = 'bold 38px "Playfair Display", Georgia, serif'
    ctx.fillStyle = '#0D2B14'
    ctx.fillText(`ƒ${space.price}`, TEXTURE_W / 2, TEXTURE_H - 38)

    return finalize(canvas, cacheKey)
  }

  // ── Station / utility: BFA badge + name + price ───────────────────────
  if (space.type === 'station' || space.type === 'utility') {
    const color = SPACE_BG[space.type]
    // Color band on left side
    ctx.fillStyle = color
    ctx.fillRect(8, 8, 28, TEXTURE_H - 16)

    // Center content
    ctx.fillStyle = '#0D2B14'
    ctx.font = '48px serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(SPACE_ICON[space.type] ?? '', TEXTURE_W / 2, 100)

    const nameLines = wrapText(ctx, space.name, TEXTURE_W - 60, 'bold 24px "Playfair Display", Georgia, serif')
    ctx.font = 'bold 24px "Playfair Display", Georgia, serif'
    nameLines.forEach((line, i) => {
      ctx.fillText(line, TEXTURE_W / 2, 200 + i * 30)
    })

    ctx.font = 'normal 14px "Space Mono", monospace'
    ctx.fillStyle = 'rgba(13,43,20,0.55)'
    ctx.fillText('PRECIO', TEXTURE_W / 2, TEXTURE_H - 78)
    ctx.font = 'bold 32px "Playfair Display", Georgia, serif'
    ctx.fillStyle = '#0D2B14'
    ctx.fillText(`ƒ${space.price}`, TEXTURE_W / 2, TEXTURE_H - 40)

    return finalize(canvas, cacheKey)
  }

  // ── Tax: big amount + icon ────────────────────────────────────────────
  if (space.type === 'tax') {
    ctx.fillStyle = SPACE_BG.tax
    ctx.fillRect(8, 8, TEXTURE_W - 16, BANNER_H)
    ctx.fillStyle = '#FDF8EE'
    ctx.font = 'bold 22px "Playfair Display", Georgia, serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('IMPUESTO', TEXTURE_W / 2, BANNER_H / 2 + 8)

    ctx.font = '90px serif'
    ctx.fillStyle = '#0D2B14'
    ctx.fillText('💸', TEXTURE_W / 2, TEXTURE_H / 2 - 10)

    ctx.font = 'bold 36px "Playfair Display", Georgia, serif'
    ctx.fillStyle = '#7B5228'
    ctx.fillText(`Paga ƒ${space.price}`, TEXTURE_W / 2, TEXTURE_H - 50)

    return finalize(canvas, cacheKey)
  }

  // ── Cards (cosecha / riesgo) ──────────────────────────────────────────
  if (space.type === 'cosecha' || space.type === 'riesgo') {
    const isCosecha = space.type === 'cosecha'
    ctx.fillStyle = SPACE_BG[space.type]
    ctx.fillRect(8, 8, TEXTURE_W - 16, TEXTURE_H - 16)

    ctx.fillStyle = '#F5C518'
    ctx.font = 'bold 28px "Playfair Display", Georgia, serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(isCosecha ? 'COSECHA' : 'RIESGO', TEXTURE_W / 2, 50)

    // Big icon
    ctx.font = '140px serif'
    ctx.fillText(SPACE_ICON[space.type] ?? '?', TEXTURE_W / 2, TEXTURE_H / 2 + 20)

    ctx.font = 'normal 18px "Space Mono", monospace'
    ctx.fillStyle = 'rgba(245,232,200,0.7)'
    ctx.fillText('Robar tarjeta', TEXTURE_W / 2, TEXTURE_H - 50)

    return finalize(canvas, cacheKey)
  }

  // ── Special corners: GO, JAIL, FREE, GOTOJAIL ─────────────────────────
  if (space.type === 'go' || space.type === 'jail' || space.type === 'free' || space.type === 'gotojail') {
    ctx.fillStyle = SPACE_BG[space.type] ?? '#444'
    ctx.fillRect(8, 8, TEXTURE_W - 16, TEXTURE_H - 16)

    const fg = space.type === 'go' ? '#0D2B14' : '#FDF8EE'
    ctx.fillStyle = fg

    // Big icon
    ctx.font = '120px serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(SPACE_ICON[space.type] ?? '', TEXTURE_W / 2, 140)

    // Name (may wrap)
    ctx.font = 'bold 24px "Playfair Display", Georgia, serif'
    const lines = wrapText(ctx, space.name, TEXTURE_W - 30, 'bold 24px "Playfair Display", Georgia, serif')
    lines.forEach((line, i) => {
      ctx.fillText(line, TEXTURE_W / 2, 250 + i * 30)
    })

    if (space.type === 'go') {
      ctx.font = 'bold 28px "Playfair Display", Georgia, serif'
      ctx.fillText('+ƒ200', TEXTURE_W / 2, TEXTURE_H - 50)
    }

    return finalize(canvas, cacheKey)
  }

  // Fallback: plain color
  ctx.fillStyle = '#888'
  ctx.fillRect(8, 8, TEXTURE_W - 16, TEXTURE_H - 16)
  return finalize(canvas, cacheKey)
}

function finalize(canvas: HTMLCanvasElement, id: number): CanvasTexture {
  const tex = new CanvasTexture(canvas)
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.colorSpace = SRGBColorSpace
  tex.needsUpdate = true
  cache.set(id, tex)
  return tex
}

// Naive word-wrap that respects the canvas measureText width.
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string): string[] {
  ctx.font = font
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)  // cap at 3 lines for layout safety
}
