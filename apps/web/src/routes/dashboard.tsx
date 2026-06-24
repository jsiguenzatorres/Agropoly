export function Component() {
  return (
    <div className="min-h-screen bg-bfa-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-bfa-gold-500">Dashboard Analytics</h1>
          <p className="text-bfa-cream/50 mt-1 font-mono text-sm">shadcn/ui Charts + Apache ECharts</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Partidas este mes', value: '0', icon: '🎲' },
            { label: 'Jugadores únicos', value: '0', icon: '👥' },
            { label: 'Modo educativo', value: '0%', icon: '📚' },
            { label: 'Conceptos enseñados', value: '0', icon: '💡' },
          ].map(kpi => (
            <div key={kpi.label} className="glass-card p-5">
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className="font-mono font-bold text-2xl text-bfa-gold-500">{kpi.value}</div>
              <div className="text-xs text-bfa-cream/50 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 text-center">
          <p className="text-bfa-cream/40 font-mono text-sm">
            Implementar: useAgropolyAnalytics() + ResumenEjecutivo / MetricasEducativas / ComportamientoFinanciero / ReporteDireccion
          </p>
          <p className="text-bfa-cream/20 font-mono text-xs mt-2">
            Ver: AGROPOLY-Dashboard-Migration-Prompts.md
          </p>
        </div>
      </div>
    </div>
  )
}
