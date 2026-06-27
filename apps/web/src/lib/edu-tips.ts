export interface EduTip {
  icon: string
  title: string
  body: string
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const EDU_TIPS = {
  go_pass: (): EduTip => pick([
    {
      icon: '💰',
      title: 'Crédito BFA productivo',
      body: 'El BFA ofrece créditos agrícolas desde 4% anual para siembra, cosecha y compra de insumos. Más bajo que la banca tradicional.',
    },
    {
      icon: '🏦',
      title: 'Cuenta de ahorro rural',
      body: 'Las cuentas de ahorro BFA no cobran comisión por manejo y pagan interés mensual. Ideal para guardar la cosecha.',
    },
    {
      icon: '📈',
      title: 'Reinvertir el ƒ200',
      body: 'Cada vez que recibís ƒ200, considerá reinvertir en propiedades. El interés compuesto es tu mejor aliado.',
    },
  ]),

  buy: (): EduTip => pick([
    {
      icon: '🌾',
      title: 'Activo productivo',
      body: 'Las propiedades agrícolas generan renta pasiva. Diferente al consumo: la tierra trabaja por vos.',
    },
    {
      icon: '🏘️',
      title: 'Grupo completo = renta x2',
      body: 'Tener todas las propiedades de un grupo duplica la renta base y habilita construir mejoras.',
    },
    {
      icon: '🎯',
      title: 'Diversificación',
      body: 'No pongás todo en un solo grupo. La diversificación protege contra eventos negativos (Tarjetas Riesgo).',
    },
  ]),

  pay_rent: (): EduTip => pick([
    {
      icon: '💸',
      title: 'Costo de oportunidad',
      body: 'Pagar renta es perder ingreso. Por eso conviene ser dueño, no inquilino, cuando es viable.',
    },
    {
      icon: '🔄',
      title: 'Flujo de caja',
      body: 'En el campo y en el juego: cuidá el flujo de caja. Tener efectivo previene quiebras inesperadas.',
    },
  ]),

  pay_tax: (): EduTip => pick([
    {
      icon: '🏛️',
      title: 'Impuestos rurales',
      body: 'Los impuestos agrarios financian caminos, riego e infraestructura que beneficia al productor. Es inversión colectiva.',
    },
    {
      icon: '📋',
      title: 'Planificación fiscal',
      body: 'Reservá un 10-15% de tu ingreso agrícola para obligaciones tributarias. Evita sorpresas.',
    },
  ]),

  cosecha: (): EduTip => pick([
    {
      icon: '🌽',
      title: 'Buenos años de cosecha',
      body: 'En años de buena cosecha, ahorrá para los años malos. El BFA tiene cuentas de depósito a plazo con buen interés.',
    },
    {
      icon: '🤝',
      title: 'Cooperativas BFA',
      body: 'Asociarse a cooperativas reduce costos de insumos y mejora precios de venta. El BFA financia cooperativas.',
    },
  ]),

  riesgo: (): EduTip => pick([
    {
      icon: '🌪️',
      title: 'Seguro agrícola BFA',
      body: 'El BFA ofrece seguro agrícola contra sequía, plagas y eventos climáticos. Protege tu inversión.',
    },
    {
      icon: '⚖️',
      title: 'Fondo de emergencia',
      body: 'Tené siempre un fondo de 3-6 meses de gastos. Los riesgos en el campo son reales e impredecibles.',
    },
  ]),

  jail: (): EduTip => ({
    icon: '🚨',
    title: 'Línea de crédito de emergencia',
    body: 'El BFA tiene líneas de crédito de emergencia para productores afectados por eventos climáticos extremos.',
  }),

  build: (): EduTip => pick([
    {
      icon: '🏗️',
      title: 'Crédito para mejoras',
      body: 'El BFA financia mejoras prediales (silos, riego, invernaderos) hasta 10 años plazo. Aumenta tu productividad.',
    },
    {
      icon: '📊',
      title: 'Renta exponencial',
      body: 'Cada casa multiplica la renta. Hotel = 5x casas. Construir es el camino más rápido al dominio del tablero.',
    },
  ]),
} as const
