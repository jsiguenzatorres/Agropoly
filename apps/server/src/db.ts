import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

const DB_PATH = process.env.DB_PATH ?? './data/agropoly.db'
mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS game_sessions (
    id               TEXT PRIMARY KEY,
    started_at       INTEGER NOT NULL,
    ended_at         INTEGER NOT NULL,
    mode             TEXT NOT NULL,                 -- 'solo' | 'multi'
    educational_mode INTEGER NOT NULL DEFAULT 0,    -- 0 | 1
    turn_count       INTEGER NOT NULL,
    winner_name      TEXT
  );

  CREATE TABLE IF NOT EXISTS game_results (
    session_id      TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    rank            INTEGER NOT NULL,
    name            TEXT NOT NULL,
    token_id        TEXT NOT NULL,
    is_ai           INTEGER NOT NULL DEFAULT 0,
    balance_final   INTEGER NOT NULL,
    net_worth_final INTEGER NOT NULL,
    properties      INTEGER NOT NULL DEFAULT 0,
    houses          INTEGER NOT NULL DEFAULT 0,
    hotels          INTEGER NOT NULL DEFAULT 0,
    bankrupt        INTEGER NOT NULL DEFAULT 0,
    is_winner       INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (session_id, rank)
  );

  CREATE INDEX IF NOT EXISTS idx_results_name      ON game_results(name);
  CREATE INDEX IF NOT EXISTS idx_results_winner    ON game_results(is_winner);
  CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON game_sessions(ended_at);

  CREATE TABLE IF NOT EXISTS analytics_events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ts          INTEGER NOT NULL,
    session_id  TEXT,
    user_name   TEXT,
    event_type  TEXT NOT NULL,
    payload     TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_events_ts        ON analytics_events(ts);
  CREATE INDEX IF NOT EXISTS idx_events_type      ON analytics_events(event_type);
  CREATE INDEX IF NOT EXISTS idx_events_session   ON analytics_events(session_id);

  CREATE TABLE IF NOT EXISTS historias_content (
    mascota_id  TEXT PRIMARY KEY,
    content     TEXT NOT NULL,       -- JSON-encoded full Historia object
    updated_at  INTEGER NOT NULL
  );
`)

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SessionRecord {
  id: string
  startedAt: number
  endedAt: number
  mode: 'solo' | 'multi'
  educationalMode: boolean
  turnCount: number
  winnerName: string | null
}

export interface ResultRecord {
  rank: number
  name: string
  tokenId: string
  isAI: boolean
  balanceFinal: number
  netWorthFinal: number
  properties: number
  houses: number
  hotels: number
  bankrupt: boolean
  isWinner: boolean
}

export interface SaveSessionInput {
  session: SessionRecord
  results: ResultRecord[]
}

// ─── Statements ────────────────────────────────────────────────────────────

const insertSession = db.prepare(`
  INSERT OR REPLACE INTO game_sessions
    (id, started_at, ended_at, mode, educational_mode, turn_count, winner_name)
  VALUES
    (@id, @startedAt, @endedAt, @mode, @educationalMode, @turnCount, @winnerName)
`)

const insertResult = db.prepare(`
  INSERT OR REPLACE INTO game_results
    (session_id, rank, name, token_id, is_ai, balance_final, net_worth_final,
     properties, houses, hotels, bankrupt, is_winner)
  VALUES
    (@sessionId, @rank, @name, @tokenId, @isAI, @balanceFinal, @netWorthFinal,
     @properties, @houses, @hotels, @bankrupt, @isWinner)
