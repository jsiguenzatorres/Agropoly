import type { Card } from './types'

export const COSECHA_DECK: Card[] = [
  { id: 'c01', type: 'cosecha', icon: '💰', title: 'Crédito BFA aprobado',      text: 'Recibes crédito de inversión. Cobra ƒ200.',                          effect: { action: 'collect', amount: 200 } },
  { id: 'c02', type: 'cosecha', icon: '🏆', title: 'Primer lugar en cosecha',   text: 'Ganaste el concurso agrícola. Cobra ƒ100.',                         effect: { action: 'collect', amount: 100 } },
  { id: 'c03', type: 'cosecha', icon: '🌾', title: 'Buena cosecha de maíz',     text: 'Excelente temporada. Cobra ƒ150.',                                  effect: { action: 'collect', amount: 150 } },
  { id: 'c04', type: 'cosecha', icon: '🐄', title: 'Venta de ganado exitosa',   text: 'Vendiste el hato a buen precio. Cobra ƒ175.',                       effect: { action: 'collect', amount: 175 } },
  { id: 'c05', type: 'cosecha', icon: '💊', title: 'Error de cálculo fiscal',   text: 'Devolución de impuestos. Cobra ƒ50.',                               effect: { action: 'collect', amount: 50 } },
  { id: 'c06', type: 'cosecha', icon: '🎓', title: 'Beca BFA capacitación',     text: 'Formación agrícola gratuita. Avanza a INICIO.',                     effect: { action: 'move', to: 0 } },
  { id: 'c07', type: 'cosecha', icon: '🚜', title: 'Compra de tractor',         text: 'Adquiriste maquinaria. Paga ƒ125.',                                 effect: { action: 'pay', amount: 125 } },
  { id: 'c08', type: 'cosecha', icon: '🌧', title: 'Sequía en tu parcela',      text: 'Pérdida de cultivos. Paga ƒ150.',                                   effect: { action: 'pay', amount: 150 } },
  { id: 'c09', type: 'cosecha', icon: '🏥', title: 'Visita médica preventiva',  text: 'Salud del agricultor primero. Paga ƒ50.',                           effect: { action: 'pay', amount: 50 } },
  { id: 'c10', type: 'cosecha', icon: '🎉', title: 'Aniversario BFA',           text: 'Celebración institucional. Cobra ƒ25 de cada jugador.',             effect: { action: 'collect_from_players', amount: 25 } },
  { id: 'c11', type: 'cosecha', icon: '🔑', title: 'Libertad agraria',          text: 'Tarjeta "Libre de Emergencia". Guárdala.',                          effect: { action: 'jail_free' } },
  { id: 'c12', type: 'cosecha', icon: '🌱', title: 'Fondo semillas BFA',        text: 'Acceso a semillas mejoradas. Cobra ƒ75.',                           effect: { action: 'collect', amount: 75 } },
  { id: 'c13', type: 'cosecha', icon: '📦', title: 'Exportación exitosa',       text: 'Café de El Salvador al mundo. Cobra ƒ225.',                        effect: { action: 'collect', amount: 225 } },
  { id: 'c14', type: 'cosecha', icon: '🧾', title: 'Auditoría imprevista',      text: 'Pagos atrasados al fisco. Paga ƒ75.',                               effect: { action: 'pay', amount: 75 } },
  { id: 'c15', type: 'cosecha', icon: '🌺', title: 'Premio agroturismo',        text: 'Tu finca ganó reconocimiento. Cobra ƒ100.',                         effect: { action: 'collect', amount: 100 } },
  { id: 'c16', type: 'cosecha', icon: '🏦', title: 'Pago de deuda',             text: 'Liquidaste el crédito. Paga ƒ100.',                                 effect: { action: 'pay', amount: 100 } },
  { id: 'c17', type: 'cosecha', icon: '☕', title: 'Premio Cup of Excellence',   text: 'Tu café fue elegido entre los mejores. Cobra ƒ300.',                effect: { action: 'collect', amount: 300 } },
  { id: 'c18', type: 'cosecha', icon: '🤝', title: 'Convenio cooperativa',       text: 'Mejores precios por volumen. Cobra ƒ80.',                           effect: { action: 'collect', amount: 80 } },
  { id: 'c19', type: 'cosecha', icon: '💧', title: 'Sistema de riego nuevo',     text: 'Instalación financiada BFA. Paga ƒ200.',                            effect: { action: 'pay', amount: 200 } },
  { id: 'c20', type: 'cosecha', icon: '🌽', title: 'Cosecha récord de maíz',     text: 'El mejor año de tu carrera. Cobra ƒ250.',                           effect: { action: 'collect', amount: 250 } },
  { id: 'c21', type: 'cosecha', icon: '🏘️', title: 'Reparación de infraestructura', text: 'Mantenimiento de propiedades. Paga ƒ40 por PA y ƒ100 por Centro.', effect: { action: 'pay_per_building', house: 40, hotel: 100 } },
  { id: 'c22', type: 'cosecha', icon: '🌿', title: 'Bono cosecha orgánica',      text: 'Certificación premium. Cobra ƒ125.',                                effect: { action: 'collect', amount: 125 } },
  { id: 'c23', type: 'cosecha', icon: '📋', title: 'Asesoría técnica BFA',       text: 'Consultoría especializada. Paga ƒ60.',                              effect: { action: 'pay', amount: 60 } },
  { id: 'c24', type: 'cosecha', icon: '🎁', title: 'Bono navideño',              text: 'Aguinaldo del BFA. Cobra ƒ150.',                                    effect: { action: 'collect', amount: 150 } },
]

