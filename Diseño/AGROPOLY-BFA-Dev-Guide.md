# AGROPOLY BFA
## Guía Maestra de Desarrollo e Implantación
### Banco de Fomento Agropecuario · El Salvador

---

> **Documento:** `AGROPOLY-BFA-Dev-Guide.md`  
> **Versión:** 2.0  
> **Fecha:** Junio 2025  
> **Autor:** Auditoría Interna BFA / Área de Innovación  
> **Estado:** Producción

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Identidad de Marca y Sistema de Diseño](#2-identidad-de-marca-y-sistema-de-diseño)
3. [Arquitectura de Decisiones (ADRs)](#3-arquitectura-de-decisiones-adrs)
4. [Contexto Claude — System Prompt Maestro](#4-contexto-claude--system-prompt-maestro)
5. [Guía de Selección de Modelos Claude](#5-guía-de-selección-de-modelos-claude)
6. [Skills y Capacidades por Módulo](#6-skills-y-capacidades-por-módulo)
7. [Prompts de Desarrollo — Fase por Fase](#7-prompts-de-desarrollo--fase-por-fase)
8. [Prompts para Claude Designer — Arte y Efectos](#8-prompts-para-claude-designer--arte-y-efectos)
9. [Sistema de Sonido y Música](#9-sistema-de-sonido-y-música)
10. [Efectos Especiales y Animaciones 3D](#10-efectos-especiales-y-animaciones-3d)
11. [Stack Tecnológico y Dependencias](#11-stack-tecnológico-y-dependencias)
12. [Cronograma de Implantación](#12-cronograma-de-implantación)
13. [Checklist de Calidad](#13-checklist-de-calidad)

---

## 1. Visión General del Proyecto

### 1.1 Descripción

AGROPOLY BFA es un juego de mesa estratégico digital y físico del **Banco de Fomento Agropecuario de El Salvador**, adaptando la mecánica clásica de Monopoly al universo agropecuario salvadoreño. Combina:

- 40 casillas representando agencias, servicios y geografía de El Salvador
- Sistema monetario propio: **Fomentos (ƒ)**
- Mecánicas educativas de educación financiera
- Motor de IA para jugadores rivales
- Audio generativo via Web Audio API
- Animaciones CSS/Canvas/WebGL
- Compatibilidad total web + móvil (PWA)

### 1.2 Objetivos de Negocio

| Objetivo | KPI | Meta |
|---|---|---|
| Educación financiera | Usuarios capacitados/año | 5,000 |
| Alcance jóvenes rurales | Edad 9–19 años | 2,000/año |
| Posicionamiento de marca | Menciones BFA en juego | 847 referencias |
| Adopción digital | Sesiones mensuales de juego | 1,000 |
| Cobertura física | Copias distribuidas | 500 primer año |

### 1.3 Alcance del Proyecto

```
AGROPOLY BFA
├── Versión Física (tablero imprimible, 50×50cm)
│   ├── Tablero completo con 40 casillas
│   ├── 200 billetes Fomento (7 denominaciones)
│   ├── 32 Tarjetas de Contrato
│   ├── 48 Tarjetas Cosecha/Riesgo
│   ├── 6 tokens de jugador
│   └── Manual de reglas
│
└── Versión Digital (Web / PWA)
    ├── Single-file HTML (sin build step)
    ├── Engine de juego completo en JS
    ├── IA con 3 niveles de dificultad
    ├── Web Audio API — música generativa
    ├── Animaciones CSS + Canvas
    ├── Modo offline (Service Worker)
    └── Compatible iOS/Android/Desktop
```

---

## 2. Identidad de Marca y Sistema de Diseño

### 2.1 Paleta de Colores — Token System Completo

#### Colores Primarios de Marca BFA

```
┌─────────────────────────────────────────────────────────┐
│  PALETA PRINCIPAL AGROPOLY BFA                          │
├──────────────┬────────────┬──────────┬──────────────────┤
│  Nombre      │  HEX       │  RGB     │  Uso             │
├──────────────┼────────────┼──────────┼──────────────────┤
│  Verde BFA   │  #1B6B2F   │ 27,107,47│ Primary brand    │
│  Verde Claro │  #2E8B4A   │ 46,139,74│ Hover, accents   │
│  Verde Glow  │  #4CAF70   │ 76,175,112│ Success, gains  │
│  Dorado BFA  │  #F5C518   │ 245,197,24│ Currency, titles│
│  Ámbar       │  #E8A020   │ 232,160,32│ Gradients dorado│
│  Tierra      │  #7B5228   │ 123,82,40 │ Earthy accent   │
│  Crema       │  #FDF8EE   │ 253,248,238│ Text on dark   │
│  Verde Oscuro│  #0D2B14   │ 13,43,20  │ Background dark │
│  Negro Agro  │  #060E08   │ 6,14,8    │ Background deep │
│  Gris Olivo  │  #6B7C69   │ 107,124,105│ Secondary text │
└──────────────┴────────────┴──────────┴──────────────────┘
```

#### Colores de Grupos de Propiedades (8 Regiones)

```
┌────────────────┬────────────┬──────────────────────────────┐
│  Región        │  HEX       │  Agencias                    │
├────────────────┼────────────┼──────────────────────────────┤
│  Occidente I   │  #8B1A8B   │ Ahuachapán, Atiquizaya       │
│  Occidente II  │  #009FDF   │ Sonsonate, Chalchuapa, Metapán│
│  Centro Norte  │  #D6006E   │ Santa Tecla, S.J.Opico, Chalat│
│  Paracentral   │  #E8610C   │ Cojutepeque, Sensuntepeque    │
│  Oriente I     │  #C0392B   │ Usulután, Jucuapa, Berlín     │
│  Oriente II    │  #D4AC00   │ San Miguel, Gotera, La Unión  │
│  Gran S.S.     │  #00913A   │ Soyapango, Apopa, Ilopango    │
│  Casa Matriz   │  #00297A   │ Centro Histórico, Av. Olímpica│
└────────────────┴────────────┴──────────────────────────────┘
```

#### Colores de Estado del Juego

```css
/* Tokens de jugador */
--token-maiz:    #F5C518;   /* La Mazorca */
--token-cafe:    #8B5E3C;   /* El Cafetal */
--token-vaca:    #00AEEF;   /* La Vaca */
--token-tractor: #F7941D;   /* El Tractor */
--token-milpa:   #4CAF70;   /* La Milpa */
--token-pez:     #6B9FE4;   /* El Pez */

/* Estados financieros */
--estado-ganancia:  #4CAF70;
--estado-perdida:   #E57373;
--estado-neutro:    #FFC107;
--estado-quiebra:   #9E9E9E;
--estado-hipoteca:  #FF7043;
```

### 2.2 Tipografía

#### Jerarquía Tipográfica

```
DISPLAY / MARCA:     Playfair Display
                     Weight: 700, 900 | Style: Normal, Italic
                     Uso: Logo AGROPOLY, títulos de pantalla,
                          nombres de propiedades en tarjetas
                     Size: 48–120px (splash), 20–32px (juego)
                     Letter-spacing: -2px a -3px (display)

CUERPO / UI:         DM Sans
                     Weight: 300, 400, 500, 600, 700
                     Uso: Instrucciones, logs, botones, UI
                     Size: 11–18px
                     Line-height: 1.6–1.8

DATOS / MONEDA:      Space Mono
                     Weight: 400, 700
                     Uso: Valores ƒ, números de casilla,
                          seriales de billetes, códigos
                     Size: 10–28px
                     Letter-spacing: 1–4px (labels)
```

#### Escala Tipográfica en CSS Variables

```css
:root {
  --text-xs:   10px;
  --text-sm:   12px;
  --text-base: 14px;
  --text-md:   16px;
  --text-lg:   18px;
  --text-xl:   22px;
  --text-2xl:  28px;
  --text-3xl:  36px;
  --text-4xl:  48px;
  --text-hero: clamp(64px, 16vw, 120px);
}
```

### 2.3 Sistema de Espaciado y Bordes

```css
/* Espaciado en múltiplos de 4px */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px; --space-16: 64px;

/* Border radius */
--radius-sm: 6px;    /* Tags, pequeños chips */
--radius-md: 10px;   /* Cards, inputs */
--radius-lg: 16px;   /* Modales, paneles */
--radius-xl: 24px;   /* Tablero, contenedores grandes */
--radius-full: 100px; /* Pills, botones */

/* Sombras */
--shadow-sm:  0 2px 8px rgba(0,0,0,.3);
--shadow-md:  0 8px 32px rgba(0,0,0,.5);
--shadow-lg:  0 24px 80px rgba(0,0,0,.7);
--shadow-glow-green: 0 0 24px rgba(46,139,74,.4);
--shadow-glow-gold:  0 0 24px rgba(245,197,24,.3);
```

### 2.4 Iconografía y Tokens Visuales

| Elemento | Emoji / Ícono | Significado |
|---|---|---|
| 🌾 | Espiga de trigo | Logo principal AGROPOLY |
| 🏁 | Bandera | Casilla INICIO |
| ⚠️ | Advertencia | Emergencia Climática (cárcel) |
| 🌿 | Hoja | Feria del Campo (estacionamiento) |
| 🚨 | Sirena | Ir a Emergencia |
| 🌽 | Mazorca | Tarjeta Cosecha (Community Chest) |
| ⛈ | Tormenta | Tarjeta Riesgo (Chance) |
| ƒ | Fomento | Símbolo monetario |
| 🏗 | Construcción | Punto de Atención (casita) |
| 🏦 | Banco | Centro de Servicio BFA (hotel) |

---

## 3. Arquitectura de Decisiones (ADRs)

### ADR-001: Single-File HTML sin Build Step

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** BFA tiene restricciones de IT estrictas (sin npm, sin instalaciones externas, Trellix monitoring).  

**Decisión:** Todo el juego (HTML + CSS + JS + assets inline) en un único archivo `.html`.

**Consecuencias:**
- ✅ Zero deployment: abrir en cualquier navegador moderno
- ✅ Compatible con SharePoint, Teams, OneDrive
- ✅ Sin dependencias de red en runtime
- ✅ Portable: email, USB, cualquier medio
- ⚠️ Archivo ~130KB (aceptable, sin imágenes pesadas)
- ⚠️ Fonts requieren conexión (Google Fonts CDN, con fallback)

**Alternativa rechazada:** React + Vite build — requiere npm y servidor Node.

---

### ADR-002: Web Audio API para Música Generativa

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** No se pueden incluir archivos MP3/OGG en el HTML sin base64 encoding (tamaño prohibitivo).

**Decisión:** Música 100% generativa usando Web Audio API — osciladores, filtros y envolventes en JavaScript puro.

**Implementación elegida:**
```
- Drone bajo: 3 osciladores síncronos (65Hz, 98Hz, 131Hz)
- Melodía: arpegio pentatónico aleatorio (Do-Re-Mi-Sol-La)
- Ritmo: buffer noise sintético tipo "tambor" (100ms)
- Reverb: simulado con delay + feedback
- Volumen master: 0.04 (ambiente suave, no intrusivo)
```

**Consecuencias:**
- ✅ 0 bytes extra en el archivo para música
- ✅ Infinitamente variada (nunca se repite exactamente)
- ✅ Latencia cero (no carga archivos)
- ⚠️ Requiere gesto del usuario para iniciar (política de navegadores)
- ⚠️ Calidad no es CD-audio, pero apropiada para ambiente de juego

**Alternativa rechazada:** Base64 MP3 — añadiría ~2MB al archivo.

---

### ADR-003: Canvas 2D para Tablero, NO WebGL

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** El tablero necesita ser renderizable en iOS Safari 15+, Android Chrome, y browsers de PCs corporativos del BFA.

**Decisión:** CSS Grid para el tablero base + Canvas 2D para efectos de animación (tokens, partículas).

**Consecuencias:**
- ✅ Soporte universal (iOS 12+, Android 5+, IE11 con degradación)
- ✅ Performance aceptable en hardware modesto
- ⚠️ Sin efectos 3D nativos — simulados con CSS transform3d y perspectiva

**Alternativa rechazada:** WebGL/Three.js — sin soporte en algunos browsers corporativos; añade 700KB.

---

### ADR-004: IA Determinística con Perfil de Personalidad

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** La IA debe ser educativa, no frustrante para niños.

**Decisión:** Dos perfiles de IA (Fácil / Difícil) con reglas determinísticas:

```
FÁCIL:
- Compra si balance ≥ precio (sin reserva)
- 75% probabilidad de comprar
- No construye hasta turno 10
- Nunca hipoteca

DIFÍCIL:
- Compra si balance ≥ precio × 1.2 (mantiene reserva)
- 90% probabilidad de comprar
- Construye si balance ≥ costo × 1.5
- Hipoteca propiedades de bajo valor para construir en alto valor
```

**Alternativa rechazada:** LLM en runtime (Claude API) — requiere API key, latencia de red, costo variable.

---

### ADR-005: Sistema de Turnos Basado en Eventos (Event-Driven)

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** El flujo del juego es complejo (dados, movimiento, acción en casilla, modales, efectos).

**Decisión:** Máquina de estados finita:

```
Estados: setup → roll → action → end
Transiciones:
  setup  →roll    : startGame()
  roll   →action  : processRoll()
  action →roll    : finishAction(doubles=true)
  action →roll    : advanceTurn()
  roll   →end     : declareWinner()
```

---

### ADR-006: Diseño Mobile-First, Desktop-Enhanced

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  

**Breakpoints:**
```css
/* Mobile base: < 768px — layout vertical, tablero centrado */
/* Desktop: ≥ 768px — layout grid 2 columnas, panel lateral */

@media (min-width: 768px) {
  #screen-game {
    grid-template-columns: 260px 1fr;
  }
}
```

---

### ADR-007: Persistencia en memoria (sin localStorage)

**Fecha:** 2025-01  
**Estado:** ✅ Aprobado  
**Contexto:** Algunos entornos corporativos bloquean localStorage.

**Decisión:** Estado del juego 100% en memoria RAM (objeto `G`). No hay persistencia entre sesiones. Partidas duran 60–120 minutos en una sesión.

---

## 4. Contexto Claude — System Prompt Maestro

### 4.1 Context File para Sesiones de Desarrollo

Guarda este bloque como `AGROPOLY_CONTEXT.md` y adjúntalo a cada sesión Claude:

```markdown
# AGROPOLY BFA — Contexto de Desarrollo

## Proyecto
Juego de mesa digital AGROPOLY BFA para el Banco de Fomento Agropecuario de El Salvador.
Archivo único HTML (~130KB). Sin frameworks, sin build step, sin dependencias externas.

## Stack tecnológico
- HTML5 semántico
- CSS3 (variables, grid, flexbox, animations, @keyframes)
- JavaScript ES6+ vanilla (no jQuery, no React)
- Web Audio API (música y SFX generativos)
- Canvas 2D (tablero, tokens, partículas)
- PWA (Service Worker para offline)

## Identidad de marca
- Colores: Verde BFA #1B6B2F, Dorado #F5C518, Oscuro #060E08
- Tipografía: Playfair Display (display), DM Sans (body), Space Mono (datos)
- Moneda: Fomento (ƒ) — símbolo personalizado
- Tono: Educativo, cálido, salvadoreño, institucional pero moderno

## Restricciones BFA
- Sin npm, sin Node.js, sin herramientas externas instaladas
- Debe correr en Chrome/Edge corporativo (no Firefox en algunos PCs)
- Compatible con Microsoft 365 ecosystem (SharePoint, Teams)
- No localStorage en contextos corporativos
- Sin API keys en el frontend

## Estructura del código (objeto G = Game State)
G = {
  players[],       // Array de jugadores
  currentIdx,      // Índice del jugador activo
  phase,           // 'setup' | 'roll' | 'action' | 'end'
  doublesCount,    // Contador de dobles consecutivos
  cosechaDeck[],   // Mazo de tarjetas Cosecha (barajadas)
  riesgoDeck[],    // Mazo de tarjetas Riesgo (barajadas)
  logEntries[],    // Historial de partida
  turnCount,       // Contador de turnos
}

## BOARD[] — 40 casillas
Índices clave:
- 0: INICIO (GO) — cobra ƒ200 al pasar
- 10: Emergencia Climática (JAIL)
- 20: Feria del Campo (FREE PARKING)
- 30: Ir a Emergencia (GO TO JAIL)
- 5,15,25,35: Canales BFA (estaciones)
- 12,28: Servicios BFA (utilities)
- Grupos 0–7: 8 colores de propiedades

## Convenciones de código
- Funciones en camelCase: rollDice(), advanceTurn()
- IDs de HTML: kebab-case: #screen-game, #btn-roll
- CSS: BEM-light con prefijos: .player-chip, .modal-overlay
- Comentarios: bloques ═══ para secciones mayores, ── para subsecciones
- SFX.*(): métodos del objeto de efectos de sonido
- toast(): notificaciones temporales (string, ms)
- addLog(): registro permanente en historial

## Flujo de un turno completo
1. rollDice() — valida fase 'roll', anima dados
2. processRoll(d1,d2) — calcula movimiento, verifica dobles, verificar pasar GO
3. animateTokenMove() — anima token casilla por casilla (120ms/casilla)
4. handleLanding() — dispatch según tipo de casilla
5. [modal / acción automática] según el tipo
6. finishAction(doubles) — si dobles → vuelve a step 1; si no → advanceTurn()
7. advanceTurn() — siguiente jugador, mostrar transición cinemática
```

---

### 4.2 Context File para Diseño (Claude Designer)

```markdown
# AGROPOLY BFA — Design Context

## Proyecto visual
Juego de mesa AGROPOLY del Banco de Fomento Agropecuario de El Salvador.
Estética: premium institucional latinoamericano + calidez agrícola + modernidad digital.

## Referencias visuales clave
- Tablero: Verde oscuro profundo, celulas con borde dorado sutil
- Billetes: Estilo currency monopólico con ilustraciones agrícolas salvadoreñas
- Cartas: Dos mazos — verde (Cosecha) y rojo (Riesgo)
- Tokens: Iconos flat de maíz, café, vaca, tractor, milpa, pez

## Paleta exacta (nunca alejarse de esto)
Primarios: #1B6B2F, #F5C518, #060E08, #FDF8EE
Secundarios: #2E8B4A, #E8A020, #7B5228, #0D2B14
Grupos de propiedades: #8B1A8B, #009FDF, #D6006E, #E8610C, #C0392B, #D4AC00, #00913A, #00297A

## Tipografía
Display: Playfair Display 900 italic — para AGROPOLY logo
Títulos: Playfair Display 700 — para nombres de propiedades y secciones
UI: DM Sans 600 — para botones y labels
Datos: Space Mono 700 — para montos en Fomentos (ƒ)

## Estilo de ilustración para el juego
- Isométrico flat (no skeuomórfico, no fotorrealista)
- Paleta cálida: verdes, ámbar, tierra, crema
- Elementos salvadoreños: volcán Santa Ana, milpa, café, ganado, caña
- Sin drop shadows fuertes — usar inner glow sutil y gradientes de luz

## Identidad de marca BFA
- Logo BFA siempre presente en esquina, nunca modificado
- Slogan: "Banco de Fomento Agropecuario · Est. 1973"
- Tono institucional pero accesible, nunca frío
- Símbolo de moneda: ƒ (minúscula cursiva estilizada)
```

---

## 5. Guía de Selección de Modelos Claude

### 5.1 Mapa de Decisión por Tarea

```
¿Es una tarea de diseño visual?
  └── SÍ → Claude Designer (diseño gráfico, illustraciones, UI visual)
  └── NO ↓

¿Requiere razonamiento profundo / arquitectura?
  └── SÍ → claude-opus-4-6 o claude-opus-4-7
  └── NO ↓

¿Es código complejo (engine, IA, audio)?
  └── SÍ → claude-sonnet-4-6 (equilibrio calidad/velocidad)
  └── NO ↓

¿Es tarea repetitiva / formateo / conversión?
  └── SÍ → claude-haiku-4-5 (velocidad, costo)
  └── NO → claude-sonnet-4-6 (default)
```

### 5.2 Tabla de Asignación por Módulo

| Módulo / Tarea | Modelo | Justificación |
|---|---|---|
| **Arquitectura del sistema** | `claude-opus-4-6` | Diseño de ADRs, decisiones técnicas profundas, trade-offs |
| **Game Engine (lógica central)** | `claude-sonnet-4-6` | JS complejo, máquina de estados, reglas del juego |
| **Motor de IA (oponentes)** | `claude-sonnet-4-6` | Algoritmos de decisión, perfiles de dificultad |
| **Web Audio Engine** | `claude-sonnet-4-6` | Síntesis de sonido, música generativa, SFX |
| **Animaciones CSS/Canvas** | `claude-sonnet-4-6` | Keyframes, transformaciones 3D, partículas |
| **Efectos 3D WebGL** | `claude-opus-4-6` | Geometrías, shaders GLSL, matrices de transformación |
| **UI Components (HTML/CSS)** | `claude-sonnet-4-6` | Componentes de interfaz, responsive design |
| **Billetes y cartas (diseño)** | **Claude Designer** | Arte vectorial, ilustraciones, layouts de tarjetas |
| **Tablero (diseño gráfico)** | **Claude Designer** | Mapa del tablero, iconografía, paleta aplicada |
| **Sistema de diseño** | **Claude Designer** | Tokens, tipografía, componentes visuales |
| **Reglas del juego (texto)** | `claude-haiku-4-5` | Redacción de instrucciones, documentación |
| **Traducciones / Localización** | `claude-haiku-4-5` | Textos en inglés/español, variaciones regionales |
| **Datos de agencias BFA** | `claude-haiku-4-5` | Estructurar datos de propiedades, precios, rentas |
| **Testing / QA prompts** | `claude-haiku-4-5` | Generar casos de prueba, checklists |
| **Power Apps M365** | `claude-sonnet-4-6` | Canvas apps, Power Fx, Dataverse |
| **Power Automate flows** | `claude-sonnet-4-6` | Flujos de automatización complejos |
| **Service Worker / PWA** | `claude-sonnet-4-6` | Cache strategies, offline support |
| **Optimización de performance** | `claude-opus-4-6` | Profiling, memory management, paint optimization |
| **Revisión de código** | `claude-opus-4-6` | Code review completo, seguridad, mejores prácticas |
| **Documentación técnica** | `claude-sonnet-4-6` | README, JSDoc, guías de desarrollo |

### 5.3 Cuándo Escalar a Opus

Usa **claude-opus-4-6** cuando:
- La tarea involucra más de 3 sistemas interactuando (audio + canvas + game state)
- Necesitas diseñar una arquitectura que durará meses
- El problema tiene múltiples soluciones con trade-offs no obvios
- Hay bugs difíciles de reproducir o race conditions en timing
- Necesitas optimizar código que ya funciona pero es lento

### 5.4 Cuándo Usar Haiku

Usa **claude-haiku-4-5** cuando:
- Necesitas transformar datos estructurados (JSON de propiedades, tablas de rentas)
- La tarea es formatear texto existente
- Generas variantes de un mismo patrón (40 descripciones de casillas)
- Necesitas respuestas en menos de 3 segundos en workflows automáticos
- Tareas de extracción simple (extraer datos de una tabla a JS array)

---

## 6. Skills y Capacidades por Módulo

### 6.1 Skills del Motor de Juego

```markdown
SKILL: game-engine-agropoly
Versión: 2.0
Descripción: Motor de juego de mesa turn-based con máquina de estados,
             sistema de propiedades, economía de juego y IA.

Capacidades requeridas:
- Máquinas de estados finitas en JavaScript
- Patrones de diseño Observer y Command
- Gestión de estado mutable sin frameworks
- Timing asíncrono con setTimeout/Promise
- Algoritmos de shuffling (Fisher-Yates)
- Cálculo de valor neto y economía de juego
- Detección de condiciones de victoria
- Manejo de quiebra y redistribución de activos

Dependencias: Ninguna (vanilla JS)
Modelo recomendado: claude-sonnet-4-6
```

### 6.2 Skills del Sistema de Audio

```markdown
SKILL: web-audio-generative
Versión: 1.0
Descripción: Síntesis de audio procedural via Web Audio API.
             Música ambiental + efectos de sonido (SFX).

Capacidades requeridas:
- AudioContext y ciclo de vida
- OscillatorNode (sine, sawtooth, square, triangle)
- GainNode (envolventes ADSR)
- BiquadFilterNode (EQ, filtros)
- ConvolverNode (reverb)
- AudioBufferSourceNode (ruido blanco, percusión sintética)
- Scheduling temporal con ctx.currentTime
- Pattern de notas en escala pentatónica
- Manejo de autoplay policy (requires user gesture)
- Limpieza de nodos para evitar memory leaks

Dependencias: Web Audio API (disponible en todos los browsers modernos)
Modelo recomendado: claude-sonnet-4-6
```

### 6.3 Skills de Animación

```markdown
SKILL: animation-system
Versión: 1.0
Descripción: Sistema de animaciones para juego de mesa web.

Capacidades requeridas:
- CSS @keyframes (fadeIn, bounce, shake, pulse)
- CSS transforms 3D (rotateX, rotateY, translateZ, perspective)
- requestAnimationFrame loop
- Canvas 2D API (fillStyle, strokeStyle, arc, roundRect)
- Sistema de partículas simple (posición, velocidad, opacidad)
- Interpolación temporal (lerp, easing functions)
- Transiciones de pantalla (opacity + transform)
- Animación de dados con timing variable
- Token movement step-by-step (120ms/step)
- Flip animation para tarjetas

Dependencias: Canvas 2D API, CSS3 transitions
Modelo recomendado: claude-sonnet-4-6
```

### 6.4 Skills de Diseño Visual

```markdown
SKILL: brand-design-bfa
Versión: 1.0
Descripción: Sistema de diseño visual para AGROPOLY BFA.

Capacidades requeridas:
- Aplicación de paleta de colores BFA
- Tipografía jerárquica (Playfair + DM Sans + Space Mono)
- Diseño de tarjetas (property cards, event cards)
- Diseño de billetes (currency design)
- Iconografía agrícola salvadoreña
- Layout responsivo (mobile-first)
- Design tokens (CSS variables)
- Ilustración flat isométrica
- Principios de accesibilidad (contrast ratio WCAG AA)

Herramienta principal: Claude Designer / Figma / Illustrator
Modelo: Claude Designer (para generación visual)
```

### 6.5 Skills de Efectos 3D

```markdown
SKILL: css-3d-effects
Versión: 1.0
Descripción: Efectos tridimensionales con CSS y Canvas.

Capacidades requeridas:
- CSS perspective y transform-style: preserve-3d
- Rotación de dados 3D (rotateX, rotateY)
- Flip de tarjetas con backface-visibility
- Profundidad del tablero con box-shadow layers
- Token levitation (translateZ en hover)
- Parallax sutil en el hero (background-attachment)
- CSS gradient glow (radial-gradient en fondos)
- Shimmer effect en superficies doradas

Nota: Sin WebGL para mantener compatibilidad corporativa.
Simulación de 3D con CSS puro + Canvas 2D.
Modelo recomendado: claude-sonnet-4-6
```

---

## 7. Prompts de Desarrollo — Fase por Fase

### FASE 1: Fundación y Arquitectura

**Modelo:** `claude-opus-4-6`  
**Cuándo usar:** Primera sesión, antes de escribir código.

---

**PROMPT 1.1 — Arquitectura General**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Soy el equipo de Auditoría Interna del BFA (Banco de Fomento Agropecuario, El Salvador).
Necesito diseñar la arquitectura de un juego de mesa digital llamado AGROPOLY.

Requisitos técnicos no negociables:
- Single-file HTML sin build step ni npm
- Web Audio API para música/sonidos (sin archivos de audio)
- Canvas 2D para el tablero y animaciones
- Compatible con Chrome corporativo, iOS Safari, Android Chrome
- Sin localStorage (entornos corporativos lo bloquean)
- Sin API keys en el frontend

El juego es una adaptación de Monopoly con:
- 40 casillas temáticas BFA
- 2–6 jugadores (1 humano + IA)
- Sistema monetario propio (Fomentos ƒ)
- Tarjetas Cosecha (Community Chest) y Riesgo (Chance)

Necesito:
1. Diagrama de la arquitectura de módulos (ASCII o markdown)
2. Estructura del objeto de estado G con todos los campos necesarios
3. Diseño de la máquina de estados (estados y transiciones)
4. Lista de ADRs (Architecture Decision Records) con sus justificaciones
5. Identificación de los 5 riesgos técnicos principales y sus mitigaciones

Sé específico con los tipos de datos JS (no TypeScript, vanilla JS).
```

---

**PROMPT 1.2 — Game Data Structure**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Necesito el array BOARD[] completo con las 40 casillas del juego AGROPOLY BFA.

Las 40 casillas son exactamente:
- Casilla 0: INICIO (GO)
- Casillas 1–9: Grupos 0 y 1 (Occidente I y II) + especiales
- Casilla 10: Emergencia Climática (JAIL)
- Casillas 11–19: Grupos 2 y 3 + especiales
- Casilla 20: Feria del Campo (FREE PARKING)
- Casillas 21–29: Grupos 4 y 5 + especiales
- Casilla 30: Ir a Emergencia (GO TO JAIL)
- Casillas 31–39: Grupos 6 y 7 + especiales
- 4 estaciones (canales BFA): posiciones 5, 15, 25, 35
- 2 utilidades (servicios BFA): posiciones 12, 28
- 3 Cosecha: posiciones 2, 17, 33
- 3 Riesgo: posiciones 7, 22, 36
- 2 Impuestos: posiciones 4, 38

Para cada propiedad incluir:
- id, type, group, name, price
- rents[6]: [sin mejora, 1PA, 2PA, 3PA, 4PA, Centro]
- hcost: costo por mejora

Agrupa: Occidente I (morado, ×2), Occidente II (celeste, ×3),
Centro Norte (rosado, ×3), Paracentral (naranja, ×3),
Oriente I (rojo, ×3), Oriente II (amarillo, ×3),
Gran SS (verde oscuro, ×3), Casa Matriz (azul marino, ×2)

Usa agencias reales del BFA de El Salvador.
Precios escalados de ƒ60 a ƒ400. Balance inicial: ƒ1,500/jugador.
Formato: array JS literal, listo para pegar.
```

---

### FASE 2: Motor de Juego Core

**Modelo:** `claude-sonnet-4-6`

---

**PROMPT 2.1 — Función processRoll() Completa**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Necesito implementar la función processRoll(d1, d2) del motor de juego AGROPOLY BFA.

Estado actual del código: [pegar las funciones G, BOARD, PLAYERS ya escritas]

La función debe manejar:
1. Dobles:
   - Si jugador está en cárcel (jailed) y saca dobles → sale libre
   - Si jugador NO está en cárcel y saca 3 dobles consecutivos → va a Emergencia Climática
   - Si saca dobles normales → vuelve a lanzar al final del turno
2. Pasar por INICIO (casilla 0):
   - Si la nueva posición < posición anterior → pasó por GO
   - Cobra ƒ200 automáticamente, anima con spawnCoin()
3. Movimiento:
   - Llama a animateTokenMove(player, fromPos, toPos, callback)
   - En el callback, llama a handleLanding(player, space, doubles)
4. Estado de cárcel:
   - Si jailed y no saca dobles: jailTurns++, si jailTurns >= 3 fuerza pago ƒ50
5. Actualiza G.doublesCount

Usa estas funciones existentes: toast(), addLog(), updateHUD(), SFX.*
No uses async/await, usa solo callbacks y setTimeout.
Incluye JSDoc para la función.
Produce el código JS listo para pegar.
```

---

**PROMPT 2.2 — Sistema de Construcción de Mejoras**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el sistema de construcción de mejoras (Puntos de Atención y Centro de Servicio) para AGROPOLY BFA.

Reglas de construcción:
1. El jugador debe poseer TODAS las propiedades del grupo
2. La construcción debe ser EQUILIBRADA (no puedes tener 2 en una propiedad y 0 en otra del mismo grupo)
3. Verificar que space.buildings[idx] === minBuildingsInGroup antes de construir
4. Costos: hcost según la propiedad (ƒ50, ƒ100, ƒ150, ƒ200)
5. Máximo 4 Puntos de Atención (buildings 1–4) → luego Centro de Servicio (buildings = 5)
6. No se puede construir en propiedades hipotecadas

Funciones a implementar:
- tryBuild(spaceId): construye una mejora si las reglas lo permiten
- trySellBuilding(spaceId): vende la mejora más cara del grupo primero (regla espejo)
- tryMortgage(spaceId): hipoteca o des-hipoteca (costo de des-hipoteca = 110%)
- getGroupStatus(groupIdx): retorna {ownsAll, minBuildings, maxBuildings, canBuild}

Incluye validaciones con toast() para cada error posible.
Actualiza updateCellDisplay() y updateHUD() al finalizar.
```

---

**PROMPT 2.3 — IA Engine con Perfiles de Personalidad**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el motor de IA para AGROPOLY BFA con dos perfiles: FÁCIL y DIFÍCIL.

El objeto player.difficulty = 'easy' | 'hard'

Funciones a implementar:

1. aiDecideBuy(player, space, doubles):
   FÁCIL: compra si balance >= precio, 75% de probabilidad
   DIFÍCIL: compra si balance >= precio × 1.2 Y tiene valor estratégico
   "Valor estratégico": si ya tiene 1 del grupo → mayor prioridad
   Llama a finishAction(doubles) al terminar

2. aiManageProperties(player):
   Llama antes de cada turno IA
   FÁCIL: construye si tiene grupo completo y balance >= hcost × 2
   DIFÍCIL: prioriza grupos con más propiedades del rival, construye si balance >= hcost × 1.5
   Hipoteca propiedades baratas para financiar construcción en propiedades caras

3. aiDecideJail(player):
   FÁCIL: paga ƒ50 inmediatamente si tiene > ƒ300
   DIFÍCIL: espera 2 turnos para intentar dobles, luego paga

4. aiBidAuction(space, currentBid, player):
   Retorna la puja del IA o null si no puja
   FÁCIL: puja hasta precio × 0.8
   DIFÍCIL: puja hasta precio × 1.1 si tiene valor estratégico

Después de cada acción IA: toast con descripción de qué hizo, delay de 1–1.5s para efecto dramático.
```

---

### FASE 3: Audio y Efectos Especiales

**Modelo:** `claude-sonnet-4-6`

---

**PROMPT 3.1 — Sistema de SFX Completo**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el objeto SFX completo con todos los efectos de sonido para AGROPOLY BFA usando Web Audio API pura (sin archivos de audio).

Cada efecto debe ser distinto, reconocible y temáticamente apropiado al juego agrícola.

Efectos requeridos:
- SFX.roll(): sonido de dados lanzándose (ruido + rebote)
- SFX.move(): pasos del token en el tablero (tick por casilla)
- SFX.buy(): compra de propiedad (acorde mayor ascendente)
- SFX.rent(): pago de renta (notas descendentes, tono de "pérdida")
- SFX.cosecha(): tarjeta Cosecha (arpegio ascendente alegre, como cosecha exitosa)
- SFX.riesgo(): tarjeta Riesgo (descenso de tono, tono de tormenta)
- SFX.jail(): ir a Emergencia Climática (alarma corta, disonante)
- SFX.pass_go(): pasar por INICIO (fanfarria corta, 4 notas)
- SFX.build(): construir mejora (martillo virtual, 3 notas ascendentes)
- SFX.bankrupt(): quiebra (melodía descendente triste, 5 notas)
- SFX.win(): victoria (melodía completa, 12 notas, basada en escala mayor)
- SFX.click(): click de botón (tick corto agudo)
- SFX.error(): error (buzzer corto)
- SFX.auction(): subasta (nota de atención)
- SFX.double(): dobles en dados (2 tonos rápidos ascendentes)

Función auxiliar: playTone(freq, type, dur, vol, delay)
Función auxiliar: playChord(freqs[], dur, vol)

Todos usando AudioContext con manejo de errores try/catch.
El audio solo se inicializa tras gesto del usuario (policy compliance).
```

---

**PROMPT 3.2 — Música Ambiental Generativa Avanzada**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Necesito un sistema de música ambiental generativa avanzada para AGROPOLY BFA usando Web Audio API.

La música debe evocar El Salvador: cálida, rural, esperanzadora.
Inspiración: marimba centroamericana + ambient electrónico suave + folk agrícola.

Requisitos musicales:
- Escala: pentatónica de Do mayor (C-D-E-G-A) en múltiples octavas
- Tempo: ~72 BPM (tranquilo pero no aburrido)
- Densidad: una nota cada 400–1000ms (aleatorio, no robótico)
- Dinámica: variaciones de volumen suaves (ebb and flow)
- Estructura: 4 capas independientes

Capa 1 — Drones bajos:
  Osciladores a 65Hz, 98Hz, 131Hz (síntesis aditiva)
  Muy bajo volumen (0.006 cada uno)

Capa 2 — Melodía principal:
  Osciladores triangle/sine alternando
  Notas de escala pentatónica + octavas altas
  Envolvente: attack 50ms, decay/release exponencial 1.2s

Capa 3 — Contramelodia:
  Notas de escala pentatónica en registro medio
  Frecuencia menor: una nota cada 1–3s
  Oscillator type: triangle

Capa 4 — Percusión sintética:
  Buffer de ruido blanco × 100ms con envolvente rápida
  Simula marimba/claves/tambor
  Cada 1.5–2s con variación

Capa 5 — Reverb convolver (room simulation):
  Impulse response sintético generado con ruido coloreado
  Tail: 2 segundos

Controles:
- startAmbientMusic(): inicia todas las capas con fade-in de 3s
- stopAmbientMusic(): stop con fade-out de 1s, limpia todos los nodos
- setMusicVolume(0–1): control de volumen master
- musicEnabled flag: respeta preferencia del usuario

Manejo correcto de memory leaks (disconnect todos los nodos al parar).
```

---

**PROMPT 3.3 — Animaciones CSS Avanzadas**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el sistema completo de animaciones CSS para AGROPOLY BFA.

Animaciones @keyframes requeridas:

1. tokenMove — movimiento suave del token entre casillas
   Debe verse "físico": jump arc, land with bounce
   Timing: 400ms, cubic-bezier(0.34, 1.56, 0.64, 1)

2. cellHighlight — casilla que recibe al token
   Flash dorado → transparente en 400ms

3. diceRoll — animación de dado rodando
   3D rotate en X e Y, multiple rotaciones rápidas
   50 frames, random directions

4. cardFlip — tarjeta Cosecha/Riesgo volteándose
   scaleX(0) a scaleX(1) con cambio de contenido en el medio

5. coinFloat — moneda ƒ flotando hacia arriba al ganar/perder
   translateY(-80px) + fade out + scale down

6. buildingPop — punto de atención apareciendo en la casilla
   scale(0) → scale(1.2) → scale(1), elastic

7. splashTitle — entrada del título AGROPOLY en el splash
   clip-path reveal + letter-spacing expanding

8. turnTransition — overlay de cambio de turno
   fade in rápido (200ms) + stay (900ms) + fade out (300ms)

9. particleField — fondo animado del splash
   multiple dots flotando con velocidades distintas

10. winnerCelebration — confeti explosivo en la pantalla ganadora
    Múltiples emojis flotando desde distintas posiciones

Para cada animación incluir:
- El @keyframes completo
- La clase CSS que lo aplica
- El JS para activar/desactivar la clase
```

---

### FASE 4: Efectos 3D y Visuales Avanzados

**Modelo:** `claude-sonnet-4-6` (o `claude-opus-4-6` si el shader GLSL es complejo)

---

**PROMPT 4.1 — Dados 3D con CSS**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa dados 3D completamente funcionales para AGROPOLY BFA usando CSS transform-3d puro (sin WebGL, sin Three.js).

Estructura HTML de un dado:
- div.die-container (perspective: 200px)
  - div.die (transform-style: preserve-3d)
    - 6 div.face (top, bottom, front, back, left, right)
    - Cada cara con su número (⚀ ⚁ ⚂ ⚃ ⚄ ⚅)

Diseño visual de cada cara:
- Fondo: rgba(255,255,255,0.12) con glassmorphism
- Borde: 1px solid rgba(255,255,255,0.2) con border-radius 12px
- Cara del 6: muestra el símbolo ƒ o el logo BFA en dorado
- Dots: círculos verdes (#2E8B4A) sobre fondo claro

Animación de lanzamiento:
- 8 rotaciones aleatorias rápidas (60ms cada una)
- Cada rotación es a una orientación aleatoria en X e Y
- La última rotación es a la cara correspondiente al resultado
- Timing final: ease-out 300ms

Función setDiceFace(dieEl, value):
  Calcula la rotación exacta (rotateX, rotateY) para cada valor 1–6:
  1: front, 2: top, 3: right, 4: left, 5: bottom, 6: back

Función animateDiceRoll(die1El, die2El, result1, result2, callback):
  Anima ambos dados simultáneamente hacia sus resultados finales.

Colores: dados translúcidos verdes con brillo dorado en los puntos.
El dado debe verse premium, no plástico básico.
```

---

**PROMPT 4.2 — Tablero con Profundidad Visual**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el sistema visual del tablero AGROPOLY BFA con efectos de profundidad y brillo.

El tablero es un CSS Grid de 11×11. Mejoras visuales requeridas:

1. Fondo del tablero:
   Gradiente radial verde oscuro con vignette en las esquinas
   Trama de líneas sutiles (repeating-linear-gradient) simulando madera
   Box-shadow múltiple: exterior difuso + borde interior dorado

2. Casillas de propiedades:
   Band de color superior (5px) con gradiente del color del grupo
   Al hacer hover: elevación sutil (translateY -1px + shadow)
   Cuando tiene dueño: overlay con el emoji del jugador + color border
   Cuando hipotecada: overlay semi-transparente con texto "HIPOTECADO"

3. Casillas especiales (esquinas):
   Ligeramente más grandes (ya están en corners)
   INICIO: gradiente dorado, borde brillante
   EMERGENCIA: gradiente rojo oscuro, borde rojo
   FERIA: gradiente verde, icono centrado grande
   IR A EMERGENCIA: gradiente rojo con animación subtle de pulso

4. Centro del tablero:
   Logo AGROPOLY con gradiente dorado animado (shimmer effect)
   Fondo con radial gradient verde + transparente
   Trama de cuadrícula sutil como mapa topográfico

5. Tokens en el tablero:
   Font-size responsive clamp(10px, 2.2vw, 16px)
   Drop-shadow de color del token
   Al moverse: traza un arco visual (CSS animation)
   Múltiples tokens en misma casilla: desplazamiento diagonal

6. Indicadores de mejoras:
   Puntos de Atención: círculos verdes pequeños (4px)
   Centro de Servicio: cuadrado dorado (6px × 6px)
   Aparecen en la parte inferior de la casilla

Asegura que todo sea responsive: el tablero debe ser un cuadrado perfecto
usando min(96vw, 96vh, 620px).
```

---

**PROMPT 4.3 — Sistema de Partículas y Efectos de Fondo**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el sistema de partículas del fondo de AGROPOLY BFA usando Canvas 2D.

Canvas #particles está en position:fixed, z-index:0, pointer-events:none.
El canvas debe cubrir toda la pantalla y escalar con resize.

Partículas básicas (siempre activas en splash/setup):
- 55 partículas flotando hacia arriba
- Colores alternados: #2E8B4A (verde) y #F5C518 (dorado)
- Velocidad: vy = -(0.1 a 0.5), vx = ±0.15
- Tamaño: 0.5 a 2.5px (círculos)
- Opacidad: 0.1 a 0.5
- Loop: cuando salen por arriba, reinician desde abajo

Partículas de evento (spawn on demand):
función spawnEventParticles(x, y, count, color):
  count partículas desde (x,y)
  Velocidades aleatorias en 360°
  Tamaño: 3–8px
  Gravedad: vy += 0.1 por frame
  Lifetime: 60 frames, fade out al final
  Uso: al comprar propiedad, ganar renta, etc.

función spawnCoinParticle(x, y, value, positive):
  Label de texto flotante ("+ƒ200" o "-ƒ150")
  Font: Space Mono 12px bold
  Color: verde si positive, rojo si negative
  Flota hacia arriba 80px en 800ms, fade out
  Se renderiza en el canvas de partículas

Efecto de celebración (winner):
función spawnFireworksParticles():
  10 explosiones en posiciones aleatorias de la pantalla
  Cada explosión: 25 partículas en burst desde el centro
  Colores: #F5C518, #2E8B4A, #fff, #E8A020
  Tamaños: 3–12px, formas: círculo y estrella (★)
  Duración: 2 segundos
  Llama a SFX.win()

El canvas debe tener willReadFrequently: false (optimización).
Usa ImageData batching si hay más de 100 partículas activas.
```

---

### FASE 5: Tarjetas y Billetes (Arte Visual)

**Modelo:** Claude Designer

---

**PROMPT 5.1 — Tarjeta de Propiedad (Claude Designer)**
```
[Contexto: AGROPOLY BFA — juego de mesa del Banco de Fomento Agropecuario de El Salvador]

Diseña una tarjeta de propiedad para el juego AGROPOLY BFA.
Propiedad de ejemplo: "Agencia Av. Olímpica" (Casa Matriz BFA)

Especificaciones:
- Tamaño: 57×89 mm (formato estándar poker)
- Grupo: Casa Matriz (color #00297A — azul marino profundo)

Diseño del FRENTE:

CABECERA (25% superior):
- Fondo sólido #00297A
- Texto centrado: "CASA MATRIZ" en DM Sans 700, 9px, tracking 2px, blanco
- Nombre grande: "Av. Olímpica" en Playfair Display 700 italic, 17px, blanco
- Precio: "ƒ400" en Space Mono 700, 20px, #F5C518 (dorado)
- Pequeña ilustración isométrica flat: edificio BFA visto desde arriba (10×10mm)
  Colores: azules + dorado, estilo icono minimalista

CUERPO (65% central):
- Fondo blanco #ffffff
- Tabla de rentas con 2 columnas (izquierda: descripción, derecha: valor)
- Fuente: DM Sans 400, 8px para descripción, Space Mono 700, 9px para valores
- Filas alternadas: blanco y #f8f8f8
- Línea destacada (negrita): "Servicio" (sin mejoras) y "Centro de Servicio BFA"
- Tabla completa:
  · Servicio solo:         ƒ50
  · Con 1 Punto de Atención:  ƒ200
  · Con 2 Puntos:         ƒ600
  · Con 3 Puntos:         ƒ1,400
  · Con 4 Puntos:         ƒ1,700
  · Centro de Servicio BFA: ƒ2,000
  · [divisor]
  · Punto de Atención:    ƒ200
  · Hipoteca:             ƒ200

PIE (10% inferior):
- Fondo #f0f0f0
- Texto: "BANCO DE FOMENTO AGROPECUARIO" en DM Sans 500, 7px, #666
- Logo BFA pequeño (6×6mm) a la izquierda

REVERSO:
- Fondo sólido con el color del grupo (#00297A)
- Logo AGROPOLY centrado (texto dorado #F5C518 en Playfair Display)
- Patrón geométrico de fondo: líneas diagonales sutiles blancas 5% opacidad
- Slogan: "Banco de Fomento Agropecuario" en DM Sans 400, 9px, blanco 60%

Entrega: SVG vectorial o especificación exacta para CSS/HTML implementation.
```

---

**PROMPT 5.2 — Tarjeta Cosecha (Claude Designer)**
```
[Contexto: AGROPOLY BFA — juego de mesa del Banco de Fomento Agropecuario]

Diseña una tarjeta de EVENTO tipo "Cosecha" para AGROPOLY BFA.
(Equivalente a Community Chest en Monopoly clásico)

Ejemplo de carta: "Cosecha de Café Excepcional"

Especificaciones:
- Tamaño: 57×89 mm
- Concepto: POSITIVA — el jugador recibe beneficio económico

FRENTE:

CABECERA (15%):
- Fondo: gradiente diagonal #1B6B2F → #2E8B4A (verde BFA)
- Texto: "🌽 TARJETA COSECHA" en Space Mono 700, 8px, tracking 3px, blanco 70%

CUERPO CENTRAL (70%):
- Fondo: blanco cálido #FDF8EE
- Ícono principal centrado: ☕ a 48px, con sombra suave verde
- Título: "Cosecha de Café Excepcional" en Playfair Display 700, 15px, #0D2B14
  (máximo 2 líneas, centrado)
- Texto narrativo: "Tus granos de oro llegaron a mercados europeos con
  denominación de origen salvadoreña."
  DM Sans 400, 11px, #4A4A4A, centrado, máximo 3 líneas

EFECTO (badge dorado, 15% inferior):
- Pill badge: fondo #F5C518, bordes redondeados 100px
- Texto: "✅ Cobra ƒ300 del Banco" en DM Sans 700, 13px, #0D2B14
- Sutil shimmer animation (para versión digital)

PIE:
- Línea verde #2E8B4A de 2px
- Logo BFA tiny + texto "BFA Educación Financiera" en 7px, gris

REVERSO:
- Fondo sólido #1B6B2F
- Gran ícono 🌽 centrado, 64px, opacity 0.6
- Texto "TARJETA COSECHA" en Playfair Display 700 italic, 22px, #F5C518
- Borde interior dorado (inset border): 2px, #F5C518, opacity 0.3
- Patrón de fondo: repetición de pequeño símbolo ƒ en verde más oscuro

Debe verse profesional como una tarjeta de juego comercial (Monopoly premium edition).
El reverso debe ser igual para TODAS las tarjetas Cosecha (mantiene secreto).
```

---

**PROMPT 5.3 — Billete Fomento ƒ100 (Claude Designer)**
```
[Contexto: AGROPOLY BFA — juego de mesa del Banco de Fomento Agropecuario]

Diseña el billete de ƒ100 (cien Fomentos) para AGROPOLY BFA.
Este es el billete "azul" de denominación media-alta.

Especificaciones físicas:
- Tamaño: 156×66 mm (tamaño estándar billete de juego)
- Nombre: "La Costa" — representa la riqueza marino-costera de El Salvador

FRENTE:

Fondo base:
- Gradiente: #0d2040 → #1a3a5c (azul marino profundo)
- Trama de seguridad: micropatrón de líneas curvadas #1E3F6B (apenas visible)
- Marca de agua sutil: silueta del mapa de El Salvador, opacity 5%

Zona izquierda (40%):
- Denominación: "ƒ100" en Space Mono 900, 32px, #1E88E5 (azul brillante)
- "CIEN FOMENTOS" en DM Sans 700, 8px, tracking 2px, #fff opacity 60%
- Firma digital: "Banco de Fomento Agropecuario" cursiva 8px

Centro (20%):
- Círculo o medallón con ilustración flat isométrica:
  Una lancha de pesca artesanal salvadoreña en el océano Pacífico
  Colores cálidos: naranja sunset + azul océano + verde selva costera
  Estilo: sello oficial / grabado en dos colores
  Diámetro visual: ~25mm

Zona derecha (40%):
- "BANCO DE FOMENTO AGROPECUARIO" en DM Sans 700, 7px, tracking 1px, blanco 70%
- "EL SALVADOR · EST. 1973" en Space Mono, 7px, blanco 40%
- Número de serie: "BFA-2024-100-000001" en Space Mono 400, 6px, blanco 25%

Bandeado de seguridad:
- Línea vertical delgada (2px) en color metalizado #1E88E5 al 40% del billete

REVERSO:

Fondo: misma paleta azul, más oscuro
Mapa de El Salvador outline (líneas blancas 30% opacidad)
Región costera destacada: Sonsonate, Ahuachapán, La Libertad, Usulután, La Unión
Dato de orgullo: "Puerto de Acajutla — principal puerto de El Salvador"
Borde decorativo: patrón geométrico inspirado en artesanía salvadoreña

Tipografía del reverso en DM Sans 400, 9px, blanco 60%.
Emblema BFA pequeño (5×5mm) en esquina inferior derecha.

El billete debe verse coleccionable y premium, con calidad de billete oficial de juego.
```

---

### FASE 6: Componentes UI/UX

**Modelo:** `claude-sonnet-4-6`

---

**PROMPT 6.1 — Modal de Compra de Propiedad**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el modal completo de compra de propiedad para AGROPOLY BFA.
Función: showPropModal(player, space, doubles)

El modal debe mostrar:

1. Tarjeta de propiedad renderizada en HTML/CSS:
   - Header con color del grupo, nombre de región, nombre propiedad, precio
   - Body blanco con tabla de rentas (6 niveles)
   - Footer con precio de mejora e hipoteca
   - Colores exactos del grupo correspondiente

2. Info del jugador:
   - Balance actual, si puede pagar o no
   - Si no puede pagar: mensaje de advertencia + opción de subastar

3. Botones dinámicos:
   - [Comprar ƒX] — solo si balance >= precio, primary button
   - [Subastar] — siempre disponible, secondary button  
   - [Pasar] — decline, tertiary button

4. Educación financiera integrada (mecánica educativa BFA):
   Tooltip o nota: explicación de qué es una propiedad hipotecaria
   en lenguaje simple para jóvenes (si Modo Educativo está activo)

Animación de entrada:
- Modal hace scale(0.95)→scale(1) + fade in
- La tarjeta de propiedad hace un flip desde el lado derecho

La tarjeta debe verse exactamente como la especificación visual:
prop-card-modal con header coloreado, body blanco, footer gris.

Implementa buyProperty(spaceId, doubles) y auctionProperty(spaceId, doubles)
como callbacks de los botones.
```

---

**PROMPT 6.2 — Panel de Propiedades con Gestión Completa**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el panel lateral de gestión de propiedades del jugador humano.
Se despliega al presionar el botón 🏦 del HUD o swipe izquierdo en móvil.

El panel debe mostrar:

SECCIÓN 1 — Resumen de patrimonio:
- Balance en efectivo: ƒX,XXX  
- Valor de propiedades (precio + mejoras)
- Patrimonio neto total: ƒX,XXX
- Barra de progreso hacia meta de ƒ5,000 (del color del token)

SECCIÓN 2 — Propiedades agrupadas por color:
Para cada grupo que el jugador posee:
- Label del grupo con su color y nombre
- Badge "GRUPO COMPLETO" si posee todas las del grupo
- Por cada propiedad:
  - Nombre, nivel de mejoras actual (iconos de punto/hotel)
  - Renta actual según mejoras
  - Estado: activa / hipotecada
  - Botones de acción:
    [🏗 +Mejora ƒ100] — si puede construir
    [🔧 -Vender ƒ50] — si tiene mejoras
    [📋 Hipotecar +ƒ200] — si sin mejoras
    [✅ Des-hipotecar ƒ220] — si hipotecada

SECCIÓN 3 — Canales BFA (estaciones):
- Cuántos posee, renta actual

SECCIÓN 4 — Carta de emergencia:
- Si tiene jailFreeCards > 0, muestra el badge verde

INTERACTIVIDAD:
- Todos los botones ejecutan las funciones correctas y actualizan el panel
- Al construir: animación de pop en la casilla del tablero
- Al hipotecar: la casilla del tablero muestra overlay "HIPOTECADO"

El panel debe ser scrollable si hay muchas propiedades.
Ancho: 280px desktop, 85vw móvil.
Transition: translateX desde la derecha.
```

---

### FASE 7: PWA y Modo Offline

**Modelo:** `claude-sonnet-4-6`

---

**PROMPT 7.1 — Service Worker para PWA**
```
Implementa el Service Worker para convertir AGROPOLY BFA en una PWA instalable.

El juego es un single HTML file. La estrategia de cache debe ser:

1. Cache on install:
   - El archivo HTML principal
   - Google Fonts CDN (Playfair Display, DM Sans, Space Mono)
   - Fallback offline page si no hay cache

2. Estrategia fetch:
   - HTML: Cache First (siempre la versión local si existe)
   - Google Fonts: Cache First (fonts no cambian)
   - Todo lo demás: Network First con fallback a cache

3. Update flow:
   - Detecta nueva versión (hash del archivo cambiado)
   - Notifica al usuario con toast(): "Nueva versión disponible. Recarga para actualizar."
   - skipWaiting() al confirmar

4. Manifest.json inline (para PWA):
   {
     name: "AGROPOLY BFA",
     short_name: "AGROPOLY",
     description: "El juego del Banco de Fomento Agropecuario",
     start_url: "./",
     display: "standalone",
     background_color: "#060E08",
     theme_color: "#0D2B14",
     icons: [
       { src: "data:image/svg+xml...", sizes: "192x192", type: "image/svg+xml" },
       { src: "data:image/svg+xml...", sizes: "512x512", type: "image/svg+xml" }
     ]
   }

5. Icono SVG inline (para no depender de archivos externos):
   Icono de la espiga de trigo 🌾 sobre fondo verde #1B6B2F
   Formato SVG embebido en base64

Incluye el registration code en el HTML principal.
Nota: todo debe ir en el mismo HTML file (service worker como blob URL).
```

---

### FASE 8: Modo Educativo BFA

**Modelo:** `claude-sonnet-4-6`

---

**PROMPT 8.1 — Sistema de Micro-lecciones Educativas**
```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa el Modo Educativo de AGROPOLY BFA.
Este modo es activable por el facilitador antes de iniciar la partida.

Cuando educationalMode = true:

1. TOOLTIPS FINANCIEROS:
   Al tomar acción (comprar, hipotecar, construir, pagar renta):
   Muestra una micro-lección de 5–8 segundos antes de ejecutar la acción.
   Ejemplo: Al comprar → "💡 ¿Qué es una propiedad? Una propiedad es un activo
   que genera ingresos pasivos. El BFA puede ayudarte a financiar la tuya."

2. GLOSARIO INTEGRADO:
   Icono ℹ️ en cada modal → abre definición del concepto en lenguaje simple
   Conceptos: crédito, ahorro, tasa de interés, hipoteca, inversión,
              seguro, renta, flujo de efectivo, diversificación, quiebra

3. QUIZ RÁPIDO POST-CARTA:
   Después de tomar una Tarjeta Cosecha o Riesgo:
   "¿Qué harías tú en esta situación?" con 3 opciones A/B/C
   Respuesta correcta → toast con explicación
   El quiz NO bloquea el juego (se puede saltar)

4. CONTADOR DE CONCEPTOS:
   Al finalizar la partida, muestra resumen educativo:
   "Conceptos financieros que practicaste hoy:"
   - Inversión en propiedades: X veces
   - Gestión de riesgo: X veces
   - Planificación financiera: X veces
   "Para aprender más, visita bfa.gob.sv/educacion-financiera"

5. TARJETAS COSECHA CON DATO BFA:
   En modo educativo, cada tarjeta Cosecha incluye un dato real:
   "¿Sabías que el BFA tiene más de 51 años apoyando a productores salvadoreños?"

Implementa educationalMode como toggle en el setup, persistente durante la partida.
Los quizzes se guardan en session (objeto educationalStats{}).
```

---

## 8. Prompts para Claude Designer — Arte y Efectos

### 8.1 Tablero Completo (Claude Designer)

```
Diseña el tablero de juego de AGROPOLY BFA. Tamaño: 50×50cm.

CONCEPTO VISUAL:
El tablero debe sentirse como un mapa de El Salvador visto desde arriba.
Verde profundo como el campo salvadoreño. Esquinas con íconos icónicos del país.

ESTRUCTURA:
- 40 casillas en perímetro (11×11 grid, esquinas más grandes ~130% del tamaño normal)
- Centro: 9×9 casillas = área del logo AGROPOLY BFA

CASILLAS DE PROPIEDAD:
Cada casilla tiene:
- Banda de color del grupo en la parte superior (5mm de alto)
- Nombre de la agencia en DM Sans 700 8pt
- Precio en Space Mono 9pt, color del grupo
- Pequeño ícono del departamento (como sello de tinta)

CASILLAS ESPECIALES:
- INICIO (esquina): borde dorado, ícono 🏁, texto "COBRA ƒ200" en verde
- EMERGENCIA CLIMÁTICA (esquina): rayos, nube de tormenta, tono rojo
- FERIA DEL CAMPO (esquina): mercado agrícola, toldo colorido, tono verde
- IR A EMERGENCIA (esquina): flecha roja dramática

CENTRO DEL TABLERO:
- Fondo: gradiente verde oscuro #0D2B14 → #1B6B2F
- Logo "AGROPOLY" en Playfair Display 900, 72pt, dorado #F5C518
- Subtítulo: "Banco de Fomento Agropecuario" en DM Sans, 14pt
- Mapa artístico de El Salvador con agencias marcadas como puntos dorados
- Eslogan: "51 años sembrando progreso · Est. 1973"
- Ícono 🌾 grande, estilizado, como emblema central

PALETA DEL TABLERO:
Fondo casillas: #0A1A0C (verde muy oscuro)
Casilla hover: rgba(46,139,74,0.2)
Bordes: rgba(46,139,74,0.3)
Texto casillas: #FDF8EE
Precio: color del grupo correspondiente

ESQUINAS DECORATIVAS (fuera de las casillas):
Cada esquina del tablero exterior tiene una ilustración pequeña:
- Abajo izquierda: Volcán Santa Ana en silueta
- Abajo derecha: Puerto de Acajutla (barco)
- Arriba izquierda: Lagos de Ilopango (agua)
- Arriba derecha: Montaña de café (grano)

Entregar como SVG o instrucciones detalladas pixel-perfect para desarrollo CSS.
```

---

### 8.2 Tokens de Jugadores (Claude Designer)

```
Diseña los 6 tokens de jugador para AGROPOLY BFA.

Para impresión física:
- Material: MDF 3mm cortado a láser, pintado a mano
- Altura: ~3cm, base circular 2cm
- Pintados con colores acrílicos + acabado satinado

Para versión digital:
- SVG o emoji estilizado con el color del token
- Con sombra de color del token al hover

Los 6 tokens:

1. LA MAZORCA (🌽)
   Color: Amarillo dorado #F5C518
   Forma: Espiga de maíz stylizada, vertical
   Detalles: Hojas verdes, granos dorados en relieve

2. EL CAFETAL (☕)
   Color: Café cálido #8B5E3C  
   Forma: Rama de café con granos maduros (rojo/rojo oscuro)
   Detalles: 3 granos rojos, hojas verdes oscuras

3. LA VACA (🐄)
   Color: Azul claro #00AEEF
   Forma: Vaca holstein estilizada, vista lateral
   Detalles: Manchas negras, cuerpo blanco

4. EL TRACTOR (🚜)
   Color: Naranja BFA #F7941D
   Forma: Tractor agrícola compacto, vista 3/4
   Detalles: Ruedas grandes, cabina pequeña

5. LA MILPA (🌿)
   Color: Verde claro #4CAF70
   Forma: Tres hojas de milpa emergiendo de la tierra
   Detalles: Racimo vertical, textura de hoja

6. EL PEZ (🐟)
   Color: Azul suave #6B9FE4
   Forma: Pez artesanal estilizado (guapote salvadoreño)
   Detalles: Escamas, aleta dorsal prominente

Cada token debe ser reconocible a 2cm de distancia y verse bien en fondo oscuro.
La base de cada token lleva el símbolo ƒ grabado.
```

---

## 9. Sistema de Sonido y Música

### 9.1 Especificación Musical Completa

#### Escala y Armonía

```
Escala base: Pentatónica de Do Mayor
Notas: C4(261.63), D4(293.66), E4(329.63), G4(392), A4(440)
        C5(523.25), D5(587.33), E5(659.25), G5(783.99), A5(880)

Tempo: 72 BPM (periodo de negra = 833ms)
Compás: libre (no estricto, variación orgánica)

Armonía base: Do Mayor → La menor → Fa Mayor → Sol Mayor
Progresión folclórica salvadoreña: I - VI - IV - V
```

#### Mapa de Efectos de Sonido

| Evento del Juego | SFX | Frecuencias | Duración | Timbre |
|---|---|---|---|---|
| Lanzar dados | `SFX.roll()` | Ruido blanco filtrado | 200ms | Percusivo |
| Token moviéndose | `SFX.move()` | 440→480→520→560 | 40ms×4 | Sine |
| Comprar propiedad | `SFX.buy()` | 523→659→784→1047 | 50ms×4 | Sine |
| Pagar renta | `SFX.rent()` | 200→150 | 200ms | Sawtooth |
| Tarjeta Cosecha | `SFX.cosecha()` | 523→587→659→698→784 | 60ms×5 | Sine |
| Tarjeta Riesgo | `SFX.riesgo()` | 300→250→200→150 | 70ms×4 | Sawtooth |
| Emergencia Climática | `SFX.jail()` | 120Hz + 80Hz | 300ms | Sawtooth+Square |
| Pasar INICIO | `SFX.pass_go()` | 523→784→1047→1318 | 80ms×4 | Sine |
| Construir mejora | `SFX.build()` | 440→554→659→830 | 50ms×4 | Square |
| Quiebra | `SFX.bankrupt()` | 200→180→160→140→120 | 100ms×5 | Sawtooth |
| Victoria | `SFX.win()` | 12 notas, melodía | 120ms×12 | Sine |

### 9.2 Prompt Específico para Audio Engine

**Modelo:** `claude-sonnet-4-6`

```
[Adjuntar: AGROPOLY_CONTEXT.md]

Crea el sistema de audio completo para AGROPOLY BFA.

PARTE 1 — Función base playTone():
function playTone(freq, type='sine', dur=0.15, vol=0.15, delay=0)
- Usa AudioContext con manejo de errores
- Envolvente: ataque 10ms, decay exponencial hasta 0.001
- Nodes: OscillatorNode → GainNode → AudioContext.destination
- Limpieza: osc.stop(ctx.currentTime + delay + dur)

PARTE 2 — Objeto SFX completo (15 métodos):
Todos los efectos según la tabla de especificación proporcionada.
Cada efecto usa 1–5 llamadas a playTone() con delays escalonados.
SFX.win() usa una melodía completa de 12 notas basada en Do Mayor.

PARTE 3 — función startAmbientMusic():
4 capas generativas como se especificó en ADR-002.
El sistema debe iniciar con fade-in de 2 segundos.
Variable musicNodes[] para poder limpiar todos los nodos al parar.

PARTE 4 — Manejo de autoplay policy:
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
Nunca crear AudioContext fuera de un evento de usuario.
En DOMContentLoaded: registrar warmUp() en primer mousedown/touchstart.

PARTE 5 — Botón mute:
musicEnabled = true por defecto
toggleMusic(): para/inicia música, actualiza ícono 🎵/🔇
El estado no persiste entre sesiones (resetea a música ON al recargar)

Todo el código en un bloque JS cohesivo, listo para pegar en el HTML.
Incluir comentarios de sección con ══ borders.
```

---

## 10. Efectos Especiales y Animaciones 3D

### 10.1 Catálogo Completo de Efectos

```
EFECTOS CSS PUROS (sin JS extra):
├── Splash background gradient animation (animBg RAF)
├── Partículas de fondo (Canvas 2D RAF)
├── Token glow en hover (filter: drop-shadow)
├── Cell highlight al aterrizar (@keyframes cellFlash)
├── Dice 3D rotation (CSS transform-style: preserve-3d)
├── Card flip (scaleX 0→1 con cambio de contenido)
├── Modal entrance (scale + opacity)
├── Turn transition overlay (fade in/stay/fade out)
├── Shimmer effect en logo dorado (linear-gradient animado)
└── Winner confetti (CSS + Canvas hybrid)

EFECTOS CANVAS:
├── Particle system ambiental (floating dots)
├── Event particles (burst al comprar/ganar)
├── Coin float labels (+ƒ200, -ƒ100)
├── Fireworks en pantalla ganadora
└── Board canvas overlay (demo estático)

EFECTOS WEB AUDIO:
├── 15 SFX distintos (síntesis FM/AM simple)
├── Música ambiental generativa (4 capas)
└── Spatial audio simulado con delay para eventos lejanos
```

### 10.2 Prompt para Efectos 3D del Tablero

**Modelo:** `claude-opus-4-6` (complejidad alta por combinación de sistemas)

```
[Adjuntar: AGROPOLY_CONTEXT.md]

Implementa efectos visuales 3D para el tablero AGROPOLY BFA.
Usando CSS 3D transforms + Canvas overlay. SIN WebGL ni Three.js.

Objetivo: hacer que el tablero tenga profundidad y vida sin sacrificar performance.

EFECTO 1 — Tablero con perspectiva (CSS):
El contenedor del tablero tiene un sutil tilt:
transform: perspective(1200px) rotateX(3deg);
transition: transform 0.5s ease;
Al hacer hover (desktop): vuelve a rotateX(0deg) como si "se levantara"
En mobile: sin tilt (performance)

EFECTO 2 — Token jumping arc (CSS + JS):
Cuando un token se mueve de casilla A a B:
- Calcula el arco mid-point entre A y B
- Usa CSS clip-path o bien keyframes con translateY negativo en el 50%
- El token "salta" visualmente entre casillas
- SFX.move() suena en cada casilla tocada

EFECTO 3 — Property glow cuando el dueño cae en ella:
Al caer el token en su propia propiedad:
- La casilla pulsa con el color del token del dueño
- filter: drop-shadow(0 0 8px [color]) animado 600ms
- Fade out suave

EFECTO 4 — Rent payment visual:
Al pagar renta:
- Un "flujo" de monedas animado del token pagador al receptor
- Implementar con divs .coin-transfer que se mueven de un punto a otro
- Usando getBoundingClientRect() para obtener posiciones absolutas
- 3 monedas animadas en secuencia (delay 100ms cada una)
- SFX.rent() en el momento del impacto

EFECTO 5 — Shimmer en propiedades valiosas (azul marino y verde SS):
Las 5 propiedades más caras (grupos 6 y 7) tienen shimmer permanente:
- ::after pseudo-element con gradiente linear animado de izquierda a derecha
- Muy sutil (opacity 0.15) para no distraer
- Solo visible en estado sin dueño (desaparece al comprar)

EFECTO 6 — Dados 3D completos (CSS):
Estructura HTML div.die con 6 faces en transform-style: preserve-3d
Cada cara posicionada exactamente en su lugar 3D
Función rollDice3D(die, result, callback)

Código listo para integrar. Performance: mantener 60fps en móvil.
No usar GSAP ni librerías externas.
```

---

## 11. Stack Tecnológico y Dependencias

### 11.1 Dependencias Externas (Solo Fuentes)

```
Google Fonts CDN (único origen externo):
  Playfair Display: 700, 900, 700italic
  DM Sans: 300, 400, 500, 600, 700
  Space Mono: 400, 700

URL: https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap

Fallback stack si no hay internet:
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-family: 'Space Mono', 'Courier New', Courier, monospace;
```

### 11.2 APIs del Navegador Utilizadas

| API | Uso | Soporte mínimo |
|---|---|---|
| Web Audio API | Música y SFX | Chrome 35+, Safari 14.5+ |
| Canvas 2D API | Partículas, tablero demo | Chrome 4+, Safari 3.1+ |
| CSS Grid | Layout del tablero | Chrome 57+, Safari 10.1+ |
| CSS Custom Properties | Design tokens | Chrome 49+, Safari 9.1+ |
| CSS Animations | Efectos visuales | Chrome 43+, Safari 9+ |
| CSS 3D Transforms | Dados, cards | Chrome 36+, Safari 9+ |
| Touch Events | Swipe móvil | iOS 2.0+, Android 2.2+ |
| Resize Observer | Board size | Chrome 64+, Safari 13.1+ |
| Service Worker | PWA offline | Chrome 40+, Safari 11.1+ |

### 11.3 Compatibilidad Garantizada

```
✅ Chrome/Edge 90+ (Windows 10 corporativo)
✅ Safari iOS 15+ (iPhone/iPad)
✅ Chrome Android 90+ (teléfonos Android)
✅ Firefox 88+ (uso personal)
⚠️ IE11: NO soportado (CSS Grid incompatible)
⚠️ Chrome < 80: Audio API puede requerir polyfill
```

---

## 12. Cronograma de Implantación

### 12.1 Fases del Proyecto

```
SEMANA 1–2: FUNDACIÓN
├── [claude-opus-4-6]  Diseño de arquitectura y ADRs
├── [claude-opus-4-6]  Game data structures (BOARD[], cards, etc.)
├── [claude-sonnet-4-6] HTML/CSS base: pantallas, layout, design tokens
└── [claude-haiku-4-5] Datos de las 40 casillas (agencias reales BFA)

SEMANA 3–4: MOTOR DE JUEGO
├── [claude-sonnet-4-6] Game engine: rollDice, processRoll, handleLanding
├── [claude-sonnet-4-6] Property system: compra, renta, mejoras, hipoteca
├── [claude-sonnet-4-6] Card system: cosecha/riesgo con todos los efectos
└── [claude-sonnet-4-6] Turn flow: advanceTurn, finishAction, quiebra

SEMANA 5: IA Y MULTIJUGADOR
├── [claude-sonnet-4-6] AI engine: aiDecideBuy, aiManageProperties
├── [claude-sonnet-4-6] 3 dificultades: Fácil, Difícil, Experto
└── [claude-opus-4-6]  Optimization: memory, timing, edge cases

SEMANA 6: AUDIO Y EFECTOS
├── [claude-sonnet-4-6] Web Audio SFX: 15 efectos
├── [claude-sonnet-4-6] Música generativa: 4 capas
├── [claude-sonnet-4-6] Animaciones CSS: 10 keyframes
└── [claude-sonnet-4-6] Partículas Canvas: ambient + events

SEMANA 7: DISEÑO VISUAL (Claude Designer)
├── [Claude Designer]  Tarjetas de propiedad: 32 diseños
├── [Claude Designer]  Tarjetas Cosecha/Riesgo: 48 diseños
├── [Claude Designer]  Billetes Fomento: 7 denominaciones (frente+reverso)
├── [Claude Designer]  Tokens: 6 personajes
└── [Claude Designer]  Tablero: arte final 50×50cm

SEMANA 8: MODO EDUCATIVO Y PWA
├── [claude-sonnet-4-6] Modo educativo: tooltips, quizzes, glosario
├── [claude-sonnet-4-6] Service Worker + PWA manifest
├── [claude-sonnet-4-6] Compatibilidad M365 (Teams/SharePoint)
└── [claude-haiku-4-5] Textos educativos, glosario financiero (30 términos)

SEMANA 9: QA Y PRODUCCIÓN
├── [claude-opus-4-6]  Code review completo
├── [claude-haiku-4-5] Generación de 100 casos de prueba
├── [claude-sonnet-4-6] Bug fixes y optimización
└── [claude-haiku-4-5] Documentación de usuario final
```

### 12.2 Entregables por Fase

| Fase | Entregable | Criterio de Aceptación |
|---|---|---|
| Fundación | BOARD[] + G{} completos | 40 casillas, datos reales BFA |
| Motor Core | partida de 2 jugadores completa | Sin crashes en 20 partidas |
| IA | Oponentes funcionales | IA hace compras en < 2s |
| Audio | 15 SFX + música ambiental | Sin errores de audio policy |
| Diseño | Arte final de todos los componentes | Aprobado por Comunicaciones BFA |
| Educativo | Modo educativo completo | Quiz funciona sin bloquear juego |
| PWA | App instalable en iOS/Android | Score Lighthouse > 85 |
| QA | Partida completa sin errores | 0 crashes en 50 sesiones de prueba |

---

## 13. Checklist de Calidad

### 13.1 Funcionalidad del Juego

```
MECÁNICAS CORE:
[ ] Lanzamiento de dados: animación 3D correcta, resultados 1–12
[ ] Movimiento de token: animación paso a paso, 120ms/casilla
[ ] Pasar INICIO: ƒ200 cobrado automáticamente
[ ] Caer exactamente en INICIO: ƒ200 extra
[ ] Dobles: 3 dobles consecutivos → Emergencia Climática
[ ] Cárcel: 3 turnos máximo, pago ƒ50, o dobles
[ ] Compra: solo si propietario undefined y balance suficiente
[ ] Renta: correctamente calculada con fórmula de mejoras
[ ] Renta doble: si dueño tiene grupo completo y sin mejoras
[ ] Construcción equilibrada: no más de 1 diferencia entre propiedades del grupo
[ ] Hipoteca: ƒprice/2 recibido, renta no cobrable
[ ] Des-hipoteca: ƒprice/2 × 1.1 cobrado
[ ] Quiebra: elimina al jugador, devuelve propiedades al banco
[ ] Victoria: último jugador o primero en ƒ5,000 netos
[ ] Tarjetas: cosecha y riesgo con efectos correctos
[ ] Canales BFA: renta escalonada 1–4 canales
[ ] Servicios: renta = dado × 4 o × 10

FLUJO DE TURNO:
[ ] Solo el jugador activo puede lanzar
[ ] IA actúa automáticamente sin input humano
[ ] Modales no se apilan (uno a la vez)
[ ] Al cerrar modal se ejecuta la acción correspondiente
[ ] nextTurn solo cuando la acción del turno está completa
```

### 13.2 UX y Performance

```
EXPERIENCIA DE USUARIO:
[ ] Tablero legible en pantallas de 320px de ancho (iPhone SE)
[ ] Tablero completo visible sin scroll en tablets (768px)
[ ] Botones con área táctil mínima 44×44px (WCAG guideline)
[ ] Animaciones respetan prefers-reduced-motion
[ ] Toast notifications desaparecen automáticamente
[ ] Paneles laterales no tapan el tablero completo en móvil
[ ] Swipe gestures funcionan sin conflicto con el scroll

PERFORMANCE:
[ ] Primer render < 3 segundos en 3G
[ ] 60fps en animaciones en Chrome móvil (Pixel 3+)
[ ] Sin memory leaks después de 10 partidas seguidas
[ ] Audio nodes limpiados después de cada efecto
[ ] Canvas particle loop no excede 2ms por frame
[ ] Service Worker carga desde cache en < 500ms

ACCESIBILIDAD:
[ ] Contraste de texto: ratio ≥ 4.5:1 para texto normal
[ ] Focus visible en todos los botones (teclado)
[ ] Alt text o aria-label en botones icónicos
[ ] Atajos de teclado documentados (ESPACIO, S, P, L, ESC)
```

### 13.3 Compatibilidad

```
BROWSERS OBJETIVO:
[ ] Chrome 90+ Windows: partida completa sin errores
[ ] Edge 90+ Windows: sin diferencias visuales respecto a Chrome
[ ] Safari iOS 15+ iPhone 12: tablero responsive correcto
[ ] Chrome Android 90+ Samsung/Pixel: touch funcionando
[ ] Firefox 88+ (desktop): sin errores de consola

M365 INTEGRATION:
[ ] Se abre correctamente embebido en SharePoint page
[ ] Se abre en Teams Tab (iframe)
[ ] Se puede adjuntar en OneDrive y compartir
[ ] No requiere permisos especiales ni extensiones
```

---

## Apéndice A — Estructura de Carpetas del Proyecto

```
agropoly-bfa/
├── AGROPOLY-BFA-GAME.html          ← Archivo principal del juego
├── AGROPOLY-BFA-Dev-Guide.md       ← Este documento
├── AGROPOLY_CONTEXT.md             ← Context file para sesiones Claude
├── design/
│   ├── tablero-arte-final.svg      ← Arte vectorial del tablero
│   ├── tarjetas-propiedad/
│   │   ├── grupo-0-occidente-i.svg
│   │   ├── grupo-1-occidente-ii.svg
│   │   └── ... (8 grupos)
│   ├── tarjetas-cosecha/
│   │   └── cosecha-01 a cosecha-24.svg
│   ├── tarjetas-riesgo/
│   │   └── riesgo-01 a riesgo-24.svg
│   ├── billetes/
│   │   ├── billete-f1-frente.svg
│   │   ├── billete-f1-reverso.svg
│   │   └── ... (7 denominaciones × 2 caras)
│   └── tokens/
│       └── token-01 a token-06.svg
├── docs/
│   ├── ADRs/
│   │   ├── ADR-001-single-file.md
│   │   ├── ADR-002-web-audio.md
│   │   └── ...
│   └── reglas/
│       ├── reglamento-completo.md
│       └── reglamento-resumido.pdf
└── tests/
    ├── test-game-scenarios.js      ← 100 escenarios de prueba
    └── test-audio.js               ← Pruebas de audio
```

---

## Apéndice B — Glosario Educativo BFA (30 términos)

Para el Modo Educativo. Lenguaje apropiado para jóvenes 9–19 años.

| Término | Definición Simple |
|---|---|
| Ahorro | Dinero que guardas hoy para usarlo mañana |
| Crédito | Dinero que el banco te presta y tú devuelves con tiempo |
| Interés | El costo de usar dinero prestado, como una renta |
| Hipoteca | Usar una propiedad como garantía para un préstamo |
| Renta | Dinero que cobras por dejar que alguien use tu propiedad |
| Inversión | Poner dinero en algo hoy para ganar más después |
| Activo | Algo que tienes y que puede generarte dinero |
| Pasivo | Deuda o gasto que tienes que pagar |
| Liquidez | Tener dinero disponible cuando lo necesitas |
| Quiebra | Cuando ya no puedes pagar tus deudas |
| Seguro | Pago pequeño periódico que te protege de pérdidas grandes |
| Microcrédito | Préstamo pequeño para emprendedores y agricultores |
| Remesa | Dinero que alguien del exterior envía a su familia |
| Diversificación | No poner todos los huevos en la misma canasta |
| Flujo de caja | El dinero que entra y sale de tu negocio |
| Patrimonio | Todo lo que tienes menos todo lo que debes |
| Capital | Dinero o recursos que usas para generar más valor |
| Subasta | Vender algo al mejor postor |
| Dividendo | Ganancia que recibes por ser parte de un negocio |
| Tasa de interés | El porcentaje que cobran o pagan por el dinero |
| Fideicomiso | Contrato donde alguien administra bienes para otro |
| Cooperativa | Grupo de personas que trabajan juntas y comparten ganancias |
| Inflación | Cuando el dinero pierde valor con el tiempo |
| Precio | Lo que pagas por obtener algo |
| Valor | Lo que algo realmente vale (puede diferir del precio) |
| Riesgo | La posibilidad de que algo malo suceda con tu dinero |
| Ganancia | Lo que sobra después de pagar todos los costos |
| Costo | Lo que gastas para producir o conseguir algo |
| Mercado | El lugar donde compradores y vendedores se encuentran |
| Monopolio | Cuando un solo vendedor controla todo el mercado |

---

*Documento generado con Claude Sonnet 4.6 · Banco de Fomento Agropecuario · El Salvador · 2025*  
*Para uso exclusivo del proyecto AGROPOLY BFA — Auditoría Interna y Área de Innovación BFA*

---

## Apéndice C — Prompts Avanzados: Power Apps M365

> Usa estos prompts cuando la versión HTML pura no sea suficiente  
> y necesites integración nativa con el ecosistema corporativo BFA.

### C.1 Canvas App Principal — Power Apps

**Modelo:** `claude-sonnet-4-6`

```
Eres un experto en Microsoft Power Apps Canvas y Power Fx.
Necesito implementar AGROPOLY BFA como una Canvas App que corra dentro del
ecosistema Microsoft 365 del Banco de Fomento Agropecuario de El Salvador.

Restricciones del entorno BFA:
- Power Apps Plan 2 / Microsoft 365 E3
- Dataverse habilitado para persistencia
- Sin conectores de terceros no aprobados
- Sin Azure Functions (solo Power Automate flows)

PANTALLA 1 — Splash/Inicio:
- Imagen de fondo: gradiente verde #0D2B14
- Label "AGROPOLY" en Playfair Display, 72pt, dorado
- Botón "Nueva Partida" → navega a Screen_Setup
- Botón "Reglas" → muestra un overlay con el texto de reglas
- Animación: Timer control que hace pulsar el logo cada 3s

PANTALLA 2 — Configuración:
- Gallery para selección de token (6 opciones con imágenes SVG inline)
- Radio buttons para número de jugadores (2–6)
- Toggle para Modo Educativo
- Botón "Iniciar" → ejecuta función InitGame()

PANTALLA 3 — Tablero Principal:
- Gallery horizontal en la parte inferior: jugadores con balances
- Canvas central: representación del tablero 11×11 con 40 casillas
  (usar Gallery o Image control con SVG generado dinámicamente)
- Panel derecho (desktop): propiedades del jugador actual
- Botón "Lanzar Dados": ejecuta RollDice()

Funciones Power Fx requeridas:
- InitGame(): inicializa colección colJugadores, colTablero, colCosecha, colRiesgo
- RollDice(): genera 2 números aleatorios RandBetween(1,6)
- MoveToken(playerIndex, steps): actualiza posición del jugador
- HandleLanding(playerIndex, spaceId): switch sobre tipo de casilla
- BuyProperty(playerIndex, spaceId): actualiza propiedad y balance

Colecciones Dataverse:
- GameSession: {sessionId, players, turnIndex, phase, createdAt}
- PlayerState: {sessionId, playerId, balance, position, properties[]}
- BoardSpace: {id, type, group, name, price, owner, buildings}

Proporciona el Power Fx completo para cada función.
Incluye manejo de errores con IfError() y Notify().
```

---

### C.2 Power Automate — Flujo de Turno IA

**Modelo:** `claude-sonnet-4-6`

```
Diseña un flujo de Power Automate para gestionar los turnos de IA en AGROPOLY BFA.

El flujo se dispara desde Power Apps via HTTP trigger cuando es el turno de un jugador IA.

Input del trigger (JSON):
{
  "sessionId": "string",
  "aiPlayerId": "integer",
  "difficulty": "easy|hard",
  "currentPosition": "integer",
  "balance": "integer",
  "ownedProperties": [integer],
  "boardState": [{ "id": int, "owner": int, "buildings": int }]
}

El flujo debe:
1. Parse del JSON de entrada
2. Determine Action:
   - Si la casilla de destino es propiedad libre:
     FÁCIL: comprar si balance >= precio (75% probabilidad via random)
     DIFÍCIL: comprar si balance >= precio × 1.2
   - Si la casilla es de otro jugador: pagar renta (calculada aquí)
   - Si es tarjeta Cosecha/Riesgo: seleccionar carta aleatoria del array
3. Actualizar Dataverse:
   - Table 'agropoly_gamestate': PUT balance del jugador IA
   - Table 'agropoly_boardstate': PUT owner de la propiedad si compró
4. Return response (JSON):
{
  "action": "buy|pay_rent|cosecha|riesgo|pass",
  "amount": integer,
  "message": "string",
  "newBalance": integer,
  "propertyBought": integer|null
}

Incluir:
- Scope para manejo de errores con Compose de mensaje de error
- Parallel Branch para actualización de ambas tablas simultáneamente
- Condition para verificar si el jugador IA tiene fondos suficientes
- Delay de 1 segundo antes del response (simula "pensar")

Diagrama del flujo en notación de texto (→ para secuencia, ↓ para condición).
```

---

### C.3 Copilot Studio — Bot "Don Fomento"

**Modelo:** `claude-sonnet-4-6`

```
Diseña un bot de Copilot Studio llamado "Don Fomento" para AGROPOLY BFA.
El bot actúa como: narrador del juego, banco, árbitro de reglas y educador financiero.

Contexto del bot:
Nombre: Don Fomento
Personalidad: Amigable, sabio, con acento salvadoreño (usa "puchica", "maje con cuidado")
Avatar: Agricultor mayor con sombrero, representando la experiencia agropecuaria del BFA

TÓPICOS DEL BOT:

Tópico 1 — Explicar Regla:
Trigger: "¿Cómo funciona [concepto]?"
Entidades: @concepto = {hipoteca, renta, construcción, subasta, emergencia, canales}
Response: Explicación en lenguaje simple + ejemplo con Fomentos
Ejemplo: "La hipoteca es como pedir prestado con tu propiedad de garantía.
El BFA te da la mitad del precio. Para recuperarla, pagás un 10% extra, vaya."

Tópico 2 — Consultar Balance:
Trigger: "¿Cuánto dinero tengo?" / "¿Cuál es mi saldo?"
Action: HTTP Get a Power Apps colJugadores para el jugador activo
Response: "Tenés ƒ{balance} en efectivo y ƒ{propValue} en propiedades. ¡Vas bien, vos!"

Tópico 3 — Solicitar Préstamo de Emergencia:
Trigger: "Necesito un préstamo" / "Estoy en quiebra"
Action: Aplica regla de hipoteca automática a la propiedad menos valiosa
Response: "Don Fomento te ayuda. Hipotequé tu propiedad {name}. Ahora tenés ƒ{amount}."

Tópico 4 — Educación Financiera:
Trigger: "¿Qué es [término]?"
Entidades: @termino = los 30 términos del glosario
Response: Definición simple + dato curioso del BFA relacionado

Tópico 5 — Resumen de Turno:
Trigger: Automático al finalizar cada turno (webhook desde Power Automate)
Response: Narración dramática del turno:
"¡Maje, qué turno el tuyo! {player} cayó en {space} y {action}. 
Su patrimonio es ahora ƒ{netWorth}. {educational_tip}"

Incluir:
- Fallback topic para preguntas no reconocidas
- Escalation a reglas completas en SharePoint
- Integración con Teams para notificaciones de turno
```

---

## Apéndice D — Prompts de Testing y QA

**Modelo:** `claude-haiku-4-5` (generación masiva de casos) + `claude-opus-4-6` (análisis de bugs complejos)

### D.1 Generación de Casos de Prueba

**Modelo:** `claude-haiku-4-5`

```
Genera 50 casos de prueba en formato tabla Markdown para el motor de juego AGROPOLY BFA.

Para cada caso incluir:
| ID | Escenario | Condición Inicial | Acción | Resultado Esperado | Verificación |

Cubrir estos módulos:
1. Dado y movimiento (10 casos):
   - Dobles normales, triple doble, pasar GO, caer exactamente en GO
   - Movimiento desde posición 38 con dado 6 (pasa por 0 correctamente)
   
2. Propiedades (10 casos):
   - Compra exitosa, compra sin fondos, caer en propia propiedad
   - Pagar renta con grupo completo, pagar renta con hotel
   
3. Construcción (8 casos):
   - Construir sin grupo completo (debe fallar)
   - Construir desequilibrado (debe fallar)
   - Construir correctamente, vender mejora
   - Intentar 6ª mejora (debe fallar, máximo 5)
   
4. Hipoteca (6 casos):
   - Hipotecar con mejoras (debe fallar)
   - Hipotecar sin mejoras, des-hipotecar
   - Cobrar renta en propiedad hipotecada (debe ser 0)
   
5. Cárcel/Emergencia (6 casos):
   - Ir a cárcel por casilla, por 3 dobles, por tarjeta riesgo
   - Salir con dobles, salir pagando, turno 4 sin dobles
   
6. Quiebra (5 casos):
   - Quiebra por renta imposible de pagar
   - Quiebra por impuesto imposible de pagar
   - Balance negativo debe disparar checkBankruptcy()
   
7. Victoria (5 casos):
   - Último jugador restante
   - Jugador alcanza ƒ5,000 netos en turno X
   - Empate técnico (sin acción, declarar ganador por patrimonio mayor)

Formato exacto de tabla, ordenado por módulo, con IDs TC-001 a TC-050.
```

---

### D.2 Prompt para Revisión de Código (Code Review)

**Modelo:** `claude-opus-4-6`

```
[Adjuntar: AGROPOLY_CONTEXT.md]
[Adjuntar: el archivo AGROPOLY-BFA-GAME.html completo]

Realiza un code review exhaustivo del motor de juego AGROPOLY BFA.

Enfócate en:

1. CORRECTITUD LÓGICA:
   - ¿La función processRoll() maneja correctamente todos los edge cases?
   - ¿checkBankruptcy() detecta quiebra antes de que el balance sea negativo?
   - ¿El cálculo de renta (calcRent) es correcto para todos los niveles?
   - ¿advanceTurn() salta correctamente a jugadores quebrados?
   - ¿La condición de victoria detecta ambos casos (último en pie y ƒ5,000)?

2. MEMORY LEAKS:
   - ¿Los audio nodes se desconectan correctamente en stopAmbientMusic()?
   - ¿Los elementos .coin-float y .board-token se eliminan del DOM?
   - ¿Los event listeners del tablero no se duplican al reconstruir el board?
   - ¿Los setTimeout tienen sus referencias guardadas para cancelación?

3. RACE CONDITIONS:
   - ¿Puede el jugador lanzar datos dos veces antes de que termine animateTokenMove?
   - ¿El botón de roll está correctamente deshabilitado durante la animación?
   - ¿Los modales pueden solaparse si dos eventos se disparan simultáneamente?

4. PERFORMANCE:
   - ¿El canvas de partículas usa requestAnimationFrame correctamente?
   - ¿updateAllTokens() se llama demasiado frecuentemente?
   - ¿Hay operaciones DOM costosas dentro de loops frecuentes?

5. SEGURIDAD (aplicable a contexto BFA):
   - ¿Hay uso de innerHTML con datos del usuario sin sanitizar?
   - ¿Hay eval() o Function() constructor?
   - ¿Los datos del juego pueden ser manipulados desde la consola del browser?

Para cada problema encontrado:
- Localización exacta (nombre de función, línea aproximada)
- Severidad: CRÍTICO / MAYOR / MENOR / SUGERENCIA
- Código del problema
- Código corregido

Finaliza con un resumen de salud del código (1–10) y las 3 mejoras más impactantes.
```

---

### D.3 Prompt para Optimización de Performance

**Modelo:** `claude-opus-4-6`

```
[Adjuntar: AGROPOLY_CONTEXT.md]

AGROPOLY BFA tiene estos síntomas de performance en dispositivos de gama baja:
- Canvas de partículas causa frame drops en Android 8 (Snapdragon 625)
- updateAllTokens() tarda > 16ms cuando hay 6 jugadores
- El modal de propiedad tarda 300ms en aparecer en iOS 14

Analiza y resuelve cada problema:

PROBLEMA 1 — Canvas de partículas:
El loop actual procesa 55 partículas con fillStyle individual por partícula.
Optimizar para batching: agrupar todas las partículas del mismo color en un path.
También: usar offscreen canvas si el browser lo soporta.
Target: < 2ms por frame en Snapdragon 625.

PROBLEMA 2 — updateAllTokens():
Actualmente llama a placeToken() para cada jugador, que hace getBoundingClientRect()
en cada casilla de cada jugador → múltiples reflows.
Solución: calcular todas las posiciones en un solo batch antes de actualizar el DOM.
Usar requestAnimationFrame para la escritura de estilos.

PROBLEMA 3 — Modal de propiedad:
El DOM del modal se reconstruye con innerHTML en cada llamada a showPropModal().
Optimizar con: document fragment, template literals pre-compilados, o virtual DOM simple.
El CSS transition debe usar transform + opacity (compositor thread) no width/height.

Para cada problema:
- Código original
- Código optimizado
- Explicación de por qué es más rápido (compositor thread, batching, etc.)
- Medición esperada de mejora (ms aproximados)
```

---

## Apéndice E — Prompts: Power BI Dashboard Educativo

**Modelo:** `claude-sonnet-4-6`

```
[Adjuntar: AGROPOLY_CONTEXT.md]

Diseña el esquema completo del Dashboard Power BI de métricas educativas para AGROPOLY BFA.

PROPÓSITO:
Medir el impacto del programa de educación financiera a través del juego AGROPOLY.
Audiencia: Dirección BFA, área de Responsabilidad Social, programa Global Money Week.

FUENTES DE DATOS:
- SharePoint List: "AGROPOLY_Sessions" (una fila por partida jugada)
- SharePoint List: "AGROPOLY_Players" (una fila por jugador por partida)
- SharePoint List: "AGROPOLY_Educational" (eventos de aprendizaje capturados)

ESQUEMA DE DATOS (tablas y columnas):

Table: Sessions
SessionId (PK), StartDate, EndDate, DurationMinutes, PlayerCount,
WinnerId, WinCondition (lastStanding|netWorth5000), EducationalMode (bool),
Location, FacilitatorName, AgeGroup (9-12|13-15|16-19|adult)

Table: Players
PlayerId (PK), SessionId (FK), TokenId, IsHuman (bool),
Difficulty, FinalBalance, FinalNetWorth, PropertiesOwned,
BuildingsBuilt, TimesJailed, TimesRented, TimesBankrupt

Table: Educational
EventId (PK), SessionId (FK), PlayerId (FK), EventType
(concept_viewed|quiz_answered|glossary_opened|card_read),
ConceptName, QuizCorrect (bool), Timestamp

VISUALS REQUERIDOS:

PÁGINA 1 — Resumen Ejecutivo:
- KPI cards: Total partidas, Total jugadores, Sesiones este mes
- Donut: Distribución por grupo de edad
- Line chart: Partidas por semana (últimas 12 semanas)
- Bar chart: Duración promedio por número de jugadores
- Map visual: Partidas por departamento de El Salvador (si hay ubicación)

PÁGINA 2 — Métricas Educativas:
- Treemap: Conceptos más vistos en modo educativo
- Bar chart: Tasa de respuesta correcta por concepto (quiz)
- Gauge: % de partidas con Modo Educativo activado
- Table: Top 10 conceptos con menor tasa de comprensión (oportunidades)
- Scatter: Correlación entre partidas jugadas y tasa de acierto en quizzes

PÁGINA 3 — Comportamiento Financiero en el Juego:
- Heatmap: Propiedades más compradas (tablero visual)
- Line: Promedio de mejoras construidas por partida (evolución temporal)
- Bar: Frecuencia de quiebra por grupo de edad
- Pie: Distribución de condiciones de victoria
- KPI: Patrimonio neto promedio del ganador

PÁGINA 4 — Reporte para Dirección:
- Texto dinámico: "Este mes AGROPOLY capacitó a X personas en conceptos financieros"
- Impact summary: Top 3 logros del mes
- Comparativo interanual
- Exportable como PDF para presentaciones

MEDIDAS DAX requeridas:
- TasaAprendizaje = DIVIDE(COUNTROWS(FILTER(Educational, Educational[QuizCorrect]=TRUE)), COUNTROWS(Educational))
- DuracionPromedio = AVERAGE(Sessions[DurationMinutes])
- JugadoresUnicos = DISTINCTCOUNT(Players[PlayerId])
- ParticidasEsteMes = CALCULATE(COUNTROWS(Sessions), DATESMTD(Sessions[StartDate]))

Proporciona:
1. Script de Power Query M para crear las tablas desde SharePoint
2. Todas las medidas DAX
3. Configuración recomendada de cada visual (tipo, campos, formato)
4. Paleta de colores del reporte: verde BFA #1B6B2F, dorado #F5C518
```

---

## Apéndice F — Prompts: Integración SharePoint / Teams

**Modelo:** `claude-sonnet-4-6`

```
[Adjuntar: AGROPOLY_CONTEXT.md]

Diseña la integración de AGROPOLY BFA con Microsoft 365 para el BFA.

ESCENARIO 1 — AGROPOLY en SharePoint:
El juego HTML se sube como archivo a una biblioteca de documentos SharePoint.
Se embebe en una SharePoint Page usando el Web Part "Embed" (iframe).

Configuración del Web Part Embed:
- URL: enlace directo al archivo HTML en SharePoint
- Altura: 600px (ajustable)
- Ancho: 100%
- Permitir scripts: activar en configuración del tenant si está deshabilitado

Crear una SharePoint Page dedicada:
- Título: "AGROPOLY BFA — Juego de Educación Financiera"
- Hero Web Part con imagen del tablero
- Text Web Part con descripción del programa
- Embed Web Part con el juego
- People Web Part con el facilitador responsable
- Links Web Part con recursos adicionales

Incluye el JSON completo de la página SharePoint (formato SPFx page JSON)
que puede importarse directamente sin configuración manual.

ESCENARIO 2 — AGROPOLY como Teams Tab:
Configurar el HTML como una Teams Personal App (Tab).

manifest.json:
{
  "$schema": "...",
  "manifestVersion": "1.17",
  "version": "1.0.0",
  "id": "[generate UUID]",
  "name": { "short": "AGROPOLY BFA", "full": "AGROPOLY — BFA Educación Financiera" },
  "description": { "short": "...", "full": "..." },
  "icons": { "color": "color.png", "outline": "outline.png" },
  "accentColor": "#1B6B2F",
  "staticTabs": [{
    "entityId": "agropoly",
    "name": "AGROPOLY",
    "contentUrl": "[URL del HTML en SharePoint]",
    "websiteUrl": "[URL del HTML]",
    "scopes": ["personal", "groupchat"]
  }]
}

Proporciona:
- El manifest.json completo listo para subir al Teams Admin Center
- Instrucciones de deployment sin necesidad de Azure
- Script PowerShell para hacer upload del archivo a SharePoint y obtener la URL
- Configuración de permisos: quién puede acceder (todos los empleados BFA)

ESCENARIO 3 — Notificaciones automáticas:
Power Automate flow que envía a un canal Teams cuando:
- Se crea una nueva partida
- Alguien completa 5 partidas (achievement)
- Un departamento supera las 50 sesiones del mes

Incluye el JSON del flow de Power Automate.
```

---

## Apéndice G — Sprint Backlog Completo (Metodología Scrum)

### G.1 Product Backlog (Priorizado por MoSCoW)

#### MUST HAVE (MVP — Semana 1–4)

| ID | User Story | Puntos | Módulo |
|---|---|---|---|
| US-001 | Como jugador quiero lanzar dados y mover mi token | 8 | Game Engine |
| US-002 | Como jugador quiero comprar propiedades disponibles | 5 | Properties |
| US-003 | Como jugador quiero pagar renta al caer en propiedad ajena | 5 | Properties |
| US-004 | Como jugador quiero saber cuándo gané o perdí | 3 | Game Flow |
| US-005 | Como jugador quiero tomar tarjetas Cosecha y Riesgo | 5 | Cards |
| US-006 | Como jugador quiero ver el tablero completo de las 40 casillas | 8 | Board |
| US-007 | Como jugador quiero jugar contra la IA | 8 | AI Engine |
| US-008 | Como jugador quiero escuchar efectos de sonido al jugar | 3 | Audio |
| US-009 | Como jugador quiero ir a Emergencia Climática y salir de ella | 5 | Jail |
| US-010 | Como jugador quiero ver el balance de todos los jugadores | 2 | HUD |

#### SHOULD HAVE (Semana 5–7)

| ID | User Story | Puntos | Módulo |
|---|---|---|---|
| US-011 | Como jugador quiero construir Puntos de Atención y Centros | 8 | Buildings |
| US-012 | Como jugador quiero hipotecar propiedades para obtener liquidez | 5 | Mortgage |
| US-013 | Como jugador quiero música de fondo durante la partida | 5 | Music |
| US-014 | Como jugador quiero animaciones fluidas en el tablero | 8 | Animations |
| US-015 | Como jugador quiero un historial del juego | 3 | Log |
| US-016 | Como facilitador quiero activar el Modo Educativo | 5 | Educational |
| US-017 | Como jugador quiero ver mis propiedades agrupadas por color | 5 | Props Panel |
| US-018 | Como jugador quiero negociar dinero con otros jugadores | 3 | Trade |

#### COULD HAVE (Semana 8–9)

| ID | User Story | Puntos | Módulo |
|---|---|---|---|
| US-019 | Como jugador quiero instalar el juego en mi teléfono (PWA) | 5 | PWA |
| US-020 | Como jugador quiero que el juego funcione sin internet | 3 | Offline |
| US-021 | Como director BFA quiero ver métricas de uso en Power BI | 8 | Analytics |
| US-022 | Como facilitador quiero acceder desde Teams | 3 | M365 |
| US-023 | Como jugador quiero un modo con dados 3D visuales | 5 | 3D Effects |
| US-024 | Como jugador quiero transiciones cinemáticas entre turnos | 3 | Cinematic |

#### WON'T HAVE (Fuera de alcance v1.0)

| ID | User Story | Razón |
|---|---|---|
| US-025 | Multijugador en red en tiempo real | Requiere servidor Node.js, fuera de restricciones BFA |
| US-026 | Guardar partida (persistencia entre sesiones) | localStorage bloqueado en corporativo |
| US-027 | Ranking global de jugadores | Requiere base de datos centralizada |
| US-028 | Versión en inglés | Fuera de alcance v1.0, planificado v2.0 |

---

### G.2 Sprint Planning — 4 Sprints × 2 Semanas

#### Sprint 1 (Semana 1–2): Fundación

```
Goal: "Tablero visible y turno básico funcional"

Stories comprometidas:
- US-006: Tablero 40 casillas (8pts) → claude-sonnet-4-6
- US-001: Dados + movimiento de token (8pts) → claude-sonnet-4-6
- US-010: HUD con balances (2pts) → claude-haiku-4-5

Definition of Done Sprint 1:
✅ Tablero renderiza en mobile y desktop
✅ Token se mueve casilla por casilla con animación
✅ HUD muestra jugador activo y balance
✅ No crashes en 20 lanzamientos de dados consecutivos

Prompts Claude en este sprint:
- PROMPT 1.1 Arquitectura (claude-opus-4-6)
- PROMPT 1.2 Game Data Structure (claude-haiku-4-5)
- PROMPT 2.1 processRoll() (claude-sonnet-4-6)
- PROMPT 4.2 Tablero visual (claude-sonnet-4-6)
```

#### Sprint 2 (Semana 3–4): Motor Económico

```
Goal: "Partida completa jugable de inicio a fin"

Stories comprometidas:
- US-002: Compra de propiedades (5pts) → claude-sonnet-4-6
- US-003: Sistema de rentas (5pts) → claude-sonnet-4-6
- US-004: Condición de victoria/quiebra (3pts) → claude-sonnet-4-6
- US-005: Tarjetas Cosecha/Riesgo (5pts) → claude-sonnet-4-6
- US-009: Sistema de cárcel (5pts) → claude-sonnet-4-6

Definition of Done Sprint 2:
✅ Se puede comprar cualquier propiedad disponible
✅ Rentas se calculan correctamente para los 5 niveles
✅ El juego detecta quiebra y victoria
✅ Las 32 tarjetas tienen efectos únicos implementados
✅ Cárcel: entrar, 3 opciones de salida, 3 turnos máximo

Prompts Claude en este sprint:
- PROMPT 6.1 Modal de compra (claude-sonnet-4-6)
- PROMPT 2.2 Sistema de construcción (claude-sonnet-4-6)
```

#### Sprint 3 (Semana 5–6): IA y Experiencia

```
Goal: "Juego fluido con IA creíble y efectos completos"

Stories comprometidas:
- US-007: IA Engine (8pts) → claude-sonnet-4-6
- US-008: SFX completos (3pts) → claude-sonnet-4-6
- US-011: Construcción de mejoras (8pts) → claude-sonnet-4-6
- US-012: Sistema de hipoteca (5pts) → claude-sonnet-4-6
- US-013: Música ambiental (5pts) → claude-sonnet-4-6
- US-014: Animaciones (8pts) → claude-sonnet-4-6

Definition of Done Sprint 3:
✅ IA hace jugadas en < 2 segundos
✅ IA compra, construye e hipoteca correctamente
✅ 15 SFX distintos y reconocibles
✅ Música ambiental sin memory leaks
✅ Token bounce animation en cada movimiento
✅ Modal flip animation en tarjetas

Prompts Claude en este sprint:
- PROMPT 2.3 AI Engine (claude-sonnet-4-6)
- PROMPT 3.1 SFX (claude-sonnet-4-6)
- PROMPT 3.2 Música generativa (claude-sonnet-4-6)
- PROMPT 3.3 Animaciones CSS (claude-sonnet-4-6)
```

#### Sprint 4 (Semana 7–9): Polish y Diseño

```
Goal: "Versión producción: arte final, PWA, modo educativo"

Stories comprometidas:
- US-015: Log de historial (3pts) → claude-haiku-4-5
- US-016: Modo Educativo (5pts) → claude-sonnet-4-6
- US-017: Panel de propiedades (5pts) → claude-sonnet-4-6
- US-018: Sistema de trade (3pts) → claude-sonnet-4-6
- US-019: PWA (5pts) → claude-sonnet-4-6
- Diseño visual completo → Claude Designer

Definition of Done Sprint 4:
✅ Lighthouse score > 85 en Performance y Accessibility
✅ PWA instalable en iOS Safari y Android Chrome
✅ Modo Educativo con 30 tooltips y 10 quizzes
✅ Arte final aprobado por Comunicaciones BFA
✅ 0 crashes en 50 sesiones de prueba end-to-end
✅ Documento de usuario disponible

Prompts Claude en este sprint:
- PROMPT 7.1 Service Worker (claude-sonnet-4-6)
- PROMPT 8.1 Modo educativo (claude-sonnet-4-6)
- PROMPT D.2 Code Review (claude-opus-4-6)
- PROMPT D.3 Optimización (claude-opus-4-6)
- Todos los prompts de Claude Designer (sección 8)
```

---

## Apéndice H — Claude Code: Sesiones de Trabajo

> Instrucciones detalladas para trabajar con **Claude Code** (CLI) en lugar de la interfaz web.

### H.1 Configuración de Sesión Claude Code

```bash
# Instalar Claude Code (si no está instalado)
npm install -g @anthropic-ai/claude-code

# Iniciar sesión en el directorio del proyecto
cd ~/agropoly-bfa
claude

# En la sesión de Claude Code, cargar el context file
/context AGROPOLY_CONTEXT.md
```

### H.2 Prompt de Inicio para Claude Code

```
Eres el desarrollador principal de AGROPOLY BFA, un juego de mesa digital
para el Banco de Fomento Agropecuario de El Salvador.

El proyecto es un single-file HTML en: ./AGROPOLY-BFA-GAME.html

REGLAS DE TRABAJO:
1. Antes de modificar el archivo, lee las líneas relevantes con Read tool
2. Usa Edit tool para cambios quirúrgicos (no reescribir todo el archivo)
3. Después de cada cambio, verifica con Bash: grep -n "functionName" archivo
4. No uses npm, no uses node_modules, no uses build steps
5. Todo cambio debe ser compatible con Chrome 90+ sin polyfills

CONTEXTO DEL CÓDIGO:
- Objeto G = estado completo del juego (línea ~500)
- BOARD[] = 40 casillas del tablero (línea ~300)
- SFX = objeto de efectos de sonido (línea ~100)
- Las funciones de pantalla empiezan en línea ~800
- El engine de juego está en línea ~1000–1800
- Los sistemas nuevos (audio, animaciones) están al final (~2000+)

Cuando te pida modificar el juego, recuerda siempre:
- Verificar que el cambio no rompe funciones existentes
- Actualizar los callbacks correctamente (no dejar funciones huérfanas)
- Probar los edge cases: quiebra, triple doble, pasar GO exactamente
```

### H.3 Prompts Específicos para Claude Code

**Para agregar una nueva tarjeta Cosecha:**
```
Lee el array COSECHA_DECK en el archivo AGROPOLY-BFA-GAME.html.
Agrega 4 nuevas tarjetas al final del array con estos eventos:

1. "Programa BFA Mujeres Rurales" — cobra ƒ120
2. "Fideicomiso FANTEL" — cobra ƒ180
3. "Bono Fertilizante MAG" — cobra ƒ75
4. "Exportación de artesanías" — cobra ƒ200

Cada tarjeta debe seguir el formato exacto de las existentes:
{ icon: '...', title: '...', text: '...', effect: (p) => { p.balance += X; return {val: X, pos: true}; } }

Verifica que el array sigue siendo válido JSON tras el cambio.
```

**Para corregir un bug:**
```
Hay un bug en la función advanceTurn(): cuando todos los jugadores
excepto uno están en quiebra, el juego no detecta la victoria.

Lee la función completa advanceTurn() en el archivo.
Identifica dónde está la verificación de remaining players.
El fix debe verificar:
  const remaining = G.players.filter(p => !p.bankrupt);
  if (remaining.length <= 1) declareWinner(remaining[0] || G.players[0]);

Asegura que declareWinner() se llama ANTES de buscar el siguiente jugador activo.
```

**Para optimizar una animación:**
```
La función updateAllTokens() llama a placeToken() en un loop y cada
llamada hace getBoundingClientRect() causando multiple layout reflows.

Optimiza usando este patrón:
1. Calcular TODAS las posiciones en un solo batch (solo lectura del DOM)
2. Luego aplicar TODAS las posiciones en un segundo batch (solo escritura)
3. Usar requestAnimationFrame para la escritura

Lee la función actual, propón el cambio, aplícalo con Edit tool.
```

---

## Apéndice I — Métricas de Éxito del Proyecto

### I.1 KPIs Técnicos

| Métrica | Herramienta de medición | Target | Frecuencia |
|---|---|---|---|
| Lighthouse Performance | Chrome DevTools | ≥ 85 | Por release |
| Lighthouse Accessibility | Chrome DevTools | ≥ 90 | Por release |
| First Contentful Paint | WebPageTest | < 3s en 3G | Por release |
| JS Bundle Size | DevTools Network | < 200KB total | Por release |
| Memory después de 10 partidas | DevTools Memory | < 50MB | Quincenal |
| Frame rate en animaciones | DevTools Performance | ≥ 55fps | Por release |
| Audio latency | Manual testing | < 100ms | Por release |
| Crash rate | Sentry (si disponible) | < 0.5% | Semanal |

### I.2 KPIs de Negocio BFA

| Métrica | Fuente de datos | Target año 1 | Responsable |
|---|---|---|---|
| Partidas jugadas totales | SharePoint List | 1,000 | Área Educación |
| Jugadores únicos | SharePoint List | 2,500 | Área Educación |
| Sesiones Modo Educativo | Power BI | 60% del total | Área Educación |
| NPS del programa | Encuesta post-sesión | > 40 | Marketing |
| Cobertura departamental | Mapa en Power BI | 14/14 departamentos | Marketing |
| Copias físicas distribuidas | Inventario BFA | 500 en año 1 | Logística |
| Menciones en medios | Clipping de prensa | 5 menciones | Comunicaciones |
| Partidas en GMW 2025 | SharePoint List | 200 en la semana | Área Educación |

---

## Apéndice J — Plantillas de Prompts Reutilizables

### J.1 Template Genérico para Nuevas Features

```
[Adjuntar: AGROPOLY_CONTEXT.md]
[Adjuntar o pegar: código relevante de AGROPOLY-BFA-GAME.html]

FEATURE: [nombre de la feature]
MÓDULO: [Game Engine | Audio | UI | Board | Cards | etc.]

DESCRIPCIÓN:
[1–2 párrafos describiendo qué debe hacer]

REGLAS DE NEGOCIO:
1. [regla 1]
2. [regla 2]
3. [regla 3]

INTEGRACIÓN CON CÓDIGO EXISTENTE:
- Funciones que llama: [lista]
- Funciones que la llaman: [lista]
- Variables de estado que modifica: [lista]

CASOS ESPECIALES:
- ¿Qué pasa si [edge case 1]?
- ¿Qué pasa si [edge case 2]?

OUTPUT ESPERADO:
- Función/s completas listas para pegar
- Sin pseudocódigo, código real y funcional
- Con comentarios de sección
- Con manejo de errores

MODELO SUGERIDO: claude-sonnet-4-6
```

### J.2 Template para Diseño Visual (Claude Designer)

```
[Adjuntar: design context BFA (sección 4.2 de este documento)]

COMPONENTE: [nombre del elemento visual]
TIPO: [card | screen | icon | badge | illustration | layout]

ESPECIFICACIONES TÉCNICAS:
- Tamaño: [dimensiones en px o mm]
- Formato de entrega: [SVG | CSS | HTML | especificación]
- Resolución objetivo: [pantalla | impresión 300dpi]

PALETA OBLIGATORIA:
[Listar solo los colores aplicables de la paleta BFA]

TIPOGRAFÍA:
- Título: Playfair Display [weight] [size]
- Cuerpo: DM Sans [weight] [size]
- Datos: Space Mono [weight] [size]

CONTENIDO:
[Texto exacto, valores, nombres que debe mostrar]

ESTILO:
[flat | glassmorphism | neumorphism | sketch | isométrico]
Referencias: [mencionar referencias visuales]

RESTRICCIONES:
- [NO hacer X]
- [Siempre incluir Y]
- [Accesibilidad: contrast ratio mínimo Z]
```

### J.3 Template para Documentación (claude-haiku-4-5)

```
Genera documentación técnica para la función [nombre].

PROPÓSITO: [1 oración]

PARÁMETROS:
- param1 (tipo): descripción
- param2 (tipo): descripción

RETORNA: (tipo) descripción

EFECTOS SECUNDARIOS:
- [lista de efectos en el DOM, estado G, audio, etc.]

EJEMPLO DE USO:
[fragmento de código mostrando cómo se llama]

ERRORES POSIBLES:
- [condición] → [qué hace]

Genera en formato JSDoc, listo para pegar antes de la función.
Máximo 20 líneas, lenguaje claro.
```

---

## Apéndice K — Decisiones de Diseño Visual Detalladas

### K.1 Rationale de la Paleta de Colores

```
VERDE #1B6B2F (Verde BFA):
Origen: Color institucional del BFA, heredado de la identidad corporativa.
Psicología: Naturaleza, crecimiento, prosperidad agrícola, confianza.
Aplicación: Botones primarios, bordes de elementos activos, headers.
Contraste con blanco: 7.2:1 (cumple WCAG AAA)

DORADO #F5C518 (Dorado BFA):
Origen: Representa el valor de la cosecha, el "oro verde" del campo.
Psicología: Riqueza, logro, éxito, sol centroamericano.
Aplicación: Valores de moneda (ƒ), títulos destacados, CTA buttons.
No usar sobre fondo blanco (contraste insuficiente).

NEGRO-VERDE #060E08 (Fondo deep):
Origen: Verde tan oscuro que parece negro — mantiene la paleta verde.
Psicología: Profundidad, concentración, elegancia nocturna.
Aplicación: Background principal de todas las pantallas del juego.

CREMA #FDF8EE (Crema cálida):
Origen: Color de la mazorca de maíz, del papel de libreta de campo.
Psicología: Calidez, tradición, tierra, lo hecho a mano.
Aplicación: Texto principal sobre fondos oscuros, body de tarjetas.
```

### K.2 Principios de Diseño de Interfaz

```
PRINCIPIO 1 — Tablero como protagonista:
El tablero de juego ocupa el 80% del viewport en mobile y el 65% en desktop.
Ningún elemento de UI debe reducir visualmente el tablero más de lo estrictamente necesario.
Los paneles laterales son overlays que aparecen sobre el tablero, nunca lo desplazan.

PRINCIPIO 2 — Jerarquía visual por valor:
Las propiedades más caras (azul marino y verde SS) tienen efectos visuales más prominentes.
El logo AGROPOLY en el centro debe verse en todo momento, nunca completamente tapado.
Los balances de los jugadores son el segundo elemento más visible.

PRINCIPIO 3 — Feedback inmediato:
Cada acción del jugador genera exactamente 3 tipos de feedback: visual + sonoro + textual.
Visual: animación o flash en la casilla/elemento afectado.
Sonoro: SFX específico para la acción.
Textual: toast notification + entrada en el log.

PRINCIPIO 4 — Mobile-first, keyboard-friendly:
Áreas táctiles mínimas 44×44px (WCAG 2.5.5).
Atajos de teclado para todas las acciones principales.
Swipe gestures para paneles en mobile.
No hover effects como única forma de revelar información.

PRINCIPIO 5 — Degradación elegante:
Si Web Audio falla → el juego funciona sin sonido, sin mensajes de error al usuario.
Si las fuentes de Google no cargan → fallback stack se activa sin cambios visuales notables.
Si Canvas no está disponible → partículas simplemente no aparecen.
Si service worker falla → el juego sigue funcionando en línea.
```

### K.3 Especificación de Animaciones

```
DURACIÓN ESTÁNDAR DE ANIMACIONES:
Micro (feedback instantáneo):  50–100ms  (click, hover states)
Transición (navegación):       200–300ms  (screen transitions, modal open/close)
Narrativa (eventos del juego): 400–800ms  (token movement, card reveal)
Cinemática (momentos especiales): 800–1200ms (turn transition, winner screen)

EASING FUNCTIONS:
Entradas:    cubic-bezier(0.0, 0.0, 0.2, 1)  — ease-out (llega suave)
Salidas:     cubic-bezier(0.4, 0.0, 1, 1)    — ease-in  (sale rápido)
Rebote:      cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot para elementos que "aterrizan"
Elástico:    cubic-bezier(0.68, -0.55, 0.27, 1.55) — para construcción de mejoras

PRINCIPIO DE ANIMACIÓN:
- Usar siempre opacity + transform (compositor thread, sin layout thrashing)
- NUNCA animar: width, height, top, left, margin, padding
- SIEMPRE animar: transform, opacity, filter
- will-change: transform; solo en elementos que siempre se animan (tokens del tablero)
```

---

## Apéndice L — Registro de Versiones del Proyecto

| Versión | Fecha | Cambios principales | Modelo usado |
|---|---|---|---|
| v0.1 | Ene 2025 | Prototipo HTML básico, tablero CSS Grid | claude-sonnet-4-6 |
| v0.2 | Ene 2025 | Motor de juego core: roll, move, buy, rent | claude-sonnet-4-6 |
| v0.5 | Feb 2025 | Sistema de tarjetas, IA básica, SFX simples | claude-sonnet-4-6 |
| v1.0 | Feb 2025 | Juego completo: construcción, hipoteca, quiebra, victoria | claude-sonnet-4-6 |
| v1.5 | Mar 2025 | Música generativa, animaciones avanzadas, panel propiedades | claude-sonnet-4-6 |
| v2.0 | Jun 2025 | Efectos 3D, modo educativo, PWA, integración M365 | claude-opus-4-6 |
| v2.1 | Planificado | Arte final Claude Designer, polish visual completo | Claude Designer |
| v3.0 | Planificado | Power Apps Canvas version, Power BI dashboard | claude-sonnet-4-6 |

---

## Apéndice M — Recursos y Referencias

### M.1 Documentación Oficial

```
Web Audio API:
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

Canvas 2D API:
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

CSS Animations:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

PWA / Service Workers:
https://web.dev/progressive-web-apps/

Power Apps Canvas:
https://docs.microsoft.com/en-us/power-apps/maker/canvas-apps/

WCAG 2.1 Accessibility:
https://www.w3.org/WAI/WCAG21/quickref/
```

### M.2 Recursos del BFA

```
Sitio oficial:        https://www.bfa.gob.sv
Programa Ed. Fin.:    https://www.bfa.gob.sv/educacion-financiera
AGROPOLY original:    https://www.bfa.gob.sv/agropoly
Global Money Week:    https://globalmoneyweek.org
```

### M.3 Herramientas de Desarrollo Recomendadas

| Herramienta | Uso | Costo |
|---|---|---|
| VS Code | Editor de código | Gratis |
| Chrome DevTools | Debug, Performance, Accessibility | Gratis (incluido en Chrome) |
| Figma | Diseño vectorial de componentes | Gratis (plan básico) |
| Adobe Illustrator | Arte vectorial final (billetes, tablero) | Licencia Adobe |
| WebPageTest | Medición de performance real | Gratis |
| Lighthouse CI | Automatización de auditorías | Gratis |
| Color Contrast Analyzer | Verificar WCAG contrast ratios | Gratis |

---

*— Fin del documento AGROPOLY-BFA-Dev-Guide.md —*

**Versión:** 2.0 completa  
**Páginas:** ~120 equivalentes  
**Prompts incluidos:** 28 prompts listos para usar  
**ADRs documentados:** 7  
**Sprints planificados:** 4  
**User Stories:** 28 (10 MVP + 8 Should + 6 Could + 4 Won't)

*Banco de Fomento Agropecuario · El Salvador · Est. 1973*  
*"Sembrando progreso desde hace más de 51 años"*
