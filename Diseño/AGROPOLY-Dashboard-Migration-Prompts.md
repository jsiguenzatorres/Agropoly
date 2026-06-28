# AGROPOLY APEX — Prompts de Migración
## Power BI → shadcn/ui Charts + Apache ECharts + Mascota La Vaquita BFA
### Instrucciones para Claude Code

---

> **Propósito de este archivo:**
> Comandos exactos listos para pegar en Claude Code o en una sesión Claude,
> para migrar el documento AGROPOLY-REACT-Dev-Guide.md reemplazando Power BI
> por el stack nativo React (shadcn/ui Charts + ECharts) y añadir la mascota
> oficial de la vaquita BFA correctamente documentada.
>
> **Modelo recomendado:** `claude-sonnet-4-6`
> **MCP requerido:** `filesystem` apuntando al proyecto

---

## PARTE 1 — Reemplazar Apéndice L completo (Power BI → Dashboard React)

### Prompt 1.1 — Reescribir el Apéndice L

Pegar este prompt en Claude Code con el MCP filesystem activo:

```
[Adjuntar o tener acceso vía MCP filesystem a: AGROPOLY-REACT-Dev-Guide.md]

Reemplaza completamente el "Apendice L -- Analytics y Power BI Dashboard"
en el archivo AGROPOLY-REACT-Dev-Guide.md.

El nuevo contenido debe llamarse:
"Apendice L -- Dashboard de Analytics (shadcn/ui Charts + Apache ECharts)"

El nuevo Apéndice L tiene 5 secciones:

────────────────────────────────────────────────────────
SECCION L.1 — Dependencias y setup (sin cambios al stack existente)
────────────────────────────────────────────────────────
Mostrar que shadcn/ui Charts ya está incluido en el stack del proyecto
(no es una dependencia nueva — es parte de shadcn/ui que ya existe).
Solo Apache ECharts se añade como dependencia nueva:

  pnpm add echarts echarts-for-react

Mostrar el import barrel en src/components/ui/chart.ts que re-exporta
los componentes shadcn/ui Chart configurados con los tokens BFA:

  AreaChart, BarChart, LineChart, DonutChart, RadarChart

Mostrar el archivo src/lib/chart-config.ts con la configuración de colores
usando los design tokens del proyecto:

  chartColors: {
    primary:   tokens.color.brand.green[500],   // #2E8B4A
    secondary: tokens.color.brand.gold[500],    // #F5C518
    groups:    Object.values(tokens.color.group).map(g => g.hex),
    positive:  tokens.color.state.success,      // #4CAF70
    negative:  tokens.color.state.danger,       // #E57373
    neutral:   tokens.color.brand.earth[500],   // #7B5228
  }

────────────────────────────────────────────────────────
SECCION L.2 — Esquema de datos de analytics (igual que antes, mantener)
────────────────────────────────────────────────────────
Mantener la interfaz GameAnalyticsEvent y la función trackEvent() que
ya existen en el documento. No cambiar nada de esta sección.

────────────────────────────────────────────────────────
SECCION L.3 — Las 4 páginas del dashboard (mismas vistas, nuevo stack)
────────────────────────────────────────────────────────
Reemplazar la descripción "Power BI" por componentes React concretos.

Para cada una de las 4 páginas, mostrar:
  a) El componente React tsx completo de esa página
  b) El hook de datos que alimenta esa página (useQuery de Supabase)
  c) El diseño visual usando los tokens BFA

PAGINA 1 — ResumenEjecutivo.tsx:
  Componentes: KPICard (×4), AreaChart (línea temporal), DonutChart (grupos de edad),
               BarChart (duración por jugadores), ElSalvadorMap (SVG custom)
  Colores: verde BFA para positivos, dorado para métricas principales
  KPIs: partidas/mes, jugadores únicos, % modo educativo, conceptos enseñados
  Fuente de datos: useQuery a Supabase game_sessions + educational_events
  Realtime: useRealtimeStats() con Supabase Realtime para KPIs en vivo

PAGINA 2 — MetricasEducativas.tsx:
  Componentes: TreemapECharts (conceptos más vistos), BarChart horizontal
               (tasa de acierto por concepto), GaugeECharts (% modo educativo),
               AreaChart (evolución semanal), ScatterECharts (correlación),
               TablaConceptos (bottom 5 con acción requerida)
  Nota: Treemap, Gauge y Scatter usan ECharts; el resto shadcn/ui Charts

PAGINA 3 — ComportamientoFinanciero.tsx:
  Componentes: BoardHeatmapECharts (heatmap visual del tablero 40 casillas),
               LineChart (patrimonio del ganador), PieChart (condición victoria),
               BarChart (frecuencia quiebra por edad), KPICard (mejoras construidas)
  ESPECIAL — BoardHeatmapECharts: renderiza visualmente el tablero de AGROPOLY
             como un heatmap 11×11 donde la intensidad del color (verde pálido a
             verde intenso BFA #2E8B4A) representa cuántas veces se compró
             esa propiedad. Las casillas especiales (cárcel, inicio, etc.)
             se muestran en dorado BFA. Usa ECharts heatmap con
             coordenadas cartesianas y tooltip con nombre de la agencia BFA.

PAGINA 4 — ReporteDireccion.tsx:
  Componentes: TextoDinamicoKPI (texto en lenguaje natural generado con
               template literals desde los datos reales), Top3Logros,
               ComparativoInteranual (BarChart grouped), ProyeccionProximoMes
               (LineChart con región sombreada de predicción usando regresión
               lineal simple en el cliente con math.js), TablaResumenDepartamentos,
               ExportarPDF button (usando window.print() + CSS @media print)

────────────────────────────────────────────────────────
SECCION L.4 — Variables y métricas equivalentes a las que tenía Power BI
────────────────────────────────────────────────────────
Reemplazar las "Medidas DAX" de Power BI por funciones TypeScript puras
que calculan exactamente los mismos valores pero en el cliente React.
Para cada medida DAX anterior, mostrar su equivalente en TypeScript:

1. TasaAprendizaje (DAX) → función calcLearningRate(events: EducationalEvent[]): number
2. PartidasEsteMes (DAX) → función getSessionsThisMonth(sessions: GameSession[]): number
3. CrecimientoMensual (DAX) → función getMonthlyGrowth(sessions: GameSession[]): number
4. PatrimonioPromedioGanador (DAX) → función getAvgWinnerNetWorth(players: SessionPlayer[]): number
5. ConceptosMenorComprension (DAX) → función getWeakConcepts(events: EducationalEvent[], topN: number): ConceptStat[]
6. JugadoresUnicosEsteMes (DAX) → función getUniquePlayersThisMonth(players: SessionPlayer[]): number
7. TextoReporteMes (DAX) → función generateReportText(stats: DashboardStats): string
8. EngagementRate (DAX) → función getEngagementRate(sessions: GameSession[]): number

Cada función debe ser pura (sin side effects), con JSDoc y TypeScript strict.
Agruparlas en src/lib/analytics-utils.ts

────────────────────────────────────────────────────────
SECCION L.5 — Hook principal del dashboard con Supabase Realtime
────────────────────────────────────────────────────────
Implementar el hook useAgropolyAnalytics() en src/hooks/useAgropolyAnalytics.ts

El hook debe:
- Usar @tanstack/react-query para fetching inicial de todos los datos
- Usar Supabase Realtime para actualizar KPIs en vivo (canal game_sessions)
- Retornar exactamente los mismos datos que antes proveía Power BI:
    { kpis, sessionsByWeek, conceptStats, boardHeatmap, ageDistribution,
      winnerNetWorth, bankruptcyByAge, reportText, isLoading, error }
- Invalidar el cache de React Query cuando llegan eventos de Supabase Realtime
- Incluir los tipos TypeScript de cada campo retornado
- Memoizar los cálculos pesados con useMemo (especialmente boardHeatmap)

Una vez aplicados los cambios al Apéndice L, también actualiza estas
2 líneas puntuales del documento:

LINEA EN EL CHECKLIST DE LANZAMIENTO (Apéndice N, DIA -1):
  ANTES: "[ ] Verificar que Power BI conecta a Supabase correctamente"
  DESPUÉS: "[ ] Verificar que el Dashboard Analytics carga datos de Supabase correctamente"

LINEA EN EL CHECKLIST (Apéndice N, POST-LANZAMIENTO semana 1):
  ANTES: "[ ] Analizar las primeras partidas en Power BI"
  DESPUÉS: "[ ] Analizar las primeras partidas en el Dashboard Analytics (/dashboard)"

También actualiza la tabla de estadísticas al final del documento:
  ANTES: "| Medidas DAX Power BI | 8 medidas |"
  DESPUÉS: "| Funciones analytics TypeScript | 8 funciones en analytics-utils.ts |"

No modifiques ninguna otra parte del documento.
```