export const RIESGO_DECK: Card[] = [
  { id: 'r01', type: 'riesgo', icon: '⛈', title: 'Tormenta tropical',          text: 'Desastre natural. Avanza a Emergencia Climática.',                  effect: { action: 'go_to_jail' } },
  { id: 'r02', type: 'riesgo', icon: '🔥', title: 'Incendio forestal',          text: 'Paga ƒ50 por cada PA y ƒ115 por cada Centro de Servicio.',         effect: { action: 'pay_per_building', house: 50, hotel: 115 } },
  { id: 'r03', type: 'riesgo', icon: '🚑', title: 'Emergencia familiar',        text: 'Gastos médicos urgentes. Paga ƒ150.',                              effect: { action: 'pay', amount: 150 } },
  { id: 'r04', type: 'riesgo', icon: '📈', title: 'Alza del precio del café',   text: 'Avanza 3 casillas y recibe recompensa.',                            effect: { action: 'move_relative', steps: 3 } },
  { id: 'r05', type: 'riesgo', icon: '🐛', title: 'Plaga en cultivos',          text: 'Pérdida del 50% de la cosecha. Paga ƒ200.',                        effect: { action: 'pay', amount: 200 } },
  { id: 'r06', type: 'riesgo', icon: '🔑', title: 'Protección agrícola',        text: 'Tarjeta "Libre de Emergencia". Guárdala.',                         effect: { action: 'jail_free' } },
  { id: 'r07', type: 'riesgo', icon: '💸', title: 'Multa ambiental',            text: 'Infracción a la Ley de Medio Ambiente. Paga ƒ100.',                effect: { action: 'pay', amount: 100 } },
  { id: 'r08', type: 'riesgo', icon: '🌊', title: 'Inundación en parcela',      text: 'Retrocede 4 casillas.',                                            effect: { action: 'move_relative', steps: -4 } },
  { id: 'r09', type: 'riesgo', icon: '🏛', title: 'Subsidio gubernamental',     text: 'Apoyo al sector agrícola. Cobra ƒ100.',                            effect: { action: 'collect', amount: 100 } },
  { id: 'r10', type: 'riesgo', icon: '⚡', title: 'Falla en sistema eléctrico', text: 'Daño a equipos de riego. Paga ƒ75.',                               effect: { action: 'pay', amount: 75 } },
  { id: 'r11', type: 'riesgo', icon: '🎲', title: 'Oportunidad de mercado',     text: 'Avanza a la propiedad más cercana sin dueño.',                     effect: { action: 'move_relative', steps: 1 } },
  { id: 'r12', type: 'riesgo', icon: '📉', title: 'Crisis de exportaciones',    text: 'Baja en precios internacionales. Paga ƒ50.',                       effect: { action: 'pay', amount: 50 } },
  { id: 'r13', type: 'riesgo', icon: '🌡', title: 'Ola de calor extremo',       text: 'Afecta toda la producción. Paga ƒ125.',                            effect: { action: 'pay', amount: 125 } },
  { id: 'r14', type: 'riesgo', icon: '🛂', title: 'Inspección sanitaria BFA',   text: 'Todo en orden. Cobra ƒ50.',                                        effect: { action: 'collect', amount: 50 } },
  { id: 'r15', type: 'riesgo', icon: '🐝', title: 'Mortandad de abejas',        text: 'Afecta polinización. Paga ƒ80.',                                   effect: { action: 'pay', amount: 80 } },
  { id: 'r16', type: 'riesgo', icon: '🚚', title: 'Venta directa al mercado',   text: 'Evitaste intermediarios. Cobra ƒ120.',                             effect: { action: 'collect', amount: 120 } },
  { id: 'r17', type: 'riesgo', icon: '🌪', title: 'Tornado en la zona',          text: 'Daños severos a tu propiedad. Paga ƒ250.',                          effect: { action: 'pay', amount: 250 } },
  { id: 'r18', type: 'riesgo', icon: '🦠', title: 'Brote viral en ganado',       text: 'Cuarentena obligatoria. Paga ƒ175.',                                effect: { action: 'pay', amount: 175 } },
  { id: 'r19', type: 'riesgo', icon: '🛣', title: 'Camino bloqueado',            text: 'Retrocede 3 casillas.',                                             effect: { action: 'move_relative', steps: -3 } },
  { id: 'r20', type: 'riesgo', icon: '🌫', title: 'Niebla densa en cosecha',     text: 'Atraso en transporte. Paga ƒ60.',                                   effect: { action: 'pay', amount: 60 } },
  { id: 'r21', type: 'riesgo', icon: '🏪', title: 'Robo en bodega',              text: 'Pérdida de inventario. Paga ƒ110.',                                 effect: { action: 'pay', amount: 110 } },
  { id: 'r22', type: 'riesgo', icon: '🚨', title: 'Restructuración de deuda',    text: 'Banco te otorga mejores condiciones. Cobra ƒ75.',                   effect: { action: 'collect', amount: 75 } },
  { id: 'r23', type: 'riesgo', icon: '🧊', title: 'Helada inesperada',           text: 'Daño a cultivos tempranos. Paga ƒ140.',                             effect: { action: 'pay', amount: 140 } },
  { id: 'r24', type: 'riesgo', icon: '💼', title: 'Inversor extranjero',         text: 'Interés en tu finca. Cobra ƒ200 de cada jugador.',                  effect: { action: 'collect_from_players', amount: 50 } },
]

export function shuffle<T>(deck: T[]): T[] {
  const a = [...deck]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
