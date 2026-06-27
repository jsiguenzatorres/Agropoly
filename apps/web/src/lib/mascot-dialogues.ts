export type MascotId = 'don_fomento' | 'maicita'
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
  roll_human: (): MascotLine => pick([
    { id: 'maicita', text: '¡Tu turno! ¡Lanzá los dados con todo!', mood: 'excited' },
    { id: 'don_fomento', text: 'Con fe y trabajo, todo sale bien. ¡Lanzá!', mood: 'neutral' },
    { id: 'maicita', text: '¡Vamos vamos! ¿Qué nos traen los dados?', mood: 'excited' },
    { id: 'don_fomento', text: 'El BFA confía en vos. ¡Adelante, muchacho!', mood: 'happy' },
  ]),

  buy: (): MascotLine => pick([
    { id: 'maicita', text: '¡Comprá esa propiedad! ¡Va a rendir un montón!', mood: 'excited' },
    { id: 'don_fomento', text: 'Invertir en tierra siempre vale la pena.', mood: 'happy' },
    { id: 'maicita', text: '¡No la dejés ir! ¡Es una buena inversión!', mood: 'excited' },
    { id: 'don_fomento', text: 'El BFA financia sueños. ¡Hacé la tuya!', mood: 'happy' },
  ]),

  skip_buy: (): MascotLine => pick([
    { id: 'don_fomento', text: 'A veces es mejor guardar el dinero. ¡Prudencia!', mood: 'neutral' },
    { id: 'maicita', text: 'Ajá... habrá otras oportunidades. ¡Tranquila!', mood: 'neutral' },
  ]),

  pay_rent: (): MascotLine => pick([
    { id: 'don_fomento', text: 'La renta es parte del juego. ¡Con dignidad!', mood: 'sad' },
    { id: 'maicita', text: '¡Ay no! Pero tranqui, la próxima es tuya.', mood: 'worried' },
    { id: 'don_fomento', text: 'Nadie escapa de la renta. ¡Ya vendrán tiempos mejores!', mood: 'sad' },
  ]),

  pay_tax: (): MascotLine => pick([
    { id: 'don_fomento', text: 'Los impuestos sostienen el país. ¡A pagarlo!', mood: 'neutral' },
    { id: 'maicita', text: '¡Impuestos! Así funciona la economía nacional.', mood: 'worried' },
    { id: 'don_fomento', text: 'Recuerden: los impuestos financian el desarrollo rural.', mood: 'neutral' },
  ]),

  cosecha: (): MascotLine => pick([
    { id: 'maicita', text: '¡Tarjeta Cosecha! ¡Buenas noticias te esperan!', mood: 'excited' },
    { id: 'don_fomento', text: 'La cosecha siempre trae bendiciones al campo.', mood: 'happy' },
    { id: 'maicita', text: '¡Ay qué chivo! ¡Tarjeta de suerte!', mood: 'excited' },
    { id: 'don_fomento', text: '¡La tierra siempre recompensa al trabajador!', mood: 'happy' },
  ]),

  riesgo: (): MascotLine => pick([
    { id: 'don_fomento', text: 'El campo también tiene sus riesgos... ¡Ánimo!', mood: 'worried' },
    { id: 'maicita', text: '¡Cuidado! Tarjeta Riesgo... ¡Que no sea tan feo!', mood: 'worried' },
    { id: 'don_fomento', text: 'La naturaleza es impredecible. ¡El BFA te respalda!', mood: 'sad' },
  ]),

  jail: (): MascotLine => pick([
    { id: 'don_fomento', text: '¡A la cárcel! Hay que respetar las reglas del juego.', mood: 'worried' },
    { id: 'maicita', text: '¡Ay puchica! ¡A la cárcel! ¡Ya salís pronto!', mood: 'sad' },
  ]),

  go_pass: (): MascotLine => pick([
    { id: 'maicita', text: '¡Pasaste por el BFA Central! ¡ƒ200 de crédito!', mood: 'excited' },
    { id: 'don_fomento', text: '¡El BFA siempre apoya! ¡ƒ200 para seguir adelante!', mood: 'happy' },
  ]),

  end_turn: (): MascotLine => pick([
    { id: 'maicita', text: '¡Buen turno! ¡A ver qué pasa en el siguiente!', mood: 'happy' },
    { id: 'don_fomento', text: 'Así se juega. ¡Con cabeza y con corazón!', mood: 'neutral' },
  ]),

  win: (name: string): MascotLine => ({
    id: 'maicita',
    text: `¡¡${name} gana!! ¡El mejor agricultor de El Salvador!`,
    mood: 'excited',
  }),
} as const