---

## PARTE 2 — Añadir La Vaquita BFA como mascota oficial

### Prompt 2.1 — Insertar La Vaquita en la sección de mascotas

Pegar este prompt justo después de completar el Prompt 1.1:

```
[Mismo archivo AGROPOLY-REACT-Dev-Guide.md con MCP filesystem]

En la sección "1.2 Las 5 Mascotas del Universo AGROPOLY" (actualmente
tiene 5 mascotas: don_fomento, maicita, don_cafe, la_canche, la_tormenta),
añade una sexta mascota ANTES de la_tormenta en la tabla:

| la_vaquita | La Vaquita BFA | Simpática, juguetona, icónica | Voz ternera salvadoreña | Mascota oficial del BFA |

La tabla actualizada queda así (6 mascotas):
- don_fomento: Agricultor sabio (ya existe)
- maicita: Niña guía (ya existe)
- don_cafe: Empresario rival difícil (ya existe)
- la_canche: Vaquera rival fácil (ya existe)
- la_vaquita: Mascota oficial BFA (NUEVA — ver especificación abajo)
- la_tormenta: Antagonista climático (ya existe)

────────────────────────────────────────────────────────
ESPECIFICACIÓN COMPLETA DE LA VAQUITA BFA (nueva sección)
────────────────────────────────────────────────────────
Agrega una subsección titulada "1.4 La Vaquita BFA — Mascota Institucional"
con el siguiente contenido:

LA VAQUITA BFA es la mascota oficial histórica del Banco de Fomento
Agropecuario de El Salvador. Aparece en la identidad corporativa del banco
desde hace décadas y representa la esencia ganadera y agropecuaria del
sector que el BFA sirve. En AGROPOLY APEX se convierte en personaje
interactivo con voz propia y personalidad definida.

ROL EN EL JUEGO:
- Aparece siempre en la casilla INICIO como mascota de bienvenida
- Celebra cuando un jugador pasa por INICIO cobrando su ƒ200
- Es el "Banco" personificado: cuando el jugador compra propiedades,
  La Vaquita entrega los documentos con animación de sellos y papeles
- Aparece en la pantalla de VICTORIA bailando junto al ganador
- En el modo educativo, La Vaquita introduce cada nueva sesión
  con el saludo: "¡Muuu! Hoy vamos a aprender algo importante"
- Su aparición especial: cuando alguien construye un Centro de Servicio BFA
  (hotel), La Vaquita lanza confetti dorado en celebración institucional

PERSONALIDAD Y VOZ (ElevenLabs):
Carácter: Simpática, orgullosa, institucional pero cercana. Representa
los 51 años de historia del BFA con humor gentil. Habla en primera persona
como si fuera la propia institución encarnada.
Frases características:
- "¡Muuu! Así se hace, ¡eso es invertir con cabeza!"
- "Desde 1973 apoyamos al campo. ¡Y vos sos parte de eso!"
- "¡Que viva el agro salvadoreño!"
- "Puchica, qué buena transacción. El BFA está orgulloso de vos."
Configuración de voz ElevenLabs:
  - Modelo: eleven_multilingual_v2
  - Estabilidad: 0.7 (voz característica reconocible)
  - Estilo: 0.6 (expresiva pero no exagerada)
  - Tono: agudo-medio (vaca simpática, no voz grave)
  - ID de voz: vf-la-vaquita-bfa-xxxx (clonar de actriz salvadoreña)

DISEÑO VISUAL (para Claude Designer):
La Vaquita BFA debe reproducir fielmente la mascota oficial del banco:
- Vaca holstein (manchas blancas y negras) estilizada
- Tamaño: rechoncha y adorable (proporciones cartoon, no realista)
- Cuernos pequeños con lazo de moño en color amarillo dorado BFA (#F5C518)
- Collar con la campanita BFA (la campana lleva el logo del banco)
- Ojos grandes y expresivos (característica de la mascota oficial)
- Sonrisa amplia y amigable
- Cola levantada en actitud alegre
- Opcional: cargando una cartera o maletín con el logo BFA

Colores exactos del diseño:
  Pelaje blanco:  #FFFFFF con sombra suave #F0F0F0
  Manchas negras: #1A1A1A (no negro puro — más suave)
  Cuernos:        #E8D5A3 (crema cálida)
  Moño y collar:  #F5C518 (dorado BFA exacto)
  Campana:        #E8A020 (ámbar BFA)
  Nariz y pezuñas: #C49A6C (rosado-ocre)
  Ojos:           negro brillante con reflejo blanco

Tamaños de exportación (mismos que otras mascotas):
  Full body:  200×300px — panel lateral y celebraciones
  Bust:       100×100px — HUD y leaderboard
  Token 3D:   El token de jugador "La Vaquita" en el tablero 3D
              (cilindro MDF con la silueta de la vaquita láser-grabada)

Animaciones Lottie requeridas (capas nombradas para After Effects):
  cuerpo_base, manchas, cuernos, moño_campana, cabeza,
  ojo_izq, ojo_der, pestañas, nariz, cola, patas_delanteras,
  patas_traseras, bolsa_bfa, burbuja_hablando

Estados de animación:
  1. IDLE: parada, cola balanceándose suavemente, ojos parpadeando
  2. HAPPY: salta con las patas delanteras, cola giratoria, confetti
  3. WELCOMING: brazo (pata) extendido dando la bienvenida, sonrisa
  4. BANKING: entrega documentos con sello, expresión formal pero amable
  5. CELEBRATING: baila al ritmo de cumbia, campana sonando
  6. SURPRISED: ojos enormes, boca abierta, salto de susto

VOICE_IDS actualizado en src/lib/voice-engine.ts:
  Añadir al objeto VOICE_IDS:
    la_vaquita: 'vf-la-vaquita-bfa-xxxx'

MascotOrchestrator actualizado:
  Añadir en el sistema prompt de Claude para generación de diálogos:
    la_vaquita: "La Vaquita BFA es la mascota oficial del banco desde 1973.
    Habla con orgullo institucional pero de forma cercana y divertida.
    Usa 'Muuu' como expresión de emoción. Menciona la historia del BFA.
    Celebra el progreso del jugador como si fuera el banco mismo."

Disparadores de aparición de La Vaquita (nuevos eventos en GameEventType):
  'player_pass_go'        → La Vaquita aparece 2s entregando el bono
  'property_bought'       → La Vaquita entrega el documento de propiedad
  'hotel_built'           → La Vaquita celebración especial (estado CELEBRATING)
  'game_start'            → La Vaquita da la bienvenida institucional
  'victory'               → La Vaquita baila junto al ganador
  'bankruptcy'            → La Vaquita dice con tristeza "Siempre habrá
                            un nuevo ciclo. El BFA está aquí para apoyarte"

Integración con el sistema de logros:
  Nuevo logro "Amigo de La Vaquita": haber recibido 10 felicitaciones
  de La Vaquita en partidas. Recompensa: el token La Vaquita desbloqueable.

NO modifiques ninguna otra sección del documento.
Ubica la nueva subsección "1.4 La Vaquita BFA" justo después de "1.3 Los 4 Pilares".
```

