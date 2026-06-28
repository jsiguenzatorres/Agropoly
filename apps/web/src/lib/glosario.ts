// Glosario financiero BFA — 30 conceptos con analogía salvadoreña y producto BFA asociado

export interface ConceptoFinanciero {
  id: string
  termino: string
  definicion: string
  analogia: string         // analogía salvadoreña simple
  productoBFA?: string     // producto BFA relacionado
}

export const GLOSARIO: Record<string, ConceptoFinanciero> = {
  credito: {
    id: 'credito',
    termino: 'Crédito',
    definicion: 'Dinero prestado que se devuelve con interés en un plazo acordado.',
    analogia: 'Como cuando el pulpero te fía hasta el día de pago, pero con un trato escrito.',
    productoBFA: 'Crédito BFA Agrícola desde 4% anual',
  },
  interes: {
    id: 'interes',
    termino: 'Tasa de interés',
    definicion: 'Costo del dinero prestado, expresado en porcentaje anual.',
    analogia: 'Es lo que cobrás de "alquiler" por dejarle tu plata a alguien.',
    productoBFA: 'BFA tiene tasas preferenciales para productores.',
  },
  capital: {
    id: 'capital',
    termino: 'Capital',
    definicion: 'Suma de dinero o bienes que se invierten para generar más dinero.',
    analogia: 'Es la milpa, las vacas y el tractor que te ayudan a producir.',
  },
  patrimonio: {
    id: 'patrimonio',
    termino: 'Patrimonio neto',
    definicion: 'Total de tus bienes menos tus deudas.',
    analogia: 'Lo que de verdad tenés si vendieras todo y pagaras lo que debés.',
  },
  inversion: {
    id: 'inversion',
    termino: 'Inversión',
    definicion: 'Poner dinero o esfuerzo hoy esperando recibir más mañana.',
    analogia: 'Sembrar maíz: gastás semilla y agua, cosechás 100 veces más.',
  },
  liquidez: {
    id: 'liquidez',
    termino: 'Liquidez',
    definicion: 'Facilidad para convertir un bien en efectivo sin perder valor.',
    analogia: 'El efectivo es agua: corre. La tierra es piedra: aguanta pero no se mueve.',
  },
  ahorro: {
    id: 'ahorro',
    termino: 'Ahorro',
    definicion: 'Dinero que no se gasta hoy para usarlo mañana.',
    analogia: 'Como guardar maíz en el silo para el tiempo de hambre.',
    productoBFA: 'Cuenta de Ahorro Rural BFA sin comisión',
  },
  hipoteca: {
    id: 'hipoteca',
    termino: 'Hipoteca',
    definicion: 'Usar una propiedad como garantía para obtener un préstamo.',
    analogia: 'Le dejás al banco las llaves de tu finca a cambio de dinero. Si pagás, la recuperás.',
  },
  renta: {
    id: 'renta',
    termino: 'Renta',
    definicion: 'Ingreso periódico que se recibe por prestar un bien (tierra, casa, dinero).',
    analogia: 'Lo que te paga el aparcero por sembrar en tu terreno.',
  },
  riesgo: {
    id: 'riesgo',
    termino: 'Riesgo',
    definicion: 'Posibilidad de perder parte o todo el dinero invertido.',
    analogia: 'Como sembrar antes de la temporada: puede que llueva, puede que no.',
  },
  diversificacion: {
    id: 'diversificacion',
    termino: 'Diversificación',
    definicion: 'Repartir las inversiones para reducir el riesgo total.',
    analogia: 'No llevés todos los huevos en una canasta. Sembrá maíz, frijol y café.',
  },
  flujo_caja: {
    id: 'flujo_caja',
    termino: 'Flujo de caja',
    definicion: 'Movimiento de entradas y salidas de dinero en un periodo.',
    analogia: 'El río de tu plata: ¿entra más de lo que sale o se está secando?',
  },
  presupuesto: {
    id: 'presupuesto',
    termino: 'Presupuesto',
    definicion: 'Plan de cuánto ganarás y en qué gastarás durante un periodo.',
    analogia: 'Antes del año, anotás qué vas a sembrar y cuánto vas a gastar en cada cosa.',
  },
  rentabilidad: {
    id: 'rentabilidad',
    termino: 'Rentabilidad',
    definicion: 'Ganancia que produce una inversión, expresada como porcentaje.',
    analogia: 'Si pagás ƒ100 por una vaca y vendés su leche en ƒ150 al año, tu rentabilidad es 50%.',
  },
  pasivo: {
    id: 'pasivo',
    termino: 'Pasivo',
    definicion: 'Deudas y obligaciones financieras pendientes.',
    analogia: 'Todo lo que debés: al banco, al pulpero, al pariente.',
  },
  activo: {
    id: 'activo',
    termino: 'Activo',
    definicion: 'Todo lo que tenés y puede generar valor o convertirse en dinero.',
    analogia: 'Tu tierra, tu ganado, tus aperos, tu efectivo y lo que te deben.',
  },
  monopolio: {
    id: 'monopolio',
    termino: 'Monopolio',
    definicion: 'Cuando un solo dueño controla toda la oferta de un mercado.',
    analogia: 'Si una sola persona tiene todos los molinos de un pueblo, cobra lo que quiere.',
  },
  cooperativa: {
    id: 'cooperativa',
    termino: 'Cooperativa',
    definicion: 'Asociación de personas que se unen para producir o vender en conjunto.',
    analogia: 'Cuando los cafetaleros se juntan para vender, sacan mejor precio que cada uno por su lado.',
    productoBFA: 'BFA financia cooperativas con líneas especiales',
  },
  seguro: {
    id: 'seguro',
    termino: 'Seguro agrícola',
    definicion: 'Pago periódico que cubre pérdidas por eventos climáticos o plagas.',
    analogia: 'Como pagar la cuota del comité de emergencias antes de la sequía.',
    productoBFA: 'Seguro Agrícola BFA contra sequía y plagas',
  },
  impuesto: {
    id: 'impuesto',
    termino: 'Impuesto',
    definicion: 'Pago obligatorio al Estado para financiar servicios públicos.',
    analogia: 'La cuota que pagás para que el alcalde arregle el camino al cantón.',
  },
  inflacion: {
    id: 'inflacion',
    termino: 'Inflación',
    definicion: 'Subida general de los precios que reduce el poder de compra del dinero.',
    analogia: 'Cuando con los ƒ5 de hoy comprás menos frijoles que con los ƒ5 del año pasado.',
  },
  bancarrota: {
    id: 'bancarrota',
    termino: 'Bancarrota',
    definicion: 'Situación en la que no podés pagar tus deudas.',
    analogia: 'Cuando ya vendiste hasta la radio y aún no alcanza.',
  },
  garantia: {
    id: 'garantia',
    termino: 'Garantía',
    definicion: 'Bien que respalda un préstamo en caso de no poder pagarlo.',
    analogia: 'El terreno que el banco se queda si no devolvés el crédito.',
  },
  amortizacion: {
    id: 'amortizacion',
    termino: 'Amortización',
    definicion: 'Pago gradual de una deuda en cuotas durante un periodo.',
    analogia: 'Como pagar la moto en cuotas mensuales hasta que es tuya.',
  },
  plazo: {
    id: 'plazo',
    termino: 'Plazo',
    definicion: 'Tiempo acordado para pagar una deuda o cumplir una obligación.',
    analogia: 'La fecha en que prometiste devolver lo prestado.',
  },
  prestamo: {
    id: 'prestamo',
    termino: 'Préstamo',
    definicion: 'Cantidad de dinero recibida con compromiso de devolución.',
    analogia: 'Lo que te entrega el banco para invertir, comprometiéndote a devolverlo.',
  },
  morosidad: {
    id: 'morosidad',
    termino: 'Morosidad',
    definicion: 'Estado de quien debe dinero y no paga en la fecha acordada.',
    analogia: 'Estar atrasado con la cuota. Trae multas y daña tu reputación crediticia.',
  },
  apalancamiento: {
    id: 'apalancamiento',
    termino: 'Apalancamiento',
    definicion: 'Usar dinero prestado para multiplicar la capacidad de inversión.',
    analogia: 'Pedís ƒ1000 al banco, comprás dos vacas y producís ƒ3000 al año.',
  },
  utilidad: {
    id: 'utilidad',
    termino: 'Utilidad',
    definicion: 'Ganancia neta después de cubrir todos los costos.',
    analogia: 'Lo que te queda en la bolsa al final de la cosecha cuando ya pagaste todo.',
  },
  depreciacion: {
    id: 'depreciacion',
    termino: 'Depreciación',
    definicion: 'Pérdida de valor de un bien con el paso del tiempo o uso.',
    analogia: 'Un tractor de hace 5 años ya no vale lo mismo que cuando estaba nuevo.',
  },
} as const

