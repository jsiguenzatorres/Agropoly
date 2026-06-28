import { useState } from 'react'

type Section = 'objetivo' | 'turno' | 'propiedades' | 'carcel' | 'cartas' | 'subasta' | 'trade' | 'victoria'

const SECTIONS: Array<{ id: Section; icon: string; label: string }> = [
  { id: 'objetivo',    icon: '🎯', label: 'Objetivo' },
  { id: 'turno',       icon: '🎲', label: 'Turno' },
  { id: 'propiedades', icon: '🏠', label: 'Propiedades' },
  { id: 'carcel',      icon: '🚨', label: 'Emergencia' },
  { id: 'cartas',      icon: '🃏', label: 'Cartas' },
  { id: 'subasta',     icon: '🔨', label: 'Subastas' },
  { id: 'trade',       icon: '💱', label: 'Trades' },
  { id: 'victoria',    icon: '🏆', label: 'Victoria' },
]

export function RulesModal({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<Section>('objetivo')

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '640px', width: '100%', maxHeight: '85vh',
          background: 'linear-gradient(180deg, rgba(27,107,47,0.96), rgba(13,43,20,0.96))',
          border: '1px solid rgba(245,197,24,0.4)',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-bfa-cream/50 text-[10px] font-mono tracking-widest uppercase">Manual</p>
            <h2 className="text-bfa-gold-500 font-display font-bold text-xl">📖 Cómo Jugar AGROPOLY BFA</h2>
          </div>
          <button onClick={onClose} className="text-bfa-cream/60 hover:text-bfa-cream text-2xl leading-none px-2">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                section === s.id
                  ? 'bg-bfa-gold-500/20 text-bfa-gold-500 border border-bfa-gold-500/40'
                  : 'bg-white/5 text-bfa-cream/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 flex-1 min-h-0">
          {section === 'objetivo' && <Objetivo />}
          {section === 'turno' && <Turno />}
          {section === 'propiedades' && <Propiedades />}
          {section === 'carcel' && <Carcel />}
          {section === 'cartas' && <Cartas />}
          {section === 'subasta' && <Subasta />}
          {section === 'trade' && <Trade />}
          {section === 'victoria' && <Victoria />}
        </div>
      </div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-bfa-cream/85 text-sm leading-relaxed mb-3">{children}</p>
}
function H({ children }: { children: React.ReactNode }) {
  return <p className="text-bfa-gold-500 font-bold text-sm mb-2 mt-1">{children}</p>
}
function L({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-bfa-cream/80 text-sm leading-relaxed mb-3 space-y-1">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  )
}

function Objetivo() {
  return (
    <>
      <H>El campo es tu negocio</H>
      <P>Sos un productor agrícola en El Salvador. Tu meta: hacer crecer tu patrimonio comprando propiedades, construyendo mejoras y cobrando renta a quienes caigan en ellas. El BFA te respalda con créditos, seguros y asesoría.</P>
      <H>Dos formas de ganar</H>
      <L items={[
        'Patrimonio ≥ ƒ5,000: balance + propiedades + mejoras. Ganás inmediatamente al alcanzarlo.',
        'Último en pie: el resto de jugadores quiebran y vos sos el único solvente.',
      ]}/>
    </>
  )
}

function Turno() {
  return (
    <>
      <H>Cada turno seguís estos pasos</H>
      <L items={[
        'Lanzás dos dados (2D6) + un dado climático ☀️🌧⛈🌈 que afecta las Cosechas.',
        'Movés tu ficha esa cantidad de casillas. Si pasás por INICIO recibís ƒ200.',
        'Resolvés la casilla donde caés: comprar, pagar renta, sacar tarjeta, etc.',
        'Si sacaste dobles: jugás otra vez. Tres dobles seguidos → vas a Emergencia.',
        'Al terminar podés construir, vender mejoras, hipotecar, deshipotecar, proponer trades (multi), y luego "Terminar turno".',
      ]}/>
      <H>Dado climático</H>
      <L items={[
        '☀️ Sol: cosechas ×1.25',
        '🌧 Lluvia: cosechas ×1.50',
        '⛈ Tormenta: cosechas ×0.50',
        '🌈 Arcoíris: cosechas ×2.00',
      ]}/>
    </>
  )
}

function Propiedades() {
  return (
    <>
      <H>Comprar</H>
      <P>Si caés en una propiedad sin dueño, podés comprarla pagando el precio impreso. Si pasás, el Banco la subasta entre los demás jugadores.</P>
      <H>Cobrar renta</H>
      <P>Si caés en una propiedad ajena, pagás renta a su dueño. La renta varía según el grupo y las mejoras construidas. Tener el grupo completo sin mejoras duplica la renta base.</P>
      <H>Construir mejoras</H>
      <L items={[
        'Necesitás ser dueño de TODAS las propiedades del grupo.',
        'La construcción debe ser equilibrada: no podés tener más mejoras en una propiedad que en otra del mismo grupo (diferencia máxima de 1).',
        'Niveles: 1-4 Puntos de Atención (PA), nivel 5 es Centro de Servicio BFA (hotel).',
        'Cada nivel multiplica fuertemente la renta cobrada.',
      ]}/>
      <H>Hipotecar / Deshipotecar</H>
      <L items={[
        'Hipotecar: recibís 50% del precio. La propiedad no cobra renta mientras esté hipotecada.',
        'Requisito: no debe tener mejoras (vendelas primero a 50% del costo).',
        'Deshipotecar: pagás 110% del valor hipotecado (50% × 1.10).',
      ]}/>
    </>
  )
}

function Carcel() {
  return (
    <>
      <H>Emergencia Climática (casilla 10)</H>
      <P>Vas a Emergencia si: caés en "Ir a Emergencia", sacás 3 dobles seguidos, o una tarjeta te envía.</P>
      <H>Tres formas de salir</H>
      <L items={[
        '🎟️ Usar una Tarjeta Libre de Emergencia si la tenés.',
        '💰 Pagar fianza de ƒ50.',
        '🎲 Tirar dobles (hasta 3 intentos; al 3er fallo pagás ƒ50 forzado).',
      ]}/>
      <P>Mientras estás en Emergencia no cobrás renta de tus propiedades.</P>
    </>
  )
}

function Cartas() {
  return (
    <>
      <H>Tarjetas Cosecha (24)</H>
      <P>Eventos positivos del campo: crédito BFA, premios, bonos, exportaciones exitosas. Generalmente dan dinero o avances. Algunas también cobran gastos esperables (insumos, fianzas, asesorías).</P>
      <H>Tarjetas Riesgo (24)</H>
      <P>Eventos imprevistos: sequías, plagas, heladas, multas, fluctuaciones de mercado. Generalmente cobran o te mueven a posiciones desfavorables. Algunas dan respiros (subsidios, restructuraciones).</P>
      <H>Modo Educativo</H>
      <P>Si activaste el modo educativo en el lobby, las cartas también disparan mini-quizes con explicaciones financieras del BFA. Aprendés mientras jugás.</P>
    </>
  )
}

function Subasta() {
  return (
    <>
      <H>¿Cuándo hay subasta?</H>
      <P>Cuando un jugador cae en una propiedad libre y decide no comprarla, el Banco la subasta entre todos los demás jugadores no quebrados.</P>
      <H>Mecánica</H>
      <L items={[
        'Los participantes pujan por turnos en ronda.',
        'Puja mínima inicial: ƒ10.',
        'Cada nueva puja supera a la anterior por al menos ƒ10.',
        'Cuando todos pasan, el último que pujó se queda con la propiedad pagando lo ofrecido.',
        'Si nadie puja, la propiedad queda libre y disponible para futuras visitas.',
      ]}/>
    </>
  )
}

function Trade() {
  return (
    <>
      <H>Negociar con otros jugadores (solo multi)</H>
      <P>Durante tu turno (al final, antes de "Terminar turno"), podés proponer un intercambio a otro jugador.</P>
      <H>Mecánica</H>
      <L items={[
        'Ofrecés: dinero + 1 propiedad (opcional).',
        'Pedís: dinero + 1 propiedad (opcional).',
        'Las propiedades a tradear NO pueden tener mejoras (vendelas primero) ni estar hipotecadas.',
        'El otro jugador recibe la oferta y debe aceptar o rechazar.',
        'Si acepta, la transferencia es atómica y bilateral.',
      ]}/>
    </>
  )
}

function Victoria() {
  return (
    <>
      <H>🏆 Cómo se gana</H>
      <P>Hay dos condiciones de victoria:</P>
      <L items={[
        'Patrimonio neto ≥ ƒ5,000: tu balance + valor de propiedades + mejoras. Gana al final de tu turno.',
        'Último en pie: todos los demás quebraron.',
      ]}/>
      <H>Quiebra (bancarrota)</H>
      <P>Si debés más de lo que tenés y no podés cubrirlo:</P>
      <L items={[
        'Si la deuda es con otro jugador (renta): tus propiedades pasan a ese acreedor, que también recibe el 50% del costo de tus mejoras como reembolso.',
        'Si la deuda es con el Banco (impuesto, carta): tus propiedades vuelven al Banco libres para comprar; tus mejoras se pierden.',
      ]}/>
    </>
  )
}
