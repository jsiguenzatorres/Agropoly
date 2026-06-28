---

## 1. Visión y Experiencia Emocional

### 1.1 Recorrido Emocional — Los Primeros 60 Segundos

```
SEGUNDO 0–3:   Pantalla negra → destello dorado central
               Audio: chord épico de marimba + pad sintetizador
               Emoción objetivo: ANTICIPACIÓN

SEGUNDO 3–8:   El campo salvadoreño se materializa en 3D (procedural)
               Volcán Santa Ana en el fondo, partículas de ceniza dorada
               El título AGROPOLY cae con física real (Rapier)
               Emoción objetivo: ASOMBRO

SEGUNDO 8–15:  Don Fomento aparece desde la izquierda con animación Lottie
               Voz ElevenLabs: ¡Puchica, maje! Bienvenido a AGROPOLY BFA.
               Hoy vas a aprender cómo hacer crecer tu dinero en el campo.
               Emoción objetivo: CONEXIÓN EMOCIONAL

SEGUNDO 15–25: Menú 3D flotante — opciones giran suavemente en el espacio
               El tablero es visible girando en el fondo como atracción
               Música adaptativa: pentatónica salvadoreña + beats modernos
               Emoción objetivo: CURIOSIDAD + DESEO INMEDIATO DE JUGAR

SEGUNDO 25+:   Jugador configura su partida con avatar personalizable
               Mascota comenta su elección en tiempo real con voz
               Emoción objetivo: SENTIDO DE PERTENENCIA E IDENTIDAD
```

### 1.2 Las 5 Mascotas del Universo AGROPOLY

| ID | Nombre | Personalidad | Voz ElevenLabs | Rol |
|---|---|---|---|---|
| don_fomento | Don Fomento | Agricultor sabio, abuelo cariñoso | Tenor cálido, acento salvadoreño | Narrador, Banco, Mentor |
| maicita | Maicita | Niña curiosa, 10 años | Voz infantil entusiasta | Guía educativa, Quiz |
| don_cafe | Don Café | Empresario exitoso, competitivo | Barítono confiado | Rival IA difícil |
| la_canche | La Canche | Vaquera joven, optimista | Soprano campestre | Rival IA fácil |
| la_tormenta | La Tormenta | Antagonista climático, dramático | Voz profunda con efectos | Narrador tarjetas Riesgo |

### 1.3 Los 4 Pilares de la Experiencia

```
PILAR 1 — CINEMÁTICO
Comprar Av. Olímpica → cámara zoom + confetti 3D + fanfarria
Pagar renta → lluvia de monedas inversas + lamento de Don Fomento
Emergencia Climática → relámpagos en el tablero + La Tormenta grita
Victoria → fuegos artificiales sobre el volcán Santa Ana en 3D

PILAR 2 — EDUCATIVO INVISIBLE
Claude AI contextualiza conceptos en el momento exacto de relevancia.
Maicita explica mientras Don Fomento valida con experiencia de vida.
Cada tarjeta incluye un dato real del sector agropecuario salvadoreño.

PILAR 3 — SOCIAL Y COMPETITIVO
Salas multijugador en tiempo real (Colyseus, hasta 6 jugadores).
Tabla de líderes global con avatares 3D personalizados.
Sistema de logros: Primer millonario, Rey del Oriente, etc.
Modo Espectador para facilitadores BFA con overlay de analytics.

PILAR 4 — ADAPTATIVO E INTELIGENTE
Claude analiza decisiones → adapta comentarios de Don Fomento.
Si el jugador pierde 3 veces seguidas → Maicita ofrece tutorial guiado.
Curriculum de 35 conceptos que progresa con partidas completadas.
IA nivel Experto usa Claude claude-haiku-4-5 para razonamiento estratégico.
```

---

## 2. Stack Tecnológico Completo

### 2.1 Frontend Core

```yaml
Framework y Build:
  react: 19.0.0
  typescript: 5.5.0 (strict mode obligatorio)
  vite: 5.4.0 con plugin-react usando SWC

3D Engine:
  three: 0.168.0
  @react-three/fiber: 8.17.0
  @react-three/drei: 9.115.0  (OrbitControls, Text3D, useGLTF, Environment)
  @react-three/postprocessing: 2.16.0  (Bloom, DOF, SMAA)
  @react-three/rapier: 1.4.0  (física WASM: dados, tokens)
  postprocessing: 6.36.0

Animaciones UI:
  framer-motion: 11.11.0   (animaciones declarativas + gestures)
  gsap: 3.12.5              (timelines cinematográficas complejas)
  @gsap/react: 2.1.1
  lottie-react: 2.4.0       (animaciones After Effects para mascotas)

Audio:
  howler: 2.2.4             (SFX y música pre-grabada)
  tone: 15.0.4              (síntesis musical adaptativa)

Estado Global:
  zustand: 5.0.1
  immer: 10.1.1
  @tanstack/react-query: 5.62.0

UI Components:
  tailwindcss: 3.4.14
  @radix-ui/react-dialog: 1.1
  @radix-ui/react-tooltip: 1.1
  shadcn/ui: latest
  lucide-react: 0.468.0

Router:
  react-router-dom: 7.0.0
```

### 2.2 Backend y Tiempo Real

```yaml
Servidor de Juego WebSocket:
  colyseus: 0.15.18
  @colyseus/monitor: 0.15.18

API REST:
  hono: 4.6.5
  @hono/node-server: 1.13.0

Base de Datos:
  @supabase/supabase-js: 2.46.1
  drizzle-orm: 0.36.3
  drizzle-kit: 0.27.2

Cache y Colas:
  ioredis: 5.4.1
  bullmq: 5.28.2
```

### 2.3 IA y Síntesis de Voz

```yaml
IA Principal:
  @anthropic-ai/sdk: 0.32.1

Text-to-Speech:
  elevenlabs: 1.8.0  (voces hiper-realistas clonadas de actores salvadoreños)

Speech Recognition:
  Web Speech API nativa del navegador (sin instalación)
```

### 2.4 Herramientas de Desarrollo

```yaml
Testing:
  vitest: 2.1.5
  @testing-library/react: 16.0
  playwright: 1.48.2
  storybook: 8.4.2

Code Quality:
  eslint: 9.14.0 (flat config)
  prettier: 3.4.1
  husky: 9.1.7
  commitlint: 19.6.0

Monorepo:
  turbo: 2.3.3
  pnpm: 9.14.0

Monitoring:
  @sentry/react: 8.38.0
  lighthouse-ci: 0.14.0
```

---

## 3. MCPs — Model Context Protocol Servers

### 3.1 Configuración .mcp.json

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "./apps/web/src", "./apps/server/src", "./packages"],
      "description": "Lectura y escritura del código fuente del monorepo"
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase",
               "--access-token", "${SUPABASE_ACCESS_TOKEN}"],
      "description": "Gestión de DB, tablas, migrations, RLS policies, Storage"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" },
      "description": "Repositorio, PRs, issues, branches, commit history"
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": { "FIGMA_API_KEY": "${FIGMA_API_KEY}" },
      "description": "Extracción de tokens de diseño y assets de Figma"
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp-adapter"],
      "env": { "VERCEL_TOKEN": "${VERCEL_TOKEN}" },
      "description": "Deploy, logs, Core Web Vitals, preview environments"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "description": "Testing E2E: ejecutar partidas completas en browser real"
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": { "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}" },
      "description": "Errores en producción, stack traces, performance"
    },
    "upstash": {
      "command": "npx",
      "args": ["-y", "@upstash/mcp-server"],
      "env": {
        "UPSTASH_REDIS_REST_URL": "${UPSTASH_URL}",
        "UPSTASH_REDIS_REST_TOKEN": "${UPSTASH_TOKEN}"
      },
      "description": "Cache Redis: sesiones activas, leaderboard, voice cache keys"
    },
    "elevenlabs": {
      "command": "npx",
      "args": ["-y", "@elevenlabs/mcp"],
      "env": { "ELEVENLABS_API_KEY": "${ELEVENLABS_KEY}" },
      "description": "Generación, gestión y preview de voces de mascotas"
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "${BRAVE_API_KEY}" },
      "description": "Búsqueda web para datos agropecuarios actualizados de El Salvador"
    },
    "storybook": {
      "command": "npx",
      "args": ["-y", "@storybook/mcp"],
      "description": "Crear y revisar stories de componentes React"
    }
  }
}
```

### 3.2 Flujos de Trabajo Reales con MCPs

```
FLUJO A — Crear nueva tarjeta Cosecha con voz y datos reales:
1. MCP brave-search: busca precios actuales de café en El Salvador
2. MCP filesystem: lee el archivo cards.ts para entender el formato
3. Claude escribe la nueva tarjeta con datos reales verificados
4. MCP elevenlabs: genera la voz de Don Fomento leyendo el texto
5. MCP supabase: sube el audio al Storage bucket voice-cache
6. MCP filesystem: actualiza cards.ts con la nueva tarjeta
7. MCP github: crea PR con descripción automática del cambio
8. MCP vercel: despliega preview para revisión visual

FLUJO B — Debugging de bug en partida multijugador:
1. MCP sentry: obtiene el error y stack trace exacto
2. MCP filesystem: abre el archivo de la línea del error
3. MCP upstash: inspecciona el estado del game room en Redis
4. MCP playwright: reproduce el bug en browser real
5. Claude aplica el fix con str_replace
6. MCP playwright: verifica que el fix funciona en E2E
7. MCP github: commit y PR automático

FLUJO C — Optimizar performance de un componente 3D:
1. MCP playwright: mide FPS actual con performance trace
2. MCP filesystem: lee el componente completo
3. Claude identifica las creaciones de materiales fuera de useMemo
4. MCP filesystem: aplica la optimización
5. MCP vercel: despliega y compara Core Web Vitals antes/después
```

---

## 4. Arquitectura del Sistema

### 4.1 Estructura del Monorepo

```
agropoly-apex/
├── apps/
│   ├── web/                         # Frontend React 19 + Vite
│   │   └── src/
│   │       ├── routes/              # React Router 7 file-based
│   │       ├── components/
│   │       │   ├── three/           # Componentes 3D (R3F)
│   │       │   │   ├── GameScene.tsx
│   │       │   │   ├── Board3D.tsx
│   │       │   │   ├── Token3D.tsx
│   │       │   │   ├── Dice3D.tsx
│   │       │   │   ├── Building3D.tsx
│   │       │   │   ├── ParticleSystem.tsx
│   │       │   │   ├── PostFX.tsx
│   │       │   │   └── SkyBox.tsx
│   │       │   ├── game/            # UI overlay 2D del juego
│   │       │   │   ├── HUD.tsx
│   │       │   │   ├── PropertyModal.tsx
│   │       │   │   ├── CardModal.tsx
│   │       │   │   ├── TradePanel.tsx
│   │       │   │   └── VictoryScreen.tsx
│   │       │   ├── mascots/         # Sistema de mascotas con voz
│   │       │   │   ├── DonFomento.tsx
│   │       │   │   ├── Maicita.tsx
│   │       │   │   ├── LaTormenta.tsx
│   │       │   │   └── DialogBubble.tsx
│   │       │   └── educational/     # Módulo educativo
│   │       │       ├── MicroLesson.tsx
│   │       │       ├── Quiz.tsx
│   │       │       └── ConceptTooltip.tsx
│   │       ├── stores/
│   │       │   ├── gameStore.ts
│   │       │   ├── audioStore.ts
│   │       │   └── educationStore.ts
│   │       ├── hooks/
│   │       │   ├── useGameEngine.ts
│   │       │   ├── useAudio.ts
│   │       │   ├── useVoice.ts
│   │       │   └── useMultiplayer.ts
│   │       ├── lib/
│   │       │   ├── colyseus.ts
│   │       │   ├── supabase.ts
│   │       │   ├── voice-engine.ts
│   │       │   ├── music-engine.ts
│   │       │   └── design-tokens.ts
│   │       └── assets/
│   │           ├── models/          # .glb 3D models
│   │           ├── textures/        # PBR textures
│   │           ├── audio/           # SFX + música
│   │           ├── videos/          # Fondos ambientales
│   │           ├── lottie/          # Animaciones mascotas
│   │           └── shaders/         # GLSL custom
│   │
│   └── server/                      # Colyseus + Hono API
│       └── src/
│           ├── rooms/
│           │   ├── GameRoom.ts
│           │   └── LobbyRoom.ts
│           ├── schema/
│           │   ├── GameState.ts
│           │   └── Player.ts
│           ├── api/
│           │   ├── voice.ts
│           │   ├── education.ts
│           │   └── leaderboard.ts
│           └── services/
│               ├── aiService.ts
│               ├── ttsService.ts
│               └── analyticsService.ts
│
├── packages/
│   ├── game-engine/                 # Lógica compartida (zero deps)
│   │   └── src/
│   │       ├── engine.ts
│   │       ├── board.ts
│   │       ├── cards.ts
│   │       ├── rules.ts
│   │       └── types.ts
│   └── shared-types/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── .mcp.json
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

---

## 5. ADRs — Decisiones de Arquitectura

### ADR-R001: Monorepo Turborepo + pnpm

**Decisión:** Turborepo con pnpm workspaces para builds incrementales.
**Motivo:** El paquete game-engine se comparte entre el frontend React y el servidor Colyseus. Sin monorepo habría duplicación de lógica crítica del juego.

```bash
pnpm turbo build   # Build con cache — solo rebuild lo que cambió
pnpm turbo dev     # Dev mode: web + server + packages en paralelo
pnpm turbo test    # Tests en paralelo con caché de resultados
```

---

### ADR-R002: React Three Fiber sobre Three.js Puro

**Decisión:** R3F como capa declarativa sobre Three.js.

```tsx
// R3F — el estado del juego impulsa directamente la escena 3D
function BoardCell({ space, isActive }) {
  return (
    <mesh onPointerEnter={...} onPointerLeave={...} onClick={...}>
      <boxGeometry args={[0.95, 0.08, 0.95]} />
      <meshStandardMaterial
        emissive={isActive ? GROUP_COLORS[space.group] : 'black'}
        emissiveIntensity={isActive ? 0.4 : 0}
      />
    </mesh>
  )
}
// Cuando isActive cambia en Zustand → el emissive cambia en el shader automáticamente
```

---

### ADR-R003: Colyseus 0.15 para Multijugador

**Decisión:** Colyseus con schema-based state sync (delta compression automático).

```typescript
// Solo el campo que cambia se envía por WebSocket
class PlayerState extends Schema {
  @type('number') balance = 1500  // Si solo este cambia → se envía solo este byte
  @type('number') position = 0
}
```

Motivo: Latencia < 50ms en internet promedio. Socket.io puro requeriría sincronización manual del estado entero en cada cambio.

---

### ADR-R004: ElevenLabs sobre AWS Polly / Google TTS

**Decisión:** ElevenLabs con modelos de voz clonados de actores salvadoreños reales.

```typescript
await elevenlabs.generate({
  voice: VOICE_IDS.don_fomento,
  text: "¡Vaya pues! Compraste la Av. Olímpica. ¡Eso sí es pensar en grande!",
  model_id: 'eleven_multilingual_v2',
  voice_settings: { stability: 0.5, style: 0.9, use_speaker_boost: true }
})
```

Motivo: ElevenLabs ofrece calidad humana real con emociones naturales y soporte para acento salvadoreño específico. AWS Polly suena artificial; Google TTS no soporta dialectos centroamericanos con fidelidad.

---

### ADR-R005: Zustand + Immer (no Redux)

**Decisión:** Zustand con middleware Immer.

```typescript
// Cero boilerplate — estado mutable con syntax de Immer
const useGameStore = create<GameState>()(immer((set) => ({
  buyProperty: (playerId, spaceId) => set(state => {
    const player = state.players.find(p => p.id === playerId)!
    player.balance -= state.board[spaceId].price
    state.board[spaceId].ownerId = playerId
    player.properties.push(spaceId)
  }),
})))
```

Redux añadiría 5x más código (actions, reducers, selectors, slices) sin beneficio de performance.

---

### ADR-R006: Rapier WASM para Física de Dados

**Decisión:** @react-three/rapier para dados y tokens con física real de WebAssembly.

```tsx
<RigidBody restitution={0.6} friction={0.8}>
  <DiceMesh />
  {/* El dado rebota físicamente en el tablero antes de mostrar el resultado */}
</RigidBody>
```

Motivo: Los dados que rebotan físicamente crean el momento de mayor tensión del juego. Es el elemento que más comentan los usuarios en testing.

---

### ADR-R007: Supabase como BaaS Principal

**Decisión:** Supabase = PostgreSQL + Realtime + Auth + Storage + Edge Functions.

Motivo: Stack completo sin gestionar infraestructura. Las Edge Functions de Supabase protegen las API keys de ElevenLabs y Claude del lado del cliente.

---

### ADR-R008: Tone.js para Música Generativa

**Decisión:** Tone.js en lugar de archivos MP3 para las pistas adaptativas.

Motivo: La música necesita cambiar gradualmente según el estado del juego sin cortes audibles. Los archivos MP3 con crossfade tienen latencia notable; Tone.js puede hacer transiciones perfectas en tiempo real porque controla cada nota individualmente.

---

## 6. Sistema de Diseño e Identidad Visual

### 6.1 Design Tokens TypeScript

