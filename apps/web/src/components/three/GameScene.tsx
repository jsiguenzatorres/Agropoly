import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { Group } from 'three'
import { BOARD_DATA } from '@agropoly/game-engine'
import {
  useActiveGame, useActiveBoardSpace, useActivePlayers,
  useActiveCurrentIdx, useActiveGameId, useActiveSetMoving,
} from '../../store/GameModeContext'
import { getBoardPosition, getBoardSide, getTokenOffset } from '../../lib/board-positions'
import { sfx } from '../../lib/sfx'

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
  maiz: '#F5C518', cafe: '#7B4A2D', vaca: '#EEEEEE',
  tractor: '#2E8B4A', milpa: '#80C070', pez: '#009FDF',
}

// ─── Tile ─────────────────────────────────────────────────────────────────────

function BoardTile({ id }: { id: number }) {
  const space = BOARD_DATA[id]
  if (!space) return null
  const pos  = getBoardPosition(id)
  const side = getBoardSide(id)
  const corner = side === 'corner'
  const color  = space.type === 'prop' ? GROUP_COLOR[space.group] : SPACE_COLOR[space.type] ?? '#444'
  const w = corner ? 1.05 : 0.83
  const d = corner ? 1.05 : 0.90
  const inset = corner ? 0 : 0.44
  let x = pos[0], z = pos[2]
  if (side === 'bottom') z -= inset
  if (side === 'top')    z += inset
  if (side === 'left')   x += inset
  if (side === 'right')  x -= inset
  const vert = side === 'left' || side === 'right'
  return (
    <mesh position={[x, 0.03, z]} receiveShadow>
      <boxGeometry args={vert ? [d, 0.06, w] : [w, 0.06, d]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
    </mesh>
  )
}

function OwnerDot({ id }: { id: number }) {
  const space = useActiveBoardSpace(id)
  const players = useActivePlayers()
  if (!space?.ownerId || space.type !== 'prop') return null
  const owner = players?.find(p => p.id === space.ownerId)
  if (!owner) return null
  const pos = getBoardPosition(id)
  const color = TOKEN_COLOR[owner.tokenId] ?? '#fff'
  return (
    <mesh position={[pos[0], 0.13, pos[2]]}>
      <cylinderGeometry args={[0.07, 0.07, 0.07, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

function Buildings({ id }: { id: number }) {
  const space = useActiveBoardSpace(id)
  if (!space || space.type !== 'prop' || !space.buildings) return null
  const pos  = getBoardPosition(id)
  const side = getBoardSide(id)
  const lvl  = space.buildings
  const isHotel = lvl >= 5

  // Place buildings along the inner edge of the tile (toward board center)
  const inset = 0.30
  let cx = pos[0], cz = pos[2]
  if (side === 'bottom') cz -= inset
  if (side === 'top')    cz += inset
  if (side === 'left')   cx += inset
  if (side === 'right')  cx -= inset

  if (isHotel) {
    return (
      <group position={[cx, 0.08, cz]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.22, 0.20]} />
          <meshStandardMaterial color="#C0392B" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* roof */}
        <mesh position={[0, 0.16, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.20, 0.10, 4]} />
          <meshStandardMaterial color="#8E2618" roughness={0.5} />
        </mesh>
      </group>
    )
  }

  // 1-4 houses laid out along the long axis of the tile
  const vert = side === 'left' || side === 'right'
  const spacing = 0.16
  const start = -((lvl - 1) * spacing) / 2
  const houses = Array.from({ length: lvl }, (_, i) => {
    const off = start + i * spacing
    const hx = vert ? cx : cx + off
    const hz = vert ? cz + off : cz
    return (
      <group key={i} position={[hx, 0.08, hz]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.13, 0.13]} />
          <meshStandardMaterial color="#4CAF70" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* roof */}
        <mesh position={[0, 0.10, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.10, 0.07, 4]} />
          <meshStandardMaterial color="#2E5C3A" roughness={0.6} />
        </mesh>
      </group>
    )
  })
  return <>{houses}</>
}

// ─── Token shapes per tokenId ──────────────────────────────────────────────

function TokenShape({ tokenId, color }: { tokenId: string; color: string }) {
  switch (tokenId) {
    case 'maiz':
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.10, 0.12, 0.28, 10]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.4} emissive={color} emissiveIntensity={0.2} />
          </mesh>
          {/* hoja */}
          <mesh position={[0.09, 0.14, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.06, 0.20, 6]} />
            <meshStandardMaterial color="#4CAF70" roughness={0.4} />
          </mesh>
        </group>
      )
    case 'cafe':
      return (
        <mesh>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.5} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      )
    case 'vaca':
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.22, 0.18, 0.14]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          {/* cabeza */}
          <mesh position={[0, 0.14, 0.07]}>
            <boxGeometry args={[0.14, 0.12, 0.12]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        </group>
      )
    case 'tractor':
      return (
        <group>
          {/* cuerpo */}
          <mesh position={[0, -0.02, 0]}>
            <boxGeometry args={[0.24, 0.12, 0.18]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
          </mesh>
          {/* cabina */}
          <mesh position={[-0.04, 0.08, 0]}>
            <boxGeometry args={[0.14, 0.10, 0.14]} />
            <meshStandardMaterial color="#1B4A25" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* rueda trasera */}
          <mesh position={[0.10, -0.04, 0.10]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.025, 6, 12]} />
            <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
          <mesh position={[0.10, -0.04, -0.10]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.025, 6, 12]} />
            <meshStandardMaterial color="#222" roughness={0.8} />
          </mesh>
        </group>
      )
    case 'milpa':
      return (
        <group>
          <mesh>
            <coneGeometry args={[0.12, 0.32, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} emissive={color} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 6]} />
            <meshStandardMaterial color="#5D8A3C" roughness={0.6} />
          </mesh>
        </group>
      )
    case 'pez':
      return (
        <group rotation={[0, Math.PI / 4, 0]}>
          <mesh scale={[1.5, 0.75, 1.0]}>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color={color} roughness={0.15} metalness={0.5} emissive={color} emissiveIntensity={0.2} />
          </mesh>
          {/* cola */}
          <mesh position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.06, 0.10, 4]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.4} />
          </mesh>
        </group>
      )
    default:
      return (
        <mesh>
          <capsuleGeometry args={[0.09, 0.22, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.25} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      )
  }
}

