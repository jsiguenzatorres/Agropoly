# AGROPOLY BFA — Contexto Maestro de Desarrollo
> Adjuntar este archivo a CADA sesión Claude para máxima coherencia.
> Versión: 2.1 | Junio 2025 | BFA Auditoría Interna / Área de Innovación

---

## 1. Proyecto

**AGROPOLY BFA** es el juego de mesa estratégico digital y físico del **Banco de Fomento Agropecuario de El Salvador**. Adapta la mecánica clásica del Monopoly al universo agropecuario salvadoreño con:

- 40 casillas representando agencias, servicios y geografía de El Salvador
- Sistema monetario propio: **Fomentos (ƒ)**
- 6 mascotas con voz IA (ElevenLabs) y personalidad definida
- Motor educativo de conceptos financieros para jóvenes 9–19 años
- Compatibilidad web + móvil + PWA

---

## 2. Dos Versiones del Proyecto

### Versión HTML — AGROPOLY BFA (Producción Interna)
| Campo | Valor |
|---|---|
| Archivo | `AGROPOLY-BFA-GAME.html` — single file sin build step |
| Stack | HTML5 · CSS3 · JavaScript ES6 vanilla · Web Audio API · Canvas 2D |
| Restricciones | Sin npm, sin Node.js, sin localStorage, sin API keys en frontend |
| Compatibilidad | Chrome/Edge corporativo 90+ · iOS Safari 15+ · Android Chrome 90+ |
| Guía | `AGROPOLY-BFA-Dev-Guide.md` |
| Restricción crítica | Sin WebGL (browsers corporativos BFA) — 3D simulado con CSS + Canvas 2D |

### Versión APEX — AGROPOLY APEX (Full Stack)
| Campo | Valor |
|---|---|
| Repositorio | `agropoly-apex/` — monorepo Turborepo + pnpm |
| Frontend | React 19 · TypeScript strict · Vite 5 · R3F/Three.js · Framer Motion · GSAP |
| 3D | @react-three/fiber · @react-three/rapier (física WASM) · @react-three/postprocessing |
| Audio | Howler.js (SFX preloadable) · Tone.js (música adaptativa por fase) |
| Voz | ElevenLabs `eleven_multilingual_v2` — voces clonadas de actores salvadoreños |
| Backend | Colyseus 0.15 (WebSocket) · Hono 4 (REST API) |
| BaaS | Supabase (PostgreSQL · Realtime · Auth · Storage · Edge Functions) |
| Estado | Zustand 5 + Immer · @tanstack/react-query 5 |
| Guía | `AGROPOLY-REACT-Dev-Guide.md` |

---

## 3. Identidad de Marca BFA

### Paleta Principal
```css
/* Primarios */
--bfa-green-700:  #1B6B2F;  /* Primary brand — verde BFA */
--bfa-green-500:  #2E8B4A;  /* Hover, accents */
--bfa-green-300:  #4CAF70;  /* Success, ganancias */
--bfa-gold-500:   #F5C518;  /* Moneda, títulos, dorado */
--bfa-amber:      #E8A020;  /* Gradientes dorados */
--bfa-earth:      #7B5228;  /* Earthy accent, tierra */
--bfa-cream:      #FDF8EE;  /* Texto sobre fondo oscuro */
--bfa-dark:       #0D2B14;  /* Background oscuro */
--bfa-deep:       #060E08;  /* Background más profundo */
--bfa-gray:       #6B7C69;  /* Texto secundario */
```

### Grupos de Propiedades (8 Regiones BFA El Salvador)
```
Grupo 0 — #8B1A8B — Occidente I    (Ahuachapán, Atiquizaya)
Grupo 1 — #009FDF — Occidente II   (Sonsonate, Chalchuapa, Metapán)
Grupo 2 — #D6006E — Centro Norte   (Santa Tecla, S.J.Opico, Chalat)
Grupo 3 — #E8610C — Paracentral    (Cojutepeque, Sensuntepeque)
Grupo 4 — #C0392B — Oriente I      (Usulután, Jucuapa, Berlín)
Grupo 5 — #D4AC00 — Oriente II     (San Miguel, Gotera, La Unión)
Grupo 6 — #00913A — Gran S.S.      (Soyapango, Apopa, Ilopango)
Grupo 7 — #00297A — Casa Matriz    (Centro Histórico, Av. Olímpica)
```