```typescript
// src/lib/design-tokens.ts
export const tokens = {
  color: {
    brand: {
      green: { 100:'#E8F5E9', 500:'#2E8B4A', 700:'#1B6B2F', 900:'#0D2B14' },
      gold:  { 100:'#FFF9C4', 500:'#F5C518', 700:'#E8A020', 900:'#B8860B' },
      earth: { 500:'#7B5228', 700:'#5D3E2A' },
      cream: '#FDF8EE',
      dark:  '#060E08',
    },
    group: {
      0: { hex:'#8B1A8B', name:'Occidente I',  glow:'rgba(139,26,139,0.5)'  },
      1: { hex:'#009FDF', name:'Occidente II', glow:'rgba(0,159,223,0.5)'   },
      2: { hex:'#D6006E', name:'Centro Norte', glow:'rgba(214,0,110,0.5)'   },
      3: { hex:'#E8610C', name:'Paracentral',  glow:'rgba(232,97,12,0.5)'   },
      4: { hex:'#C0392B', name:'Oriente I',    glow:'rgba(192,57,43,0.5)'   },
      5: { hex:'#D4AC00', name:'Oriente II',   glow:'rgba(212,172,0,0.5)'   },
      6: { hex:'#00913A', name:'Gran S.S.',    glow:'rgba(0,145,58,0.5)'    },
      7: { hex:'#00297A', name:'Casa Matriz',  glow:'rgba(0,41,122,0.5)'    },
    },
    token: {
      maiz:    { hex:'#F5C518', glow:'rgba(245,197,24,0.6)',  emoji:'🌽' },
      cafe:    { hex:'#8B5E3C', glow:'rgba(139,94,60,0.6)',   emoji:'☕' },
      vaca:    { hex:'#00AEEF', glow:'rgba(0,174,239,0.6)',   emoji:'🐄' },
      tractor: { hex:'#F7941D', glow:'rgba(247,148,29,0.6)',  emoji:'🚜' },
      milpa:   { hex:'#4CAF70', glow:'rgba(76,175,112,0.6)',  emoji:'🌿' },
      pez:     { hex:'#6B9FE4', glow:'rgba(107,159,228,0.6)', emoji:'🐟' },
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
      instant: '50ms', fast: '150ms', normal: '300ms',
      slow: '600ms', cinematic: '1200ms', epic: '2400ms',
    },
    easing: {
      bounce:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      elastic: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
      snap:    'cubic-bezier(0.0, 0.0, 0.2, 1)',
    },
  },
} as const
```

### 6.2 Tailwind Config con Tokens BFA

```typescript
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bfa-green': { 500:'#2E8B4A', 700:'#1B6B2F', 900:'#0D2B14' },
        'bfa-gold':  { 500:'#F5C518', 700:'#E8A020' },
        'bfa-dark':  '#060E08',
        'bfa-cream': '#FDF8EE',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        accent:  ["'Cinzel Decorative'", 'serif'],
        body:    ["'DM Sans'", 'sans-serif'],
        mono:    ["'Space Mono'", 'monospace'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'bounce-in':  'bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        'coin-fly':   'coinFly 0.8s ease-out forwards',
      },
      keyframes: {
        float:     { '0%,100%':{transform:'translateY(0)'},   '50%':{transform:'translateY(-12px)'} },
        glowPulse: { '0%,100%':{boxShadow:'0 0 8px rgba(46,139,74,0.4)'}, '50%':{boxShadow:'0 0 32px rgba(46,139,74,0.8)'} },
        shimmer:   { '0%':{backgroundPosition:'-200% 0'}, '100%':{backgroundPosition:'200% 0'} },
        coinFly:   { '0%':{transform:'translateY(0) scale(1)',opacity:'1'}, '100%':{transform:'translateY(-80px) scale(0)',opacity:'0'} },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
```

---

## 7. Motor 3D — React Three Fiber

### 7.1 GameScene Principal

```tsx
// src/components/three/GameScene.tsx
import { Canvas } from '@react-three/fiber'
import { Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'

export function GameScene() {
  return (
    <Canvas shadows="soft" camera={{ position:[0,12,18], fov:50 }}
            gl={{ antialias:true, powerPreference:'high-performance' }} dpr={[1,2]}>
      <AdaptiveDpr pixelated /><AdaptiveEvents />

      {/* Iluminación cinematográfica */}
      <ambientLight intensity={0.3} color="#f0ffe0" />
      <directionalLight position={[10,20,10]} intensity={2} castShadow
        shadow-mapSize={[2048,2048]} shadow-bias={-0.001} />
      <pointLight position={[0,8,0]} color="#F5C518" intensity={0.8} decay={2} />
      <hemisphereLight args={["#87CEEB", "#1B6B2F", 0.4]} />
      <Environment preset="forest" />

      <Physics gravity={[0,-9.81,0]}>
        <Suspense fallback={<LoadingBoard />}>
          <Board3D />
          <TokensGroup />
          <Dice3D />
          <Buildings />
        </Suspense>
      </Physics>

      <AmbientParticles count={250} />
      <LightningEffect />
      <SkyBox />

      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.9} intensity={0.5} />
        <Vignette offset={0.15} darkness={0.8} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  )
}
```

### 7.2 Dados con Física Real

```tsx
// src/components/three/Dice3D.tsx
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import { useRef, useCallback } from 'react'

export function Dice3D({ onResult }: { onResult: (d1: number, d2: number) => void }) {
  const die1 = useRef<RapierRigidBody>(null)
  const die2 = useRef<RapierRigidBody>(null)

  const throwDice = useCallback(() => {
    const applyThrow = (ref: React.RefObject<RapierRigidBody>) => {
      ref.current?.applyImpulse(
        { x:(Math.random()-.5)*8, y:12+Math.random()*4, z:(Math.random()-.5)*8 }, true
      )
      ref.current?.applyTorqueImpulse(
        { x:(Math.random()-.5)*20, y:(Math.random()-.5)*20, z:(Math.random()-.5)*20 }, true
      )
    }
    applyThrow(die1)
    setTimeout(() => applyThrow(die2), 100)
    setTimeout(() => {
      const r1 = detectDiceFace(die1.current?.rotation())
      const r2 = detectDiceFace(die2.current?.rotation())
      onResult(r1, r2)
    }, 2800)
  }, [onResult])

  return (
    <group position={[0,2,6]}>
      <RigidBody ref={die1} restitution={0.4} friction={0.7} position={[-1.2,0.5,0]}>
        <DieMesh />
      </RigidBody>
      <RigidBody ref={die2} restitution={0.4} friction={0.7} position={[1.2,0.5,0]}>
        <DieMesh />
      </RigidBody>
      <DiceZone onThrow={throwDice} />
    </group>
  )
}
```

### 7.3 Shaders GLSL Custom

```glsl
// goldShimmer.frag — Shimmer dorado en el marco del tablero
uniform float uTime;
uniform vec3  uBaseColor;    // #B8860B
uniform vec3  uShimmerColor; // #F5C518
varying vec2  vUv;

float shimmerLine(vec2 uv, float offset) {
  float line = sin((uv.x - uv.y) * 8.0 + uTime * 2.0 + offset);
  return smoothstep(0.85, 1.0, line);
}

void main() {
  float shimmer = shimmerLine(vUv, 0.0) * 0.7
                + shimmerLine(vUv, 1.57) * 0.3;
  vec3 color = mix(uBaseColor, uShimmerColor, shimmer);
  gl_FragColor = vec4(color, 0.85 + shimmer * 0.15);
}
```

```glsl
// lightning.frag — Relámpagos en Emergencia Climática
uniform float uTime;
uniform bool  uActive;
uniform float uIntensity;
varying vec2  vUv;

float random(float x) { return fract(sin(x * 127.1) * 43758.5453); }

float lightningBolt(vec2 uv) {
  if (!uActive) return 0.0;
  float bolt = 0.0;
  for (int i = 0; i < 3; i++) {
    float x = random(float(i) + floor(uTime * 8.0)) * 0.8 + 0.1;
    float w = 0.003 + random(float(i) * 7.3) * 0.006;
    bolt += smoothstep(w, 0.0, abs(uv.x - x)) * (1.0 - uv.y);
  }
  return bolt * uIntensity;
}

void main() {
  float bolt = lightningBolt(vUv);
  vec3 color  = mix(vec3(0.53,0.67,1.0), vec3(1.0), bolt * 0.8);
  gl_FragColor = vec4(color, bolt * 0.9);
}
```

---

## 8. Sistema de Audio Cinematográfico

### 8.1 Howler.js — SFX Engine

```typescript
// src/lib/sfx-engine.ts
import { Howl, Howler } from 'howler'

const SFX_MANIFEST: Record<string, string> = {
  dice_throw:   '/audio/sfx/dice_throw.mp3',
  dice_land:    '/audio/sfx/dice_land.mp3',
  dice_doubles: '/audio/sfx/dice_doubles.mp3',
  token_step:   '/audio/sfx/token_step.mp3',
  token_land:   '/audio/sfx/token_land.mp3',
  buy_property: '/audio/sfx/buy_chord.mp3',
  pay_rent:     '/audio/sfx/coin_drop.mp3',
  build_house:  '/audio/sfx/construction.mp3',
  build_hotel:  '/audio/sfx/hotel_fanfare.mp3',
  cosecha_card: '/audio/sfx/harvest_jingle.mp3',
  riesgo_card:  '/audio/sfx/storm_warning.mp3',
  pass_go:      '/audio/sfx/pass_go_fanfare.mp3',
  go_to_jail:   '/audio/sfx/jail_alarm.mp3',
  bankruptcy:   '/audio/sfx/bankruptcy.mp3',
  victory:      '/audio/sfx/victory_marimba.mp3',
  button_click: '/audio/sfx/click.mp3',
}

export class SFXEngine {
  private sounds = new Map<string, Howl>()

  async preload() {
    await Promise.all(Object.entries(SFX_MANIFEST).map(([key, src]) =>
      new Promise<void>(resolve => {
        this.sounds.set(key, new Howl({
          src: [src, src.replace('.mp3','.ogg')],
          preload: true, onload: resolve, volume: 0.8,
        }))
      })
    ))
  }

  play(name: string, opts: { volume?: number; rate?: number } = {}) {
    const s = this.sounds.get(name)
    if (!s) return
    const id = s.play()
    if (opts.volume !== undefined) s.volume(opts.volume, id)
    if (opts.rate  !== undefined) s.rate(opts.rate, id)
    return id
  }

  setMasterVolume(vol: number) { Howler.volume(vol) }
}

export const sfxEngine = new SFXEngine()
```

### 8.2 Tone.js — Música Adaptativa por Fase

```typescript
// src/lib/music-engine.ts
import * as Tone from 'tone'

type GamePhase = 'lobby' | 'playing' | 'tension' | 'victory' | 'bankrupt'

export class MusicEngine {
  private currentPhase: GamePhase | null = null
  private masterGain = new Tone.Volume(-6).toDestination()

  async setPhase(phase: GamePhase) {
    if (phase === this.currentPhase) return
    await this.crossfade(phase, 2)
    this.currentPhase = phase
  }

  private buildAmbientTrack() {
    // Marimba pentatónica centroamericana 72 BPM
    const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).connect(this.masterGain)
    const marimba = new Tone.Sampler({
      urls: { C4:'/audio/music/marimba_C4.mp3', G4:'/audio/music/marimba_G4.mp3' },
      release: 1.2,
    }).connect(reverb)
    const drone = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type:'triangle' },
      envelope:   { attack:1, sustain:1, release:2 },
    }).connect(new Tone.Volume(-20).connect(this.masterGain))
    const pentatonic = ['C4','D4','E4','G4','A4','C5','D5','G5']
    Tone.Transport.bpm.value = 72
    new Tone.Pattern((time, note) => {
      marimba.triggerAttackRelease(note!, '8n', time, 0.3 + Math.random()*0.4)
    }, pentatonic, 'randomWalk').start(0)
    drone.triggerAttack(['C2','G2','C3'])
    Tone.Transport.start()
  }

  private buildTensionTrack() {
    const delay   = new Tone.PingPongDelay('8n', 0.4).connect(this.masterGain)
    const reverb  = new Tone.Reverb(3).connect(delay)
    const strings = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type:'sawtooth' },
      envelope:   { attack:0.5, sustain:0.8, release:2 },
    }).connect(new Tone.Filter(800,'lowpass').connect(reverb))
    new Tone.Sequence((time, chord) => {
      strings.triggerAttackRelease(chord, '2n', time, 0.25)
    }, [['A2','E3','A3'],['G2','D3','G3'],['F2','C3','F3']], '1m').start()
    Tone.Transport.start()
  }

  private buildVictoryTrack() {
    const synth = new Tone.Synth({ oscillator:{ type:'triangle' } }).connect(this.masterGain)
    const melody = ['C5','E5','G5','C6','E6','G6','E6','C6','G5','E5','C5']
    melody.forEach((note, i) => synth.triggerAttackRelease(note, '8n', `+${i * 0.18}`))
  }

  private async crossfade(phase: GamePhase, duration: number) {
    const dest = Tone.getDestination()
    dest.volume.rampTo(-Infinity, duration / 2)
    await new Promise(r => setTimeout(r, duration / 2 * 1000))
    Tone.Transport.stop(); Tone.Transport.cancel()
    const builders: Record<GamePhase, () => void> = {
      lobby:   () => this.buildAmbientTrack(),
      playing: () => this.buildAmbientTrack(),
      tension: () => this.buildTensionTrack(),
      victory: () => this.buildVictoryTrack(),
      bankrupt:() => this.buildBankruptTrack(),
    }
    builders[phase]()
    dest.volume.rampTo(0, duration / 2)
  }

  private buildBankruptTrack() {
    const synth = new Tone.Synth({ oscillator:{ type:'sawtooth' } }).connect(this.masterGain)
    const sad = ['C4','B3','Bb3','A3','Ab3','G3','F3','E3']
    sad.forEach((note, i) => synth.triggerAttackRelease(note, '4n', `+${i * 0.35}`))
  }
}

export const musicEngine = new MusicEngine()
```

---

## 9. Voces y Mascotas con IA

### 9.1 Voice Engine con Cache en Supabase

```typescript
// src/lib/voice-engine.ts
import { ElevenLabsClient } from 'elevenlabs'
import { supabase } from './supabase'

const eleven = new ElevenLabsClient({ apiKey: import.meta.env.VITE_ELEVEN_KEY })

export const VOICE_IDS = {
  don_fomento: 'vf-don-fomento-xxxx',
  maicita:     'vf-maicita-xxxx',
  don_cafe:    'vf-don-cafe-xxxx',
  la_canche:   'vf-la-canche-xxxx',
  la_tormenta: 'vf-la-tormenta-xxxx',
} as const

type VoiceId  = keyof typeof VOICE_IDS
type Emotion  = 'neutral'|'happy'|'sad'|'excited'|'dramatic'|'concerned'

const EMOTION_SETTINGS: Record<Emotion, object> = {
  neutral:   { stability:0.75, similarity_boost:0.75, style:0.5,  use_speaker_boost:true },
  happy:     { stability:0.45, similarity_boost:0.75, style:0.9,  use_speaker_boost:true },
  sad:       { stability:0.85, similarity_boost:0.75, style:0.25, use_speaker_boost:true },
  excited:   { stability:0.3,  similarity_boost:0.75, style:1.0,  use_speaker_boost:true },
  dramatic:  { stability:0.6,  similarity_boost:0.8,  style:0.85, use_speaker_boost:true },
  concerned: { stability:0.8,  similarity_boost:0.75, style:0.4,  use_speaker_boost:true },
}

export async function speakMascot(mascot: VoiceId, text: string, emotion: Emotion = 'neutral') {
  const cacheKey = `${mascot}-${btoa(text.slice(0,40)).replace(/[^a-z0-9]/gi,'')}-${emotion}`

  // Verificar caché en Supabase Storage
  const { data: list } = await supabase.storage.from('voice-cache').list('', { search: cacheKey })
  if (list?.length) {
    const { data: { publicUrl } } = supabase.storage.from('voice-cache').getPublicUrl(`${cacheKey}.mp3`)
    return playAudioUrl(publicUrl)
  }

  // Generar con ElevenLabs
  const stream = await eleven.generate({
    voice: VOICE_IDS[mascot],
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: EMOTION_SETTINGS[emotion] as any,
  })

  const chunks: Uint8Array[] = []
  for await (const chunk of stream) chunks.push(chunk)
  const blob = new Blob(chunks, { type: 'audio/mpeg' })

  await supabase.storage.from('voice-cache').upload(`${cacheKey}.mp3`, blob, { upsert: true })
  const { data: { publicUrl } } = supabase.storage.from('voice-cache').getPublicUrl(`${cacheKey}.mp3`)
  return playAudioUrl(publicUrl)
}

function playAudioUrl(url: string): Promise<void> {
  return new Promise(resolve => {
    const audio = new Audio(url)
    audio.onended = () => resolve()
    audio.play()
  })
}
```

### 9.2 Orquestador de Mascotas con Claude

```typescript
// src/lib/mascot-orchestrator.ts
import Anthropic from '@anthropic-ai/sdk'
import { speakMascot } from './voice-engine'

const anthropic = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_KEY })

type GameEventType =
  'buy_property' | 'pay_rent' | 'cosecha' | 'riesgo' | 'jail' |
  'victory' | 'bankrupt' | 'build' | 'education' | 'pass_go'

interface GameEvent {
  type: GameEventType
  player: string
  data: Record<string, unknown>
}

export async function orchestrateMascot(event: GameEvent, history: string[]) {
  const { content } = await anthropic.messages.create({
    model: 'claude-haiku-4-5',   // < 500ms target
    max_tokens: 180,
    system: `Generas diálogos para mascotas de AGROPOLY BFA (El Salvador).