---

## PARTE 3 — Verificación post-edición

### Prompt 3.1 — Verificar que los cambios son correctos

Después de aplicar los prompts 1.1 y 2.1, ejecuta este prompt de verificación:

```
[AGROPOLY-REACT-Dev-Guide.md con MCP filesystem]

Verifica que los dos cambios anteriores se aplicaron correctamente:

VERIFICACION 1 — Reemplazo de Power BI:
1. Busca en el documento cualquier mención de "Power BI", "DAX", "PAGINA 1 -- RESUMEN EJECUTIVO BFA"
   (el antiguo formato sin componentes React). Si encuentras alguna, muéstramela.
2. Verifica que el Apéndice L ahora tiene exactamente 5 secciones:
   L.1 Dependencias, L.2 Esquema de datos, L.3 Las 4 páginas, L.4 Funciones TypeScript, L.5 Hook
3. Verifica que el checklist de lanzamiento (Apéndice N) ya no menciona Power BI
4. Confirma que la tabla final de estadísticas dice "Funciones analytics TypeScript" en lugar de "Medidas DAX"

VERIFICACION 2 — La Vaquita BFA:
1. Verifica que la tabla de mascotas en la sección 1.2 tiene exactamente 6 filas
2. Verifica que la nueva sección "1.4 La Vaquita BFA — Mascota Institucional" existe
   y contiene: ROL, PERSONALIDAD, DISEÑO VISUAL, VOICE_IDS, DISPARADORES DE APARICION
3. Verifica que el ID de voz la_vaquita está incluido en la especificación de VOICE_IDS
4. Verifica que los 6 estados de animación Lottie están documentados

Si encuentras algún error o sección faltante, corrígelo directamente.
Muestra un resumen de los cambios verificados.
```

