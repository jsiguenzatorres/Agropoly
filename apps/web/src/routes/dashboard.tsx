// Analytics dashboard — KPI cards + 4 charts (sessions/day, top card actions,
// victory reasons, tokens usage). Backed by /api/analytics/summary which
// aggregates from SQLite analytics_events + game_sessions/game_results tables.

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:2567') + '/api/analytics'

const COLORS = {
  green:  '#2E8B4A',
  gold:   '#F5C518',
  amber:  '#E8A020',
  earth:  '#7B5228',
  cream:  '#FDF8EE',
  red:    '#C0392B',
  blue:   '#3498DB',
  purple: '#9B59B6',
}
const PIE_COLORS = [COLORS.gold, COLORS.green, COLORS.amber, COLORS.blue, COLORS.purple, COLORS.red, COLORS.earth]

interface Summary {
  totalSessions: number
  uniqueUsers: number
  educationalPct: number
  avgTurnsPerGame: number
  totalEvents: number
  totalConcepts: number
  bankruptcies: number
  trades: number
  cardsRevealed: number
  victoryReasons: Array<{ reason: string; count: number }>
  byDay: Array<{ day: string; sessions: number; events: number }>
  topCardActions: Array<{ action: string; count: number }>
  tokensUsage: Array<{ tokenId: string; uses: number; wins: number }>
}

type RangeKey = '24h' | '7d' | '30d' | 'all'
const RANGE_MS: Record<RangeKey, number | null> = {
  '24h': 24 * 3600 * 1000,
  '7d':  7  * 24 * 3600 * 1000,
  '30d': 30 * 24 * 3600 * 1000,
  'all': null,
}
const RANGE_LABEL: Record<RangeKey, string> = {
  '24h': 'Últimas 24h',
  '7d':  '7 días',
  '30d': '30 días',
  'all': 'Todo el tiempo',
}

const ACTION_LABEL: Record<string, string> = {
  collect:               'Cobrar',
  pay:                   'Pagar',
  move:                  'Mover',
  move_relative:         'Mover relativo',
  go_to_jail:            'Ir a Emergencia',
  jail_free:             'Salir libre',
  collect_from_players:  'Cobrar a todos',
  pay_per_building:      'Pagar x edificio',
  unknown:               'Otra',
}
const REASON_LABEL: Record<string, string> = {
  wealth:        'ƒ5,000 patrimonio',
  last_standing: 'Último en pie',
  timeout:       'Por tiempo',
  unknown:       'Sin clasificar',
}
const TOKEN_LABEL: Record<string, string> = {
  maiz: '🌽 Mazorca', cafe: '☕ Café', vaca: '🐄 Vaca',
  tractor: '🚜 Tractor', milpa: '🌿 Milpa', pez: '🐟 Pez',
}