// ─── Quiz: 3 opciones, 1 correcta + explicación ───────────────────────────

export interface QuizQuestion {
  conceptoId: string       // referencia al glosario
  pregunta: string
  opciones: [string, string, string]
  correcta: 0 | 1 | 2
  explicacion: string
}

export const QUIZ_BANK: QuizQuestion[] = [
  // Cosecha (positivos — buenos hábitos)
  {
    conceptoId: 'ahorro',
    pregunta: '¿Por qué es importante ahorrar parte de cada cosecha?',
    opciones: [
      'Para gastarlo en lo que se antoje',
      'Para tener reserva en años malos',
      'Para que no se devalúe',
    ],
    correcta: 1,
    explicacion: 'Ahorrar en años buenos te protege en años malos. Es la base de la estabilidad financiera rural.',
  },
  {
    conceptoId: 'diversificacion',
    pregunta: '¿Qué significa "no poner todos los huevos en una canasta"?',
    opciones: [
      'Sembrar siempre el mismo cultivo',
      'Diversificar inversiones para reducir riesgo',
      'Vender todo en un solo mercado',
    ],
    correcta: 1,
    explicacion: 'La diversificación reduce el impacto si una inversión falla. Sembrá maíz, frijol y café — no solo uno.',
  },
  {
    conceptoId: 'rentabilidad',
    pregunta: 'Si invertís ƒ100 y al año tenés ƒ140, ¿cuál es tu rentabilidad?',
    opciones: [
      '14%',
      '40%',
      '140%',
    ],
    correcta: 1,
    explicacion: 'Rentabilidad = ganancia / inversión = ƒ40 / ƒ100 = 40%. La rentabilidad mide la eficiencia de tu inversión.',
  },
  {
    conceptoId: 'apalancamiento',
    pregunta: '¿Qué es apalancamiento financiero?',
    opciones: [
      'Pagar deudas con más deudas',
      'Usar préstamos para multiplicar capacidad de inversión',
      'Esconder dinero del banco',
    ],
    correcta: 1,
    explicacion: 'El apalancamiento bien usado multiplica tus ingresos: pedís crédito BFA, invertís productivamente y devolvés con ganancia.',
  },
  {
    conceptoId: 'cooperativa',
    pregunta: '¿Qué ventaja tiene unirse a una cooperativa?',
    opciones: [
      'Mejor precio de venta colectiva e insumos baratos',
      'Pagar más impuestos',
      'Trabajar más solo',
    ],
    correcta: 0,
    explicacion: 'Las cooperativas suman volumen, negocian mejores precios y acceden a créditos preferenciales del BFA.',
  },
  // Riesgo (negativos — qué hacer ante problemas)
  {
    conceptoId: 'seguro',
    pregunta: 'Si tenés seguro agrícola y hay sequía, ¿qué pasa?',
    opciones: [
      'Perdés todo igual',
      'El seguro cubre parte o todas las pérdidas',
      'Tenés que pagar más',
    ],
    correcta: 1,
    explicacion: 'El Seguro Agrícola BFA cubre pérdidas por sequía, plagas y eventos climáticos. Es protección, no gasto.',
  },
  {
    conceptoId: 'liquidez',
    pregunta: '¿Por qué importa la liquidez en una emergencia?',
    opciones: [
      'Para impresionar al banco',
      'Para pagar sin tener que vender bienes urgentemente',
      'Para gastar más',
    ],
    correcta: 1,
    explicacion: 'Tener efectivo o ahorros líquidos te permite enfrentar imprevistos sin malvender tu patrimonio.',
  },
  {
    conceptoId: 'morosidad',
    pregunta: '¿Qué consecuencia tiene caer en morosidad?',
    opciones: [
      'Nada, todos pagan tarde',
      'Multas, intereses y daño a tu historial crediticio',
      'El banco te perdona la deuda',
    ],
    correcta: 1,
    explicacion: 'La morosidad daña tu historial crediticio por años. Es preferible renegociar antes de dejar de pagar.',
  },
  {
    conceptoId: 'inflacion',
    pregunta: '¿Cómo te protege el ahorro contra la inflación?',
    opciones: [
      'Si lo guardás bajo el colchón, sí',
      'Si lo ponés a interés en cuenta de ahorro, sí',
      'No te protege nunca',
    ],
    correcta: 1,
    explicacion: 'Una cuenta de ahorro con interés (como las del BFA) ayuda a que tu plata no pierda valor frente a la inflación.',
  },
  {
    conceptoId: 'hipoteca',
    pregunta: 'Hipotecar una propiedad significa…',
    opciones: [
      'Venderla definitivamente',
      'Usarla como garantía para recibir dinero del banco',
      'Pagar más impuestos',
    ],
    correcta: 1,
    explicacion: 'Al hipotecar entregás temporalmente el título como garantía. Si pagás, recuperás la propiedad.',
  },
]

// Pick a random question, optionally biased to a specific concept set
export function randomQuiz(filter?: (q: QuizQuestion) => boolean): QuizQuestion {
  const pool = filter ? QUIZ_BANK.filter(filter) : QUIZ_BANK
  return pool[Math.floor(Math.random() * pool.length)]
}

export function quizForCardType(type: 'cosecha' | 'riesgo'): QuizQuestion {
  // First 5 questions are "positive" topics → cosecha; rest → riesgo
  return type === 'cosecha'
    ? randomQuiz()
    : randomQuiz(q => QUIZ_BANK.indexOf(q) >= 5)
}
