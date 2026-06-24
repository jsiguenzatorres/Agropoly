# AGROPOLY BFA — Architecture Decision Records (ADRs)
> Registro consolidado de todas las decisiones arquitectónicas.
> Versión HTML (ADR-001 a ADR-007) + Versión APEX React (ADR-R001 a ADR-R008)

---

## Versión HTML — AGROPOLY BFA

---

### ADR-001: Single-File HTML sin Build Step

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Versión HTML

**Contexto:**
BFA tiene restricciones de IT estrictas — sin npm, sin instalaciones externas, Trellix monitoring activo en PCs corporativos.

**Decisión:**
Todo el juego (HTML + CSS + JS + assets inline) en un único archivo `.html`. ~130KB total.

**Consecuencias:**
- ✅ Zero deployment: abrir en cualquier navegador moderno
- ✅ Compatible con SharePoint, Teams, OneDrive
- ✅ Sin dependencias de red en runtime
- ✅ Portable: email, USB, cualquier medio
- ⚠️ Archivo ~130KB (aceptable, sin imágenes pesadas)
- ⚠️ Fonts requieren conexión (Google Fonts CDN, con fallback)

**Alternativa rechazada:** React + Vite build — requiere npm y servidor Node.

---

### ADR-002: Web Audio API para Música Generativa (sin MP3)

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Versión HTML

**Contexto:**
No se pueden incluir archivos MP3/OGG en el HTML sin base64 encoding — añadiría ~2MB prohibitivos al archivo.

**Decisión:**
Música 100% generativa usando Web Audio API — osciladores, filtros y envolventes en JavaScript puro.

**Implementación:**
```
- Drone bajo:     3 osciladores síncronos (65Hz, 98Hz, 131Hz)
- Melodía:        arpegio pentatónico aleatorio (Do-Re-Mi-Sol-La)
- Contramelodia:  oscilador triangle en registro medio (1 nota / 1–3s)
- Percusión:      buffer noise sintético tipo marimba (cada 1.5–2s)
- Reverb:         ConvolverNode simulado con delay + feedback (tail 2s)
- Tempo:          72 BPM — tranquilo pero no aburrido
- Volumen:        0.04 master (ambiente suave)
```

**Consecuencias:**
- ✅ 0 bytes extra en el archivo para música
- ✅ Infinitamente variada (nunca se repite exactamente)
- ✅ Latencia cero (no carga archivos)
- ⚠️ Requiere gesto del usuario para iniciar (política de navegadores)
- ⚠️ Calidad ambiente, no CD-audio

**Alternativa rechazada:** Base64 MP3 — añadiría ~2MB al archivo.

---

### ADR-003: Canvas 2D para Tablero (NO WebGL)

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Versión HTML

**Contexto:**
El tablero necesita ser renderizable en iOS Safari 15+, Android Chrome, y browsers corporativos del BFA.

**Decisión:**
CSS Grid para el tablero base + Canvas 2D para efectos de animación (tokens, partículas).

**Consecuencias:**
- ✅ Soporte universal (iOS 12+, Android 5+)
- ✅ Performance aceptable en hardware modesto
- ✅ Sin dependencias adicionales
- ⚠️ Sin efectos 3D nativos — simulados con CSS transform3d y perspectiva

**Alternativa rechazada:** WebGL/Three.js — sin soporte en algunos browsers corporativos; añade 700KB.

---

### ADR-004: IA Determinística con Perfil de Personalidad

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Versión HTML

**Contexto:**
La IA debe ser educativa y no frustrante para niños. Sin latencia de red.

**Decisión:**
Dos perfiles de IA con reglas determinísticas:

```javascript
// FÁCIL
aiDecideBuy: balance >= precio && Math.random() < 0.75
aiManageProperties: build si balance >= hcost * 2 y grupo completo

// DIFÍCIL
aiDecideBuy: balance >= precio * 1.2 && tiene valor estratégico (90%)
aiManageProperties: prioriza grupos con más propiedades rivales
```

**Consecuencias:**
- ✅ Comportamiento predecible y educativo
- ✅ Sin latencia de red
- ✅ Apropiado para edades 9–19 años
- ⚠️ No aprende de partidas anteriores

