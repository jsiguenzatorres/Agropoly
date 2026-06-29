// Physics-based dice roll overlay — drops 2 dice from above into a soft floor,
// they tumble with random angular velocity, settle, and fade out. The displayed
// pips on top are forced to match `value` so the visual matches the engine's
// authoritative random roll.
//
// Mounts on top of the existing GameScene Canvas (separate fullscreen Canvas
// with transparent background). Total runtime ~2.4s; calls `onDone` when done.

import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Text } from '@react-three/drei'
import type { Group } from 'three'

interface Props {
  d1: number
  d2: number
  onDone: () => void
}

const ROLL_DURATION_MS = 2200
const FADE_OUT_MS      = 350

// Pip positions on a unit cube face. We label faces 1..6 and render them as
// text on each side so users see the rolled value when it settles.
function DieMesh({ value, position, seed }: { value: number; position: [number, number, number]; seed: number }) {
  const body = useRef<RapierRigidBody>(null)
  const grp  = useRef<Group>(null)

  useEffect(() => {
    if (!body.current) return
    // Random initial angular velocity for tumbling
    body.current.setAngvel({
      x: (seed * 7 % 13) + 6,
      y: (seed * 11 % 17) + 4,
      z: (seed * 5 % 9) + 3,
    }, true)
    body.current.setLinvel({
      x: (seed % 3) - 1,
      y: 0,
      z: (seed % 5) - 2,
    }, true)
  }, [seed])

  // Force the die to settle showing the engine-authoritative value:
  // after ROLL_DURATION_MS we set angular damping high and snap rotation
  // to the orientation that shows `value` on top.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!body.current) return
      body.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      // Rotation per face value (face=1..6 → euler that puts that face up)
      const rot = FACE_ROTATIONS[value - 1]
      body.current.setRotation({ x: rot[0], y: rot[1], z: rot[2], w: rot[3] }, true)
    }, ROLL_DURATION_MS - 400)
    return () => clearTimeout(t)
  }, [value])

  return (
    <RigidBody ref={body} position={position} restitution={0.4} friction={0.6} mass={1} colliders="cuboid">
      <group ref={grp}>
        {/* Cube body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FDF8EE" roughness={0.6} metalness={0.05} />
        </mesh>
        {/* Numbers on each face (1..6) */}
        <Text position={[0, 0.51, 0]}  rotation={[-Math.PI / 2, 0, 0]} fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">1</Text>
        <Text position={[0, -0.51, 0]} rotation={[ Math.PI / 2, 0, 0]} fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">6</Text>
        <Text position={[0, 0, 0.51]}  rotation={[0, 0, 0]}            fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">2</Text>
        <Text position={[0, 0, -0.51]} rotation={[0, Math.PI, 0]}      fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">5</Text>
        <Text position={[ 0.51, 0, 0]} rotation={[0, Math.PI / 2, 0]}  fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">3</Text>
        <Text position={[-0.51, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.55} color="#5C3A1E" anchorX="center" anchorY="middle">4</Text>
      </group>
    </RigidBody>
  )
}

// Quaternion rotations that put face N (1..6) on top of the die (+Y direction)
const FACE_ROTATIONS: Array<[number, number, number, number]> = [
  [0,          0, 0,          1],          // face 1 (already on top by construction)
  [-Math.SQRT1_2, 0, 0, Math.SQRT1_2],     // face 2
  [0, 0,  Math.SQRT1_2, Math.SQRT1_2],     // face 3
  [0, 0, -Math.SQRT1_2, Math.SQRT1_2],     // face 4
  [Math.SQRT1_2, 0, 0, Math.SQRT1_2],      // face 5
  [1, 0, 0, 0],                            // face 6
]

export function DiceRoll3D({ d1, d2, onDone }: Props) {
  const [exiting, setExiting] = useState(false)
  // Stable seeds for both dice (don't reroll on parent re-renders)
  const seeds = useMemo(() => [Math.floor(d1 * 31 + d2 * 17 + 7), Math.floor(d1 * 13 + d2 * 23 + 11)], [d1, d2])

  useEffect(() => {
    const fadeT = setTimeout(() => setExiting(true), ROLL_DURATION_MS)
    const doneT = setTimeout(onDone, ROLL_DURATION_MS + FADE_OUT_MS)
    return () => { clearTimeout(fadeT); clearTimeout(doneT) }
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        pointerEvents: 'none',
        opacity: exiting ? 0 : 1,
        transition: `opacity ${FADE_OUT_MS}ms ease-out`,
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 6, 7], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 10, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />

        <Physics gravity={[0, -22, 0]}>
          {/* Invisible floor for the dice to land on */}
          <RigidBody type="fixed" position={[0, -0.5, 0]} restitution={0.45} friction={0.7}>
            <CuboidCollider args={[5, 0.5, 5]} />
          </RigidBody>
          {/* Invisible walls so dice don't fly off */}
          <RigidBody type="fixed" position={[ 3.5, 1, 0]}><CuboidCollider args={[0.1, 2, 5]} /></RigidBody>
          <RigidBody type="fixed" position={[-3.5, 1, 0]}><CuboidCollider args={[0.1, 2, 5]} /></RigidBody>
          <RigidBody type="fixed" position={[0, 1,  3.5]}><CuboidCollider args={[5, 2, 0.1]} /></RigidBody>
          <RigidBody type="fixed" position={[0, 1, -3.5]}><CuboidCollider args={[5, 2, 0.1]} /></RigidBody>

          <DieMesh value={d1} position={[-1.2, 5.5, 0]} seed={seeds[0]} />
          <DieMesh value={d2} position={[ 1.2, 6.0, 0]} seed={seeds[1]} />
        </Physics>
      </Canvas>
    </div>
  )
}