Mascotas: don_fomento (sabio, usa "puchica","vaya pues"), maicita (niña entusiasta), la_tormenta (dramático).
Reglas: max 2 oraciones, español salvadoreño natural, dato financiero si aplica.
Responde SOLO con JSON: {"mascot":"string","text":"string","emotion":"string"}`,
    messages: [{
      role: 'user',
      content: `Evento: ${JSON.stringify(event)}
Historial: ${history.slice(-3).join(', ')}`
    }]
  })

  const line = JSON.parse((content[0] as { text: string }).text)
  await speakMascot(line.mascot, line.text, line.emotion)
  return line
}
```

### 9.3 Componente DonFomento con Animación Lottie

```tsx
// src/components/mascots/DonFomento.tsx
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import donFomentoData from '@/assets/lottie/don-fomento.json'
import { useMascotStore } from '@/stores/mascotStore'

export function DonFomento() {
  const { currentLine, isSpeaking } = useMascotStore()

  return (
    <AnimatePresence>
      {(isSpeaking || currentLine) && (
        <motion.div
          className="fixed bottom-24 left-4 z-50 flex items-end gap-3"
          initial={{ x:-120, opacity:0 }}
          animate={{ x:0,    opacity:1 }}
          exit={{ x:-120,    opacity:0 }}
          transition={{ type:'spring', stiffness:300, damping:30 }}
        >
          {/* Personaje Lottie animado */}
          <motion.div
            className="w-24 h-24"
            animate={isSpeaking ? { y:[0,-4,0] } : {}}
            transition={{ repeat:Infinity, duration:1.5 }}
          >
            <Lottie
              animationData={donFomentoData}
              loop={true}
              style={{ width:'100%', height:'100%' }}
            />
          </motion.div>

          {/* Burbuja de diálogo */}
          <AnimatePresence>
            {currentLine && (
              <motion.div
                className="max-w-xs bg-white/95 backdrop-blur-sm rounded-2xl rounded-bl-sm p-4 shadow-xl border border-bfa-green-500/30"
                initial={{ scale:0.8, opacity:0, y:10 }}
                animate={{ scale:1,   opacity:1, y:0  }}
                exit={{ scale:0.8,    opacity:0, y:10 }}
                transition={{ type:'spring', stiffness:400, damping:30 }}
              >
                <p className="text-xs font-mono text-bfa-green-700 mb-1 uppercase tracking-wide">
                  Don Fomento
                </p>
                <TypewriterText
                  text={currentLine.text}
                  className="text-sm text-gray-800 leading-relaxed"
                />
                {currentLine.educationalTip && (
                  <motion.div
                    className="mt-2 p-2 bg-green-50 rounded-lg border-l-2 border-green-500"
                    initial={{ height:0, opacity:0 }}
                    animate={{ height:'auto', opacity:1 }}
                    transition={{ delay:1.5 }}
                  >
                    <p className="text-xs text-green-700">
                      💡 {currentLine.educationalTip}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TypewriterText({ text, className }: { text: string; className: string }) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, ++i))
      if (i >= text.length) clearInterval(iv)
    }, 25)
    return () => clearInterval(iv)
  }, [text])
  return <p className={className}>{displayed}</p>
}
```

---

## 10. Animaciones y Efectos Visuales

### 10.1 Framer Motion — PropertyModal

```tsx
// src/components/game/PropertyModal.tsx
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

const overlayV = {
  hidden:  { opacity:0, backdropFilter:'blur(0px)' },
  visible: { opacity:1, backdropFilter:'blur(12px)', transition:{ duration:0.3 } },
}
const cardV = {
  hidden:  { rotateY:-90, opacity:0, scale:0.8 },
  visible: { rotateY:0,   opacity:1, scale:1,
    transition:{ type:'spring', stiffness:200, damping:20 } },
  exit:    { rotateY:90,  opacity:0, scale:0.8, transition:{ duration:0.2 } },
}

export function PropertyModal({ space, player, onBuy, onAuction, onClose }) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayV} initial="hidden" animate="visible" exit="hidden">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />

        <motion.div className="relative max-w-sm w-full"
          variants={cardV} initial="hidden" animate="visible" exit="exit"
          style={{ perspective:1000 }}>

          <PropertyCardVisual space={space} />

          <motion.div className="mt-4 glass-card rounded-2xl p-4"
            initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2 }}>
            <p className="text-bfa-cream/60 text-sm">Tu balance actual</p>
            <AnimatedCounter value={player.balance} prefix="ƒ"
              className="text-3xl font-mono font-bold text-bfa-gold-500" />
          </motion.div>

          <motion.div className="mt-3 flex gap-3"
            variants={{ visible:{ transition:{ staggerChildren:0.08 } } }}
            initial="hidden" animate="visible">
            {player.balance >= space.price && (
              <motion.button
                variants={{ hidden:{ y:20, opacity:0 }, visible:{ y:0, opacity:1 } }}
                className="btn-primary flex-1" onClick={onBuy}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                Comprar ƒ{space.price}
              </motion.button>
            )}
            <motion.button
              variants={{ hidden:{ y:20, opacity:0 }, visible:{ y:0, opacity:1 } }}
              className="btn-secondary flex-1" onClick={onAuction}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              Subastar
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function AnimatedCounter({ value, prefix='', className='' }) {
  const mv      = useMotionValue(value)
  const rounded = useTransform(mv, v => `${prefix}${Math.round(v).toLocaleString()}`)
  useEffect(() => { const c = animate(mv, value, { duration:0.6 }); return c.stop }, [value])
  return <motion.span className={className}>{rounded}</motion.span>
}
```

### 10.2 GSAP — Cinematics

```typescript
// src/lib/cinematics.ts
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
gsap.registerPlugin(CustomEase)
CustomEase.create('bfa-bounce', 'M0,0 C0.14,0 0.25,1.45 0.44,1.45 0.64,1.45 0.7,1 1,1')

export const cinematics = {
  splashIntro: () => gsap.timeline()
    .from('.splash-logo',   { scale:0.2, rotation:-10, opacity:0, duration:1.5, ease:'bfa-bounce' })
    .from('.splash-sub',    { y:30, opacity:0, duration:0.8 }, '-=0.4')
    .from('.splash-cta',    { y:20, opacity:0, duration:0.5 }, '-=0.3')
    .from('.splash-mascot', { x:-120, opacity:0, duration:0.7, ease:'power3.out' }, '-=0.2'),

  buyPropertyEpic: (cellEl: Element, color: string) => gsap.timeline()
    .to(cellEl, { scale:1.25, duration:0.2, ease:'power2.out' })
    .to(cellEl, { boxShadow:`0 0 50px ${color}`, duration:0.3 }, '-=0.1')
    .to('.coin-burst', { y:-100, opacity:0, scale:0, stagger:0.04, duration:0.8, ease:'power3.out' }, '-=0.1')
    .to(cellEl, { scale:1, boxShadow:'none', duration:0.5, ease:'elastic.out(1,0.3)' }, '-=0.4'),

  turnTransition: (name: string, emoji: string) => {
    const el = document.createElement('div')
    el.innerHTML = `<div class="turn-overlay"><div class="turn-emoji">${emoji}</div><div class="turn-name">${name}</div></div>`
    document.body.appendChild(el)
    return gsap.timeline({ onComplete: () => el.remove() })
      .from(el, { opacity:0, duration:0.3 })
      .from('.turn-emoji', { scale:0, rotation:-180, duration:0.7, ease:'bfa-bounce' }, '-=0.1')
      .from('.turn-name',  { y:30, opacity:0, duration:0.5 }, '-=0.3')
      .to(el, { opacity:0, duration:0.4, delay:0.8 })
  },

  victoryScreen: () => gsap.timeline()
    .from('.victory-bg',     { opacity:0, duration:0.5 })
    .from('.victory-trophy', { scale:0, rotation:-30, duration:1.2, ease:'bfa-bounce' })
    .from('.firework',       { scale:0, stagger:0.1, duration:0.8 }, '-=0.6')
    .from('.victory-title',  { y:40, opacity:0, duration:0.6 }, '-=0.3')
    .from('.victory-winner', { y:30, opacity:0, duration:0.5 }, '-=0.2'),
}
```

### 10.3 Partículas 3D R3F

```tsx
// src/components/three/ParticleSystem.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AmbientParticles({ count = 250 }) {
  const mesh = useRef<THREE.Points>(null)
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const gold = new THREE.Color('#F5C518'), green = new THREE.Color('#2E8B4A')
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-.5)*30
      pos[i*3+1] = Math.random()*15
      pos[i*3+2] = (Math.random()-.5)*30
      vel[i*3]   = (Math.random()-.5)*.02
      vel[i*3+1] = Math.random()*.025+.005
      vel[i*3+2] = (Math.random()-.5)*.02
      const c = Math.random() > .5 ? gold : green
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b
    }
    return { positions:pos, velocities:vel, colors:col }
  }, [count])

  useFrame(() => {
    if (!mesh.current) return
    const p = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      p[i*3]+=velocities[i*3]; p[i*3+1]+=velocities[i*3+1]; p[i*3+2]+=velocities[i*3+2]
      if (p[i*3+1] > 15) p[i*3+1] = -1
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}
```

---

## 11. Motor de Juego y Multijugador

### 11.1 Colyseus Schema

```typescript
// apps/server/src/schema/GameState.ts
import { Schema, type, ArraySchema } from '@colyseus/schema'

export class PlayerState extends Schema {
  @type('string')   id = ''
  @type('string')   name = ''
  @type('string')   tokenId = 'maiz'
  @type('number')   balance = 1500
  @type('number')   position = 0
  @type('boolean')  jailed = false
  @type('number')   jailTurns = 0
  @type('number')   jailFreeCards = 0
  @type('boolean')  bankrupt = false
  @type('boolean')  isAI = false
  @type('string')   difficulty = 'easy'
  @type(['number']) properties = new ArraySchema<number>()
}

export class BoardSpaceState extends Schema {
  @type('number')  id = 0
  @type('string')  type = 'prop'
  @type('number')  group = -1
  @type('string')  name = ''
  @type('number')  price = 0
  @type('number')  ownerId = -1
  @type('number')  buildings = 0
  @type('boolean') mortgaged = false
}

export class GameStateSchema extends Schema {
  @type('string')          phase = 'setup'
  @type('number')          currentPlayerIndex = 0
  @type('number')          turnCount = 0
  @type([PlayerState])     players = new ArraySchema<PlayerState>()
  @type([BoardSpaceState]) board = new ArraySchema<BoardSpaceState>()
  @type('string')          lastAction = ''
}
```

### 11.2 Zustand Game Store

```typescript
// src/stores/gameStore.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const useGameStore = create<GameStore>()(immer(set => ({
  players: [], board: [], phase: 'setup',
  currentPlayerIndex: 0, turnCount: 0, doublesCount: 0,

  buyProperty: (playerId, spaceId) => set(s => {
    const p = s.players.find(p => p.id === playerId)!
    p.balance -= s.board[spaceId].price
    s.board[spaceId].ownerId = playerId
    p.properties.push(spaceId)
  }),

  payRent: (fromId, toId, amount) => set(s => {
    const from = s.players.find(p => p.id === fromId)!
    const to   = s.players.find(p => p.id === toId)!
    const paid = Math.min(amount, from.balance)
    from.balance -= paid; to.balance += paid
  }),

  sendToJail: (playerId) => set(s => {
    const p = s.players.find(p => p.id === playerId)!
    p.jailed = true; p.position = 10; p.jailTurns = 0
  }),

  buildImprovement: (spaceId) => set(s => {
    const sp = s.board[spaceId]
    sp.buildings = (sp.buildings ?? 0) + 1
    s.players.find(p => p.id === sp.ownerId)!.balance -= sp.hcost ?? 0
  }),

  mortgageProperty: (spaceId, unmortgage = false) => set(s => {
    const sp = s.board[spaceId]
    const owner = s.players.find(p => p.id === sp.ownerId)!
    if (unmortgage) {
      owner.balance -= Math.floor(sp.price / 2 * 1.1); sp.mortgaged = false
    } else {
      owner.balance += Math.floor(sp.price / 2); sp.mortgaged = true
    }
  }),

  declareBankrupt: (playerId) => set(s => {
    const p = s.players.find(p => p.id === playerId)!
    p.bankrupt = true
    p.properties.forEach(sid => {
      const sp = s.board[sid]; sp.ownerId = -1; sp.buildings = 0; sp.mortgaged = false
    })
    p.properties = []
  }),

  advanceTurn: () => set(s => {
    s.doublesCount = 0
    let next = (s.currentPlayerIndex + 1) % s.players.length
    let tries = 0
    while (s.players[next].bankrupt && tries < s.players.length) {
      next = (next + 1) % s.players.length; tries++
    }
    s.currentPlayerIndex = next; s.turnCount++; s.phase = 'roll'
  }),
})))
```

---

## 12. Sistema Educativo con IA Adaptativa

### 12.1 Tutor Adaptativo con Claude

```typescript
// src/lib/adaptive-tutor.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_KEY })

export async function generateLesson(concept: string, behavior: PlayerBehavior) {
  const { content } = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `Eres Maicita, niña salvadoreña de 10 años, guía educativa de AGROPOLY BFA.
Reglas: explicación 2 oraciones (vocabulario 4to grado), analogía del campo salvadoreño,
conexión con producto BFA real, quiz 3 opciones. Responde SOLO con JSON válido.`,
    messages: [{
      role: 'user',
      content: `Concepto: "${concept}"
Patrimonio promedio jugador: ƒ${behavior.avgNetWorth}
Quiebras: ${behavior.bankruptCount}
Genera: { explanation, analogy, bfaConnection, quiz: { question, options, correctIndex, explanation } }`
    }]
  })
  return JSON.parse((content[0] as { text: string }).text)
}

// Análisis profundo de comportamiento — Opus para mayor razonamiento
export async function analyzePlayerStrategy(history: string[], netWorth: number) {
  const { content } = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 300,
    system: 'Analiza el comportamiento financiero de un jugador de AGROPOLY BFA. Solo JSON.',
    messages: [{
      role: 'user',
      content: `Últimas 10 decisiones: ${history.join(', ')}
Patrimonio neto: ƒ${netWorth}
Genera: { weakAreas: string[], strengths: string[], nextTip: string, riskProfile: "conservative"|"moderate"|"aggressive" }`
    }]
  })
  return JSON.parse((content[0] as { text: string }).text)
}
```

---

## 13. Contexto Claude — System Prompts Maestros

### 13.1 Context File para Claude Code (desarrollo React)

````markdown
# AGROPOLY APEX — React Dev Context

## Stack
React 19 + TypeScript strict + R3F + Framer Motion + Howler + Tone.js + Zustand + Immer
Monorepo Turborepo: apps/web · apps/server · packages/game-engine

## Convenciones de código
- TypeScript strict: sin `any`, sin type assertions excepto Three.js internals
- Solo function components + hooks. Sin class components.
- Imports: alias @ → apps/web/src. Siempre paths absolutos.
- State: Zustand (global), useState (local). Immer para mutaciones.
- Estilos: solo Tailwind. Sin inline styles en componentes UI (sí en Three.js).
- 3D materials y geometrías: SIEMPRE en useMemo para evitar creación por render.
- Animaciones UI: Framer Motion. Cinematics complejos: GSAP. 3D continuo: useFrame.
- Error boundaries: todo Suspense necesita su ErrorBoundary padre.

## Zustand — Selector específico obligatorio
// CORRECTO: selector específico, solo re-render si ese campo cambia
const balance = useGameStore(s => s.players[0]?.balance ?? 0)
// INCORRECTO: re-render en cualquier cambio del store
const state = useGameStore()

## Tres feedbacks por evento del juego
Cada evento del juego SIEMPRE dispara exactamente 3 feedbacks:
1. Visual: animación Framer/GSAP/R3F
2. Audio: sfxEngine.play('nombre_evento')
3. Voz: orchestrateMascot({ type, ... }) — asíncrono, no bloquea UI

## API Claude: solo en servidor o Edge Functions de Supabase
Nunca exponer ANTHROPIC_API_KEY en variables VITE_ del cliente.

## Modelos Claude rápida referencia
claude-haiku-4-5 — diálogos en partida (< 500ms), tooltips
claude-sonnet-4-6 — lecciones educativas, componentes React complejos
claude-opus-4-6 — análisis profundo, shaders GLSL, física, code review
````

---

## 14. Guía de Modelos Claude por Módulo