---

## PARTE 4 — Actualizar el Apéndice D (IA Engine) para incluir La Vaquita

### Prompt 4.1 — Añadir la_vaquita al sistema de mascotas en el código

```
[AGROPOLY-REACT-Dev-Guide.md con MCP filesystem]

En el Apéndice D (IA Engine), dentro de la función orchestrateMascot o
el system prompt de Claude para generación de diálogos, actualiza la
lista de mascotas disponibles para incluir la_vaquita:

ANTES (system prompt actual):
  "Mascotas: don_fomento (sabio, usa 'puchica','vaya pues'), maicita (niña entusiasta), la_tormenta (dramático)."

DESPUÉS:
  "Mascotas disponibles y cuándo usarlas:
   - don_fomento: eventos financieros generales, consejos de inversión, mentor
   - maicita: conceptos educativos, quizzes, celebraciones de aprendizaje
   - la_vaquita: eventos institucionales BFA (compra de propiedad, pasar INICIO,
     victoria, inicio de partida, construcción de Centro de Servicio)
   - la_tormenta: SOLO para tarjetas Riesgo y Emergencia Climática
   Prioridad: la_vaquita primero para eventos de propiedad y bienvenida,
   don_fomento para consejos, maicita para educación, la_tormenta para desastres."

También en el Apéndice A (Glosario), al final de la entrada 'fomento', añade:
  "Símbolo visual: La Vaquita BFA — mascota oficial del banco desde 1973,
   presente en la identidad corporativa institucional."

Solo estas dos modificaciones puntuales. No cambies nada más.
```

