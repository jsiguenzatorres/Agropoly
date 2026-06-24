import { Schema, type, ArraySchema } from '@colyseus/schema'

export class PlayerState extends Schema {
  @type('string')   id = ''
  @type('string')   name = ''
  @type('string')   tokenId = 'maiz'
  @type('number')   balance = 1500
  @type('number')   position = 0
  @type('boolean')  jailed = false
  @type('number')   jailTurns = 0
  @type('number')   jailFreeCards = 0
  @type('boolean')  bankrupt = false
  @type('boolean')  isAI = false
  @type('string')   difficulty = 'easy'
  @type(['number']) properties = new ArraySchema<number>()
}

export class BoardSpaceState extends Schema {
  @type('number')  id = 0
  @type('string')  type = 'prop'
  @type('number')  group = -1
  @type('string')  name = ''
  @type('number')  price = 0
  @type('number')  ownerId = -1
  @type('number')  buildings = 0
  @type('boolean') mortgaged = false
}

export class GameStateSchema extends Schema {
  @type('string')          phase = 'setup'
  @type('number')          currentPlayerIndex = 0
  @type('number')          turnCount = 0
  @type('boolean')         educationalMode = false
  @type([PlayerState])     players = new ArraySchema<PlayerState>()
  @type([BoardSpaceState]) board = new ArraySchema<BoardSpaceState>()
  @type('string')          lastAction = ''
}