### Tokens de Jugador
```
🌽 maiz    — #F5C518 — La Mazorca
☕ cafe    — #8B5E3C — El Cafetal
🐄 vaca    — #00AEEF — La Vaca
🚜 tractor — #F7941D — El Tractor
🌿 milpa   — #4CAF70 — La Milpa
🐟 pez     — #6B9FE4 — El Pez
```

### Tipografía
```
DISPLAY:  Playfair Display 700/900 · logo AGROPOLY, títulos, nombres propiedades
          Size: 48–120px (splash), 20–32px (juego) · letter-spacing: -2px a -3px

BODY/UI:  DM Sans 300–700 · instrucciones, logs, botones, UI
          Size: 11–18px · line-height: 1.6–1.8

DATOS:    Space Mono 400/700 · valores ƒ, números casilla, seriales
          Size: 10–28px · letter-spacing: 1–4px
```

---

## 4. Las 6 Mascotas del Universo AGROPOLY

| ID | Nombre | Personalidad | Voz ElevenLabs | Rol |
|---|---|---|---|---|
| `don_fomento` | Don Fomento | Agricultor sabio, abuelo cariñoso 65 años | Tenor cálido, acento salvadoreño | Narrador, Banco, Mentor |
| `maicita` | Maicita | Niña curiosa, 10 años | Voz infantil entusiasta | Guía educativa, Quiz |
| `don_cafe` | Don Café | Empresario exitoso, competitivo | Barítono confiado | Rival IA difícil |
| `la_canche` | La Canche | Vaquera joven, optimista | Soprano campestre | Rival IA fácil |
| `la_vaquita` | La Vaquita BFA | Simpática, institucional, orgullosa | Agudo-medio, ternera salvadoreña | Mascota oficial BFA, eventos institucionales |
| `la_tormenta` | La Tormenta | Antagonista climático, dramático | Voz profunda con efectos | Solo tarjetas Riesgo y Emergencia |

### La Vaquita BFA — Especificación Clave
- Mascota oficial histórica del BFA desde 1973
- Prioridad: aparece primero en eventos de propiedad y bienvenida
- Aparece en: `player_pass_go` · `property_bought` · `hotel_built` · `game_start` · `victory` · `bankruptcy`
- Frase: "¡Muuu! Así se hace, ¡eso es invertir con cabeza!"
- Config ElevenLabs: estabilidad 0.7, estilo 0.6
- Diseño: vaca holstein estilizada, moño dorado #F5C518, campanita BFA, cola levantada alegre

### Prioridad de Mascotas por Evento
```
la_vaquita  → eventos institucionales (propiedad, bienvenida, victoria)
don_fomento → consejos financieros generales, mentor
maicita     → conceptos educativos, quizzes, logros de aprendizaje
la_tormenta → SOLO tarjetas Riesgo y Emergencia Climática
```

---

## 5. Tablero — 40 Casillas

### Posiciones Clave
```
0:  INICIO (GO) — cobra ƒ200 al pasar, ƒ200 extra si cae exactamente
10: Emergencia Climática (JAIL)
20: Feria del Campo (FREE PARKING)
30: Ir a Emergencia (GO TO JAIL)

Canales BFA (estaciones): 5, 15, 25, 35
Servicios BFA (utilities): 12, 28  → renta = dado × 4 (1 servicio) / × 10 (ambos)
Tarjetas Cosecha: 2, 17, 33
Tarjetas Riesgo:  7, 22, 36
Impuestos:        4, 38
```

### Estructura de una Propiedad
```javascript
{
  id: 1,
  type: 'prop',        // 'prop' | 'station' | 'utility' | 'cosecha' | 'riesgo' | 'tax' | 'special'
  group: 0,            // índice del grupo de color (0–7) o -1 si no aplica
  name: 'Agencia Ahuachapán',
  price: 60,           // precio de compra en ƒ
  rents: [2, 10, 30, 90, 160, 250],  // [sin mejora, 1PA, 2PA, 3PA, 4PA, Centro]
  hcost: 50,           // costo por Punto de Atención (mejora)
  // Runtime fields:
  owner: null,         // índice del jugador dueño
  buildings: 0,        // 0–4 = Puntos de Atención, 5 = Centro de Servicio BFA
  mortgaged: false
}
```