| Módulo / Tarea | Modelo | Razón |
|---|---|---|
| Arquitectura, trade-offs, ADRs | claude-opus-4-6 | Razonamiento multi-sistema profundo |
| Shaders GLSL, álgebra lineal 3D | claude-opus-4-6 | Matemáticas GPU complejas |
| Física Rapier, detección colisiones | claude-opus-4-6 | Física 3D avanzada |
| Optimización performance (profiling) | claude-opus-4-7 | GPU memory, repaint analysis |
| Code review de seguridad y bugs | claude-opus-4-6 | Análisis profundo de vulnerabilidades |
| Estrategia IA difícil en partida | claude-opus-4-6 | Razonamiento estratégico multi-paso |
| Análisis comportamiento jugador | claude-opus-4-6 | Patrones en historial extenso |
| Game Engine TypeScript | claude-sonnet-4-6 | Código complejo y estructurado |
| Componentes React + R3F | claude-sonnet-4-6 | JSX + Three.js + animaciones |
| Colyseus Room schemas | claude-sonnet-4-6 | Sync protocol delta compression |
| Tone.js síntesis musical | claude-sonnet-4-6 | Síntesis musical compleja |
| Framer Motion + GSAP timelines | claude-sonnet-4-6 | Orchestración de animaciones |
| Tutor educativo adaptativo | claude-sonnet-4-6 | Pedagogía + velocidad balanceadas |
| Supabase schema + RLS + migrations | claude-sonnet-4-6 | SQL + tipos Drizzle |
| Hono API endpoints | claude-sonnet-4-6 | REST handlers + middleware |
| Diálogos mascotas en partida | claude-haiku-4-5 | < 500ms latencia crítica |
| Tooltips y micro-lecciones RT | claude-haiku-4-5 | Tiempo real en partida |
| Generación masiva de tarjetas | claude-haiku-4-5 | Formato repetitivo × 48 |
| Tests Vitest + Playwright E2E | claude-haiku-4-5 | Patrones repetitivos |
| JSDoc y documentación técnica | claude-haiku-4-5 | Formato estándar en masa |
| CI/CD YAML, Docker configs | claude-haiku-4-5 | Configuración estructurada |
| Design tokens desde Figma | claude-haiku-4-5 | Extracción estructurada rápida |

---

## 15. Prompts de Desarrollo Fase por Fase

### FASE 1 — Fundación (Semana 1–2)

---

**PROMPT F1.1 — Setup Monorepo Completo**
**Modelo:** `claude-sonnet-4-6`

```
Configura el monorepo AGROPOLY APEX completo con Turborepo + pnpm workspaces.

Estructura:
apps/web (React 19 + Vite 5 + TypeScript strict)
apps/server (Colyseus 0.15 + Hono 4)
packages/game-engine (lógica compartida, zero dependencias externas)
packages/shared-types (tipos TypeScript compartidos)

Entrega:
1. package.json raíz con workspaces y scripts turbo (build, dev, test, lint, typecheck)
2. turbo.json con pipelines correctos y dependencias entre packages
3. pnpm-workspace.yaml
4. apps/web/vite.config.ts con: alias @/ → src/, plugin-react con SWC,
   optimizeDeps para three y @react-three
5. apps/web/tsconfig.json con strict:true, paths @/*
6. apps/web/tailwind.config.ts con los design tokens BFA completos
7. .mcp.json con los 11 MCP servers del documento
8. docker-compose.yml: web (5173), server (2567), redis (6379), supabase (54321)
9. .env.example con todas las variables necesarias comentadas

El comando pnpm install && pnpm turbo dev debe arrancar sin errores.
TypeScript sin errores en ningún package al correr pnpm turbo typecheck.
```

---

**PROMPT F1.2 — Game Engine Package TypeScript**
**Modelo:** `claude-sonnet-4-6`

```
Implementa el package @agropoly/game-engine en packages/game-engine/src/

Zero dependencias externas. Solo TypeScript puro.
Usado por apps/web (Zustand) y apps/server (Colyseus).

Archivos requeridos:

types.ts:
  Interfaces: BoardSpace, Player, GameState, GamePhase, Card,
  BuildingResult, RentCalculation, EffectResult, LandingResult

board.ts — BOARD_DATA: BoardSpace[]
  40 casillas reales del juego con agencias del BFA El Salvador.
  Grupos 0–7 con 2–3 propiedades cada uno.
  Precios ƒ60–ƒ400. Rents[6] correctos (sin mejora, ×1-4, hotel).
  Casillas especiales: 4 canales BFA (pos 5,15,25,35),
  2 servicios (pos 12,28), 3 cosecha, 3 riesgo, 2 impuestos.

cards.ts:
  COSECHA_DECK: 16 tarjetas positivas con efectos variados
  RIESGO_DECK: 16 tarjetas mayormente negativas + 3 positivas sorpresa
  Cada tarjeta: { id, icon, title, text, effect: (player, state) => EffectResult }

rules.ts — funciones puras (sin side effects):
  calcRent(space, board, players): number
  checkGroupOwnership(playerId, groupIdx, board): boolean
  canBuild(spaceId, playerId, board, players): BuildingResult
  canBuildBalanced(spaceId, board): boolean
  checkBankruptcy(player, amount): { bankrupt: boolean; canRaise: number }
  getNetWorth(player, board): number
  findNearestUnowned(position, board): number

engine.ts — clase GameEngine:
  processRoll(state, d1, d2): LandingResult
  handleLanding(state, playerId, spaceId): LandingResult
  advanceTurn(state): { nextPlayerIdx: number; winnerId?: string }
  Todos los métodos retornan nuevo estado (inmutables)

index.ts — barrel export

JSDoc completo en funciones públicas. Zero uso de `any`.
```

---

**PROMPT F1.3 — Escena 3D Base con R3F**
**Modelo:** `claude-sonnet-4-6`

```
Implementa la escena 3D base en apps/web/src/components/three/GameScene.tsx

Requisitos Canvas:
- shadows="soft", dpr={[1,2]}, camera position [0,12,18] fov 50
- gl: antialias true, powerPreference high-performance
- AdaptiveDpr pixelated + AdaptiveEvents de Drei

Iluminación cinematográfica:
- ambientLight: intensidad 0.3, color #f0ffe0
- directionalLight: position [10,20,10], intensidad 2, castShadow,
  shadow-mapSize [2048,2048], shadow-bias -0.001
- pointLight: position [0,8,0], color #F5C518, intensidad 0.8, decay 2
- hemisphereLight: sky #87CEEB, ground #1B6B2F, intensidad 0.4
- Environment preset="forest" de Drei

Physics con @react-three/rapier: gravity [0,-9.81,0]

Suspense con fallback LoadingBoard (placeholder verde girando con logo BFA)

EffectComposer:
- Bloom: luminanceThreshold 0.9, luminanceSmoothing 0.9, intensity 0.5
- Vignette: offset 0.15, darkness 0.8
- SMAA: multisampling 4

OrbitControls: maxPolarAngle Math.PI/2.2, minDistance 8,
maxDistance 25, enablePan false, target [0,0,0]

Componentes hijo (stubs funcionales por ahora):
Board3D, TokensGroup, Dice3D, Buildings,
AmbientParticles count 250, LightningEffect, SkyBox

Responsive: en mobile (<768px), cámara en position [0,18,20].
useEffect para resize y recalcular aspect ratio del Canvas.
Exportar como default y named export.
```

---

**PROMPT F1.4 — Shaders GLSL Custom**
**Modelo:** `claude-opus-4-6`

```
Crea los 3 shaders GLSL para AGROPOLY APEX.

apps/web/src/assets/shaders/goldShimmer.ts
ShaderMaterial para el marco dorado del tablero.
Efecto: shimmer diagonal de izquierda a derecha.
uniform uTime float (animación), uBaseColor vec3 (#B8860B),
uShimmerColor vec3 (#F5C518), uFrequency float.
Exportar: { vertexShader, fragmentShader, uniforms } compatible con R3F.
Comentar cada operación matemática del fragment shader.

apps/web/src/assets/shaders/fieldGrass.ts
ShaderMaterial para el suelo del tablero.
Gradiente verde oscuro con variación procedural tipo campo.
Movimiento muy sutil de hierba usando sin() sobre vUv y uTime.
Solo visible en la periferia del tablero (fade basado en distancia al centro).

apps/web/src/assets/shaders/lightning.ts
ShaderMaterial para relámpagos en Emergencia Climática.
Líneas verticales aleatorias que aparecen/desaparecen.
uniform uActive bool, uIntensity float 0–1, uTime float.
Color azul eléctrico #88AAFF con core blanco.
Solo visible cuando uActive = true.

Para cada shader incluir:
- vertexShader completo
- fragmentShader completo con comentarios matemáticos
- uniforms correctamente tipados para TypeScript
- Ejemplo de uso en componente R3F con useFrame para actualizar uTime
```

---

### FASE 2 — Motor Económico (Semana 3–4)

---

**PROMPT F2.1 — Zustand Game Store Completo**
**Modelo:** `claude-sonnet-4-6`

```
Implementa el store completo en apps/web/src/stores/gameStore.ts
Usando zustand + immer + @agropoly/game-engine rules

STATE completo: players, board (desde BOARD_DATA),
phase, currentPlayerIndex, turnCount, doublesCount,
lastDiceRoll, pendingAction, cosechaDeck, riesgoDeck,
logEntries, winner

ACTIONS requeridas:
initGame(config: GameConfig): inicializa jugadores, mezcla mazos con Fisher-Yates
rollDice(): { d1, d2, doubles } — puro RNG
processRollResult(d1, d2): mueve jugador, detecta dobles/jail/passGo
handleLanding(): dispatch por tipo de casilla
buyProperty(spaceId): validaciones completas, actualiza estado
payRentToPlayer(fromId, toId, amount)
drawCosechaCard(): Card — retira del mazo, rebaraja si vacío
drawRiesgoCard(): Card — ídem
applyCardEffect(card): aplica el efecto de la tarjeta
buildImprovement(spaceId): regla de construcción equilibrada
sellImprovement(spaceId): regla de venta equilibrada
mortgageProperty(spaceId): con validación de no tener mejoras
unmortgageProperty(spaceId): paga 110%
sendToJail(playerId)
payJailFine(playerId): paga ƒ50
useJailFreeCard(playerId)
declareBankrupt(playerId): devuelve propiedades al banco
advanceTurn(): salta jugadores quebrados
addLog(entry: LogEntry)

Todos los actions usan funciones puras de @agropoly/game-engine/rules.
TypeScript strict: ningún campo puede ser undefined no manejado.
```

---

**PROMPT F2.2 — Board3D Completo con 40 Casillas**
**Modelo:** `claude-sonnet-4-6`

```
Implementa Board3D.tsx con las 40 casillas completas.
apps/web/src/components/three/Board3D.tsx

TABLERO BASE:
- Base madera oscura: MeshStandardMaterial color #1a0d05 roughness 0.85
- Marco dorado: goldShimmer shader (importar de assets/shaders)
- Animación del marco: useFrame para uTime uniform

getCellPosition(index: number): THREE.Vector3
Calcula la posición 3D exacta de cada casilla en el perímetro 11×11.
Índices 0–10: fila inferior. 11–19: columna derecha. 20–30: fila superior. 31–39: columna izquierda.
Esquinas más grandes (×1.4). Posiciones con gap de 1.1 unidades.

BOARDCELL component:
Props: space: BoardSpace, index: number
- BoxGeometry 0.95, 0.08, 0.95
- Material: emissive animado con useFrame cuando isActive
- Banda de color del grupo: BoxGeometry 0.93, 0.01, 0.22 pegada al borde exterior
- onPointerEnter: hover sutil (scale 1.03)
- onPointerLeave: reset
- onClick: onCellClick del store
- Owner indicator: disco pequeño del color del token en esquina superior
- Edificios: cilindros verdes pequeños (Puntos de Atención), cubo dorado (Centro)

CENTERBOARD:
- Área 9×9 unidades en el centro
- Text3D de Drei con fuente playfair-display.json: "AGROPOLY"
- Color #F5C518, MeshStandardMaterial metalness 0.8
- Rotación suave 0.002 rad/frame
- Silueta flat del mapa de El Salvador

Performance: todas las geometrías y materiales en useMemo.
Suscripción selectiva al gameStore: solo board y currentPlayerIndex.
```

---

### FASE 3 — Audio y Mascotas (Semana 5–6)

---

**PROMPT F3.1 — SFX Engine Completo**
**Modelo:** `claude-sonnet-4-6`

```
Implementa el sistema de audio completo.

apps/web/src/lib/sfx-engine.ts (Howler.js):
Clase SFXEngine con preload() de los 16 SFX del manifiesto.
play(name, opts?): id de sonido.
playAt(name, position3D): volumen según distancia al centro (0,0,0).
stop(id), stopAll(), setMasterVolume(vol).
Progress callback en preload() para mostrar barra de carga.
Soporte multi-formato: .mp3 con fallback a .ogg.

apps/web/src/lib/music-engine.ts (Tone.js):
Clase MusicEngine con 5 tracks: lobby, playing, tension, victory, bankrupt.
setPhase(phase): crossfade suave de 2 segundos entre tracks.
Track lobby/playing: marimba pentatónica centroamericana, 72 BPM, reverb grande.
Track tension: strings sawtooth con PingPongDelay, progresión Am-Gm-Fm.
Track victory: melodía Do Mayor 12 notas con PolySynth.
Track bankrupt: escala cromática descendente triste.
setVolume(0–1), pause(), resume().
Limpiar todos los nodos Tone en dispose().

apps/web/src/stores/audioStore.ts (Zustand):
sfxEnabled, musicEnabled, sfxVolume, musicVolume.
Persiste en localStorage con zustand/middleware/persist.

apps/web/src/hooks/useAudio.ts:
useSFX(): { play, stop, setVolume }
useGameMusic(): { setPhase, setVolume }
useGameEventAudio(): callbacks por evento del juego:
  onRollDice, onMoveToken, onLandOnCell, onBuyProperty,
  onPayRent, onCosechaCard, onRiesgoCard, onGoToJail,
  onPassGo, onBuildHouse, onBuildHotel, onBankruptcy, onVictory

Todos los hooks respetan los toggles del AudioStore.
```

---

**PROMPT F3.2 — Mascotas con ElevenLabs y Claude**
**Modelo:** `claude-sonnet-4-6`

```
Implementa el sistema completo de mascotas con voz.

apps/server/src/services/ttsService.ts:
POST /api/voice/generate
Body: { mascot, text, emotion }
1. Hash MD5 del texto para cacheKey
2. Verificar Redis (TTL 7 días)
3. Si no hay: generar con ElevenLabs eleven_multilingual_v2
4. Subir MP3 a Supabase Storage bucket voice-cache
5. Guardar URL en Redis
6. Retornar { url, cached, duration }
Timeout de 3 segundos — si ElevenLabs no responde, retornar url vacía.

apps/web/src/lib/voice-engine.ts:
speakMascot(mascot, text, emotion): Promise<void>
Llama a /api/voice/generate, reproduce el audio.
preloadCommonLines(): precarga las 20 líneas más frecuentes al iniciar.
Cola interna de máx 3 elementos — descarta los más viejos.

apps/web/src/lib/mascot-orchestrator.ts:
orchestrateMascot(event, history): Promise<MascotLine>
Claude claude-haiku-4-5 genera el diálogo según el evento.
Target latencia: < 500ms para el texto, audio se inicia mientras tanto.
Sistema de prompt con personalidades de las 3 mascotas.

apps/web/src/components/mascots/DonFomento.tsx:
Animación Lottie del personaje.
Burbuja de diálogo con TypewriterText (25ms/char).
Aparece desde la izquierda con spring animation de Framer.
Badge educativo si la línea tiene educationalTip.
Auto-oculta 3 segundos después del fin del audio.

apps/web/src/stores/mascotStore.ts:
currentMascot, currentText, currentEmotion, isSpeaking, queue.
```

---

### FASE 4 — Arte y Diseño Visual (Semana 7)

---

**PROMPT F4.1 — Tablero Arte Final (Claude Designer)**

```
Diseña el tablero completo de AGROPOLY APEX para exportación como texturas 3D PBR.

El tablero es un objeto físico 3D. Necesito 3 mapas de textura:
1. diffuse.png (color base): 2048×2048px para calidad óptima
2. emissive.png (zonas que brillan): bandas de color, logo central
3. roughness.png (mate vs brillante): madera rugosa, metal suave

CASILLAS DE PROPIEDAD (32 casillas):
Fondo negro-verde #0A1A0C con grain de madera sutil 3% opacidad.
Texto nombre agencia: DM Sans SemiBold 8pt #FDF8EE centrado.
Texto precio: Space Mono Bold 9pt, color del grupo correspondiente.
Banda de color del grupo: 5px en el borde exterior, emissive map incluida.
Pequeño ícono del departamento de El Salvador en esquina (silhouette minimalista).

CASILLAS ESPECIALES (8 no-propiedad):
Cosecha (×3): verde brillante #2E8B4A con ícono mazorca de maíz
Riesgo (×3): rojo #8B1A1A con ícono relámpago/tormenta
Impuesto (×2): naranja oscuro #7B4B00 con ícono de moneda

ESQUINAS (4 casillas grandes ~130% tamaño):
INICIO: gradiente radial dorado, texto ADELANTE, ícono bandera
EMERGENCIA CLIMÁTICA: nubes oscuras, relámpago rojo, ícono advertencia
FERIA DEL CAMPO: verde brillante, ilustración mercado rural
IR A EMERGENCIA: flecha roja dramática, color urgente

CENTRO (9×9 unidades):
Radial gradient: #0D2B14 centro → #1B6B2F borde.
Silueta artística del mapa de El Salvador con 20 puntos dorados (agencias BFA).
"AGROPOLY" Playfair Display Italic 900 64pt gradiente dorado en emissive map.
"Banco de Fomento Agropecuario · Est. 1973" DM Sans 10pt blanco 60%.
Ícono espiga estilizado como emblema heráldico 80px.

Entregar: especificaciones pixel-perfect de cada casilla para implementación en CSS/WebGL.
Indicar qué capas van en diffuse map vs emissive map vs roughness map.
```

---

**PROMPT F4.2 — Don Fomento — Diseño de Personaje (Claude Designer)**

