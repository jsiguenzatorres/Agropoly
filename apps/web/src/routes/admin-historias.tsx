// Admin editor for Historias del Campo content. Single shared password (set
// server-side via ADMIN_PASSWORD env). Once logged in, allows editing all
// fields per mascot and persists via PUT /api/historias/:mascotaId.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminLogin, adminLogout, adminMe, adminUpdateHistoria, listHistorias, type Historia } from '../lib/historias-api'

export function Component() {
  const [auth, setAuth] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { void adminMe().then(setAuth) }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setLoginError(null)
    const ok = await adminLogin(password)
    setBusy(false)
    if (ok) { setAuth(true); setPassword('') }
    else setLoginError('Contraseña incorrecta')
  }

  const handleLogout = async () => {
    await adminLogout()
    setAuth(false)
  }

  if (auth === null) return <CenteredMsg msg="Verificando sesión…" />

  return (
    <div className="min-h-screen bg-bfa-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_10%,rgba(245,197,24,0.15)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-8">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo-bfa.png" alt="BFA" className="h-10 sm:h-12 w-auto shrink-0" style={{ filter: 'drop-shadow(0 2px 6px rgba(245,197,24,0.25))' }} />
            <div>
              <p className="text-xs font-mono tracking-widest text-bfa-cream/50 uppercase">Panel BFA</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-bfa-gold-500">🔐 Editor de Historias</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/historias" className="btn-secondary text-xs sm:text-sm px-3 py-2">Ver público</Link>
            {auth && <button onClick={handleLogout} className="btn-secondary text-xs sm:text-sm px-3 py-2">Cerrar sesión</button>}
          </div>
        </header>

        {!auth ? (
          <LoginPanel password={password} setPassword={setPassword} onSubmit={handleLogin} error={loginError} busy={busy} />
        ) : (
          <EditorPanel />
        )}
      </div>
    </div>
  )
}

function LoginPanel({ password, setPassword, onSubmit, error, busy }: {
  password: string
  setPassword: (s: string) => void
  onSubmit: (e: React.FormEvent) => void
  error: string | null
  busy: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto glass-card p-6 mt-12">
      <p className="text-bfa-cream/70 text-sm mb-4">
        Acceso restringido al equipo BFA. Ingresá la contraseña institucional para editar los textos de las historias.
      </p>
      <label className="block text-xs font-mono text-bfa-cream/50 uppercase tracking-wider mb-1">Contraseña</label>
      <input
        type="password" autoFocus
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full bg-bfa-deep/60 border border-bfa-cream/15 rounded-lg px-3 py-2 text-bfa-cream font-mono focus:border-bfa-gold-500/60 focus:outline-none"
        placeholder="••••••••"
      />
      {error && <p className="text-bfa-red text-xs mt-2 font-mono">{error}</p>}
      <button type="submit" disabled={busy || !password} className="btn-gold w-full mt-4 disabled:opacity-50">
        {busy ? 'Verificando…' : 'Ingresar'}
      </button>
      <p className="text-bfa-cream/30 text-[10px] mt-4 font-mono text-center">
        Default dev: <code className="text-bfa-gold-500/70">agropoly-bfa-2026</code>
      </p>
    </form>
  )
}