export function Component() {
  const [range, setRange] = useState<RangeKey>('7d')

  const query = useQuery<Summary>({
    queryKey: ['analytics-summary', range],
    queryFn: async () => {
      const span = RANGE_MS[range]
      const to = Date.now()
      const from = span === null ? 0 : to - span
      const res = await fetch(`${API_URL}/summary?from=${from}&to=${to}`)
      if (!res.ok) throw new Error('Failed to load')
      return res.json()
    },
    refetchInterval: 30_000, // auto-refresh every 30s
  })

  const s = query.data

  return (
    <div className="min-h-screen bg-bfa-dark p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div className="flex items-center gap-4">
            <img
              src="/logo-bfa.png"
              alt="BFA"
              className="h-12 sm:h-14 w-auto shrink-0"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(245,197,24,0.2))' }}
            />
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-bfa-gold-500">
                Dashboard Analytics
              </h1>
              <p className="text-bfa-cream/50 mt-1 font-mono text-xs sm:text-sm">
                AGROPOLY — Métricas en tiempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/lobby" className="btn-secondary text-xs px-3 py-2">← Volver</Link>
            {(['24h', '7d', '30d', 'all'] as RangeKey[]).map(k => (
              <button
                key={k}
                onClick={() => setRange(k)}
                className={`px-3 py-2 text-xs rounded-full font-mono transition-colors ${
                  range === k
                    ? 'bg-bfa-gold-500 text-bfa-dark font-bold'
                    : 'bg-white/5 text-bfa-cream/60 hover:bg-white/10'
                }`}
              >
                {RANGE_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        {query.isLoading && <LoadingState />}
        {query.isError && <ErrorState onRetry={() => query.refetch()} />}

        {s && (
          <>
            {/* KPI grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <Kpi icon="🎲" label="Partidas"          value={s.totalSessions} />
              <Kpi icon="👥" label="Jugadores únicos"   value={s.uniqueUsers} />
              <Kpi icon="📚" label="Modo educativo"     value={`${s.educationalPct}%`} />
              <Kpi icon="🎯" label="Turnos / partida"   value={s.avgTurnsPerGame} />
              <Kpi icon="💡" label="Conceptos vistos"   value={s.totalConcepts} />
              <Kpi icon="🃏" label="Tarjetas reveladas" value={s.cardsRevealed} />
              <Kpi icon="🤝" label="Trades completados" value={s.trades} />
              <Kpi icon="💀" label="Quiebras"           value={s.bankruptcies} />
            </div>

            {/* Charts grid: 2 columns desktop, 1 mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="📈 Actividad por día" subtitle="Partidas iniciadas y eventos totales">
                {s.byDay.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={s.byDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FDF8EE15" />
                      <XAxis dataKey="day" tick={{ fill: COLORS.cream, fontSize: 11 }} stroke={COLORS.cream + '40'} />
                      <YAxis tick={{ fill: COLORS.cream, fontSize: 11 }} stroke={COLORS.cream + '40'} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12, color: COLORS.cream }} />
                      <Line type="monotone" dataKey="sessions" name="Partidas" stroke={COLORS.gold} strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="events"   name="Eventos"  stroke={COLORS.green} strokeWidth={1.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard title="🏆 Razones de victoria" subtitle="Cómo terminan las partidas">
                {s.victoryReasons.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={s.victoryReasons.map(r => ({ name: REASON_LABEL[r.reason] ?? r.reason, value: r.count }))}
                        cx="50%" cy="50%" outerRadius={90} innerRadius={45}
                        dataKey="value" stroke={COLORS.cream + '20'} strokeWidth={1}
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {s.victoryReasons.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard title="🃏 Tipos de carta más vistas" subtitle="Por acción del efecto">
                {s.topCardActions.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={s.topCardActions.map(a => ({ name: ACTION_LABEL[a.action] ?? a.action, count: a.count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FDF8EE15" />
                      <XAxis dataKey="name" tick={{ fill: COLORS.cream, fontSize: 10 }} stroke={COLORS.cream + '40'} angle={-20} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: COLORS.cream, fontSize: 11 }} stroke={COLORS.cream + '40'} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>

              <ChartCard title="🎭 Tokens preferidos y victorias" subtitle="Usos vs victorias por mascota">
                {s.tokensUsage.length === 0 ? <EmptyChart /> : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={s.tokensUsage.map(t => ({ name: TOKEN_LABEL[t.tokenId] ?? t.tokenId, uses: t.uses, wins: t.wins }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FDF8EE15" />
                      <XAxis dataKey="name" tick={{ fill: COLORS.cream, fontSize: 10 }} stroke={COLORS.cream + '40'} />
                      <YAxis tick={{ fill: COLORS.cream, fontSize: 11 }} stroke={COLORS.cream + '40'} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: 12, color: COLORS.cream }} />
                      <Bar dataKey="uses" name="Usos"      fill={COLORS.green} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="wins" name="Victorias" fill={COLORS.gold}  radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </div>

            <p className="text-center text-bfa-cream/30 text-xs font-mono mt-6">
              Datos actualizados automáticamente cada 30s · Última carga: {new Date().toLocaleTimeString()}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const tooltipStyle: React.CSSProperties = {
  background:   'rgba(13, 43, 20, 0.95)',
  border:       '1px solid rgba(245, 197, 24, 0.4)',
  borderRadius: '8px',
  fontSize:     '12px',
  color:        COLORS.cream,
}

function Kpi({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="text-xl sm:text-2xl mb-1">{icon}</div>
      <div className="font-mono font-bold text-xl sm:text-2xl text-bfa-gold-500 leading-tight">{value}</div>
      <div className="text-[10px] sm:text-xs text-bfa-cream/50 mt-1 leading-tight">{label}</div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-display font-semibold text-lg text-bfa-gold-500 leading-tight">{title}</h3>
      <p className="text-[11px] font-mono text-bfa-cream/40 mb-3">{subtitle}</p>
      {children}
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[260px] flex items-center justify-center text-bfa-cream/30 text-xs font-mono">
      Sin datos en este rango
    </div>
  )
}

function LoadingState() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-10 h-10 border-2 border-bfa-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="font-mono text-bfa-cream/40 text-sm mt-3">Cargando métricas…</p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="glass-card p-8 text-center">
      <p className="text-bfa-red text-sm mb-3">⚠️ Error cargando analytics</p>
      <p className="text-bfa-cream/50 text-xs mb-4">
        Asegurate de que el servidor esté corriendo en <code className="text-bfa-gold-500">{API_URL}</code>
      </p>
      <button onClick={onRetry} className="btn-secondary text-xs px-4 py-2">Reintentar</button>
    </div>
  )
}