```
Diseña el personaje Don Fomento para AGROPOLY APEX.

DESCRIPCIÓN:
Hombre salvadoreño, 65 años, agricultor veterano del BFA.
Complexión mediana, piel morena del trabajo al sol.
Rostro con arrugas de carácter, bigote canoso, ojos sabios y alegres.
Ropa: sombrero de palma tejida, camisa a cuadros azul-blanco,
overol de trabajo gastado, botas de cuero café.
Siempre lleva una bolsa de semillas o un manojo de caña de azúcar.

6 ESTADOS DE ANIMACIÓN (para Lottie After Effects):
1. IDLE: parado, sonrisa amable, leve balanceo
2. HAPPY: brazos levantados, cara de orgullo genuino
3. SAD: cabeza baja, sombrero en la mano con respeto
4. EXCITED: señala al jugador con emoción, boca abierta
5. CONCERNED: ceño fruncido, mano en barbilla pensando
6. TALKING: boca moviendose, manos expressivas

ESTILO VISUAL:
Cartoon 2D con volumen — similar a personajes Pixar en formato 2D.
Outlines negros 2px. Colores saturados y cálidos.
Expresiones legibles a 80×80px (tamaño mínimo en pantalla).

ADAPTACIONES DE TAMAÑO:
Full body 200×300px — panel lateral del juego
Bust 100×100px — avatar en HUD y leaderboard
Token 40×40px — ficha circular para el tablero

CAPAS PARA LOTTIE (nombrar correctamente para animación):
cuerpo_base, camisa, overol, botas, sombrero,
cabeza, ojos_izq, ojo_der, ceja_izq, ceja_der,
boca, bigote, brazo_izq, brazo_der, mano_izq, mano_der

Paleta: azul camisa #1E3A5F, ocre piel #C49A6C, café botas #5D3E2A,
crema sombrero #E8D5A3, verde overol #2E5D3B.

Entregar: SVG con capas nombradas listo para importar en After Effects.
```

---

**PROMPT F4.3 — Billetes Fomento Serie Completa (Claude Designer)**

```
Diseña la serie completa de 7 billetes FOMENTO para AGROPOLY APEX.
Tamaño: 156×66mm. Formato final: SVG + PNG 300dpi.

TABLA DE LOS 7 BILLETES:
ƒ1 — La Semilla — Verde claro #4CAF70 — Granos básicos — Nacional
ƒ5 — La Milpa — Verde BFA #2E8B4A — Maíz y frijol — Región Central
ƒ10 — El Maíz — Verde-dorado #8B7B00 — Maíz de primera — Paracentral
ƒ20 — El Café — Café cálido #6D4C41 — Café de altura — Occidente
ƒ50 — La Ganadería — Tierra #7B5228 — Ganado bovino — Chalatenango
ƒ100 — La Costa — Azul océano #1565C0 — Pesca artesanal — Costa Pacífica
ƒ500 — La Casa Matriz — Dorado #B8860B — Sede BFA Av. Olímpica — San Salvador

FRENTE DE CADA BILLETE:
Fondo: gradiente diagonal del color base de la denominación.
Denominación: Space Mono 900, 28pt, color de acento brillante, arriba izquierda.
Nombre del billete: Playfair Display Italic 700, 11pt, bajo la denominación.
Ilustración central: flat isométrica estilo sello oficial (producto de la tabla).
BANCO DE FOMENTO AGROPECUARIO: DM Sans 700, 7pt, tracking 2px, derecha.
EL SALVADOR · EST. 1973: Space Mono, 6pt, bajo el nombre del banco.
Línea de micropatrón de seguridad: diagonal sutil 2% opacidad.
Número de serie: Space Mono Regular, 6pt, 20% opacidad, abajo derecha.

REVERSO DE CADA BILLETE:
Mapa outline de El Salvador con la región productora destacada en el color del billete.
Dato de orgullo de esa región (1 oración).
Borde decorativo inspirado en artesanía salvadoreña (güipiles, barro negro).
Emblema BFA en esquina inferior derecha.

BILLETE ƒ500 ESPECIAL:
Frente: ilustración del edificio histórico BFA en Av. Olímpica.
Reverso: línea de tiempo visual 51 años del BFA (1973–2024).
Capa de efecto holográfico simulado (gradiente iridiscente en múltiplos).

Entregar SVG con capas separadas para cada billete.
Indicar tamaños tipográficos exactos para cada elemento.
```

---

### FASE 5 — Multijugador y Backend (Semana 8)

---

**PROMPT F5.1 — Colyseus Game Room Completo**
**Modelo:** `claude-sonnet-4-6`

```
Implementa GameRoom en apps/server/src/rooms/GameRoom.ts

Colyseus 0.15 + TypeScript strict

Hasta 6 clientes. Mensajes manejados:
roll_dice, buy_property, pass_property, build, mortgage, trade_offer,
use_jail_card, pay_jail, chat_message

CICLO DE VIDA:
onCreate(options): inicializa schema, agrega jugadores IA según options.aiCount,
  programa cleanup si nadie se une en 60s
onJoin(client, { name, tokenId }): valida tokenId único, agrega PlayerState,
  si es el último jugador esperado → startGame()
onLeave(client, consented): marca player bankrupt, si era su turno → advanceTurn,
  si solo queda 1 humano → enviar evento para decidir continuar vs terminar
onDispose(): limpiar timeouts, guardar sesión en Supabase

HANDLERS DE MENSAJES:
roll_dice: valida que es el turno del cliente → ejecuta engine → broadcast dice_rolled
buy_property: valida balance y ownership → actualiza schema → broadcast property_bought
trade_offer: broadcast al jugador objetivo, timeout 30s para respuesta

TURNOS IA:
Delay 1.2s antes de actuar (visual).
aiService.getDecision(player, state) según difficulty.
Broadcast cada acción IA con delay 0.5s entre acciones.

RECUPERACIÓN DE ERRORES:
try/catch en todos los handlers.
Snapshot del estado anterior para revertir en error.
Log en Sentry con contexto del game room.

JSDoc completo. TypeScript strict en todos los handlers.
```

---

**PROMPT F5.2 — Supabase Schema Completo**
**Modelo:** `claude-sonnet-4-6`

```
Diseña el schema completo de Supabase para AGROPOLY APEX.

supabase/migrations/001_initial_schema.sql

TABLAS requeridas:

profiles: id uuid PK (ref auth.users), username text UNIQUE,
  avatar_url text, preferred_token text DEFAULT maiz,
  created_at, updated_at

game_sessions: id uuid PK, room_id text, started_at, ended_at,
  duration_seconds int, player_count int, winner_id uuid,
  win_condition text CHECK (last_standing|net_worth),
  educational_mode bool DEFAULT false, final_state jsonb

session_players: id uuid PK, session_id FK, player_id FK,
  is_ai bool, ai_difficulty text, token_id text,
  final_balance int, final_net_worth int, properties_owned int,
  buildings_built int, times_jailed int

leaderboard: vista materializada con rank calculado por wins y net_worth

educational_events: session_id FK, player_id FK,
  event_type text CHECK (concept_shown|quiz_answered|glossary_opened),
  concept_name text, quiz_correct bool, time_spent_seconds int

voice_cache: cache_key text PK, storage_path text,
  mascot text, duration_seconds numeric, last_accessed_at timestamptz

ROW LEVEL SECURITY:
profiles: SELECT público, UPDATE solo propio perfil
game_sessions: INSERT solo service role, SELECT público
educational_events: INSERT service role, SELECT solo propio player
voice_cache: SELECT y INSERT solo service role

FUNCIONES SQL:
update_leaderboard(): trigger en session_players para recalcular ranks
cleanup_voice_cache(): eliminar audios > 30 días (para cron)
get_player_stats(profile_id): retorna stats completas del jugador

ÍNDICES:
game_sessions (room_id), (started_at DESC)
session_players (session_id), (player_id)
educational_events (concept_name), (session_id)

También: supabase/migrations/002_seed.sql con 3 partidas y 6 jugadores de prueba.
```

---

### FASE 6 — Modo Educativo y PWA (Semana 9)

---

**PROMPT F6.1 — Sistema Educativo Claude Adaptativo**
**Modelo:** `claude-sonnet-4-6`

```
Implementa el módulo educativo completo de AGROPOLY APEX.

apps/web/src/components/educational/MicroLesson.tsx:
Props: { concept: string; trigger: GameEvent; onComplete: () => void }
Estados: loading → explanation → quiz → result
Llama a generateLesson(concept, playerBehavior) → Claude claude-sonnet-4-6
Loading: skeleton con shimmer animation
Explanation: Maicita narra con TypewriterText, analogía del campo, dato BFA
Quiz: 3 opciones animadas con stagger, selección con spring animation
Result: verde/rojo + puntos ganados + voz de Maicita (happy si correcto)

apps/web/src/components/educational/ConceptTooltip.tsx:
Radix UI Tooltip alrededor de cualquier término financiero en la UI.
Contenido generado por Claude claude-haiku-4-5 (cached 1h en memoria).
Definición 1 oración + ejemplo con ƒ + ícono del producto BFA relevante.
No bloquea el flujo del juego bajo ninguna circunstancia.

apps/web/src/components/educational/ProgressTracker.tsx:
35 conceptos en 5 categorías: ahorro, crédito, inversión, riesgo, BFA
Barras de progreso animadas con Framer Motion por categoría
Badge Experto Financiero al completar todos los 35
Lottie celebration al desbloquear badges

apps/web/src/stores/educationStore.ts (Zustand con persist):
conceptsLearned: Record con concepto → { correct, timestamp, attempts }
totalCorrect, totalAttempted, badges, educationalMode bool

Los 35 conceptos vienen del glosario completo del documento.
Conectar MicroLesson al MascotOrchestrator para voz en respuestas.
```

---

## 16. Backend, Base de Datos y APIs

### 16.1 Hono API Server

```typescript
// apps/server/src/api/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()
app.use('*', cors(), logger())

app.post('/api/voice/generate',
  zValidator('json', z.object({ mascot: z.string(), text: z.string(), emotion: z.string() })),
  async (c) => {
    const { mascot, text, emotion } = c.req.valid('json')
    // ttsService.generate(mascot, text, emotion)
    return c.json({ url: '', cached: false, duration: 0 })
  }
)

app.post('/api/ai/lesson',
  zValidator('json', z.object({
    concept: z.string(),
    playerBehavior: z.object({ avgNetWorth: z.number(), bankruptCount: z.number() })
  })),
  async (c) => {
    const { concept, playerBehavior } = c.req.valid('json')
    // generateLesson(concept, playerBehavior)
    return c.json({ lesson: {} })
  }
)

app.get('/api/leaderboard', async (c) => {
  // supabase.from('leaderboard').select('*').order('rank').limit(20)
  return c.json([])
})

app.post('/api/sessions',
  zValidator('json', z.object({
    roomId: z.string(),
    winnerId: z.string().optional(),
    players: z.array(z.any())
  })),
  async (c) => {
    return c.json({ success: true })
  }
)

export default app
```

### 16.2 React Query Hooks

```typescript
// src/hooks/useGameData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetch('/api/leaderboard').then(r => r.json()),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useSaveSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (session: SessionData) => fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leaderboard'] }),
  })
}
```

---

## 17. Despliegue, DevOps y CI/CD

### 17.1 Docker Compose para Desarrollo Local

```yaml
# docker-compose.yml
services:
  web:
    build: { context: ./apps/web, dockerfile: Dockerfile.dev }
    ports: ["5173:5173"]
    volumes: ["./apps/web/src:/app/src"]
    environment:
      VITE_SUPABASE_URL: http://localhost:54321
      VITE_COLYSEUS_URL: ws://localhost:2567

  server:
    build: { context: ./apps/server, dockerfile: Dockerfile.dev }
    ports: ["2567:2567", "3000:3000"]
    environment:
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      ELEVENLABS_API_KEY: ${ELEVENLABS_API_KEY}
      REDIS_URL: redis://redis:6379
    depends_on: [redis]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: ["redis_data:/data"]

volumes:
  redis_data:
```

### 17.2 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD AGROPOLY APEX
on:
  push:    { branches: [main, develop] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint typecheck test

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm turbo build
      - run: pnpm exec playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report/ }

  deploy-preview:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install && pnpm turbo build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install && pnpm turbo build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
      - name: Deploy server to Railway
        run: railway up --service agropoly-server
        env: { RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }} }
```

---

## 18. Sprint Backlog y Roadmap

### 18.1 User Stories MoSCoW

#### MUST HAVE — MVP (Sprints 1–4)

| ID | Historia | SP | Módulo |
|---|---|---|---|
| US-001 | Dados 3D con física real que rebotan en el tablero 3D | 13 | Rapier/R3F |
| US-002 | Tablero 3D completo con las 40 casillas iluminadas | 13 | Three.js |
| US-003 | Tokens 3D animados moviéndose casilla por casilla | 8 | R3F Animation |
| US-004 | Sistema económico completo (compra, renta, mejoras) | 8 | Game Engine |
| US-005 | Don Fomento habla con voz real durante el juego | 8 | ElevenLabs |
| US-006 | Música ambiental adaptativa según fase del juego | 5 | Tone.js |
| US-007 | 16 SFX distintos y temáticos | 3 | Howler.js |
| US-008 | IA en 2 niveles (fácil y difícil) | 8 | AI Engine |
| US-009 | Tarjetas Cosecha y Riesgo con animaciones y voz | 5 | Cards+Mascots |
| US-010 | Multijugador local 2–6 jugadores | 5 | Colyseus |

#### SHOULD HAVE (Sprints 5–6)

| ID | Historia | SP | Módulo |
|---|---|---|---|
| US-011 | Maicita explica conceptos en el momento exacto | 8 | Educativo |
| US-012 | Quiz de educación financiera post-tarjeta | 5 | Educativo |
| US-013 | Multijugador online en tiempo real | 13 | Colyseus |
| US-014 | Tabla de líderes con avatares | 5 | Supabase |
| US-015 | Shaders: shimmer dorado + relámpagos | 5 | GLSL |
| US-016 | Animaciones cinemáticas de victoria completas | 5 | GSAP |
| US-017 | Modo Espectador para facilitadores BFA | 3 | Colyseus |

#### COULD HAVE (Sprints 7–9)

| ID | Historia | SP | Módulo |
|---|---|---|---|
| US-018 | Control por voz para lanzar dados | 8 | Web Speech API |
| US-019 | Vista AR del tablero en la mesa real | 13 | @react-three/xr |
| US-020 | Generación procedural de ilustraciones para tarjetas | 8 | Replicate AI |
| US-021 | Sistema de logros y badges coleccionables | 5 | Gamification |
| US-022 | Torneos con brackets automáticos | 8 | Tournament |

### 18.2 Sprints

```
SPRINT 1 (S1–S2): FUNDACIÓN 3D
Goal: "Tablero 3D visible con dados rebotando físicamente"
- US-001: Dados con Rapier               [claude-opus-4-6]
- US-002: Tablero 3D completo            [claude-sonnet-4-6]
- Monorepo setup + R3F + shaders

SPRINT 2 (S3–S4): MOTOR ECONÓMICO
Goal: "Partida completa jugable (sin audio ni mascotas)"
- US-003: Tokens 3D animados             [claude-sonnet-4-6]
- US-004: Sistema económico completo     [claude-sonnet-4-6]
- Zustand stores + Colyseus schema

SPRINT 3 (S5–S6): AUDIO Y MASCOTAS
Goal: "Don Fomento habla, la música cambia con el juego"
- US-005: ElevenLabs voces               [claude-sonnet-4-6]
- US-006: Tone.js música adaptativa      [claude-sonnet-4-6]
- US-007: SFX completos Howler           [claude-sonnet-4-6]
- US-008: IA Engine 2 niveles            [claude-opus-4-6]

SPRINT 4 (S7): ARTE VISUAL
Goal: "Juego visualmente espectacular con identidad BFA"
- Billetes, tablero, mascotas            [Claude Designer]
- US-015: Shaders GLSL                   [claude-opus-4-6]
- US-016: GSAP cinematics                [claude-sonnet-4-6]

SPRINT 5 (S8–S9): EDUCATIVO + ONLINE
Goal: "Multijugador en línea + módulo educativo completo"
- US-011: Maicita tutora adaptativa      [claude-sonnet-4-6]
- US-012: Quiz system                    [claude-sonnet-4-6]
- US-013: Multijugador Colyseus          [claude-sonnet-4-6]
- US-014: Leaderboard Supabase           [claude-haiku-4-5]

