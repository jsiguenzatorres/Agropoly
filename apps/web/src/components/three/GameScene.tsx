import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import type { Mesh } from 'three'
import { BOARD_DATA } from '@agropoly/game-engine'
import { useGameStore } from '../../store/gameStore'
import { getBoardPosition, getBoardSide, getTokenOffset } from '../../lib/board-positions'

// ─── Colors ───────────────────────────────────────────────────────────────────

const GROUP_COLOR: Record<number, string> = {
  0: '#8B1A8B', 1: '#009FDF', 2: '#D6006E', 3: '#E8610C',
  4: '#C0392B', 5: '#D4AC00', 6: '#00913A', 7: '#00297A',
}

const SPACE_COLOR: Record<string, string> = {
  go: '#F5C518', jail: '#E8A020', free: '#2E8B4A', gotojail: '#C0392B',
  tax: '#7B5228', cosecha: '#1B6B2F', riesgo: '#4A1A4A',
  station: '#555555', utility: '#888888',
}

const TOKEN_COLOR: Record<string, string> = {
  maiz: '#F5C518', cafe: '#8B4513', vaca: '#F0F0F0',
  tractor: '#2E8B4A', milpa: '#90EE90', pez: '#009FDF',
}

const TOKEN_EMOJI: Record<string, string> = {
  maiz: '🌽', cafe: '☕', vaca: '🐄', tractor: '🚜', milpa: '🌱', pez: '🐟',
}

// ─── BoardTile ────────────────────────────────────────────────────────────────

function BoardTile({ id }: { id: number }) {
  const space = BOARD_DATA[id]
  if (!space) return null

  const pos = getBoardPosition(id)
  const side = getBoardSide(id)
  const isCorner = side === 'corner'

  const color = space.type === 'prop'
    ? GROUP_COLOR[space.group]
    : SPACE_COLOR[space.type] ?? '#444444'

  const w = isCorner ? 1.0 : 0.82
  const d = isCorner ? 1.0 : 0.88

  // Offset tiles inward from edge so they sit on the board
  const inset = isCorner ? 0 : 0.44
  let x = pos[0], z = pos[2]
  if (side === 'bottom') z -= inset
  if (side === 'top')    z += inset
  if (side === 'left')   x += inset
  if (side === 'right')  x -= inset

  // Horizontal vs vertical tile
  const isVertical = side === 'left' || side === 'right'

  return (
    <mesh position={[x, 0.03, z]} castShadow receiveShadow>
      <boxGeometry args={isVertical ? [d, 0.06, w] : [w, 0.06, d]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.15} />
    </mesh>
  )
}

// ─── OwnerIndicator ────────────────────────────────────────────────────────────

function OwnerIndicator({ id }: { id: number }) {
  const game = useGameStore(s => s.game)
  if (!game) return null
  const space = game.board[id]
  if (!space?.ownerId || space.type !== 'prop') return null
  const owner = game.players.find(p => p.id === space.ownerId)
  if (!owner) return null

  const pos = getBoardPosition(id)
  const color = TOKEN_COLOR[owner.tokenId] ?? '#ffffff'

  return (
    <mesh position={[pos[0], 0.12, pos[2]]}>
      <cylinderGeometry args={[0.08, 0.08, 0.08, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  )
}

// ─── PlayerToken ──────────────────────────────────────────────────────────────

function PlayerToken({ playerId, playerIndex }: { playerId: string; playerIndex: number }) {
  const game = useGameStore(s => s.game)
  const currentIdx = useGameStore(s => s.game?.currentPlayerIndex ?? 0)
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const isActive = playerIndex === currentIdx
    meshRef.current.position.y = isActive
      ? 0.35 + Math.sin(clock.elapsedTime * 3) * 0.06
      : 0.25
  })

  if (!game) return null
  const player = game.players[playerIndex]
  if (!player || player.bankrupt) return null

  const pos = getBoardPosition(player.position)
  const [ox, oz] = getTokenOffset(playerIndex)
  const color = TOKEN_COLOR[player.tokenId] ?? '#ffffff'

  return (
    <group position={[pos[0] + ox, 0, pos[2] + oz]}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.08, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Body */}
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <capsuleGeometry args={[0.10, 0.22, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.4} emissive={color} emissiveIntensity={0.15} />
      </mesh>
    </group>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────

function Board() {
  return (
    <>
      {/* Base verde BFA */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9.8, 9.8]} />
        <meshStandardMaterial color="#0D2B14" roughness={0.9} />
      </mesh>
      {/* Borde exterior */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color="#1B6B2F" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Cuadrícula interior */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial color="#132618" roughness={0.95} />
      </mesh>
    </>
  )
}

// ─── Lights ───────────────────────────────────────────────────────────────────

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FDF8EE"
      />
      <pointLight position={[0, 4, 0]} intensity={1.0} color="#F5C518" distance={10} decay={2} />
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  const game = useGameStore(s => s.game)

  return (
    <>
      <Lights />
      <Board />

      {/* 40 casillas */}
      {BOARD_DATA.map(space => (
        <BoardTile key={space.id} id={space.id} />
      ))}

      {/* Indicadores de propietario */}
      {BOARD_DATA.map(space => (
        <OwnerIndicator key={`own-${space.id}`} id={space.id} />
      ))}

      {/* Tokens de jugadores */}
      {game?.players.map((p, i) => (
        <PlayerToken key={p.id} playerId={p.id} playerIndex={i} />
      ))}

      <Environment preset="forest" />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0, 0]}
      />
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function GameScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 9, 9], fov: 48, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#060E08', width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
