// Story-mode intro lines. Each player gets:
//   - presentation (BFA presents the player by name + token)
//   - aspiration (random per personal mascot — what they dream of achieving)

import type { TokenId } from '@agropoly/game-engine'

export const TOKEN_EMOJI: Record<TokenId, string> = {
  maiz: '🌽', cafe: '☕', vaca: '🐄', tractor: '🚜', milpa: '🌿', pez: '🐟',
}

export const TOKEN_NICKNAME: Record<TokenId, string> = {
  maiz:    'La Mazorca',
  cafe:    'El Cafetal',
  vaca:    'La Vaca',
  tractor: 'El Tractor',
  milpa:   'La Milpa',
  pez:     'El Pez',
}

// Aspirations — 2 variants per token, randomly chosen on each intro.
const ASPIRATIONS: Record<TokenId, string[]> = {
  maiz: [
    '"¡Quiero llenar de maíz cada agencia del país!"',
    '"Voy por el monopolio de Occidente. ¡A sembrar!"',
  ],
  cafe: [
    '"Mi café va a dominar San Salvador. Premio en cada cosecha."',
    '"Pienso construir Centros BFA en cada zona cafetalera."',
  ],
  vaca: [
    '"¡Muuu! Voy a quebrar a todos sin perder ni un colón."',
    '"La Vaquita BFA quiere su patrimonio de ƒ5,000. ¡Y lo logra!"',
  ],
  tractor: [
    '"Con disciplina y crédito BFA, el campo se conquista."',
    '"Voy a comprar la Casa Matriz. La capital es mía."',
  ],
  milpa: [
    '"Sólo no quiero quebrar... pero si gano, mejor."',
    '"Quiero un Centro de Servicio BFA, aunque sea uno."',
  ],
  pez: [
    '"Voy a navegar entre tormentas y arcoíris. ¡Que llueva oro!"',
    '"El BFA me respalda. Los riesgos no me asustan."',
  ],
}

export function aspirationFor(token: TokenId): string {
  const list = ASPIRATIONS[token] ?? ASPIRATIONS.maiz
  return list[Math.floor(Math.random() * list.length)]
}