`)

export const saveSession = db.transaction((input: SaveSessionInput) => {
  insertSession.run({
    id:              input.session.id,
    startedAt:       input.session.startedAt,
    endedAt:         input.session.endedAt,
    mode:            input.session.mode,
    educationalMode: input.session.educationalMode ? 1 : 0,
    turnCount:       input.session.turnCount,
    winnerName:      input.session.winnerName,
  })
  for (const r of input.results) {
    insertResult.run({
      sessionId:     input.session.id,
      rank:          r.rank,
      name:          r.name,
      tokenId:       r.tokenId,
      isAI:          r.isAI ? 1 : 0,
      balanceFinal:  r.balanceFinal,
      netWorthFinal: r.netWorthFinal,
      properties:    r.properties,
      houses:        r.houses,
      hotels:        r.hotels,
      bankrupt:      r.bankrupt ? 1 : 0,
      isWinner:      r.isWinner ? 1 : 0,
    })
  }
})

// ─── Leaderboard ───────────────────────────────────────────────────────────

const leaderboardQuery = db.prepare(`
  SELECT
    name,
    COUNT(*)                                       AS games,
    SUM(is_winner)                                 AS wins,
    SUM(CASE WHEN is_winner = 0 THEN 1 ELSE 0 END) AS losses,
    ROUND(AVG(net_worth_final))                    AS avg_net_worth,
    MAX(net_worth_final)                           AS best_net_worth,
    SUM(houses)                                    AS total_houses,
    SUM(hotels)                                    AS total_hotels
  FROM game_results
  WHERE is_ai = 0
  GROUP BY name
  ORDER BY wins DESC, avg_net_worth DESC
  LIMIT @limit
`)

export interface LeaderboardEntry {
  name: string
  games: number
  wins: number
  losses: number
  avg_net_worth: number
  best_net_worth: number
  total_houses: number
  total_hotels: number
}

export function leaderboard(limit = 20): LeaderboardEntry[] {
  return leaderboardQuery.all({ limit }) as LeaderboardEntry[]
}

const recentSessionsQuery = db.prepare(`
  SELECT id, ended_at, mode, turn_count, winner_name
  FROM game_sessions
  ORDER BY ended_at DESC
  LIMIT @limit
`)

export interface RecentSession {
  id: string
  ended_at: number
  mode: string
  turn_count: number
  winner_name: string | null
}

export function recentSessions(limit = 10): RecentSession[] {
  return recentSessionsQuery.all({ limit }) as RecentSession[]
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  ts:         number
  sessionId?: string | null
  userName?:  string | null
  type:       string
  payload?:   Record<string, unknown> | null
}

const insertEvent = db.prepare(`
  INSERT INTO analytics_events (ts, session_id, user_name, event_type, payload)
  VALUES (@ts, @sessionId, @userName, @type, @payload)
