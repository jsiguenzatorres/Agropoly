// Renders coins that fly along an arc from one player's scoreboard chip to another's
// (or to a fixed "bank" point top-center). Reads positions from data-player-id attributes on
// the scoreboard chips in GameHUD.

import { useEffect, useState } from 'react'
import { useMoneyFlowStore } from '../../store/moneyFlowStore'

const KEYFRAMES = `
@keyframes coin-spin {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
`

interface FlightView {
  id: number
  fromX: number; fromY: number
  toX:   number; toY:   number
  amount: number
}

function getRect(playerId: string): DOMRect | null {
  const el = document.querySelector(`[data-player-id="${playerId}"]`) as HTMLElement | null
  return el?.getBoundingClientRect() ?? null
}

function bankRect(): { x: number; y: number } {
  // Top-center of viewport — represents the bank/center cashier
  return { x: window.innerWidth / 2, y: 60 }
}

export function MoneyFlowLayer() {
  const flights = useMoneyFlowStore(s => s.flights)
  const done    = useMoneyFlowStore(s => s.done)
  const [views, setViews] = useState<FlightView[]>([])

  useEffect(() => {
    // Convert each new flight to a positioned view with measured rects
    flights.forEach(f => {
      if (views.find(v => v.id === f.id)) return
      const fromR = getRect(f.fromId)
      const toR   = f.toId === 'bank' ? null : getRect(f.toId)
      const from  = fromR
        ? { x: fromR.left + fromR.width / 2, y: fromR.top + fromR.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const to    = toR
        ? { x: toR.left + toR.width / 2, y: toR.top + toR.height / 2 }
        : bankRect()
      setViews(v => [...v, { id: f.id, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, amount: f.amount }])
      // Cleanup after animation duration
      const t = setTimeout(() => {
        setViews(v => v.filter(x => x.id !== f.id))
        done(f.id)
      }, 1400)
      return () => clearTimeout(t)
    })
  }, [flights]) // eslint-disable-line react-hooks/exhaustive-deps

  if (views.length === 0) return null

  return (
    <>
      <style>{KEYFRAMES}</style>
      <svg
        style={{
          position: 'fixed', inset: 0, zIndex: 77, pointerEvents: 'none',
          width: '100vw', height: '100vh',
        }}
      >
        {views.map(v => (
          <FlightAnim key={v.id} v={v} />
        ))}
      </svg>
    </>
  )
}

function FlightAnim({ v }: { v: FlightView }) {
  // Build a quadratic Bezier control point above the midpoint for arc trajectory
  const midX = (v.fromX + v.toX) / 2
  const midY = (v.fromY + v.toY) / 2 - 140
  const path = `M${v.fromX},${v.fromY} Q${midX},${midY} ${v.toX},${v.toY}`

  // Spawn 3 coins along the path with slight delay between them
  return (
    <>
      <path d={path} fill="none" stroke="rgba(245,197,24,0.18)" strokeWidth={2}
        strokeDasharray="4 6" />
      {[0, 0.12, 0.24].map((delay, i) => (
        <g key={i}>
          <text
            fontSize="26"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ filter: 'drop-shadow(0 2px 6px rgba(245,197,24,0.55))' }}
          >
            🪙
            <animateMotion
              path={path}
              dur="1.1s"
              begin={`${delay}s`}
              fill="freeze"
              rotate="auto"
            />
          </text>
        </g>
      ))}
      {/* Amount label arrives at destination near the end */}
      <text
        x={v.toX}
        y={v.toY - 18}
        fontSize="16"
        fontWeight="700"
        textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fill="#F5C518"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}
      >
        +ƒ{v.amount}
        <animate attributeName="opacity" from="0" to="1" begin="0.9s" dur="0.2s" fill="freeze" />
        <animate attributeName="y" from={v.toY - 8} to={v.toY - 32} begin="0.9s" dur="0.5s" fill="freeze" />
      </text>
    </>
  )
}
