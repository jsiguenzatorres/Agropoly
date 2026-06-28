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

// Map a player's tokenId to their "personal" mascot — the one that reacts
// emotionally to their gains and losses.
export const TOKEN_MASCOT: Record<string, MascotId> = {
  maiz:    'maicita',
  cafe:    'don_cafe',
  vaca:    'la_vaquita',
  tractor: 'don_fomento',
  milpa:   'la_canche',
  pez:     'la_tormenta',
}

export function mascotForToken(tokenId: string): MascotId {
  return TOKEN_MASCOT[tokenId] ?? 'don_fomento'
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

  // ── Commentary lines (narrador automático de eventos del juego) ──────────
  commentary_group_complete: (playerName: string, groupName: string): MascotLine => pick([
    { id: 'la_vaquita',  text: `¡Muuu! ${playerName} ya domina ${groupName}. Renta x2 desde ahora.`, mood: 'excited' },
    { id: 'don_fomento', text: `${playerName} cerró el grupo ${groupName}. Trabajo bien hecho.`,    mood: 'happy' },
  ]),
  commentary_hotel: (playerName: string, tileName: string): MascotLine => pick([
    { id: 'la_vaquita', text: `¡Muuu! Un Centro de Servicio BFA en ${tileName}. ¡${playerName} es fuerte!`, mood: 'excited' },
    { id: 'don_cafe',   text: `${playerName} levantó un Centro en ${tileName}. La competencia se calienta.`, mood: 'worried' },
  ]),
  commentary_bankruptcy: (playerName: string): MascotLine => pick([
    { id: 'don_fomento', text: `${playerName} quebró. A veces el campo es duro, pero siempre se vuelve a sembrar.`, mood: 'sad' },
    { id: 'la_tormenta', text: `⛈️ Hasta los más grandes caen. ${playerName} salió del juego.`, mood: 'sad' },
  ]),
  commentary_auction_won: (playerName: string, amount: number, tileName: string): MascotLine => pick([
    { id: 'maicita',  text: `¡${playerName} se quedó con ${tileName} por ƒ${amount}! Buena jugada.`, mood: 'happy' },
    { id: 'don_cafe', text: `${playerName} ganó la subasta por ƒ${amount}. Era una buena oferta.`,    mood: 'neutral' },
  ]),
  commentary_jail_free_used: (playerName: string): MascotLine => pick([
    { id: 'don_fomento', text: `${playerName} usó su Tarjeta Libre de Emergencia. ¡Listo para seguir!`, mood: 'happy' },
    { id: 'maicita',     text: `¡${playerName} se salvó con su carta! Ahora a jugar fuerte.`,            mood: 'excited' },
  ]),
  commentary_climate_extreme: (climate: 'tormenta' | 'arcoiris'): MascotLine =>
    climate === 'tormenta'
      ? { id: 'la_tormenta', text: '⛈️ ¡Viene tormenta! Las cosechas valen la mitad esta ronda.', mood: 'worried' }
      : { id: 'la_vaquita',  text: '🌈 ¡Arcoíris en el campo! Las cosechas valen el doble. ¡Aprovechen!', mood: 'excited' },
  commentary_trade_accepted: (fromName: string, toName: string): MascotLine => pick([
    { id: 'don_fomento', text: `${fromName} y ${toName} cerraron un trato. Así se hace negocio.`, mood: 'happy' },
    { id: 'maicita',     text: `¡Trato hecho entre ${fromName} y ${toName}!`,                      mood: 'excited' },
  ]),

  // ── Personal mascot reactions to player's own money events ───────────────
  // Each mascot reacts in-character to losing money to another player.
  pay_to_other: (ownTokenId: string, otherName: string, amount: number): MascotLine => {
    const mascot = mascotForToken(ownTokenId)
    const variants: Record<MascotId, string[]> = {
      maicita: [
        `¡Ay no! ƒ${amount} para ${otherName}... 😢 ¡Pero la próxima la levantamos!`,
        `Puchica, ƒ${amount} se fueron. ¡Tranquila, ya viene mi turno!`,
      ],
      don_fomento: [
        `Ni modo... ƒ${amount} para ${otherName}. El campo enseña humildad.`,
        `Ahí van ƒ${amount}. Cuestiones de honor — se paga lo que se debe.`,
      ],
      la_vaquita: [
        `Muuu... ƒ${amount} menos en el establo. ${otherName} se los lleva.`,
        `¡Ay muuu! Eso dolió: ƒ${amount} a ${otherName}.`,
      ],
      don_cafe: [
        `Ahem... ${otherName} se queda con ƒ${amount} de mi cosecha de café. Veremos.`,
        `Pago lo justo: ƒ${amount} a ${otherName}. Pero estaré atento.`,
      ],
      la_canche: [
        `¡Ay no, ƒ${amount}! Es muchísimo... ${otherName} qué suertudo.`,
        `Pero pero pero... ¿ƒ${amount}? ¡Está caro pisar aquí!`,
      ],
      la_tormenta: [
        `⛈️ Truena fuerte: ƒ${amount} salen rumbo a ${otherName}.`,
        `⚡ Pérdida fría: ƒ${amount} a ${otherName}. Así es la naturaleza.`,
      ],
    }
    return { id: mascot, text: pick(variants[mascot]), mood: 'sad' }
  },

  // Reactions to receiving money (rent income).
  receive_from_other: (ownTokenId: string, otherName: string, amount: number): MascotLine => {
    const mascot = mascotForToken(ownTokenId)
    const variants: Record<MascotId, string[]> = {
      maicita: [
        `¡Yupii! +ƒ${amount} de ${otherName}. ¡Así me gusta!`,
        `¡Cabal, ƒ${amount}! ${otherName} pagó renta — el patrimonio crece.`,
      ],
      don_fomento: [
        `Buenas inversiones rinden. ƒ${amount} de ${otherName}, bien merecido.`,
        `Otro pago puntual: ƒ${amount}. El BFA estaría orgulloso.`,
      ],
      la_vaquita: [
        `¡Muuu de la fortuna! +ƒ${amount} de ${otherName}. 🥛`,
        `Muuu... el establo crece: ƒ${amount} más, gracias ${otherName}.`,
      ],
      don_cafe: [
        `Café con leche y ƒ${amount} de ${otherName}. ¡Buen día!`,
        `Eso es: ƒ${amount} a la bolsa. ${otherName} pagó como caballero.`,
      ],
      la_canche: [
        `¡Ay sí, ƒ${amount}! ${otherName}, mil gracias.`,
        `¡Wepa! +ƒ${amount} para mí. ¡Qué chivo!`,
      ],
      la_tormenta: [
        `🌈 Renta cae como lluvia: +ƒ${amount} de ${otherName}.`,
        `⚡ El campo da: +ƒ${amount}. ${otherName} paga su tributo.`,
      ],
    }
    return { id: mascot, text: pick(variants[mascot]), mood: 'excited' }
  },
} as const