`)

export const insertEvents = db.transaction((events: AnalyticsEvent[]) => {
  for (const e of events) {
    insertEvent.run({
      ts:        e.ts,
      sessionId: e.sessionId ?? null,
      userName:  e.userName ?? null,
      type:      e.type,
      payload:   e.payload ? JSON.stringify(e.payload) : null,
    })
  }
})

// Summary KPIs across a date range (ms timestamps; defaults: all-time)
export interface AnalyticsSummary {
  totalSessions:    number
  uniqueUsers:      number
  educationalPct:   number
  avgTurnsPerGame:  number
  totalEvents:      number
  totalConcepts:    number      // distinct glossary concepts revealed
  bankruptcies:     number
  trades:           number
  cardsRevealed:    number
  victoryReasons:   Array<{ reason: string; count: number }>
  byDay:            Array<{ day: string; sessions: number; events: number }>
  topCardActions:   Array<{ action: string; count: number }>
  tokensUsage:      Array<{ tokenId: string; uses: number; wins: number }>
}

const stmtTotalSessions = db.prepare(`SELECT COUNT(*) AS n FROM game_sessions WHERE ended_at BETWEEN @from AND @to`)
const stmtUniqueUsers   = db.prepare(`SELECT COUNT(DISTINCT name) AS n FROM game_results r JOIN game_sessions s ON s.id = r.session_id WHERE r.is_ai = 0 AND s.ended_at BETWEEN @from AND @to`)
const stmtEduPct        = db.prepare(`SELECT ROUND(100.0 * SUM(educational_mode) / NULLIF(COUNT(*), 0), 1) AS pct FROM game_sessions WHERE ended_at BETWEEN @from AND @to`)
const stmtAvgTurns      = db.prepare(`SELECT ROUND(AVG(turn_count), 1) AS avg FROM game_sessions WHERE ended_at BETWEEN @from AND @to`)
const stmtTotalEvents   = db.prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE ts BETWEEN @from AND @to`)
const stmtBankruptcies  = db.prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE event_type = 'bankruptcy' AND ts BETWEEN @from AND @to`)
const stmtTrades        = db.prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE event_type = 'trade_completed' AND ts BETWEEN @from AND @to`)
const stmtCards         = db.prepare(`SELECT COUNT(*) AS n FROM analytics_events WHERE event_type = 'card_revealed' AND ts BETWEEN @from AND @to`)
const stmtConcepts      = db.prepare(`
  SELECT COUNT(DISTINCT json_extract(payload, '$.id')) AS n
  FROM analytics_events
  WHERE event_type = 'concept_learned' AND ts BETWEEN @from AND @to
`)
const stmtVictoryReasons = db.prepare(`
  SELECT
    COALESCE(json_extract(payload, '$.reason'), 'unknown') AS reason,
    COUNT(*) AS count
  FROM analytics_events
  WHERE event_type = 'game_ended' AND ts BETWEEN @from AND @to
  GROUP BY reason
  ORDER BY count DESC
`)
const stmtByDay = db.prepare(`
  SELECT
    date(ts/1000, 'unixepoch') AS day,
    SUM(CASE WHEN event_type = 'game_started' THEN 1 ELSE 0 END) AS sessions,
    COUNT(*) AS events
  FROM analytics_events
  WHERE ts BETWEEN @from AND @to
  GROUP BY day
  ORDER BY day ASC
`)
const stmtTopCardActions = db.prepare(`
  SELECT
    COALESCE(json_extract(payload, '$.action'), 'unknown') AS action,
    COUNT(*) AS count
  FROM analytics_events
  WHERE event_type = 'card_revealed' AND ts BETWEEN @from AND @to
  GROUP BY action
  ORDER BY count DESC
  LIMIT 10
`)
const stmtTokens = db.prepare(`
  SELECT
    token_id AS tokenId,
    COUNT(*) AS uses,
    SUM(is_winner) AS wins
  FROM game_results r JOIN game_sessions s ON s.id = r.session_id
  WHERE s.ended_at BETWEEN @from AND @to
  GROUP BY token_id
  ORDER BY uses DESC
`)

export function analyticsSummary(fromTs = 0, toTs = Date.now()): AnalyticsSummary {
  const args = { from: fromTs, to: toTs }
  return {
    totalSessions:   (stmtTotalSessions.get(args)  as { n: number }).n,
    uniqueUsers:     (stmtUniqueUsers.get(args)    as { n: number }).n,
    educationalPct:  (stmtEduPct.get(args)         as { pct: number | null })?.pct ?? 0,
    avgTurnsPerGame: (stmtAvgTurns.get(args)       as { avg: number | null })?.avg ?? 0,
    totalEvents:     (stmtTotalEvents.get(args)    as { n: number }).n,
    totalConcepts:   (stmtConcepts.get(args)       as { n: number | null })?.n ?? 0,
    bankruptcies:    (stmtBankruptcies.get(args)   as { n: number }).n,
    trades:          (stmtTrades.get(args)         as { n: number }).n,
    cardsRevealed:   (stmtCards.get(args)          as { n: number }).n,
    victoryReasons:  stmtVictoryReasons.all(args)  as Array<{ reason: string; count: number }>,
    byDay:           stmtByDay.all(args)           as Array<{ day: string; sessions: number; events: number }>,
    topCardActions:  stmtTopCardActions.all(args)  as Array<{ action: string; count: number }>,
    tokensUsage:     stmtTokens.all(args)          as Array<{ tokenId: string; uses: number; wins: number }>,
  }
}

