import { useEventLogStore } from '../../store/eventLogStore'

export function LogPanel() {
  const entries = useEventLogStore(s => s.entries)
  const open    = useEventLogStore(s => s.open)
  const setOpen = useEventLogStore(s => s.setOpen)
  const clear   = useEventLogStore(s => s.clear)

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-2 right-24 sm:top-4 sm:right-72 z-30 glass-card px-2 py-1 text-[10px] sm:text-xs font-mono text-bfa-cream/60"
      >
        📜 {open ? 'cerrar' : `historial (${entries.length})`}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', zIndex: 35,
            top: '60px', left: '8px', bottom: '180px',
            width: '300px', maxWidth: 'calc(100vw - 16px)',
            background: 'linear-gradient(180deg, rgba(13,43,20,0.95), rgba(6,14,8,0.95))',
            border: '1px solid rgba(245,197,24,0.3)',
            borderRadius: '14px',
            display: 'flex', flexDirection: 'column',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <p className="text-bfa-gold-500 text-[10px] font-mono tracking-widest">📜 HISTORIAL</p>
            <button onClick={clear} className="text-bfa-cream/40 hover:text-bfa-cream text-[10px] font-mono">
              limpiar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col-reverse gap-1">
            {entries.length === 0 && (
              <p className="text-bfa-cream/30 text-xs text-center mt-4 font-mono">Sin eventos aún.</p>
            )}
            {[...entries].reverse().map(e => (
              <div
                key={e.id}
                className="flex items-center gap-2 text-[11px] px-2 py-1 rounded bg-white/3"
              >
                <span className="text-bfa-cream/30 font-mono shrink-0">
                  {new Date(e.ts).toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {e.icon && <span>{e.icon}</span>}
                <span className="text-bfa-cream/80 flex-1 truncate">{e.text}</span>
                {e.amount !== undefined && e.amount !== 0 && (
                  <span className={`font-mono shrink-0 ${e.amount > 0 ? 'text-bfa-green-300' : 'text-red-400'}`}>
                    {e.amount > 0 ? '+' : ''}ƒ{Math.abs(e.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