function EditorPanel() {
  const [historias, setHistorias] = useState<Historia[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Historia | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  useEffect(() => {
    void listHistorias().then(hs => {
      setHistorias(hs)
      if (hs.length > 0) {
        setSelectedId(hs[0].mascotaId)
        setDraft(structuredClone(hs[0]))
      }
    })
  }, [])

  const handleSelect = (id: string) => {
    if (!historias) return
    const h = historias.find(x => x.mascotaId === id)
    if (h) { setSelectedId(id); setDraft(structuredClone(h)); setSavedAt(null) }
  }

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    const ok = await adminUpdateHistoria(draft)
    setSaving(false)
    if (ok) {
      setSavedAt(Date.now())
      // Refresh local cache
      setHistorias(hs => hs?.map(h => h.mascotaId === draft.mascotaId ? draft : h) ?? null)
    } else {
      alert('Error al guardar. Verificá tu sesión.')
    }
  }

  const update = (patch: Partial<Historia>) => setDraft(d => d ? { ...d, ...patch } : d)

  if (!historias) return <CenteredMsg msg="Cargando contenido…" />

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
      {/* Mascot list */}
      <aside className="glass-card p-3 h-fit">
        <p className="text-xs font-mono text-bfa-cream/50 uppercase tracking-wider mb-2 px-2">Mascotas</p>
        {historias.map(h => (
          <button
            key={h.mascotaId}
            onClick={() => handleSelect(h.mascotaId)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors flex items-center justify-between gap-2 ${
              selectedId === h.mascotaId ? 'bg-bfa-gold-500/15 text-bfa-gold-500' : 'text-bfa-cream/70 hover:bg-white/5'
            }`}
          >
            <span>{h.nombre}</span>
            {h.pendingReview && <span title="Provisional" className="text-bfa-amber text-xs">⚠</span>}
          </button>
        ))}
      </aside>

      {/* Editor */}
      <main className="glass-card p-5 space-y-4">
        {!draft ? (
          <p className="text-bfa-cream/60">Seleccioná una mascota</p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
              <h2 className="font-display font-bold text-xl text-bfa-gold-500">
                {draft.nombre} · <span className="text-bfa-cream/60 text-sm font-mono">{draft.mascotaId}</span>
              </h2>
              <div className="flex items-center gap-3">
                {savedAt && Date.now() - savedAt < 4000 && (
                  <span className="text-bfa-green-500 text-xs font-mono">✓ Guardado</span>
                )}
                <button onClick={handleSave} disabled={saving} className="btn-gold text-sm">
                  {saving ? 'Guardando…' : '💾 Guardar cambios'}
                </button>
              </div>
            </div>

            <Field  label="Nombre"      value={draft.nombre}            onChange={v => update({ nombre: v })} />
            <Field  label="Rubro"       value={draft.rubro}             onChange={v => update({ rubro: v })} />
            <Field  label="Zona geográfica" value={draft.zona}          onChange={v => update({ zona: v })} />

            <Textarea label="Saludo (frase de bienvenida)" value={draft.saludo} onChange={v => update({ saludo: v })} rows={2} />
            <Textarea label="Origen (1 párrafo)"           value={draft.origen} onChange={v => update({ origen: v })} rows={4} />

            <Textarea label="Descripción del rubro" value={draft.rubroDescripcion} onChange={v => update({ rubroDescripcion: v })} rows={3} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Estadística — etiqueta" value={draft.rubroStatLabel} onChange={v => update({ rubroStatLabel: v })} />
              <Field label="Estadística — valor"    value={draft.rubroStatValue} onChange={v => update({ rubroStatValue: v })} />
              <Field label="Estadística — nota"     value={draft.rubroStatNote}  onChange={v => update({ rubroStatNote: v })} />
            </div>

            <DesafiosEditor desafios={draft.desafios} onChange={d => update({ desafios: d })} />

            <Field    label="Producto BFA"          value={draft.bfaProducto}    onChange={v => update({ bfaProducto: v })} />
            <Textarea label="Descripción del producto BFA" value={draft.bfaDescripcion} onChange={v => update({ bfaDescripcion: v })} rows={3} />

            <Textarea label="Reto al jugador (conecta mecánica del juego)" value={draft.retoJugador} onChange={v => update({ retoJugador: v })} rows={3} />

            <label className="flex items-center gap-2 text-sm text-bfa-cream/70 pt-2 border-t border-white/10">
              <input
                type="checkbox"
                checked={!draft.pendingReview}
                onChange={e => update({ pendingReview: !e.target.checked })}
              />
              <span>Marcar como <strong>validado por BFA</strong> (quita el aviso ⚠ Provisional)</span>
            </label>
          </>
        )}
      </main>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-mono text-bfa-cream/50 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-bfa-deep/60 border border-bfa-cream/15 rounded-lg px-3 py-2 text-bfa-cream text-sm focus:border-bfa-gold-500/60 focus:outline-none"
      />
    </div>
  )
}

function Textarea({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <div>
      <label className="block text-xs font-mono text-bfa-cream/50 uppercase tracking-wider mb-1">{label}</label>
      <textarea
        value={value} onChange={e => onChange(e.target.value)} rows={rows}
        className="w-full bg-bfa-deep/60 border border-bfa-cream/15 rounded-lg px-3 py-2 text-bfa-cream text-sm leading-relaxed focus:border-bfa-gold-500/60 focus:outline-none resize-y"
      />
    </div>
  )
}

function DesafiosEditor({ desafios, onChange }: { desafios: string[]; onChange: (d: string[]) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-mono text-bfa-cream/50 uppercase tracking-wider">Desafíos del rubro</label>
        <button onClick={() => onChange([...desafios, ''])} className="text-xs text-bfa-gold-500/70 hover:text-bfa-gold-500">+ Agregar</button>
      </div>
      <div className="space-y-2">
        {desafios.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text" value={d}
              onChange={e => onChange(desafios.map((x, j) => j === i ? e.target.value : x))}
              className="flex-1 bg-bfa-deep/60 border border-bfa-cream/15 rounded-lg px-3 py-1.5 text-bfa-cream text-sm focus:border-bfa-gold-500/60 focus:outline-none"
            />
            <button onClick={() => onChange(desafios.filter((_, j) => j !== i))} className="text-bfa-red/70 hover:text-bfa-red text-xs px-2">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function CenteredMsg({ msg }: { msg: string }) {
  return (
    <div className="min-h-screen bg-bfa-dark flex items-center justify-center">
      <p className="text-bfa-cream/60 font-mono text-sm">{msg}</p>
    </div>
  )
}