**Alternativa rechazada:** LLM en runtime (Claude API) — requiere API key, latencia de red, costo variable.

---

### ADR-005: Máquina de Estados Finita para Turnos

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Ambas versiones

**Contexto:**
El flujo del juego es complejo (dados, movimiento, acción en casilla, modales, efectos).

**Decisión:**
```
Estados: setup → roll → action → end

Transiciones:
  setup  → roll    : startGame()
  roll   → action  : processRoll()
  action → roll    : finishAction(doubles=true)
  action → roll    : advanceTurn()
  roll   → end     : declareWinner()
```

**Consecuencias:**
- ✅ Un jugador activo a la vez, siempre
- ✅ No hay modales que se apilan
- ✅ Estado predecible en debugging
- ✅ Fácil de serializar para multijugador (APEX)

---

### ADR-006: Diseño Mobile-First, Desktop-Enhanced

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Ambas versiones

**Decisión:**
```css
/* Mobile base: < 768px — layout vertical, tablero centrado */
--board-size: min(96vw, 96vh, 620px);

/* Desktop: ≥ 768px — grid 2 columnas, panel lateral */
@media (min-width: 768px) {
  #screen-game { grid-template-columns: 260px 1fr; }
}
```

**Target mínimo:** iPhone SE (320px ancho). Botones: área táctil ≥ 44×44px.

---

### ADR-007: Persistencia en Memoria (sin localStorage)

**Fecha:** Enero 2025 | **Estado:** ✅ Aprobado | **Aplicación:** Versión HTML

**Contexto:**
Algunos entornos corporativos BFA bloquean localStorage.

**Decisión:**
Estado del juego 100% en memoria RAM (objeto `G`). No hay persistencia entre sesiones. Las partidas duran 60–120 minutos en una sesión continua.

**Consecuencias:**
- ✅ Funciona en todos los entornos corporativos
- ✅ Sin datos persistentes = sin privacidad concerns
- ⚠️ Recargar la página pierde la partida (documentado en reglas)

---

---

## Versión APEX — AGROPOLY APEX (React Full Stack)

---

### ADR-R001: Monorepo Turborepo + pnpm

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
Turborepo con pnpm workspaces para builds incrementales.

```bash
pnpm turbo build   # Build con cache — solo rebuild lo que cambió
pnpm turbo dev     # Dev mode: web + server + packages en paralelo
pnpm turbo test    # Tests en paralelo con caché de resultados
```

**Motivo:**
El package `game-engine` se comparte entre el frontend React y el servidor Colyseus. Sin monorepo habría duplicación de lógica crítica del juego.

```
agropoly-apex/
├── apps/web/        ← React 19 + Vite 5 + TypeScript
├── apps/server/     ← Colyseus 0.15 + Hono 4
├── packages/
│   ├── game-engine/ ← Lógica compartida (zero deps)
│   └── shared-types/
```

---

### ADR-R002: React Three Fiber sobre Three.js Puro

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
R3F como capa declarativa sobre Three.js para 3D reactivo.

