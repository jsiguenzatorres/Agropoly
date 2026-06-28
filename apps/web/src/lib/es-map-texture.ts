// Procedural El Salvador silhouette + agency dots texture.
// Rendered once into a CanvasTexture used on the board center plane.

import { CanvasTexture, LinearFilter, SRGBColorSpace } from 'three'

// Simplified El Salvador outline as normalized path (0..1 x/y, internal -1..1 mapped to canvas)
// Approximated from public-domain ES geo data; not survey-accurate but recognizable.
const ES_PATH: Array<[number, number]> = [
  [0.05, 0.55], [0.08, 0.45], [0.12, 0.35], [0.18, 0.28], [0.24, 0.22],
  [0.32, 0.18], [0.40, 0.16], [0.48, 0.18], [0.55, 0.20], [0.62, 0.22],
  [0.68, 0.25], [0.75, 0.30], [0.82, 0.36], [0.88, 0.44], [0.92, 0.52],
  [0.94, 0.60], [0.92, 0.66], [0.88, 0.70], [0.82, 0.74], [0.75, 0.78],
  [0.66, 0.82], [0.56, 0.85], [0.46, 0.86], [0.36, 0.84], [0.27, 0.80],
  [0.18, 0.74], [0.10, 0.65], [0.05, 0.55],
]

// 8 representative BFA agency locations (approx, normalized) — color-coded by group
const AGENCY_DOTS: Array<{ x: number; y: number; group: number; label: string }> = [
  { x: 0.18, y: 0.40, group: 0, label: 'Ahuachapán' },
  { x: 0.22, y: 0.55, group: 1, label: 'Sonsonate' },
  { x: 0.34, y: 0.50, group: 2, label: 'Santa Tecla' },
  { x: 0.42, y: 0.40, group: 2, label: 'Chalatenango' },
  { x: 0.48, y: 0.55, group: 7, label: 'San Salvador' },
  { x: 0.58, y: 0.50, group: 3, label: 'Cojutepeque' },
  { x: 0.68, y: 0.55, group: 4, label: 'Usulután' },
  { x: 0.82, y: 0.50, group: 5, label: 'San Miguel' },
]

const GROUP_COLOR: Record<number, string> = {
  0: '#8B1A8B', 1: '#009FDF', 2: '#D6006E', 3: '#E8610C',
  4: '#C0392B', 5: '#D4AC00', 6: '#00913A', 7: '#F5C518',
}

let _texture: CanvasTexture | null = null

export function getCenterMapTexture(): CanvasTexture {
  if (_texture) return _texture
  const SIZE = 1024
  const canvas = document.createElement('canvas')
  canvas.width = SIZE; canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  // Transparent dark base (won't fully wash the inner board)
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, SIZE, SIZE)

  // Center the map slightly upward; leave room for "AGROPOLY" text on top later
  const mapBox = { x: 100, y: 220, w: SIZE - 200, h: 600 }

  // Map outline filled with dark green
  ctx.beginPath()
  ES_PATH.forEach(([x, y], i) => {
    const px = mapBox.x + x * mapBox.w
    const py = mapBox.y + y * mapBox.h
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.closePath()
  ctx.fillStyle = 'rgba(46,139,74,0.18)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(245,197,24,0.5)'
  ctx.lineWidth = 4
  ctx.stroke()

  // Agency dots
  AGENCY_DOTS.forEach(d => {
    const px = mapBox.x + d.x * mapBox.w
    const py = mapBox.y + d.y * mapBox.h
    // Halo
    const grd = ctx.createRadialGradient(px, py, 0, px, py, 30)
    grd.addColorStop(0, 'rgba(245,197,24,0.45)')
    grd.addColorStop(1, 'rgba(245,197,24,0)')
    ctx.fillStyle = grd
    ctx.beginPath(); ctx.arc(px, py, 30, 0, Math.PI * 2); ctx.fill()
    // Dot
    ctx.fillStyle = GROUP_COLOR[d.group] ?? '#F5C518'
    ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill()
    // Label
    ctx.fillStyle = 'rgba(253,248,238,0.7)'
    ctx.font = 'normal 18px "Space Mono", monospace'
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.fillText(d.label, px + 14, py)
  })

  // Footer credit line
  ctx.fillStyle = 'rgba(245,197,24,0.4)'
  ctx.font = 'normal 22px "Space Mono", monospace'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('20 AGENCIAS · BANCO DE FOMENTO AGROPECUARIO', SIZE / 2, 900)

  _texture = new CanvasTexture(canvas)
  _texture.minFilter = LinearFilter
  _texture.magFilter = LinearFilter
  _texture.colorSpace = SRGBColorSpace
  _texture.needsUpdate = true
  return _texture
}