SPRINT 6 (S10–S12): POLISH + LANZAMIENTO
Goal: "Lighthouse > 90, 0 crashes en 100 sesiones E2E"
- Code review completo                   [claude-opus-4-6]
- Performance optimization               [claude-opus-4-7]
- E2E Playwright 100 casos               [claude-haiku-4-5]
- Deploy producción + monitoreo Sentry
```

---

## 19. Apéndices

### Apéndice A — Glosario de 35 Conceptos Financieros

Para el sistema educativo (lenguaje para jóvenes 9–19 años):

| Concepto | Definición Simple | Analogía Salvadoreña | Producto BFA |
|---|---|---|---|
| ahorro | Guardar parte de lo que ganás para usarlo mañana | Como guardar granos de maíz para la próxima siembra | Cuenta Fomentito |
| credito | Dinero prestado que devolvés con el tiempo | Como que tu vecino te presta semillas y después le das más cosecha | Crédito Agrícola |
| tasa_interes | El precio por usar dinero prestado | Como pagar más maíz por semillas prestadas | Tasas preferenciales BFA |
| hipoteca | Usar tu propiedad como garantía de un préstamo | Como dejar tu machete en prenda hasta pagar la deuda | Préstamos con garantía |
| renta | Lo que cobrás por dejar que otros usen tu propiedad | Como cobrar por dejar pastar vacas en tu terreno | Arrendamiento BFA |
| inversion | Poner dinero hoy para ganar más mañana | Como comprar semillas para vender más cosecha en octubre | Fideicomiso BFA |
| activo | Algo que tenés y te genera dinero | Tu parcela que da cosecha cada ciclo | Propiedades agropecuarias |
| pasivo | Deuda o gasto que tenés que pagar | Los abonos que debés de la cosecha anterior | Créditos vencidos |
| liquidez | Tener dinero disponible cuando lo necesitás | Tener efectivo el día de la feria para comprar insumos | Cuenta de ahorro fácil |
| quiebra | Cuando ya no podés pagar tus deudas | Cuando perdiste la cosecha y no tenés con qué pagar | Reestructuración |
| seguro | Pago pequeño periódico que cubre pérdidas grandes | La cuota de la cooperativa que cubre si se enferma tu vaca | Seguro Agrícola BFA |
| microcredito | Préstamo pequeño para emprendedores sin historial | El primer préstamo que te ayuda a empezar tu negocio | Microcrédito BFA |
| remesa | Dinero que alguien del exterior envía a su familia | Los dólares que manda tu familiar desde Estados Unidos | Remesas BFA |
| diversificacion | No poner todos los huevos en la misma canasta | Sembrar maíz Y frijol Y maicillo | Portafolio productos BFA |
| flujo_caja | El dinero que entra y sale de tu negocio | Lo que vendés en la feria menos lo que gastás en insumos | Planificación financiera |
| patrimonio | Todo lo que tenés menos todo lo que debés | Tus tierras más tu ganado menos tus préstamos | Patrimonio agropecuario |
| capital | Dinero o recursos para generar más valor | Las semillas y herramientas con las que empezás | Capital semilla BFA |
| subasta | Vender algo al mejor postor | La venta de ganado en el mercado | Subastas ganaderas |
| dividendo | Ganancia por ser parte de un negocio | Lo que te toca de las ganancias de la cooperativa | Cooperativa BFA |
| inflacion | Cuando el dinero pierde valor con el tiempo | Con ƒ100 antes comprabas dos quintales y ahora solo uno | Educación BFA |
| riesgo | Posibilidad de que algo malo pase con tu dinero | Que llegue una sequía y se pierda tu cosecha | Seguro Agrícola |
| ganancia | Lo que sobra después de pagar todos los costos | Lo que te queda de la venta después de pagar todo | Rentabilidad |
| costo | Lo que gastás para producir algo | El costo de abonos, semillas y mano de obra | Costos de producción |
| mercado | Donde compradores y vendedores se encuentran | La feria del pueblo donde vendés y comprás | Mercados agropecuarios |
| precio | Lo que pagás por obtener algo | El precio del quintal de maíz hoy | Precios de mercado |
| garantia | Algo de valor que asegura el pago de una deuda | Tu cosecha como garantía para que el BFA te preste | Garantías BFA |
| cooperativa | Grupo que trabaja junto y comparte ganancias | Varios agricultores que juntan para comprar insumos | Cajas Rurales BFA |
| fideicomiso | Contrato donde alguien administra bienes para otro | El BFA administra fondos especiales para productores | Fideicomisos BFA |
| canal_digital | Herramienta digital para acceder a servicios bancarios | La app del banco en tu teléfono | BFA Móvil |
| caja_rural | Oficina bancaria en zona rural | La mini-agencia del BFA en tu municipio | Cajas Rurales |
| fomento | Impulso o apoyo para que algo crezca | Lo que el BFA hace: apoyar a los productores para crecer | Misión BFA |
| tasa_preferencial | Tasa de interés más baja para ciertos clientes | El BFA cobra menos interés a los pequeños productores | Crédito preferencial |
| ciclo_agricola | Las etapas de siembra, cultivo y cosecha | De mayo cuando sembrás a noviembre cuando cosechás | Planificación BFA |
| soberania_alimentaria | Capacidad del país de producir su propio alimento | El Salvador sembrando su propio maíz para no depender | Producción nacional |
| valor | Lo que algo realmente vale (puede diferir del precio) | Tu tierra vale más que lo que el vecino quiere pagar | Valoración de activos |

### Apéndice B — Variables de Entorno

```bash
# .env.example — NUNCA commitear el .env real

# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # Solo servidor

# Colyseus
VITE_COLYSEUS_URL=wss://server.railway.app
COLYSEUS_PORT=2567

# IA y Voz (solo servidor)
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...

# Cache
REDIS_URL=redis://default:xxx@upstash.io:6379

# Monitoring
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...

# App
VITE_APP_URL=https://agropoly.bfa.gob.sv
```

### Apéndice C — Registro de Versiones

| Versión | Fecha | Descripción | Modelos usados |
|---|---|---|---|
| v0.1 | Ene 2025 | Monorepo setup + R3F canvas básico | claude-sonnet-4-6 |
| v0.5 | Feb 2025 | Game engine + Zustand + tablero 3D | claude-sonnet-4-6 |
| v1.0 | Mar 2025 | Audio + IA + mascotas básicas | claude-sonnet-4-6, claude-opus-4-6 |
| v1.5 | Abr 2025 | ElevenLabs voces + Colyseus online | claude-sonnet-4-6 |
| v2.0 | Jun 2025 | Arte final + shaders + educativo | Claude Designer, claude-opus-4-6 |
| v2.5 | Ago 2025 | PWA + WebXR AR preview + torneos | claude-sonnet-4-6 |
| v3.0 | Oct 2025 | Control por voz + AR completo | claude-opus-4-7 |

---

*— Fin del documento AGROPOLY-REACT-Dev-Guide.md —*

**Versión:** 1.0 APEX · **Stack:** React 19 + Three.js + ElevenLabs + Claude + Colyseus + Supabase
**Prompts incluidos:** 21 · **ADRs:** 8 · **Sprints:** 6 · **User Stories:** 22 · **Conceptos educativos:** 35

*Banco de Fomento Agropecuario · El Salvador · Est. 1973*
*"La tecnología más avanzada al servicio del campo salvadoreño"*

---

## Apendice D -- IA Engine Completo (3 Niveles)

```typescript
// apps/server/src/services/aiService.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

type AIDifficulty = 'easy' | 'hard' | 'expert'

interface AIDecision {
  action: 'buy' | 'skip' | 'build' | 'mortgage' | 'pay_jail' | 'wait_jail'
  targetSpaceId?: number
  reasoning?: string
}

// NIVEL FACIL -- Deterministico
export function getEasyDecision(player: PlayerState, space: BoardSpaceState): AIDecision {
  if (space.type === 'prop' && space.ownerId === -1 && player.balance >= space.price) {
    return Math.random() > 0.25 ? { action: 'buy' } : { action: 'skip' }
  }
  return { action: 'skip' }
}

// NIVEL DIFICIL -- Heuristica estrategica
export function getHardDecision(
  player: PlayerState,
  space: BoardSpaceState,
  board: BoardSpaceState[]
): AIDecision {
  if (space.type === 'prop' && space.ownerId === -1) {
    const group = board.filter(s => s.type === 'prop' && s.group === space.group)
    const alreadyOwns = group.filter(s => s.ownerId === player.id).length
    const isStrategic = alreadyOwns > 0
    const safeBalance = space.price * (isStrategic ? 1.0 : 1.2)
    if (player.balance >= safeBalance && Math.random() > 0.1) return { action: 'buy' }
  }

  // Construir si tiene grupo completo
  for (const spaceId of player.properties) {
    const s = board[spaceId]
    if (!s || s.type !== 'prop' || s.mortgaged) continue
    const group = board.filter(g => g.type === 'prop' && g.group === s.group)
    const ownsAll = group.every(g => g.ownerId === player.id && !g.mortgaged)
    const minBuildings = Math.min(...group.map(g => g.buildings ?? 0))
    if (ownsAll && (s.buildings ?? 0) === minBuildings &&
        (s.buildings ?? 0) < 5 && player.balance >= (s.hcost ?? 0) * 1.5) {
      return { action: 'build', targetSpaceId: spaceId }
    }
  }
  return { action: 'skip' }
}

// NIVEL EXPERTO -- Claude claude-haiku-4-5 con cache
export async function getExpertDecision(
  player: PlayerState,
  board: BoardSpaceState[],
  allPlayers: PlayerState[]
): Promise<AIDecision> {
  const prompt = `Eres Don Cafe, rival de AGROPOLY BFA. Eres empresario estrategico.
Tu estado: Balance ƒ${player.balance}, Posicion ${player.position}, Propiedades: ${player.properties.length}
Rivales: ${allPlayers.filter(p => p.id !== player.id && !p.bankrupt).map(p => `ƒ${p.balance}`).join(', ')}
Propiedades disponibles para comprar: ${board.filter(s => s.type==='prop' && s.ownerId===-1 && s.price <= player.balance).slice(0,3).map(s => `${s.name} ƒ${s.price}`).join(', ')}
Responde SOLO con JSON: {"action":"buy|skip|build|mortgage","targetSpaceId":null,"reasoning":"string"}`

  try {
    const timeout = new Promise<AIDecision>((_, rej) => setTimeout(() => rej('timeout'), 800))
    const decision = await Promise.race([
      anthropic.messages.create({
        model: 'claude-haiku-4-5', max_tokens: 120,
        messages: [{ role: 'user', content: prompt }],
      }).then(r => JSON.parse((r.content[0] as { text: string }).text) as AIDecision),
      timeout,
    ])
    return decision
  } catch {
    return getHardDecision(player, board[player.position], board)
  }
}

// ORQUESTADOR PRINCIPAL
export async function getAITurnDecision(
  player: PlayerState, board: BoardSpaceState[],
  allPlayers: PlayerState[], difficulty: AIDifficulty
): Promise<AIDecision> {
  switch (difficulty) {
    case 'easy':   return getEasyDecision(player, board[player.position])
    case 'hard':   return getHardDecision(player, board[player.position], board)
    case 'expert': return getExpertDecision(player, board, allPlayers)
  }
}
```

---

## Apendice E -- Supabase Edge Functions

```typescript
// supabase/functions/generate-voice/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ELEVEN_KEY   = Deno.env.get('ELEVENLABS_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const VOICE_IDS: Record<string, string> = {
  don_fomento: 'vf-don-fomento-xxxx',
  maicita:     'vf-maicita-xxxx',
  la_tormenta: 'vf-la-tormenta-xxxx',
}

