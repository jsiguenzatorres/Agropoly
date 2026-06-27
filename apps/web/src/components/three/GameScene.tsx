import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Text3D, Center } from '@react-three/drei'
import { Suspense } from 'react'
import { BOARD_DATA } from '@agropoly/game-engine'

function BoardPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#0D2B14" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

function BoardBorder() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[11, 11]} />
      <meshStandardMaterial color="#1B6B2F" roughness={0.6} metalness={0.2} />
    </mesh>
  )
}

function PropertyTile({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.4, 0.05, 0.6]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

const GROUP_COLORS: Record<number, string> = {
  0: '#8B1A8B',
  1: '#009FDF',
  2: '#D6006E',
  3: '#E8610C',
  4: '#C0392B',
  5: '#D4AC00',
  6: '#00913A',
  7: '#00297A',
}

function BoardTiles() {
  const props = BOARD_DATA.filter(s => s.type === 'prop')
  // Lay out 40 spaces around the perimeter (simplified 10×10 grid)
  return (
    <>
      {props.map((space, i) => {
        const angle = (i / props.length) * Math.PI * 2
        const r = 4
        const x = Math.cos(angle) * r
        const z = Math.sin(angle) * r
        return (
          <PropertyTile
            key={space.id}
            position={[x, 0.025, z]}
            color={GROUP_COLORS[space.group] ?? '#2E8B4A'}
          />
        )
      })}
    </>
  )
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#FDF8EE"
      />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#F5C518" distance={8} />
    </>
  )
}

export default function GameScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 8], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: '#060E08' }}
    >
      <Suspense fallback={null}>
        <SceneLights />
        <BoardBorder />
        <BoardPlane />
        <BoardTiles />
        <Grid
          args={[10, 10]}
          position={[0, 0.001, 0]}
          cellSize={1}
          cellThickness={0.3}
          cellColor="#2E8B4A"
          sectionSize={5}
          sectionThickness={0.6}
          sectionColor="#F5C518"
          fadeDistance={20}
          infiniteGrid={false}
        />
        <Environment preset="forest" />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Suspense>
    </Canvas>
  )
}
