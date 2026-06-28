export type MascotId =
  | 'don_fomento'   // Anciano del banco, sabio
  | 'maicita'       // Joven entusiasta
  | 'la_vaquita'    // Mascota oficial BFA (desde 1973)
  | 'don_cafe'      // Productor cafetalero, rival comercial
  | 'la_canche'     // Rival novata, IA fácil
  | 'la_tormenta'   // Aparece solo en Tarjetas Riesgo

export type Mood = 'happy' | 'sad' | 'excited' | 'worried' | 'neutral'

export interface MascotLine {
  id: MascotId
  text: string
  mood: Mood
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const DIALOGUES = {
  // ── Don Fomento + Maicita (originales) ───────────────────────────────────
  roll_human: (): MascotLine => pick([
    { id: 'maicita',     text: '¡Tu turno! ¡Lanzá los dados con todo!',         mood: 'excited' },
    { id: 'don_fomento', text: 'Con fe y trabajo, todo sale bien. ¡Lanzá!',     mood: 'neutral' },
    { id: 'maicita',     text: '¡Vamos vamos! ¿Qué nos traen los dados?',      mood: 'excited' },
    { id: 'don_fomento', text: 'El BFA confía en vos. ¡Adelante, muchacho!',   mood: 'happy' },
  ]),

  buy: (): MascotLine => pick([
    { id: 'maicita',     text: '¡Comprá esa propiedad! ¡Va a rendir un montón!', mood: 'excited' },
    { id: 'don_fomento', text: 'Invertir en tierra siempre vale la pena.',       mood: 'happy' },
    { id: 'maicita',     text: '¡No la dejés ir! ¡Es una buena inversión!',     mood: 'excited' },
    { id: 'don_cafe',    text: 'Si la dejás, te la compro yo. ¡Pensalo bien!',  mood: 'neutral' },
  ]),

  skip_buy: (): MascotLine => pick([
    { id: 'don_fomento', text: 'A veces es mejor guardar el dinero. ¡Prudencia!', mood: 'neutral' },
    { id: 'maicita',     text: 'Ajá... habrá otras oportunidades. ¡Tranquila!',   mood: 'neutral' },
  ]),

  pay_rent: (): MascotLine => pick([
    { id: 'don_fomento', text: 'La renta es parte del juego. ¡Con dignidad!',           mood: 'sad' },
    { id: 'maicita',     text: '¡Ay no! Pero tranqui, la próxima es tuya.',             mood: 'worried' },
    { id: 'don_fomento', text: 'Nadie escapa de la renta. ¡Ya vendrán tiempos mejores!', mood: 'sad' },
  ]),

  pay_tax: (): MascotLine => pick([
    { id: 'don_fomento', text: 'Los impuestos sostienen el país. ¡A pagarlo!',          mood: 'neutral' },
    { id: 'maicita',     text: '¡Impuestos! Así funciona la economía nacional.',        mood: 'worried' },
    { id: 'don_fomento', text: 'Recuerden: los impuestos financian el desarrollo rural.', mood: 'neutral' },
  ]),

  cosecha: (): MascotLine => pick([
    { id: 'maicita',     text: '¡Tarjeta Cosecha! ¡Buenas noticias te esperan!',       mood: 'excited' },
    { id: 'don_fomento', text: 'La cosecha siempre trae bendiciones al campo.',        mood: 'happy' },
    { id: 'la_vaquita',  text: '¡Muuu! La buena cosecha alimenta a todos.',            mood: 'happy' },
  ]),

  riesgo: (): MascotLine => pick([
    { id: 'la_tormenta', text: '⚡ ¡Cuidado! Los riesgos del campo no perdonan...',   mood: 'worried' },
    { id: 'la_tormenta', text: '⛈️ Cuando truena, hasta el más fuerte se asusta.',     mood: 'sad' },
    { id: 'don_fomento', text: 'La naturaleza es impredecible. ¡El BFA te respalda!',  mood: 'sad' },
  ]),

  jail: (): MascotLine => pick([
    { id: 'don_fomento', text: '¡A la cárcel! Hay que respetar las reglas del juego.',  mood: 'worried' },
    { id: 'maicita',     text: '¡Ay puchica! ¡A la cárcel! ¡Ya salís pronto!',           mood: 'sad' },
    { id: 'la_tormenta', text: '⚡ Una emergencia climática te detiene. Es la naturaleza.', mood: 'worried' },
  ]),

  go_pass: (): MascotLine => pick([
    { id: 'la_vaquita',  text: '¡Muuu! Pasaste por el BFA Central. ¡Tomá tus ƒ200!',  mood: 'excited' },
    { id: 'la_vaquita',  text: '¡Muuu! El BFA te entrega tu crédito de ƒ200.',          mood: 'happy' },
    { id: 'maicita',     text: '¡Pasaste por el BFA Central! ¡ƒ200 de crédito!',       mood: 'excited' },
    { id: 'don_fomento', text: '¡El BFA siempre apoya! ƒ200 para seguir adelante!',    mood: 'happy' },
  ]),

  property_bought: (): MascotLine => pick([
    { id: 'la_vaquita',  text: '¡Muuu! Nueva propiedad. Vas haciendo patrimonio.',     mood: 'happy' },
    { id: 'don_fomento', text: '¡Felicidades! Una propiedad más en tu cartera.',       mood: 'happy' },
  ]),

  hotel_built: (): MascotLine => pick([
    { id: 'la_vaquita',  text: '¡Muuu! ¡Un Centro de Servicio BFA! ¡Qué grande!',       mood: 'excited' },
    { id: 'don_cafe',    text: 'Hotel construido... la competencia se pone seria.',     mood: 'worried' },
  ]),

  bankruptcy: (): MascotLine => pick([
    { id: 'don_fomento', text: 'A veces caemos. Lo importante es levantarse.',        mood: 'sad' },
    { id: 'la_tormenta', text: '⛈️ La tormenta pasó. Mañana será otro día.',           mood: 'sad' },
  ]),

  end_turn: (): MascotLine => pick([
    { id: 'maicita',     text: '¡Buen turno! ¡A ver qué pasa en el siguiente!',       mood: 'happy' },
    { id: 'don_fomento', text: 'Así se juega. ¡Con cabeza y con corazón!',            mood: 'neutral' },
  ]),

  auction_start: (): MascotLine => pick([
    { id: 'don_cafe',    text: '¡A subasta! Yo le voy a entrar fuerte. ¡Cuidado!',     mood: 'excited' },
    { id: 'la_canche',   text: '¡Ay, una subasta! No sé cuánto pujar...',              mood: 'worried' },
  ]),

  win: (name: string): MascotLine => ({
    id: 'la_vaquita',
    text: `¡¡${name} gana!! ¡El mejor agricultor de El Salvador! ¡Muuu!`,
    mood: 'excited',
  }),
} as const