---

## Referencia rápida: qué cambia y qué no cambia

```
CAMBIA (Power BI → React nativo):
  Apéndice L completo (reescrito con React components)
  Checklist DIA -1: una línea
  Checklist POST-LANZAMIENTO: una línea
  Tabla de estadísticas final: una celda

CAMBIA (nueva mascota):
  Sección 1.2 tabla de mascotas: añade fila la_vaquita
  Nueva sección 1.4 completa con toda la especificación
  Apéndice D system prompt de Claude: una línea
  Apéndice A glosario entrada 'fomento': una línea

NO CAMBIA:
  Toda la arquitectura del sistema (secciones 4-18)
  Los ADRs (sección 5)
  El stack tecnológico (sección 2)
  Los MCPs (sección 3)
  El motor de juego (sección 11)
  Los prompts de desarrollo (sección 15)
  El backend y despliegue (secciones 16-17)
  El sprint backlog (sección 18)
  Los apéndices A-K, M-P (no tocados)
```

---

## Notas para el desarrollador

### Por qué shadcn/ui Charts + ECharts reemplaza a Power BI

| Aspecto | Power BI | shadcn/ui + ECharts |
|---|---|---|
| Vive dentro de la app | No (herramienta externa) | Sí (componentes React) |
| Requiere licencia | Sí (Microsoft 365) | No (MIT + Apache 2.0) |
| Personalización con tokens BFA | Limitada | Total |
| Datos en tiempo real | Requiere gateway | Supabase Realtime nativo |
| BoardHeatmap del tablero | Básico | ECharts heatmap nativo |
| Bundle añadido | 0 (externo) | ~200KB (echarts-for-react) |
| Despliegue | Separado | Incluido en la app |
| Curva de aprendizaje | Alta (DAX, Power Query) | Baja (TypeScript que ya conocés) |

### Funciones TypeScript equivalentes a las medidas DAX

Todas las medidas DAX que calculaba Power BI ahora son funciones
TypeScript puras en `src/lib/analytics-utils.ts`. Son equivalentes
matemáticamente y más fáciles de testear con Vitest.

### La Vaquita BFA — por qué es importante incluirla

La Vaquita es la mascota oficial e histórica del BFA. No incluirla
en el juego sería perder la identidad más reconocible del banco para
el público salvadoreño. Su aparición en los momentos institucionales
clave (compra de propiedad, victoria, inicio) refuerza la conexión
emocional entre el juego y el banco real.

---

*Archivo: AGROPOLY-Dashboard-Migration-Prompts.md*
*Uso: Instrucciones para Claude Code — ejecutar en orden: Prompt 1.1 → 2.1 → 3.1 → 4.1*
*Modelo recomendado: claude-sonnet-4-6*
*MCP requerido: filesystem apuntando al proyecto*
