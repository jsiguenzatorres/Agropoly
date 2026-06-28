import { useState, useMemo } from 'react'
import type { Player, BoardSpace } from '@agropoly/game-engine'
import { useMultiplayerStore, type TradeProposal } from '../../store/multiplayerStore'

interface ComposeProps {
  me:       Player
  others:   Player[]
  board:    BoardSpace[]
  onClose:  () => void
}

export function TradeComposeModal({ me, others, board, onClose }: ComposeProps) {
  const proposeTrade = useMultiplayerStore(s => s.proposeTrade)
  const [toId, setToId] = useState<string>(others[0]?.id ?? '')
  const [giveMoney, setGiveMoney] = useState(0)
  const [wantMoney, setWantMoney] = useState(0)
  const [giveProp, setGiveProp]   = useState<number>(-1)
  const [wantProp, setWantProp]   = useState<number>(-1)

  const myFreeProps    = me.properties
    .map(id => board[id])
    .filter(sp => sp && (sp.buildings ?? 0) === 0 && !sp.mortgaged)
  const taker = others.find(p => p.id === toId)
  const takerFreeProps = taker
    ? taker.properties.map(id => board[id]).filter(sp => sp && (sp.buildings ?? 0) === 0 && !sp.mortgaged)
    : []

  const submit = () => {
    if (!toId) return
    const proposal: TradeProposal = {
      to: toId,
      giveMoney: Math.max(0, Math.floor(giveMoney || 0)),
      giveProp,
      wantMoney: Math.max(0, Math.floor(wantMoney || 0)),
      wantProp,
    }
    if (proposal.giveMoney === 0 && proposal.giveProp < 0 && proposal.wantMoney === 0 && proposal.wantProp < 0) return
    if (proposal.giveMoney > me.balance) return
    proposeTrade(proposal)
    onClose()
  }

  return (
    <ModalShell title="💱 Proponer Trade" onClose={onClose}>
      <Section label="Para:">
        <select
          value={toId}
          onChange={e => { setToId(e.target.value); setWantProp(-1) }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-bfa-cream text-sm"
        >
          {others.map(p => (
            <option key={p.id} value={p.id}>{p.name} · ƒ{p.balance}</option>
          ))}
        </select>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Section label="Yo doy:">
          <NumberInput value={giveMoney} max={me.balance} onChange={setGiveMoney} suffix={`/ƒ${me.balance}`} />
          <PropertySelect value={giveProp} options={myFreeProps} onChange={setGiveProp} />
        </Section>
        <Section label="Yo recibo:">
          <NumberInput value={wantMoney} max={taker?.balance ?? 0} onChange={setWantMoney} suffix={`/ƒ${taker?.balance ?? 0}`} />
          <PropertySelect value={wantProp} options={takerFreeProps} onChange={setWantProp} />
        </Section>
      </div>

      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="btn-secondary flex-1 text-sm py-2">Cancelar</button>
        <button onClick={submit} className="btn-gold flex-1 text-sm py-2">Enviar oferta</button>
      </div>
    </ModalShell>
  )
}

interface IncomingProps {
  offer:   { fromId: string; giveMoney: number; givePropertyId: number; wantMoney: number; wantPropertyId: number }
  players: Player[]
  board:   BoardSpace[]
}

export function TradeIncomingModal({ offer, players, board }: IncomingProps) {
  const acceptTrade = useMultiplayerStore(s => s.acceptTrade)
  const rejectTrade = useMultiplayerStore(s => s.rejectTrade)
  const from = useMemo(() => players.find(p => p.id === offer.fromId), [players, offer.fromId])
  const giveProp = offer.givePropertyId >= 0 ? board[offer.givePropertyId] : null
  const wantProp = offer.wantPropertyId >= 0 ? board[offer.wantPropertyId] : null

  return (
    <ModalShell title={`💱 ${from?.name ?? 'Alguien'} te ofrece un trade`}>
      <div className="grid grid-cols-2 gap-3">
        <OfferSide label="Te ofrece" money={offer.giveMoney} property={giveProp ?? null} color="green" />
        <OfferSide label="A cambio de" money={offer.wantMoney} property={wantProp ?? null} color="amber" />
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={rejectTrade} className="btn-secondary flex-1 text-sm py-2">❌ Rechazar</button>
        <button onClick={acceptTrade} className="btn-gold flex-1 text-sm py-2">✅ Aceptar</button>
      </div>
    </ModalShell>
  )
}

export function TradeWaitingModal({ fromId, toId, players }: {
  fromId: string; toId: string; players: Player[]
}) {
  const from = players.find(p => p.id === fromId)
  const to   = players.find(p => p.id === toId)
  return (
    <ModalShell title="💱 Esperando respuesta…">
      <p className="text-bfa-cream/70 text-sm text-center">
        Trade propuesto por <span className="text-bfa-gold-500 font-bold">{from?.name}</span>{' '}
        a <span className="text-bfa-gold-500 font-bold">{to?.name}</span>.
      </p>
      <p className="text-bfa-cream/40 text-xs text-center animate-pulse font-mono">
        Esperando aceptación…
      </p>
    </ModalShell>
  )
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children }: {
  title: string; onClose?: () => void; children: React.ReactNode
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 75,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '480px', width: '100%',
          background: 'linear-gradient(180deg, rgba(27,107,47,0.95), rgba(13,43,20,0.95))',
          border: '1px solid rgba(245,197,24,0.4)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}
      >
        <p style={{ color: '#F5C518', fontWeight: 700, fontSize: '14px',
                    textAlign: 'center', margin: 0 }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-bfa-cream/50 text-[10px] font-mono uppercase tracking-widest">{label}</p>
      {children}
    </div>
  )
}

function NumberInput({ value, max, onChange, suffix }: {
  value: number; max: number; onChange: (n: number) => void; suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number" min={0} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-bfa-cream text-sm font-mono outline-none"
      />
      {suffix && <span className="text-bfa-cream/40 text-[10px] font-mono whitespace-nowrap">{suffix}</span>}
    </div>
  )
}

function PropertySelect({ value, options, onChange }: {
  value: number; options: BoardSpace[]; onChange: (id: number) => void
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-bfa-cream text-xs"
    >
      <option value={-1}>— ninguna propiedad —</option>
      {options.map(sp => (
        <option key={sp.id} value={sp.id}>{sp.name}</option>
      ))}
    </select>
  )
}

function OfferSide({ label, money, property, color }: {
  label: string; money: number; property: BoardSpace | null; color: 'green' | 'amber'
}) {
  const tint = color === 'green'
    ? { bg: 'rgba(76,175,112,0.12)', border: 'rgba(76,175,112,0.3)' }
    : { bg: 'rgba(232,160,32,0.12)', border: 'rgba(232,160,32,0.3)' }
  return (
    <div style={{
      padding: '10px', borderRadius: '10px',
      background: tint.bg, border: `1px solid ${tint.border}`,
    }}>
      <p className="text-bfa-cream/50 text-[10px] font-mono uppercase tracking-widest mb-2">{label}</p>
      {money > 0 && (
        <p className="text-bfa-gold-500 font-bold text-sm font-mono">ƒ{money.toLocaleString()}</p>
      )}
      {property && (
        <p className="text-bfa-cream/80 text-xs mt-1">🏠 {property.name}</p>
      )}
      {money === 0 && !property && (
        <p className="text-bfa-cream/30 text-xs italic">nada</p>
      )}
    </div>
  )
}