```tsx
// El estado del juego (Zustand) impulsa directamente la escena 3D
function BoardCell({ space, isActive }) {
  return (
    <mesh>
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

**Motivo:**
Three.js puro requiere sincronización manual del estado con la escena 3D en cada frame. R3F hace ese binding automáticamente a través del reconciler de React.

---

### ADR-R003: Colyseus 0.15 para Multijugador

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
Colyseus con schema-based state sync (delta compression automático).

```typescript
class PlayerState extends Schema {
  @type('number') balance = 1500  // Si solo este cambia → se envía SOLO este byte
  @type('number') position = 0
}
```

**Motivo:**
Latencia < 50ms en internet promedio. Socket.io puro requeriría sincronización manual del estado entero en cada cambio. Colyseus envía solo los deltas.

---

### ADR-R004: ElevenLabs sobre AWS Polly / Google TTS

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
ElevenLabs con modelos de voz clonados de actores salvadoreños reales.

```typescript
await elevenlabs.generate({
  voice: VOICE_IDS.don_fomento,
  text: "¡Vaya pues! Compraste la Av. Olímpica. ¡Eso sí es pensar en grande!",
  model_id: 'eleven_multilingual_v2',
  voice_settings: { stability: 0.5, style: 0.9, use_speaker_boost: true }
})
```

**Motivo:**
ElevenLabs ofrece calidad humana real con emociones naturales y soporte para el acento salvadoreño específico. AWS Polly suena artificial. Google TTS no soporta dialectos centroamericanos con fidelidad suficiente.

**Caché:** `voice-cache` bucket en Supabase Storage + Redis (TTL 7 días).

---

### ADR-R005: Zustand + Immer (no Redux)

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
Zustand con middleware Immer para mutaciones.

```typescript
const useGameStore = create<GameState>()(immer((set) => ({
  buyProperty: (playerId, spaceId) => set(state => {
    const player = state.players.find(p => p.id === playerId)!
    player.balance -= state.board[spaceId].price
    state.board[spaceId].ownerId = playerId
    player.properties.push(spaceId)
  }),
})))
```

**Motivo:**
Redux añadiría 5x más código (actions, reducers, selectors, slices) sin beneficio de performance. Zustand + Immer logra el mismo resultado con sintaxis directa y sin boilerplate.

**Regla obligatoria:** Usar SIEMPRE selector específico:
```typescript
✅ const balance = useGameStore(s => s.players[0]?.balance ?? 0)
❌ const state = useGameStore()   // re-render en CUALQUIER cambio del store
```

---

### ADR-R006: Rapier WASM para Física de Dados

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
@react-three/rapier para dados y tokens con física real de WebAssembly.

```tsx
<RigidBody restitution={0.6} friction={0.8}>
  <DiceMesh />
  {/* El dado rebota físicamente en el tablero antes de mostrar el resultado */}
</RigidBody>
```

**Motivo:**
Los dados que rebotan físicamente crean el momento de mayor tensión del juego. Es el elemento que más comentan los usuarios en testing. CSS 3D no puede replicar este nivel de credibilidad física.

---

### ADR-R007: Supabase como BaaS Principal

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
Supabase = PostgreSQL + Realtime + Auth + Storage + Edge Functions.

**Motivo:**
Stack completo sin gestionar infraestructura propia. Las Edge Functions de Supabase protegen las API keys de ElevenLabs y Claude del lado del cliente — NUNCA exponer `ANTHROPIC_API_KEY` o `ELEVENLABS_KEY` en variables `VITE_` del cliente.

**Seguridad obligatoria:**
- RLS (Row Level Security) activado en TODAS las tablas
- `service_role` key SOLO en servidor (Edge Functions, Colyseus)
- `anon` key para lecturas públicas autorizadas por RLS

---

### ADR-R008: Tone.js para Música Generativa Adaptativa

**Fecha:** 2025 | **Estado:** ✅ Aprobado | **Aplicación:** APEX

**Decisión:**
Tone.js para pistas musicales que cambian según el estado del juego.

```typescript
type GamePhase = 'lobby' | 'playing' | 'tension' | 'victory' | 'bankrupt'
await musicEngine.setPhase('tension')  // crossfade automático de 2 segundos
```

**Motivo:**
La música necesita cambiar gradualmente según el estado del juego sin cortes audibles. Los archivos MP3 con crossfade tienen latencia notable. Tone.js puede hacer transiciones perfectas en tiempo real porque controla cada nota individualmente.

**5 tracks:**
- `lobby/playing` — marimba pentatónica centroamericana, 72 BPM, reverb grande
- `tension` — strings sawtooth con PingPongDelay, progresión Am-Gm-Fm
- `victory` — melodía Do Mayor 12 notas con PolySynth
- `bankrupt` — escala cromática descendente triste

---

## Registro de Cambios

| Fecha | ADR | Cambio |
|---|---|---|
| Jun 2025 | ADR-L (nuevo) | Dashboard Analytics migrado de Power BI a shadcn/ui Charts + Apache ECharts |
| Jun 2025 | ADR-M (nuevo) | La Vaquita BFA añadida como 6ª mascota oficial |

---

*Documento: AGROPOLY_ADRs.md · BFA Auditoría Interna · El Salvador · 2025*
