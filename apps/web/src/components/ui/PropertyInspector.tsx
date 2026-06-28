// Side panel showing detailed info for the clicked board tile.
// Pulls live state for ownership/buildings/mortgaged, and computes "next rent if you build".

import { motion, AnimatePresence } from 'framer-motion'
import { useInspectorStore } from '../../store/inspectorStore'
import { useGameSource } from '../../store/useGameSource'
import { BOARD_DATA, calcRent, HOTEL_LEVEL } from '@agropoly/game-engine'

const GROUP_NAMES: Record<number, string> = {
  0: 'Occidente I', 1: 'Occidente II', 2: 'Centro Norte',
  3: 'Paracentral', 4: 'Oriente I', 5: 'Oriente II',
  6: 'Gran S.S.',  7: 'Casa Matriz',
}
const GROUP_COLOR: Record<number, string> = {
  0: '#8B1A8B', 1: '#009FDF', 2: '#D6006E', 3: '#E8610C',
  4: '#C0392B', 5: '#D4AC00', 6: '#00913A', 7: '#00297A',
}
const SPACE_LABEL: Record<string, string> = {
  go: 'INICIO', jail: 'Emergencia Climática', free: 'Feria del Campo',
  gotojail: 'Ir a Emergencia', tax: 'Impuesto',
  cosecha: 'Tarjeta Cosecha', riesgo: 'Tarjeta Riesgo',
  station: 'Estación BFA', utility: 'Servicio BFA',
}

export function PropertyInspector({ mode }: { mode: 'solo' | 'multi' }) {
  const id    = useInspectorStore(s => s.selectedSpaceId)
  const close = useInspectorStore(s => s.close)
  const game  = useGameSource(mode).game

  return (
    <AnimatePresence>
      {id !== null && (
        <Panel id={id} game={game} close={close} key={id} />
      )}
    </AnimatePresence>
  )
}