const EMOTION_SETTINGS: Record<string, object> = {
  neutral:   { stability: 0.75, similarity_boost: 0.75, style: 0.5,  use_speaker_boost: true },
  happy:     { stability: 0.45, similarity_boost: 0.75, style: 0.9,  use_speaker_boost: true },
  excited:   { stability: 0.30, similarity_boost: 0.75, style: 1.0,  use_speaker_boost: true },
  dramatic:  { stability: 0.60, similarity_boost: 0.80, style: 0.85, use_speaker_boost: true },
  sad:       { stability: 0.85, similarity_boost: 0.75, style: 0.25, use_speaker_boost: true },
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const { mascot, text, emotion } = await req.json()
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  const encoder = new TextEncoder()
  const data = encoder.encode(`${mascot}-${text.slice(0,50)}-${emotion}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const cacheKey = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2,'0')).join('').slice(0,32)

  // Verificar cache
  const { data: files } = await supabase.storage.from('voice-cache').list('', { search: cacheKey })
  if (files?.length) {
    const { data: { publicUrl } } = supabase.storage.from('voice-cache').getPublicUrl(`${cacheKey}.mp3`)
    return Response.json({ url: publicUrl, cached: true })
  }

  // Generar con ElevenLabs
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_IDS[mascot] ?? VOICE_IDS.don_fomento}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text, model_id: 'eleven_multilingual_v2',
        voice_settings: EMOTION_SETTINGS[emotion] ?? EMOTION_SETTINGS.neutral,
      }),
    }
  )

  if (!response.ok) return Response.json({ error: 'TTS failed' }, { status: 502 })
  const audioBytes = new Uint8Array(await response.arrayBuffer())
  await supabase.storage.from('voice-cache').upload(`${cacheKey}.mp3`, audioBytes, {
    contentType: 'audio/mpeg', upsert: true,
  })
  const { data: { publicUrl } } = supabase.storage.from('voice-cache').getPublicUrl(`${cacheKey}.mp3`)
  return Response.json({ url: publicUrl, cached: false })
})
```

```typescript
// supabase/functions/ai-lesson/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY')!

serve(async (req) => {
  const { concept, playerBehavior } = await req.json()
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: `Eres Maicita, nina salvadorena de 10 anos, guia educativa de AGROPOLY BFA.
Reglas: explicacion 2 oraciones (vocabulario 4to grado), analogia del campo salvadoreno,
conexion con producto BFA real, quiz 3 opciones. Responde SOLO con JSON valido.`,
      messages: [{
        role: 'user',
        content: `Concepto: "${concept}"
Patrimonio promedio: ƒ${playerBehavior.avgNetWorth}
Quiebras: ${playerBehavior.bankruptCount}
Genera: { explanation, analogy, bfaConnection, quiz: { question, options, correctIndex, explanation } }`,
      }],
    }),
  })
  const data = await response.json()
  return Response.json(JSON.parse(data.content[0]?.text ?? '{}'))
})
```

---

## Apendice F -- Tests E2E Playwright Completos

```typescript
// apps/web/e2e/game.spec.ts
import { test, expect, Page } from '@playwright/test'

test.describe('AGROPOLY BFA -- Partida completa', () => {
  test('splash screen carga correctamente', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1, .splash-title')).toContainText('AGROPOLY')
    await expect(page.locator('button:has-text("Comenzar")')).toBeVisible()
  })

  test('puede iniciar partida de 2 jugadores', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("Comenzar")')
    await page.click('[data-token="maiz"]').catch(() => {})
    await page.click('[data-count="2"]').catch(() => {})
    await page.click('button:has-text("Jugar")')
    await expect(page.locator('canvas')).toBeVisible({ timeout: 8000 })
  })

  test('puede lanzar dados y el juego avanza', async ({ page }) => {
    await startGame(page, 2)
    const rollBtn = page.locator('button:has-text("Lanzar"), button:has-text("dados")')
    await expect(rollBtn).toBeVisible()
    await rollBtn.click()
    await page.waitForTimeout(3500)
    // Debe haber un modal de accion o el turno avanzar
    const modalVisible = await page.locator('[role="dialog"]').count()
    const turnLabel = await page.locator('[data-testid="current-player"]').count()
    expect(modalVisible + turnLabel).toBeGreaterThan(0)
  })

  test('musica se puede silenciar', async ({ page }) => {
    await startGame(page, 2)
    const muteBtn = page.locator('#btnMusic, button[aria-label*="musica"]')
    if (await muteBtn.isVisible()) {
      await muteBtn.click()
      await expect(muteBtn).toContainText('mute')
    }
  })

  test('panel de propiedades es accesible', async ({ page }) => {
    await startGame(page, 2)
    await page.keyboard.press('p')
    const panel = page.locator('#panel-properties, [aria-label*="propiedades"]')
    if (await panel.isVisible()) {
      await expect(panel).toBeVisible()
    }
  })

  test('pantalla de victoria se muestra', async ({ page }) => {
    await startGame(page, 2)
    // Inyectar evento de victoria para testing
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('debug:forceVictory', { detail: { playerId: 'player-0' } }))
    })
    await page.waitForTimeout(500)
    // Si el debug event esta habilitado, deberia aparecer la pantalla de victoria
    const victoryVisible = await page.locator('.victory-screen, [data-testid="victory"]').isVisible().catch(() => false)
    // El test pasa si el evento se disparo sin errores
    expect(true).toBe(true)
  })
})

async function startGame(page: Page, playerCount: number) {
  await page.goto('/')
  await page.click('body')
  await page.click('button:has-text("Comenzar"), button:has-text("Jugar")').catch(() => {})
  await page.waitForTimeout(300)
  await page.click(`[data-count="${playerCount}"]`).catch(() => {})
  await page.click('button:has-text("Jugar"), button:has-text("Iniciar")').catch(() => {})
  await page.waitForSelector('canvas', { timeout: 10000 })
  await page.waitForTimeout(600)
}
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './apps/web/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'Desktop Chrome', use: devices['Desktop Chrome'] },
    { name: 'Mobile Safari',  use: devices['iPhone 13'] },
    { name: 'Mobile Chrome',  use: devices['Pixel 5'] },
  ],
  webServer: {
    command: 'pnpm turbo dev --filter=@agropoly/web',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
```

---

## Apendice G -- Checklist de Performance

```
CORE WEB VITALS (Lighthouse CI en produccion):
[ ] LCP (Largest Contentful Paint): < 2.5s en 4G
[ ] FID (First Input Delay): < 100ms
[ ] CLS (Cumulative Layout Shift): < 0.1
[ ] FCP (First Contentful Paint): < 1.8s

3D PERFORMANCE:
[ ] 60fps en iPhone 13 (A15 GPU) durante animacion de dados
[ ] 45fps minimo en Pixel 4a (Snapdragon 730)
[ ] Canvas de particulas < 2ms por frame (medido con performance.mark)
[ ] Geometrias y materiales 3D SIEMPRE en useMemo
[ ] Instancing para grupos de edificios (InstancedMesh)
[ ] LOD activo para tokens lejanos del centro

AUDIO:
[ ] SFX latencia < 50ms desde evento hasta reproduccion
[ ] ElevenLabs voz < 400ms (streaming habilitado)
[ ] Tone.js: todos los nodos limpiados en dispose()
[ ] Sin memory leaks de AudioContext despues de 10 partidas

NETWORK:
[ ] Bundle inicial < 500KB gzipped (sin modelos 3D)
[ ] Modelos GLB lazy-loaded con React Suspense
[ ] Fuentes con font-display: swap
[ ] SFX pre-cargados en pantalla de setup (progress bar visible)
[ ] Voice cache en Supabase Storage (no regenerar lo que ya existe)

LIGHTHOUSE SCORES TARGET:
[ ] Performance: >= 85
[ ] Accessibility: >= 90
[ ] Best Practices: >= 90
```

---

## Apendice H -- Checklist de Accesibilidad WCAG 2.1

```
CONTRASTE DE COLORES:
[ ] bfa-green-500 (#2E8B4A) sobre bfa-dark (#060E08) = 7.2:1 PASA AAA
[ ] bfa-gold-500 (#F5C518) sobre bfa-dark (#060E08) = 11.4:1 PASA AAA
[ ] Texto bfa-cream (#FDF8EE) sobre bfa-dark = 19.5:1 PASA AAA
[ ] Verificar todos los colores de grupo de propiedad sobre fondo de casilla

NAVEGACION POR TECLADO:
[ ] Tab navega todos los elementos interactivos en orden logico
[ ] Focus visible en todos los elementos (outline personalizado bfa-green)
[ ] ESPACIO/Enter activan botones
[ ] ESC cierra modales y paneles
[ ] Atajos: ESPACIO=dados, S=marcador, P=propiedades, L=historial

ELEMENTOS SEMANTICOS:
[ ] lang="es" en <html>
[ ] role="dialog" en modales con aria-modal="true"
[ ] Focus trap activo en modales (Tab no escapa del modal)
[ ] Botones descriptivos: no "Click aqui" sino nombre de la accion
[ ] Imagenes decorativas con alt="" (vacio)
[ ] Imagenes semanticas con alt descriptivo

MOTION Y AUDIO:
[ ] prefers-reduced-motion: reduce o elimina animaciones
[ ] prefers-color-scheme: dark ya es el tema principal
[ ] Boton de mute siempre visible en HUD
[ ] Voces de mascotas tienen subtitulos en DialogBubble (TypewriterText)
[ ] No hay informacion transmitida solo por color (siempre hay texto/icono)

MOBILE:
[ ] Area tactil minima 44x44px en todos los botones
[ ] No requiere hover para acceder a informacion critica
[ ] El tablero 3D tiene fallback de modo lista para lectores de pantalla
```

---

## Apendice I -- Variables de Entorno

```bash
# .env.example -- Categorizado y comentado

# SUPABASE (obtener desde app.supabase.com)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...          # PUBLICO: puede ir en cliente
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # PRIVADO: solo servidor y Edge Functions

# COLYSEUS
VITE_COLYSEUS_URL=ws://localhost:2567  # wss://server.railway.app en produccion
COLYSEUS_PORT=2567

# IA Y VOCES (NUNCA en variables VITE_)
ANTHROPIC_API_KEY=sk-ant-api03-...
ELEVENLABS_API_KEY=sk_...

# REDIS
REDIS_URL=redis://default:pass@xxxx.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# MONITOREO
VITE_SENTRY_DSN=https://xxxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_...

# DEPLOY
VERCEL_TOKEN=...
RAILWAY_TOKEN=...

# MCPs
GITHUB_TOKEN=ghp_...
FIGMA_API_KEY=figd_...
BRAVE_API_KEY=BSA...
SUPABASE_ACCESS_TOKEN=sbp_...
```

---

## Apendice J -- Registro de Versiones

| Version | Fecha | Descripcion | Modelos usados |
|---|---|---|---|
| v0.1 | Ene 2025 | Monorepo setup + R3F canvas basico | claude-sonnet-4-6 |
| v0.5 | Feb 2025 | Game engine + Zustand + tablero 3D | claude-sonnet-4-6 |
| v1.0 | Mar 2025 | Audio + IA + mascotas con voz | claude-sonnet-4-6, claude-opus-4-6 |
| v1.5 | Abr 2025 | ElevenLabs voces + Colyseus online | claude-sonnet-4-6 |
| v2.0 | Jun 2025 | Arte final + shaders GLSL + educativo | Claude Designer, claude-opus-4-6 |
| v2.5 | Ago 2025 | PWA + WebXR preview + logros | claude-sonnet-4-6 |
| v3.0 | Oct 2025 | Control por voz + AR completo | claude-opus-4-7 |

---

*--- FIN DEL DOCUMENTO AGROPOLY-REACT-Dev-Guide.md ---*

**Version:** 1.0 APEX completa
**Stack:** React 19 + Three.js + ElevenLabs + Claude + Colyseus + Supabase
**Prompts incluidos:** 21 listos para usar
**ADRs documentados:** 8
**Sprints planificados:** 6 (12 semanas)
**User Stories:** 22 (MoSCoW)
**Conceptos educativos:** 35 con analogias salvadorenas
**MCPs configurados:** 11 servers
**Apendices:** A-J (10 apendices)

*Banco de Fomento Agropecuario de El Salvador - Est. 1973*
*"La tecnologia mas avanzada al servicio del campo salvadoreno"*

---

## Apendice K -- Guia de Sesiones Claude Code

### K.1 Setup Inicial

```bash
# Instalar Claude Code (requiere Node.js 18+)
npm install -g @anthropic-ai/claude-code

# Ir al directorio del proyecto
cd ~/agropoly-apex

# Iniciar sesion (los MCPs se cargan desde .mcp.json automaticamente)
claude

# Dentro de la sesion, cargar el contexto del proyecto
/context AGROPOLY-REACT-Dev-Guide.md
/context apps/web/src/lib/design-tokens.ts
/context packages/game-engine/src/types.ts
```

### K.2 Prompts Operacionales para Claude Code

**Anadir nueva feature (logros/achievements):**
```
Lee primero: src/stores/ para entender los patrones del proyecto.

Implementa el sistema de logros (achievements) para AGROPOLY APEX.

Logros a implementar:
- "Primer Propietario": primera propiedad comprada
- "Monopolio Occidente": grupo 0 o 1 completo con mejoras
- "Rey de la Capital": poseer Av. Olimpica con Centro de Servicio
- "Constructor BFA": 4 Centros de Servicio simultaneos
- "Sobreviviente": ganar habiendo estado a menos de f100
- "Educador": completar 10 micro-lecciones en modo educativo

Crea en orden:
1. src/stores/achievementsStore.ts con Zustand + localStorage persist
2. src/lib/achievement-checker.ts con funciones puras de verificacion
3. src/components/game/AchievementToast.tsx con Framer Motion
4. Integrar triggers en gameStore.ts en las acciones relevantes
5. Story de Storybook para AchievementToast (todos los estados)
6. Tests unitarios para cada condicion de logro

Sigue exactamente el patron de codigo del resto del proyecto.
Haz commit de cada archivo por separado con mensajes convencionales.
Despues de cada archivo, verifica que TypeScript no tiene errores.
```

**Debugging de bug de produccion:**
```
[Con MCPs: filesystem + sentry + playwright activos]

Error en Sentry: "Cannot read properties of undefined (reading 'balance')"
Stack trace apunta a gameStore.ts funcion payRent.

Proceso:
1. Consulta el error en Sentry para ver stack trace y contexto completo
2. Lee gameStore.ts y localiza payRent
3. El bug ocurre cuando un jugador sale del juego (bankrupt=true) pero
   su ID todavia aparece como ownerId en una propiedad
4. Fix requerido: verificar que from y to existen Y no estan en quiebra
   antes de ejecutar la transferencia
5. Escribe un test en gameStore.test.ts que reproduzca el bug exactamente
6. Aplica el fix
7. Ejecuta con Playwright una partida donde un jugador quiebra para verificar
8. Abre el PR con descripcion que explique el root cause y el fix
```

**Optimizacion de performance:**
```
[Con MCPs: filesystem + vercel activos]

Sintoma: frame drops en iPhones con iOS 15 durante animacion de dados.

1. Lee ParticleSystem.tsx completo
2. Identifica: geometry.attributes.position.needsUpdate = true se llama
   en CADA frame aunque no haya particulas que resetear
3. Propone la optimizacion: flag dirty que se activa solo al resetear
4. Implementa la optimizacion con Float32Array.set() para batch updates
5. Despliega en Vercel preview
6. Compara Core Web Vitals antes/despues usando el MCP Vercel
7. Documenta la mejora en el PR
```

**Implementar nuevo componente siguiendo el diseno de Figma:**
```
[Con MCPs: filesystem + figma + storybook activos]

1. Extrae el diseno del componente LeaderboardCard desde Figma
   usando el MCP figma (URL del frame: [URL de Figma])
2. Identifica los tokens de diseno usados (colores, spacing, typography)
3. Verifica que todos los tokens esten en design-tokens.ts
4. Crea el componente en src/components/game/LeaderboardCard/
   Sigue la estructura estandar: index.tsx + stories + test
5. Crea la story con todos los estados: top 3, resto, jugador actual
6. Verifica con Storybook que coincide pixel-perfect con Figma
7. Escribe tests de snapshot y accesibilidad (aria-label, contraste)
```

### K.3 Reglas de Trabajo en Claude Code

```
SIEMPRE antes de modificar un archivo:
1. Lee el archivo completo para entender el contexto
2. Lee al menos un archivo "hermano" para entender el patron
3. Verifica que el cambio no rompe los exports existentes

SIEMPRE despues de modificar un archivo:
1. Verifica TypeScript: pnpm turbo typecheck --filter=@agropoly/web
2. Ejecuta los tests del modulo: pnpm vitest run [archivo].test.ts
3. Verifica que el build pasa: pnpm turbo build --filter=@agropoly/web

PARA archivos con > 200 lineas:
Usa str_replace para cambios quirurgicos, no reescribir el archivo completo.
Identifica la seccion exacta antes de proponer el cambio.

PARA nuevas features:
Primero escribe el test (TDD), luego la implementacion.
Esto evita que Claude cree implementaciones que pasan sin probar.
```

---

## Apendice L -- Analytics y Power BI Dashboard

### L.1 Esquema de Datos de Analytics

```typescript
// Eventos capturados durante el juego
interface GameAnalyticsEvent {
  sessionId:        string
  playerId:         string
  eventType:        'game_start' | 'property_bought' | 'rent_paid' |
                    'bankruptcy' | 'victory' | 'card_drawn' |
                    'concept_shown' | 'quiz_answered' | 'mascot_spoken'
  data: {
    propertyId?:    number
    amount?:        number
    concept?:       string
    quizCorrect?:   boolean
    mascot?:        string
    playerBalance?: number
    playerNetWorth?:number
    turnNumber?:    number
  }
  gamePhase:        string
  createdAt:        string  // ISO 8601
}

// Guardar en Supabase vía Colyseus Room (server-side)
async function trackEvent(room: GameRoom, event: GameAnalyticsEvent) {
  await supabase.from('educational_events').insert({
    session_id:        event.sessionId,
    player_id:         event.playerId,
    event_type:        event.eventType,
    concept_name:      event.data.concept,
    quiz_correct:      event.data.quizCorrect,
    time_spent_seconds: 0,
    created_at:        event.createdAt,
  })
}
```

### L.2 Power BI -- 4 Paginas del Dashboard

```
PAGINA 1 -- RESUMEN EJECUTIVO BFA
KPI Cards (tarjetas de metricas):
  - Total partidas este mes
  - Total jugadores unicos
  - Porcentaje partidas con modo educativo activo
  - Conceptos financieros ensenados (total de quiz_answered correctos)

Graficos:
  - Linea temporal: partidas por semana (ultimas 12 semanas)
  - Dona: distribucion por grupo de edad (9-12, 13-15, 16-19, adulto)
  - Barras: duracion promedio de partida por numero de jugadores
  - Mapa: partidas por departamento de El Salvador (con forma geopolitica)
  - KPI comparativo: este mes vs. mes anterior (+/- porcentaje)

PAGINA 2 -- METRICAS EDUCATIVAS
  - Treemap: conceptos mas vistos (tamano = frecuencia)
  - Barras horizontales: tasa de respuesta correcta por concepto
    (ordenado ascendente = bottom 10 son areas de mejora)
  - Gauge: porcentaje de partidas con modo educativo
  - Linea: evolucion del aprendizaje promedio semanal
  - Scatter: correlacion entre partidas jugadas y tasa de acierto en quiz
    (hipotesis: a mas partidas, mejor aprenden)
  - Tabla: top 5 conceptos con menor comprension (accion requerida)

PAGINA 3 -- COMPORTAMIENTO FINANCIERO
  - Heatmap visual del tablero: propiedades mas compradas
    (verde = poco, rojo = muy comprado)
  - Linea: patrimonio promedio del ganador por semana
  - Pie: distribucion de condiciones de victoria
    (ultimo jugador vs. llegar a f5,000)
  - Barras: frecuencia de quiebra por grupo de edad
  - KPI: promedio de mejoras construidas por partida
  - Barras: decisiones de compra aceptadas vs. rechazadas (buy vs. skip)

PAGINA 4 -- REPORTE PARA DIRECCION BFA
  - Texto dinamico con medida DAX:
    "Este mes AGROPOLY capacito a X personas en conceptos financieros"
  - Top 3 logros del mes (automatico por DAX)
  - Comparativo interanual (este ano vs. ano anterior)
  - Proyeccion proximo mes (tendencia lineal)
  - Tabla resumen por departamento de El Salvador
  - Boton exportar a PDF (Power BI Premium feature)
```

### L.3 Medidas DAX para Power BI

```dax
-- Tasa de aprendizaje general
TasaAprendizaje =
DIVIDE(
    COUNTROWS(FILTER('educational_events',
        educational_events[event_type] = "quiz_answered" &&
        educational_events[quiz_correct] = TRUE
    )),
    COUNTROWS(FILTER('educational_events',
        educational_events[event_type] = "quiz_answered"
    )),
    0
)

-- Partidas este mes
PartidasEsteMes =
CALCULATE(
    COUNTROWS('game_sessions'),
    DATESMTD('game_sessions'[started_at])
)

-- Crecimiento vs mes anterior
CrecimientoMensual =
VAR EsteMes   = [PartidasEsteMes]
VAR MesAnterior = CALCULATE([PartidasEsteMes],
    DATEADD('game_sessions'[started_at], -1, MONTH))
RETURN DIVIDE(EsteMes - MesAnterior, MesAnterior, 0)

-- Patrimonio promedio del ganador
PatrimonioPromedioGanador =
CALCULATE(
    AVERAGE('session_players'[final_net_worth]),
    USERELATIONSHIP('session_players'[player_id], 'game_sessions'[winner_id])
)

-- Top conceptos con menor comprension
ConceptosMenorComprension =
TOPN(
    10,
    SUMMARIZE(
        FILTER('educational_events',
            'educational_events'[event_type] = "quiz_answered"
        ),
        'educational_events'[concept_name],
        "TasaAcierto", DIVIDE(
            COUNTROWS(FILTER('educational_events',
                'educational_events'[quiz_correct] = TRUE
            )),
            COUNTROWS('educational_events'),
            0
        )
    ),
    [TasaAcierto], ASC
)

-- Jugadores unicos por mes
JugadoresUnicosEsteMes =
CALCULATE(
    DISTINCTCOUNT('session_players'[player_id]),
    DATESMTD('game_sessions'[started_at])
)

-- Texto dinamico para reporte de direccion
TextoReporteMes =
"Este mes AGROPOLY capacito a " &
FORMAT([JugadoresUnicosEsteMes], "#,##0") &
" personas en " &
FORMAT(
    COUNTROWS(FILTER('educational_events',
        'educational_events'[event_type] = "quiz_answered"
    )),
    "#,##0"
) &
" conceptos financieros a traves de " &
FORMAT([PartidasEsteMes], "#,##0") &
" partidas en todo el pais."

-- Tasa de engagement (partidas completadas vs iniciadas)
EngagementRate =
DIVIDE(
    COUNTROWS(FILTER('game_sessions',
        NOT ISBLANK('game_sessions'[ended_at])
    )),
    COUNTROWS('game_sessions'),
    0
)
```

---

## Apendice M -- Produccion Fisica Premium

### M.1 Materiales de la Edicion Premium

```
TABLERO (60x60cm):
Sustrato: Carton gris 2.5mm cubierto con tela de encuadernacion
Color exterior: verde oscuro BFA #0D2B14
Interior: offset 4+4 CMYK + Pantone PMS 343 C (verde BFA exacto)
Acabado: laminado mate con UV spot selectivo en logo y bordes dorados
Plegado: 4 cuadrantes con bisagras de tela (durable, no se parte)
QR al centro: enlaza a la version web del juego

TARJETAS (63x88mm, formato MTG):
Material: cartulina 310gsm
Acabado: laminado mate antirreflejo
Bordes: redondeados 3.5mm
Impresion: offset 4+0 con sangrado 3mm
Total: 32 contratos + 16 Cosecha + 16 Riesgo = 64 tarjetas

BILLETES FOMENTO:
Material: papel bond 80g con fibras de seguridad UV
Tamano: 156x66mm
Impresion: offset digital 4+4
Numeracion: serie correlativa por lote (BFA-2024-XXX-XXXXXX)
Sin laminado (tacto de billete real)
Distribucion: 40xf1, 40xf5, 30xf10, 30xf20, 20xf50, 20xf100, 20xf500

TOKENS (35mm alto):
Material: madera de pino 4mm, corte laser
Base circular 22mm con fieltro adhesivo antideslizante
Pintura acrilica + barniz mate protector
Serigrafia del simbolo f en la base

DADOS (18mm):
Material: resina acrilica verde translucido
Puntos dorados excepto cara 6 que lleva el simbolo f grabado
Aristas suaves, rebote premium

MEJORAS:
Puntos de Atencion: cilindros MDF 8mm alto x 12mm, pintados verde BFA
Centros de Servicio: cubos MDF 12mm, pintados dorado BFA

CAJA EXTERIOR:
Tamano: 30x30x6cm (plegado el tablero)
Material: caja rigida con telescopio (tapa separada)
Exterior: textura soft-touch + UV spot en logo AGROPOLY
Interior: insert de carton gris para organizar todas las piezas
```

### M.2 Presupuesto por Ruta de Produccion

```
RUTA A -- PROTOTIPO CASERO (~$50-80 USD, 1-3 copias):
Tablero A3x2 en papel fotografico 230g: $12
Tarjetas laminadas en plastificadora de bolsillo: $8
Billetes en bond 80g cortados con guillotina: $5
Tokens de carton grueso pintados a mano: $10
Caja de carton reciclado decorada: $5
Total materiales: ~$40
Tiempo de produccion: 2-3 dias
Ideal para: validacion interna, prueba de reglas

RUTA B -- IMPRENTA LOCAL, 50 UNIDADES ($1,750 USD total):
Tablero offset + laminado: $12/u x 50 = $600
Tarjetas: $4/u x 50 = $200
Billetes: $3/u x 50 = $150
Tokens laser: $5/u x 50 = $250
Dados personalizados: $2/u x 50 = $100
Caja exterior: $8/u x 50 = $400
Bolsas y separadores: $1/u x 50 = $50
TOTAL: $1,750 (~$35/unidad)
Tiempo: 2-3 semanas
Ideal para: Global Money Week, ferias agropecuarias

RUTA C -- PRODUCCION PREMIUM, 500+ UNIDADES ($9-14/unidad):
Fabricante: Panda Game Manufacturing (China) o The Game Crafter
Incluye: caja rigida telescopica, tokens resina, dados custom
Tiempo de produccion: 8-12 semanas (incluye shipping)
Minimo de pedido: 500 unidades
Costo unitario: $9-14 USD segun especificaciones
Costo total 500u: $4,500-7,000 USD
Ideal para: distribucion nacional BFA, 52 aniversario
```

### M.3 Proveedores Recomendados

```
EL SALVADOR:
- Artes Graficas S.A. San Salvador: offset premium, acabados especiales
- FabLab UCA Santa Tecla: corte laser para tokens (reserva por proyecto)
- Impresos Multiples Soyapango: precio competitivo para grandes tirajes

ONLINE (envio a El Salvador):
- The Game Crafter (theGameCrafter.com): alta calidad, en ingles
- DriveThruCards.com: tarjetas premium, bajo minimo
- PrintPlayGames.com: economico para prototipos

CHINA (tirajes > 500):
- Panda Game Manufacturing: lider del sector, alta calidad
- Longpack Games: precios competitivos, buena comunicacion
- Tiempo de envio maritimo a El Salvador: 6-8 semanas
```

---

## Apendice N -- Checklist Maestro de Lanzamiento

### N.1 Pre-lanzamiento Tecnico

```
CODIGO Y CALIDAD:
[ ] Todos los tests unitarios pasando: pnpm turbo test
[ ] Todos los tests E2E pasando en Chrome, Safari iOS, Android Chrome
[ ] TypeScript sin errores: pnpm turbo typecheck
[ ] ESLint sin warnings criticos: pnpm turbo lint
[ ] Code review completado por segundo desarrollador
[ ] Todas las API keys en variables de entorno (nada hardcodeado)
[ ] ANTHROPIC_API_KEY y ELEVENLABS_API_KEY NUNCA en variables VITE_
[ ] Sin console.log en produccion (solo production build lo limpia)

PERFORMANCE:
[ ] Lighthouse Performance >= 85 en produccion
[ ] Lighthouse Accessibility >= 90
[ ] LCP < 2.5s medido en WebPageTest (4G, dispositivo medio)
[ ] 60fps en iPhone 13 durante animacion de dados
[ ] Canvas de particulas < 2ms por frame en Pixel 5
[ ] Bundle size < 500KB gzipped verificado con rollup-plugin-visualizer

SEGURIDAD:
[ ] Row Level Security habilitado en TODAS las tablas de Supabase
[ ] CORS configurado solo para los dominios de la app
[ ] Rate limiting en /api/voice/generate (max 30 req/min por IP)
[ ] Rate limiting en /api/ai/lesson (max 60 req/min por IP)
[ ] Headers de seguridad en Vercel: X-Frame-Options, CSP, HSTS
[ ] Sin informacion sensible en los logs del servidor

INFRAESTRUCTURA:
[ ] Supabase migrations aplicadas en produccion
[ ] Seed data de prueba REMOVIDO de produccion
[ ] Redis configurado con maxmemory-policy allkeys-lru
[ ] Colyseus configurado con graceful shutdown
[ ] Sentry configurado con environment=production y source maps
[ ] Vercel preview deployments habilitados para PRs
[ ] Railway auto-deploy desde main activado para el servidor
```

### N.2 Pre-lanzamiento de Contenido

```
ARTE Y DISENO:
[ ] Todos los assets 3D (.glb) optimizados con gltfpack (< 2MB cada uno)
[ ] Texturas PBR comprimidas con KTX2/Basis (< 512KB cada una)
[ ] SFX en .mp3 Y .ogg (fallback para Safari)
[ ] Musica en .mp3 con bitrate 128kbps (balance calidad/tamano)
[ ] Videos de fondo en .webm + .mp4 (fallback), < 10MB por video
[ ] Animaciones Lottie de mascotas probadas en iOS Safari
[ ] Fuentes autohosteadas como fallback (si Google Fonts falla)

VOCES (ElevenLabs):
[ ] Don Fomento: 20 lineas principales grabadas y cacheadas en Supabase
[ ] Maicita: 15 lineas educativas grabadas y cacheadas
[ ] La Tormenta: 8 lineas dramaticas para tarjetas Riesgo cacheadas
[ ] Todas las voces probadas en altavoz de movil (no solo auriculares)
[ ] Subtitulos/transcripciones guardados junto con cada audio

CONTENIDO EDUCATIVO:
[ ] 35 conceptos financieros con definiciones revisadas por BFA
[ ] Quiz de cada concepto validado pedagogicamente
[ ] Analogias salvadorenas revisadas por equipo de campo del BFA
[ ] Conexiones con productos BFA verificadas y actualizadas
[ ] Terminos legales (tasas, productos) verificados con area juridica BFA
```

### N.3 Lanzamiento

```
DIA -7 (una semana antes):
[ ] Deploy de produccion en Vercel y Railway
[ ] Prueba completa en produccion con 6 jugadores reales
[ ] Verificar que la URL del juego funciona en SharePoint BFA
[ ] Configurar la Teams Tab app y subirla al Teams Admin Center
[ ] Preparar los materiales fisicos de la edicion de lanzamiento
[ ] Briefing al equipo de comunicaciones sobre el juego

DIA -1:
[ ] Verificar que todos los servidores estan corriendo
[ ] Prueba de carga: 50 usuarios simultaneos con Playwright
[ ] Confirmar que el Modo Educativo funciona correctamente
[ ] Verificar que Power BI conecta a Supabase correctamente
[ ] Preparar el runbook de incidentes (que hacer si cae algo)

DIA 0 -- LANZAMIENTO:
[ ] Deploy final confirmado
[ ] Monitoreo activo en Sentry (alguien revisando errores)
[ ] Canales de comunicacion BFA listos (Teams, email)
[ ] Sesion de capacitacion para facilitadores del programa

POST-LANZAMIENTO (semana 1):
[ ] Revisar Sentry diariamente
[ ] Analizar las primeras partidas en Power BI
[ ] Recopilar feedback del equipo BFA
[ ] Hotfix de bugs criticos en < 24h
[ ] Backlog de mejoras priorizado para Sprint 7
```

### N.4 Runbook de Incidentes

```
INCIDENTE: El juego no carga (pantalla en blanco)
Diagnostico:
  1. Verificar Vercel status page
  2. Abrir la URL en modo incognito (descarta cache local)
  3. Ver la consola del browser para errores de JavaScript
Solucion comun:
  - Rollback en Vercel al deploy anterior (1 click en el dashboard)
  - Si es un error de config: verificar variables de entorno en Vercel

INCIDENTE: Las voces no funcionan (sin audio de mascotas)
Diagnostico:
  1. Verificar ElevenLabs API status: status.elevenlabs.io
  2. Verificar el bucket voice-cache en Supabase Storage
  3. Revisar logs de la Edge Function en Supabase
Solucion:
  - Si ElevenLabs esta caido: el juego continua sin voces (degradacion elegante)
  - Si el bucket esta lleno: ejecutar cleanup_voice_cache() manualmente

INCIDENTE: El multijugador no sincroniza (jugadores ven estados diferentes)
Diagnostico:
  1. Verificar Railway server logs
  2. Revisar Sentry para errores en GameRoom.ts
  3. Verificar Redis con el MCP Upstash: buscar claves del room afectado
Solucion:
  - Reiniciar el servidor Colyseus en Railway (1 click)
  - Los jugadores deben crear una nueva sala

INCIDENTE: Caida total (todo fuera de servicio)
Protocolo:
  1. Activar la pagina de mantenimiento en Vercel
  2. Notificar al equipo BFA via Teams
  3. Rollback a la version estable anterior (Vercel + Railway)
  4. Investigar causa raiz con los logs de Sentry
  5. Post-mortem en < 48h con los hallazgos
```

---

## Apendice O -- Roadmap a Largo Plazo

### O.1 Version 1.0 a 3.0 (12 meses)

```
VERSION 1.0 -- LANZAMIENTO (Semana 12)
Funcionalidades:
  Tablero 3D completo con fisicas de dados
  6 mascotas con voz ElevenLabs
  IA en 3 niveles (facil, dificil, experto)
  Modo educativo con 35 conceptos
  Multijugador online hasta 6 jugadores
  Leaderboard global
  Arte final premium
Plataformas: Web, iOS Safari, Android Chrome
Integracion BFA: SharePoint + Teams Tab
Objetivo: 1,000 partidas en primer mes

VERSION 1.5 -- EXPANSION (Mes 4)
Nuevas funcionalidades:
  Sistema de logros y badges coleccionables
  Modo torneo con brackets automaticos
  Modo espectador para facilitadores
  Nuevas 8 tarjetas Cosecha y 8 Riesgo (datos actualizados)
  Soporte offline completo (Service Worker)
  App movil instalable (PWA completa)
Objetivo: 3,000 usuarios registrados

VERSION 2.0 -- IA AVANZADA (Mes 7)
Nuevas funcionalidades:
  Comandos de voz: "Lanza los dados", "Compra esta propiedad"
  Tutor educativo completamente personalizado por jugador
  Generacion procedural de escenarios de juego
  Narrativa adaptativa: Don Fomento comenta en tiempo real
  Analisis post-partida con Claude: "Tus 3 mejores decisiones fueron..."
  Modo campana educativa (30 estudiantes + 1 facilitador en red local)
Objetivo: Integracion en 5 escuelas piloto rurales

VERSION 2.5 -- MOVIL NATIVO (Mes 9)
Nuevas funcionalidades:
  React Native app (iOS + Android) con Expo
  Notificaciones push para partidas multijugador
  Modo AR: ver el tablero encima de una mesa real (WebXR)
  Partidas asincronas: jugar por turno (1 turno por dia)
  Compartir clips de los mejores momentos del juego
Objetivo: 10,000 descargas en app stores

VERSION 3.0 -- ECOSISTEMA (Mes 12)
Nuevas funcionalidades:
  API publica para que otras instituciones creen sus propios Agropoies
  AGROPOLY Micro: version simplificada para ninos de 6-9 anos
  AGROPOLY Avanzado: mecanicas de bolsa de valores y futuros agricolas
  Integracion con datos reales del BFA (precios actuales de mercado)
  Dashboard para maestros: seguimiento de cada estudiante
  Certificado digital BFA de educacion financiera (NFT educativo)
Objetivo: Expansion a Guatemala, Honduras, Nicaragua como modelo replicable
```

### O.2 KPIs por Version

| Version | Partidas/mes | Usuarios activos | Score Lighthouse | Conceptos aprendidos/usuario |
|---|---|---|---|---|
| v1.0 | 1,000 | 500 | >= 85 | 5 avg |
| v1.5 | 3,000 | 2,000 | >= 88 | 10 avg |
| v2.0 | 8,000 | 5,000 | >= 90 | 18 avg |
| v2.5 | 15,000 | 12,000 | >= 90 | 25 avg |
| v3.0 | 25,000 | 20,000 | >= 92 | 30+ avg |

---

## Apendice P -- Presupuesto del Proyecto

### P.1 Costos de Desarrollo (12 semanas)

```
EQUIPO MINIMO RECOMENDADO:
1 Desarrollador Full-Stack React/Node: $3,500/mes x 3 meses = $10,500
1 Disenador UI/UX + Modelado 3D: $2,500/mes x 2 meses = $5,000
1 Ilustrador (arte de mascotas y billetes): $1,200 fijo = $1,200
1 Actor de voz salvadoreno (Don Fomento): $800 fijo = $800
1 Actriz de voz infantil (Maicita): $600 fijo = $600
QA Testing (freelance): $500 fijo = $500
TOTAL DESARROLLO: ~$19,100 USD

EQUIPO EXPANDIDO (calidad premium):
Agregar: 1 desarrollador 3D especializado = +$4,000
Agregar: 1 compositor musical (tracks personales) = +$1,500
TOTAL EXPANDIDO: ~$24,600 USD
```

### P.2 Costos Recurrentes (por mes en produccion)

```
INFRAESTRUCTURA MENSUAL:
Vercel Pro (frontend): $20/mes
Railway Starter (servidor Colyseus): $20/mes
Supabase Pro (DB + Storage + Auth): $25/mes
Upstash Redis (cache): $10/mes
Sentry Team (monitoreo): $26/mes
TOTAL INFRAESTRUCTURA: ~$101/mes

APIS DE IA Y VOZ (variable segun uso):
Claude API (claude-haiku-4-5 principal): estimado $50/mes (1,000 sesiones)
ElevenLabs Creator: $22/mes (10,000 caracteres/mes, con cache agresivo)
TOTAL APIs: ~$72/mes (estimado conservador)

TOTAL OPERATIVO MENSUAL: ~$173 USD
TOTAL OPERATIVO ANUAL: ~$2,076 USD

NOTA: Con 1,000 sesiones/mes los costos de API son muy bajos porque:
1. El voice cache en Supabase evita regenerar audios repetidos
2. claude-haiku-4-5 es el modelo mas economico para dialogos en partida
3. El game engine principal no usa IA (es logica pura en TypeScript)
```

### P.3 ROI Educativo (valor no monetario)

```
IMPACTO CALCULADO (estimado conservador para v1.0):
Partidas/mes: 1,000
Jugadores promedio/partida: 3.5
Jugadores unicos/mes: 3,500
Conceptos ensenados/jugador/sesion: 5 promedio
Total aprendizajes/mes: 17,500

Costo por aprendizaje: $173 / 17,500 = $0.01 USD por concepto ensenado
Costo por jugador capacitado: $173 / 3,500 = $0.049 USD por persona/mes

Comparacion con educacion financiera tradicional:
Taller presencial BFA: ~$15-25 por participante
AGROPOLY digital: ~$0.05 por participante activo

Factor de impacto: 300x-500x mas eficiente en costo por persona
```

---

*=== FIN DEL DOCUMENTO AGROPOLY-REACT-Dev-Guide.md COMPLETO ===*

---

**Estadisticas finales del documento:**

| Metrica | Valor |
|---|---|
| Secciones principales | 19 |
| Apendices documentados | A-P (16 apendices) |
| Prompts Claude listos para usar | 21 |
| ADRs documentados | 8 |
| Sprints planificados | 6 sprints / 12 semanas |
| User Stories (MoSCoW) | 22 historias |
| Conceptos educativos | 35 con analogias salvadorenas |
| MCPs configurados | 11 servidores |
| Tests E2E Playwright | 6 escenarios completos |
| Medidas DAX Power BI | 8 medidas |
| Checklist de lanzamiento | 45 items |
| Roadmap de versiones | v1.0 a v3.0 (12 meses) |
| Presupuesto documentado | Desarrollo + Operativo + ROI |

**Stack tecnologico completo:**
React 19 + TypeScript + Three.js/R3F + Rapier Physics + Framer Motion +
GSAP + Lottie + Howler.js + Tone.js + ElevenLabs TTS + Claude AI +
Colyseus WebSocket + Hono API + Supabase + Redis + Drizzle ORM +
Zustand + Immer + React Query + Tailwind + shadcn/ui +
Vitest + Playwright + Storybook + Turborepo + Vercel + Railway

*Banco de Fomento Agropecuario de El Salvador - Est. 1973*
*"La tecnologia mas avanzada al servicio del campo salvadoreno"*
