import { Schema, type, ArraySchema } from '@colyseus/schema'

export class PlayerState extends Schema {
  @type('string')   id            = ''
  @type('string')   name          = ''
  @type('string')   tokenId       = 'maiz'
  @type('number')   balance       = 1500
  @type('number')   position      = 0
  @type('boolean')  jailed        = false
  @type('number')   jailTurns     = 0
  @type('number')   jailFreeCards = 0
  @type('boolean')  bankrupt      = false
  @type('boolean')  isAI          = false
  @type('string')   difficulty    = 'easy'
  @type(['number']) properties    = new ArraySchema<number>()
  @type('boolean')  isHost        = false  // first to join is host (can start game)
  @type('boolean')  isReady       = false
}

export class BoardSpaceState extends Schema {
  @type('number')  id        = 0
  @type('string')  type      = 'prop'
  @type('number')  group     = -1
  @type('string')  name      = ''
  @type('number')  price     = 0
  @type('number')  hcost     = 0
  @type('string')  ownerId   = ''      // empty when unowned
  @type('number')  buildings = 0
  @type('boolean') mortgaged = false
  // rents NOT in schema — looked up from BOARD_DATA on client
}

export class DiceState extends Schema {
  @type('number')  d1      = 0
  @type('number')  d2      = 0
  @type('boolean') doubles = false
}

export class CardState extends Schema {
  @type('string')  id    = ''
  @type('string')  type  = 'cosecha'
  @type('string')  icon  = ''
  @type('string')  title = ''
  @type('string')  text  = ''
  // effect serialized as JSON string (CardEffect union too varied for schema)
  @type('string')  effectJson = ''
}

export class AuctionStateSchema extends Schema {
  @type('number')   spaceId          = -1
  @type('number')   currentBid       = 0
  @type('string')   highBidderId     = ''
  @type('string')   currentBidderId  = ''
  @type(['string']) participants     = new ArraySchema<string>()
}

export class GameStateSchema extends Schema {
  @type('string')          phase              = 'waiting'    // waiting | playing | game_over
  @type('string')          pending            = 'roll'       // roll | buy | pay_rent | pay_tax | cosecha | riesgo | apply_card | jail_choice | end | game_over
  @type('number')          currentPlayerIndex = 0
  @type('number')          turnCount          = 0
  @type('number')          doublesCount       = 0
  @type('number')          pendingAmount      = 0
  @type('boolean')         educationalMode    = false
  @type('string')          winnerId           = ''
  @type('string')          hostId             = ''           // sessionId of host

  @type(DiceState)         lastDice           = new DiceState()
  @type(CardState)         pendingCard        = new CardState()
  @type('boolean')         hasPendingCard     = false
  @type(AuctionStateSchema) auction           = new AuctionStateSchema()
  @type('boolean')         hasAuction         = false

  @type([PlayerState])     players            = new ArraySchema<PlayerState>()
  @type([BoardSpaceState]) board              = new ArraySchema<BoardSpaceState>()

  // Decks tracked as ordered arrays of card IDs (cards looked up on server from COSECHA_DECK/RIESGO_DECK)
  @type(['string'])        cosechaDeckIds     = new ArraySchema<string>()
  @type(['string'])        riesgoDeckIds      = new ArraySchema<string>()
}