### Nombres de Mejoras (no Monopoly estándar)
- Casa → **Punto de Atención BFA** (ícono 🏗)
- Hotel → **Centro de Servicio BFA** (ícono 🏦)
- Renta base doble → si dueño posee TODOS los del grupo y sin mejoras

---

## 6. Estado del Juego

### Objeto G (Versión HTML)
```javascript
G = {
  players: [],          // Array de objetos jugador
  currentIdx: 0,        // Índice del jugador activo
  phase: 'setup',       // 'setup' | 'roll' | 'action' | 'end'
  doublesCount: 0,      // Contador de dobles consecutivos (max 3 → jail)
  cosechaDeck: [],      // Mazo Cosecha (barajado Fisher-Yates)
  riesgoDeck: [],       // Mazo Riesgo (barajado)
  logEntries: [],       // Historial de partida
  turnCount: 0,         // Contador de turnos totales
}

// Jugador
{
  name: 'string',
  token: 'maiz',        // id del token
  balance: 1500,        // ƒ iniciales
  pos: 0,               // posición en el tablero (0–39)
  jailed: false,
  jailTurns: 0,
  jailFreeCards: 0,
  bankrupt: false,
  isAI: false,
  difficulty: 'easy'    // 'easy' | 'hard'
}
```

### GameStateSchema (Versión APEX — Colyseus)
```typescript
class PlayerState extends Schema {
  @type('string')   id: string
  @type('number')   balance = 1500
  @type('number')   position = 0
  @type('boolean')  jailed = false
  @type('number')   jailTurns = 0
  @type('boolean')  bankrupt = false
  @type('boolean')  isAI = false
  @type('string')   difficulty = 'easy'
  @type(['number']) properties = new ArraySchema<number>()
}
```

---

## 7. Flujo de un Turno

```
1. rollDice()             — valida fase 'roll', anima dados (3D CSS o Rapier WASM)
2. processRoll(d1, d2)    — calcula movimiento, verifica dobles, pago GO
3. animateTokenMove()     — 120ms/casilla (HTML) | física Rapier (APEX)
4. handleLanding()        — dispatch según type de casilla
5. [modal de acción]      — compra / renta / tarjeta / especial
6. finishAction(doubles)  — si dobles → vuelve a step 1; si no → advanceTurn()
7. advanceTurn()          — salta jugadores quebrados, siguiente turno
```

### Condiciones de Victoria
- **Última persona en pie** (todos demás quebrados)
- **Primer jugador en alcanzar ƒ5,000 neto** (patrimonio = efectivo + propiedades + mejoras - hipotecas)

---

## 8. Motor de IA

```
FÁCIL:
  - Compra si balance >= precio (75% probabilidad)
  - No construye hasta turno 10
  - Nunca hipoteca
  - Paga ƒ50 cárcel inmediatamente si balance > ƒ300

DIFÍCIL:
  - Compra si balance >= precio × 1.2 (mantiene reserva)
  - 90% probabilidad de comprar; prioriza grupos con propiedades propias
  - Construye si balance >= hcost × 1.5
  - Hipoteca propiedades baratas para construir en caras
  - Espera 2 turnos en cárcel para intentar dobles

EXPERTO (solo APEX):
  - Claude claude-haiku-4-5 en runtime para razonamiento estratégico
  - < 500ms target de latencia
```

---

## 9. Sistema de Audio

### Versión HTML — Web Audio API Sintética
```javascript
// Sin archivos MP3 — música 100% generativa
// Escala pentatónica Do Mayor: C4(261.63), D4(293.66), E4(329.63), G4(392), A4(440)
// 72 BPM · Capas: drones bajos + melodía + contramelodia + percusión sintética + reverb

SFX.roll()      // Ruido + rebote — dados lanzándose
SFX.move()      // Tick por casilla — movimiento
SFX.buy()       // Acorde mayor ascendente — compra
SFX.rent()      // Notas descendentes — pérdida
SFX.cosecha()   // Arpegio alegre ascendente
SFX.riesgo()    // Descenso de tono — tormenta
SFX.jail()      // Alarma disonante corta
SFX.pass_go()   // Fanfarria 4 notas
SFX.build()     // 3 notas ascendentes
SFX.bankrupt()  // Melodía descendente triste (5 notas)
SFX.win()       // Melodía completa 12 notas Do Mayor
SFX.click()     // Tick agudo
SFX.error()     // Buzzer corto
SFX.double()    // 2 tonos rápidos ascendentes
```