function Panel({ id, game, close }: { id: number; game: ReturnType<typeof useGameSource>['game']; close: () => void }) {
  const baseSpace = BOARD_DATA[id]
  const liveSpace = game?.board[id] ?? baseSpace
  const owner     = liveSpace.ownerId ? game?.players.find(p => p.id === liveSpace.ownerId) : null
  const buildings = liveSpace.buildings ?? 0

  if (!baseSpace) return null

  const isProp = baseSpace.type === 'prop'
  const groupColor = isProp ? GROUP_COLOR[baseSpace.group] : '#444'
  const groupName  = isProp ? GROUP_NAMES[baseSpace.group] : (SPACE_LABEL[baseSpace.type] ?? '—')

  // Rent calc (live)
  const currentRent = isProp && game ? calcRent(liveSpace, game.board, game.players) : null
  const nextRent    = isProp && buildings < HOTEL_LEVEL
    ? baseSpace.rents[Math.min(buildings + 1, HOTEL_LEVEL)] ?? null
    : null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={close}
      style={{
        position: 'fixed', inset: 0, zIndex: 65,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      }}
    >
      <motion.div
        initial={{ x: 360, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        exit={{   x: 360, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 240 }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: '60px', right: '8px', bottom: '180px',
          width: '320px', maxWidth: 'calc(100vw - 16px)',
          background: 'linear-gradient(180deg, rgba(13,43,20,0.97), rgba(6,14,8,0.97))',
          border: '1px solid rgba(245,197,24,0.4)',
          borderRadius: '16px',
          padding: '0',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Color banner */}
        <div style={{ height: '12px', background: groupColor }} />
        <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-bfa-cream/40 text-[10px] font-mono uppercase tracking-widest">
                {groupName}
              </p>
              <p className="text-bfa-gold-500 font-display font-bold text-lg leading-tight">
                {baseSpace.name}
              </p>
            </div>
            <button onClick={close} className="text-bfa-cream/40 hover:text-bfa-cream text-xl leading-none px-2">×</button>
          </div>

          {(isProp || baseSpace.type === 'station' || baseSpace.type === 'utility') && (
            <Field label="Precio base">ƒ{baseSpace.price}</Field>
          )}
          {baseSpace.type === 'tax' && (
            <Field label="Monto a pagar">ƒ{baseSpace.price}</Field>
          )}

          {/* Owner status */}
          <Field label="Estado">
            {liveSpace.mortgaged ? (
              <span className="text-bfa-amber font-bold">🔓 HIPOTECADA</span>
            ) : owner ? (
              <span className="text-bfa-gold-500">
                Propiedad de <span className="font-bold">{owner.name}</span>
              </span>
            ) : isProp || baseSpace.type === 'station' || baseSpace.type === 'utility' ? (
              <span className="text-bfa-green-300">Disponible para compra</span>
            ) : (
              <span className="text-bfa-cream/60">—</span>
            )}
          </Field>

          {/* Buildings */}
          {isProp && (
            <Field label="Construcciones">
              {buildings >= HOTEL_LEVEL ? '🏨 Centro de Servicio BFA'
                : buildings > 0 ? `🏠 ${buildings} Punto${buildings > 1 ? 's' : ''} de Atención`
                : 'Sin mejoras'}
            </Field>
          )}

          {/* Rent table */}
          {isProp && (
            <div className="mt-2">
              <p className="text-bfa-cream/40 text-[10px] font-mono uppercase tracking-widest mb-2">
                Tabla de rentas
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <RentRow label="Base"             value={baseSpace.rents[0]} active={buildings === 0 && !owner} />
                <RentRow label="Grupo completo"    value={baseSpace.rents[0] * 2} active={buildings === 0 && owner !== null} />
                <RentRow label="1 PA"              value={baseSpace.rents[1]} active={buildings === 1} />
                <RentRow label="2 PA"              value={baseSpace.rents[2]} active={buildings === 2} />
                <RentRow label="3 PA"              value={baseSpace.rents[3]} active={buildings === 3} />
                <RentRow label="4 PA"              value={baseSpace.rents[4]} active={buildings === 4} />
                <RentRow label="Centro BFA"        value={baseSpace.rents[5]} active={buildings >= HOTEL_LEVEL} />
              </div>
            </div>
          )}

          {/* Current & next rent */}
          {isProp && owner && currentRent !== null && currentRent > 0 && (
            <div className="glass-card p-3 mt-2">
              <p className="text-bfa-cream/50 text-[10px] font-mono uppercase">Renta a pagar si caés ahora</p>
              <p className="text-bfa-gold-500 font-display font-bold text-2xl">ƒ{currentRent}</p>
            </div>
          )}
          {isProp && owner && nextRent !== null && buildings < HOTEL_LEVEL && (
            <p className="text-bfa-cream/50 text-[11px] font-mono">
              Próxima mejora subiría renta a <span className="text-bfa-green-300">ƒ{nextRent}</span>
              {' '}(costo construcción ƒ{baseSpace.hcost})
            </p>
          )}

          {/* Cosecha / Riesgo */}
          {(baseSpace.type === 'cosecha' || baseSpace.type === 'riesgo') && (
            <p className="text-bfa-cream/70 text-xs">
              Al caer aquí, robás una {baseSpace.type === 'cosecha' ? '🌽 Cosecha' : '⚡ Riesgo'} del mazo.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-bfa-cream/40 text-[10px] font-mono uppercase tracking-widest">{label}</p>
      <p className="text-bfa-cream text-sm">{children}</p>
    </div>
  )
}
function RentRow({ label, value, active }: { label: string; value: number; active: boolean }) {
  return (
    <>
      <span className={active ? 'text-bfa-gold-500 font-bold' : 'text-bfa-cream/60'}>{label}</span>
      <span className={`text-right font-mono ${active ? 'text-bfa-gold-500 font-bold' : 'text-bfa-cream/60'}`}>
        ƒ{value}
      </span>
    </>
  )
}