// Raw event timeline (for drill-down tables)
const stmtRecentEvents = db.prepare(`
  SELECT id, ts, session_id AS sessionId, user_name AS userName, event_type AS type, payload
  FROM analytics_events
  WHERE ts BETWEEN @from AND @to
  ORDER BY ts DESC
  LIMIT @limit
`)
export interface RecentEvent {
  id: number
  ts: number
  sessionId: string | null
  userName: string | null
  type: string
  payload: string | null
}
export function recentEvents(fromTs = 0, toTs = Date.now(), limit = 100): RecentEvent[] {
  return stmtRecentEvents.all({ from: fromTs, to: toTs, limit }) as RecentEvent[]
}

// ─── Historias del Campo ──────────────────────────────────────────────────

export interface Historia {
  mascotaId:       string
  nombre:          string
  rubro:           string
  zona:            string
  saludo:          string
  origen:          string
  rubroDescripcion: string
  rubroStatLabel:  string
  rubroStatValue:  string
  rubroStatNote:   string
  desafios:        string[]
  bfaProducto:     string
  bfaDescripcion:  string
  retoJugador:     string
  // Indicates the content still uses default seed text and BFA hasn't validated yet
  pendingReview:   boolean
}

const HISTORIAS_SEED: Historia[] = [
  {
    mascotaId: 'maicita', nombre: 'Maicita', rubro: 'Maíz', zona: 'Oriente: Usulután, San Miguel, La Unión',
    saludo: '¡Pues qué onda! Soy Maicita, la mazorca que alimenta cada hogar salvadoreño.',
    origen: 'Vengo de los maizales del oriente, donde la tierra todavía huele a tortilla recién hecha. Desde antes que llegara el BFA en 1973, mi familia ha sembrado el maíz que mantiene viva la mesa de El Salvador.',
    rubroDescripcion: 'El maíz no es solo un cultivo: es identidad. De cada cosecha sale el atol, la tortilla, los tamales — y miles de familias viven de él.',
    rubroStatLabel: 'Producción nacional anual', rubroStatValue: '≈ 700,000 TM', rubroStatNote: 'Cultivo de seguridad alimentaria',
    desafios: ['Sequías cada vez más largas', 'Costo creciente de fertilizantes', 'Precios bajos al productor', 'Plagas como el gusano cogollero'],
    bfaProducto: 'Crédito Granos Básicos BFA',
    bfaDescripcion: 'Financiamiento para insumos, semilla certificada y avío de cosecha — diseñado para el ciclo del maíz y frijol.',
    retoJugador: 'En AGROPOLY, completar el grupo de Occidente te da renta múltiple: igual que diversificar tu cosecha protege tu finca en la vida real.',
    pendingReview: true,
  },
  {
    mascotaId: 'don_cafe', nombre: 'Don Café', rubro: 'Café', zona: 'Cordilleras Apaneca-Ilamatepec y Tecapa-Chinameca',
    saludo: 'Buen día, joven. Soy Don Café — el grano que puso a El Salvador en el mapa del mundo.',
    origen: 'Mi historia es la historia del país: durante el siglo XX llegué a representar más de la mitad de las exportaciones nacionales. Hoy, aunque la roya y los precios me golpean, sigo dando trabajo en las alturas cafetaleras.',
    rubroDescripcion: 'El café salvadoreño es de altura, sombra y tradición. Cada quintal pasa por manos de pequeños caficultores que luchan por mantener la calidad ante la roya y el cambio climático.',
    rubroStatLabel: 'Aporte histórico al PIB', rubroStatValue: '≈ 5% (años pico)', rubroStatNote: 'Hoy menor pero estratégico',
    desafios: ['Roya y broca', 'Volatilidad del precio internacional', 'Renovación de cafetales viejos', 'Falta de relevo generacional'],
    bfaProducto: 'Crédito Renovación de Cafetales',
    bfaDescripcion: 'Financiamiento BFA a tasa preferencial para renovar plantaciones, sembrar variedades resistentes a roya y mejorar productividad.',
    retoJugador: 'En el juego, invertir en hoteles te da rentas muy altas — pero requiere paciencia. Lo mismo pasa con renovar un cafetal: la cosecha tarda 3 años, pero rinde por décadas.',
    pendingReview: true,
  },
  {
    mascotaId: 'la_vaquita', nombre: 'La Vaquita BFA', rubro: 'Ganadería y lácteos', zona: 'Sonsonate, La Unión, Chalatenango',
    saludo: '¡Muuu! Soy La Vaquita BFA — el orgullo del establo salvadoreño desde 1973.',
    origen: 'El BFA me dio nombre porque desde su fundación impulsó la modernización ganadera. Hoy somos miles de productores familiares que abastecemos leche, queso y carne para todo el país.',
    rubroDescripcion: 'El sector lácteo emplea decenas de miles de familias. La leche fresca de Sonsonate y Chalatenango llega cada mañana a las queserías artesanales que sostienen la economía rural.',
    rubroStatLabel: 'Ganaderos en el país', rubroStatValue: '≈ 27,000 productores', rubroStatNote: 'Mayoría son familias pequeñas',
    desafios: ['Costo de alimento balanceado', 'Calidad sanitaria del hato', 'Pasturas afectadas por sequía', 'Competencia de lácteos importados'],
    bfaProducto: 'Crédito Ganadero BFA',
    bfaDescripcion: 'Financiamiento para adquisición de vientres, mejoramiento genético, equipo de ordeño e infraestructura.',
    retoJugador: 'En AGROPOLY, construir casas antes que hoteles es estrategia segura. Igual que un ganadero: primero el establo y el pasto, luego la planta procesadora.',
    pendingReview: true,
  },
  {
    mascotaId: 'don_fomento', nombre: 'Don Fomento', rubro: 'Mecanización y agronegocio', zona: 'Llanuras y zonas planas: Zapotitán, Bajo Lempa, San Miguel',
    saludo: 'Bienvenido al campo, amigo. Soy Don Fomento — la maquinaria que modernizó el agro salvadoreño.',
    origen: 'Llegué con la fundación del BFA en 1973, cuando el país necesitaba pasar del azadón al tractor. Desde entonces represento el agronegocio organizado: caña, arroz, hortalizas a escala.',
    rubroDescripcion: 'La mecanización agrícola multiplica la productividad. Un tractor moderno hace en una mañana el trabajo de diez peones — pero el acceso a maquinaria sigue siendo limitado para muchos.',
    rubroStatLabel: 'Productos financiables BFA', rubroStatValue: 'Tractores, cosechadoras, riego', rubroStatNote: 'Hasta 10 años de plazo',
    desafios: ['Alto costo inicial de equipo', 'Mantenimiento técnico especializado', 'Capacitación de operadores', 'Repuestos importados'],
    bfaProducto: 'Crédito Equipos y Maquinaria Agrícola',
    bfaDescripcion: 'Financiamiento de largo plazo para adquisición de maquinaria nueva o usada, con tasas y plazos diseñados para amortizar con la producción.',
    retoJugador: 'En el juego, comprar propiedades caras al inicio limita tu flujo pero da renta alta después. La mecanización funciona igual: gran inversión, gran retorno multianual.',
    pendingReview: true,
  },
  {
    mascotaId: 'la_canche', nombre: 'La Canche', rubro: 'Agricultura familiar diversificada', zona: 'Cabañas, Chalatenango, Morazán',
    saludo: '¡Hola, vos! Soy La Canche — la milpa diversificada de la agricultura familiar.',
    origen: 'Represento a las familias que siembran maíz, frijol, ayote, loroco y hortalizas en parcelas pequeñas. Somos la mayoría de productores del país, los que mantenemos viva la cocina salvadoreña con productos frescos.',
    rubroDescripcion: 'La agricultura familiar abastece los mercados locales y garantiza variedad nutricional. No producimos a gran escala, pero somos la columna vertebral del consumo interno.',
    rubroStatLabel: 'Productores familiares', rubroStatValue: '≈ 325,000 familias', rubroStatNote: 'Pieza clave de seguridad alimentaria',
    desafios: ['Acceso limitado a mercados', 'Pérdidas post-cosecha', 'Falta de riego', 'Vulnerabilidad climática'],
    bfaProducto: 'Programa Agricultura Familiar',
    bfaDescripcion: 'Créditos pequeños, asistencia técnica y capacitación BFA orientados al pequeño productor diversificado.',
    retoJugador: 'En AGROPOLY, tener variedad de propiedades baratas también gana partidas — no solo las caras. La diversificación es estrategia, tanto en el tablero como en la milpa.',
    pendingReview: true,
  },
  {
    mascotaId: 'la_tormenta', nombre: 'La Tormenta', rubro: 'Resiliencia climática', zona: 'Zonas vulnerables: Bajo Lempa, costa, valles bajos',
    saludo: '⛈️ Soy La Tormenta — el reto climático que toda finca salvadoreña aprende a enfrentar.',
    origen: 'No soy mascota, soy realidad. Desde el huracán Mitch en 1998 hasta las tormentas tropicales recientes, mi paso ha redefinido cómo el agro debe planificar. El BFA respondió creando productos de recuperación post-desastre.',
    rubroDescripcion: 'El cambio climático intensifica fenómenos extremos: sequías más largas, tormentas más fuertes. La resiliencia ya no es opcional — es supervivencia productiva.',
    rubroStatLabel: 'Eventos relevantes SV', rubroStatValue: 'Mitch (1998), Ida (2009), Bonnie (2022)', rubroStatNote: 'Cada uno marcó política agrícola',
    desafios: ['Pérdida total de cosecha', 'Daño a infraestructura productiva', 'Descapitalización del productor', 'Adaptación de cultivos al nuevo clima'],
    bfaProducto: 'Seguro Agropecuario + Crédito Recuperación',
    bfaDescripcion: 'Cobertura ante eventos climáticos extremos y línea de crédito blanda para reactivar la producción tras desastre.',
    retoJugador: 'En el juego, la carta climática puede multiplicar tu cosecha o arruinarla. Igual en la vida real: el agricultor que tiene seguro y reserva, sobrevive y crece.',
    pendingReview: true,
  },
]