### Versión APEX — Howler + Tone.js
```typescript
// Howler.js: 16 SFX preloadables con fallback .ogg
// Tone.js: 5 tracks adaptativos: 'lobby' | 'playing' | 'tension' | 'victory' | 'bankrupt'
// Crossfade suave de 2 segundos entre tracks
// Marimba pentatónica centroamericana 72 BPM en track lobby/playing
```

---

## 10. Convenciones de Código

### Versión HTML (Vanilla JS)
```
- camelCase: rollDice(), advanceTurn(), handleLanding()
- kebab-case IDs: #screen-game, #btn-roll, #modal-buy
- Clases CSS: .player-chip, .modal-overlay, .board-cell
- Secciones: comentarios con ═══ borders
- Objetos singleton: G (game state), SFX (audio), BOARD[] (casillas)
- Callbacks y setTimeout — NO async/await
- toast(message, ms): notificación temporal flotante
- addLog(text): registro permanente en historial
- updateHUD(): sincroniza panel lateral con G
```

### Versión APEX (TypeScript React)
```
- TypeScript strict: sin any, sin type assertions excepto Three.js
- Solo function components + hooks
- Estado: Zustand (global) · useState (local) · Immer para mutaciones
- Estilos: solo Tailwind, sin inline styles en componentes UI
- Materials y geometrías 3D: SIEMPRE en useMemo
- Imports: alias @/ → apps/web/src (siempre absolutos)
- Zustand: selector específico OBLIGATORIO
  ✅ const balance = useGameStore(s => s.players[0]?.balance ?? 0)
  ❌ const state = useGameStore()
```

### Regla de los 3 Feedbacks (APEX)
```
Cada evento del juego SIEMPRE dispara exactamente 3 feedbacks:
1. Visual:  animación Framer Motion / GSAP / useFrame R3F
2. Audio:   sfxEngine.play('nombre_evento')
3. Voz:     orchestrateMascot({ type, player, data }) — asíncrono, NO bloquea UI
```

---

## 11. Selección de Modelos Claude

| Tarea | Modelo | Razón |
|---|---|---|
| Arquitectura, ADRs, trade-offs | `claude-opus-4-6` | Razonamiento multi-sistema profundo |
| Shaders GLSL, física Rapier, álgebra lineal 3D | `claude-opus-4-6` | Matemáticas GPU complejas |
| Optimización performance, memory profiling | `claude-opus-4-6` | Análisis profundo de rendimiento |
| Code review seguridad y bugs | `claude-opus-4-6` | Análisis exhaustivo |
| Game engine (TypeScript/JS), motor core | `claude-sonnet-4-6` | Código complejo estructurado |
| Componentes React + R3F, animaciones | `claude-sonnet-4-6` | JSX + Three.js + Framer |
| Audio (Web Audio / Tone.js), SFX | `claude-sonnet-4-6` | Síntesis musical compleja |
| Supabase schema + RLS, Colyseus rooms | `claude-sonnet-4-6` | SQL + WebSocket protocols |
| UI/UX modales, paneles, HUD | `claude-sonnet-4-6` | Interfaz compleja responsive |
| Tutor educativo adaptativo | `claude-sonnet-4-6` | Pedagogía + velocidad |
| **Diálogos mascotas en partida** | `claude-haiku-4-5` | **< 500ms target latencia** |
| Tooltips y micro-lecciones realtime | `claude-haiku-4-5` | Tiempo real en partida |
| Generación masiva de tarjetas (×48) | `claude-haiku-4-5` | Patrón repetitivo en masa |
| Design tokens desde Figma | `claude-haiku-4-5` | Extracción estructurada rápida |
| Diseño gráfico (tablero, billetes, personajes) | Claude Designer | Arte vectorial, ilustración |

---