// ─── Animated Player Token ────────────────────────────────────────────────────

function computeSteps(from: number, to: number): number[] {
  if (from === to) return []
  const fwd = (to - from + 40) % 40
  const bwd = 40 - fwd
  const useBack = bwd < fwd && bwd <= 6  // only go backward for short card moves
  const count = useBack ? bwd : fwd
  const dir   = useBack ? -1 : 1
  const steps: number[] = []
  let p = from
  for (let i = 0; i < count; i++) {
    p = (p + dir + 40) % 40
    steps.push(p)
  }
  return steps
}

const STEP_INTERVAL = 0.13  // seconds per space

function AnimatedPlayerToken({ playerIndex }: { playerIndex: number }) {
  const game      = useActiveGame()
  const gameId    = useActiveGameId()
  const setMoving = useActiveSetMoving()
  const curIdx    = useActiveCurrentIdx()

  const player = game?.players[playerIndex]

  const [visualPos, setVisualPos] = useState(player?.position ?? 0)
  const stepQueue  = useRef<number[]>([])
  const stepTimer  = useRef(0)
  const lastTarget = useRef(player?.position ?? 0)
  const groupRef   = useRef<Group>(null)
  const bobTimer   = useRef(0)

  // Reset visual pos when new game starts
  useEffect(() => { setVisualPos(0); stepQueue.current = []; lastTarget.current = 0 }, [gameId])

  // Queue steps when game position changes
  useEffect(() => {
    if (!player) return
    const to = player.position
    if (to === lastTarget.current) return
    const steps = computeSteps(lastTarget.current, to)
    lastTarget.current = to
    if (steps.length === 0) return
    stepQueue.current = steps
    stepTimer.current = 0
    setMoving(true)
  }, [player?.position])

  useFrame((_, delta) => {
    if (!groupRef.current || !player) return

    // Step animation
    if (stepQueue.current.length > 0) {
      stepTimer.current += delta
      if (stepTimer.current >= STEP_INTERVAL) {
        stepTimer.current -= STEP_INTERVAL
        const next = stepQueue.current.shift()!
        setVisualPos(next)
        sfx.step()
        if (stepQueue.current.length === 0) setMoving(false)
      }
      // Arc Y during movement
      const progress = stepTimer.current / STEP_INTERVAL
      groupRef.current.position.y = 0.06 + Math.sin(progress * Math.PI) * 0.25
    } else {
      // Idle bob for active player
      const isActive = playerIndex === curIdx
      if (isActive) {
        bobTimer.current += delta
        groupRef.current.position.y = 0.04 + Math.sin(bobTimer.current * 2.8) * 0.05
      } else {
        groupRef.current.position.y = 0.04
      }
    }
  })

  if (!player || player.bankrupt) return null
  const basePos  = getBoardPosition(visualPos)
  const [ox, oz] = getTokenOffset(playerIndex)
  const color    = TOKEN_COLOR[player.tokenId] ?? '#ffffff'
  const isActive = playerIndex === curIdx

  return (
    <group ref={groupRef} position={[basePos[0] + ox, 0.04, basePos[2] + oz]}>
      {/* Base disk */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.17, 0.20, 0.06, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Token shape */}
      <mesh castShadow position={[0, 0.14, 0]}>
        <TokenShape tokenId={player.tokenId} color={color} />
      </mesh>
      {/* Active glow ring */}
      {isActive && (
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.20, 0.26, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

// ─── Board & Lights ───────────────────────────────────────────────────────────

function Board() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9.8, 9.8]} />
        <meshStandardMaterial color="#0D2B14" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[11.2, 11.2]} />
        <meshStandardMaterial color="#1B6B2F" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[7.1, 7.1]} />
        <meshStandardMaterial color="#111F13" roughness={0.95} />
      </mesh>
    </>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} castShadow
        shadow-mapSize={[2048, 2048]} color="#FDF8EE" />
      <pointLight position={[0, 4, 0]} intensity={1.0} color="#F5C518" distance={10} decay={2} />
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const isPortrait = size.width < size.height
    const isMobile   = size.width < 640
    if (isPortrait || isMobile) {
      // Tight overhead framing for portrait — board fills most of the screen
      camera.position.set(0, 8, 6)
      if ('fov' in camera) {
        ;(camera as { fov: number }).fov = 78
      }
    } else {
      camera.position.set(0, 9, 9)
      if ('fov' in camera) {
        ;(camera as { fov: number }).fov = 48
      }
    }
    if ('updateProjectionMatrix' in camera) (camera as { updateProjectionMatrix: () => void }).updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

function Scene() {
  const game = useActiveGame()
  return (
    <>
      <ResponsiveCamera />
      <Lights />
      <Board />
      {BOARD_DATA.map(s => <BoardTile  key={s.id}        id={s.id} />)}
      {BOARD_DATA.map(s => <OwnerDot   key={`d${s.id}`}  id={s.id} />)}
      {BOARD_DATA.map(s => <Buildings  key={`b${s.id}`}  id={s.id} />)}
      {game?.players.map((_, i) => (
        <AnimatedPlayerToken key={i} playerIndex={i} />
      ))}
      <Environment preset="forest" />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={18}
        maxPolarAngle={Math.PI / 2.1} target={[0, 0, 0]} />
    </>
  )
}

export default function GameScene() {
  return (
    <Canvas shadows camera={{ position: [0, 9, 9], fov: 48, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#060E08', width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