const insertHistoria = db.prepare(`
  INSERT OR REPLACE INTO historias_content (mascota_id, content, updated_at)
  VALUES (@mascotaId, @content, @updatedAt)
`)
const stmtGetHistoria  = db.prepare(`SELECT content FROM historias_content WHERE mascota_id = ?`)
const stmtAllHistorias = db.prepare(`SELECT mascota_id AS mascotaId, content, updated_at AS updatedAt FROM historias_content ORDER BY mascota_id`)

// Seed on first boot — only inserts if the row doesn't exist
HISTORIAS_SEED.forEach(h => {
  const existing = stmtGetHistoria.get(h.mascotaId)
  if (!existing) {
    insertHistoria.run({ mascotaId: h.mascotaId, content: JSON.stringify(h), updatedAt: Date.now() })
  }
})

export function getAllHistorias(): Historia[] {
  const rows = stmtAllHistorias.all() as Array<{ mascotaId: string; content: string; updatedAt: number }>
  return rows.map(r => JSON.parse(r.content) as Historia)
}

export function getHistoria(mascotaId: string): Historia | null {
  const row = stmtGetHistoria.get(mascotaId) as { content: string } | undefined
  return row ? (JSON.parse(row.content) as Historia) : null
}

export function updateHistoria(mascotaId: string, h: Historia) {
  insertHistoria.run({ mascotaId, content: JSON.stringify(h), updatedAt: Date.now() })
}