## 12. MCPs Configurados (APEX)

```json
{
  "filesystem":    "lectura/escritura del monorepo src",
  "supabase":      "DB, tablas, migrations, RLS, Storage",
  "github":        "repositorio, PRs, issues, branches",
  "figma":         "tokens de diseño y assets",
  "vercel":        "deploy, logs, Core Web Vitals, previews",
  "playwright":    "testing E2E: partidas completas en browser",
  "sentry":        "errores producción, stack traces, performance",
  "upstash":       "cache Redis: sesiones activas, leaderboard, voice cache",
  "elevenlabs":    "generación, gestión y preview de voces",
  "brave-search":  "datos agropecuarios actualizados de El Salvador",
  "storybook":     "crear y revisar stories de componentes React"
}
```

---

## 13. Modo Educativo BFA

Activable por facilitador. Cuando `educationalMode = true`:
1. **Tooltips financieros** al tomar acciones (5–8 segundos antes de ejecutar)
2. **Glosario integrado** (ℹ️ en cada modal → definición en lenguaje de 4to grado)
3. **Quiz rápido** post-tarjeta Cosecha/Riesgo (3 opciones A/B/C, no bloquea el juego)
4. **Contador de conceptos** al finalizar la partida
5. **Dato BFA real** en cada tarjeta Cosecha ("¿Sabías que...?")

**Glosario:** 30 términos — ahorro, crédito, interés, hipoteca, renta, inversión, activo, pasivo, liquidez, quiebra, seguro, microcrédito, remesa, diversificación, flujo de caja, patrimonio, capital, subasta, dividendo, tasa de interés, fideicomiso, cooperativa, inflación, precio, valor, riesgo, ganancia, costo, mercado, monopolio.

---

## 14. Dashboard Analytics (Post Power BI → React nativo)

El dashboard de analytics fue migrado de Power BI a **shadcn/ui Charts + Apache ECharts**.

- **Nueva dependencia:** `pnpm add echarts echarts-for-react`
- **4 páginas:** ResumenEjecutivo · MetricasEducativas · ComportamientoFinanciero · ReporteDireccion
- **Hook principal:** `useAgropolyAnalytics()` en `src/hooks/useAgropolyAnalytics.ts`
  - @tanstack/react-query para fetching inicial
  - Supabase Realtime para KPIs en vivo
  - Retorna: `{ kpis, sessionsByWeek, conceptStats, boardHeatmap, ageDistribution, ... }`
- **Funciones analytics:** `src/lib/analytics-utils.ts` (8 funciones puras TypeScript, equivalentes a medidas DAX)
- **BoardHeatmapECharts:** Tablero 11×11 como heatmap ECharts — intensidad = frecuencia de compra por casilla

---

## 15. Objetivos de Negocio BFA

| KPI | Meta |
|---|---|
| Usuarios capacitados en educación financiera | 5,000/año |
| Jóvenes rurales 9–19 años alcanzados | 2,000/año |
| Menciones de marca BFA en el juego | 847 referencias |
| Sesiones mensuales de juego | 1,000 |
| Copias físicas distribuidas (año 1) | 500 |
| Score Lighthouse PWA | > 85 |
| Latencia diálogos mascota | < 500ms |

---

## 16. Archivos del Proyecto

```
C:\Sistemas\Agropoly\
├── AGROPOLY_CONTEXT.md           ← ESTE ARCHIVO (contexto maestro Claude)
├── AGROPOLY_ADRs.md              ← Todas las decisiones de arquitectura
│
└── Diseño\
    ├── AGROPOLY-BFA-GAME.html        ← Juego HTML single-file (producción BFA)
    ├── AGROPOLY-BFA-Dev-Guide.md     ← Guía HTML version (9 secciones, prompts)
    ├── AGROPOLY-REACT-Dev-Guide.md   ← Guía APEX React version (15 secciones)
    ├── BFA-AgroPoly-Propuesta.html   ← Propuesta visual de diseño
    └── AGROPOLY-Dashboard-Migration-Prompts.md  ← Migración Power BI → React
```

---

*Documento: AGROPOLY_CONTEXT.md · BFA Auditoría Interna · El Salvador · 2025*
*Adjuntar en CADA sesión Claude para coherencia del proyecto*
