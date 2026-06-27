// Posiciones 3D del tablero — layout cuadrado tipo Monopoly
// 40 casillas: esquinas en 0 (GO), 10 (Jail), 20 (Free), 30 (GoToJail)
// Tablero de 9×9 unidades, paso = 0.9 por casilla

const B = 4.5   // mitad del lado
const STEP = 0.9 // 9 unidades / 10 casillas

export type BoardSide = 'bottom' | 'left' | 'top' | 'right' | 'corner'

export function getBoardSide(id: number): BoardSide {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 'corner'
  if (id < 10)  return 'bottom'
  if (id < 20)  return 'left'
  if (id < 30)  return 'top'
  return 'right'
}

export function getBoardPosition(id: number): [number, number, number] {
  if (id <= 10)  return [B - id * STEP,           0, B]
  if (id <= 20)  return [-B,                       0, B - (id - 10) * STEP]
  if (id <= 30)  return [-B + (id - 20) * STEP,   0, -B]
  return              [B,                          0, -B + (id - 30) * STEP]
}

// Offset para apilar múltiples tokens en la misma casilla
const STACK: [number, number][] = [
  [0, 0], [0.28, 0], [-0.28, 0], [0, 0.28], [0.18, 0.22], [-0.18, 0.22],
]
export function getTokenOffset(playerIndex: number): [number, number] {
  return STACK[playerIndex % STACK.length]
}
