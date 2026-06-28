import { Room, Client } from 'colyseus'
import {
  BOARD_DATA, STARTING_BALANCE, GO_AMOUNT,
  JAIL_POSITION, JAIL_FINE, MAX_JAIL_TURNS,
  calcRent, canBuild,
  shuffle, COSECHA_DECK, RIESGO_DECK,
} from '@agropoly/game-engine'
import type { Card } from '@agropoly/game-engine'
import {
  GameStateSchema, PlayerState, BoardSpaceState,
} from '../schema/GameState'

const rollD6 = () => Math.floor(Math.random() * 6) + 1

interface JoinOptions {
  name?: string
  tokenId?: string
  educationalMode?: boolean
}

export class GameRoom extends Room<GameStateSchema> {
  maxClients = 6

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onCreate(_options: unknown) {
    this.setState(new GameStateSchema())
    this.populateBoard()
    this.populateDecks()

    this.onMessage('start_game', client => {
      if (this.state.hostId !== client.sessionId) return
      if (this.state.phase !== 'waiting') return
      if (this.state.players.length < 2) return
      this.state.phase = 'playing'
      this.state.pending = 'roll'
      this.state.currentPlayerIndex = 0
    })

    this.onMessage('roll_dice',     client => this.guard(client, () => this.rollDice()))
    this.onMessage('confirm_buy',   client => this.guard(client, () => this.confirmBuy()))
    this.onMessage('skip_buy',      client => this.guard(client, () => this.skipBuy()))
    this.onMessage('confirm_rent',  client => this.guard(client, () => this.confirmRent()))
    this.onMessage('confirm_tax',   client => this.guard(client, () => this.confirmTax()))
    this.onMessage('draw_card',     client => this.guard(client, () => this.drawCard()))
    this.onMessage('apply_card',    client => this.guard(client, () => this.applyCard()))
    this.onMessage('pay_jail_fine', client => this.guard(client, () => this.payJailFine()))
    this.onMessage('roll_for_jail', client => this.guard(client, () => this.rollForJail()))
    this.onMessage('end_turn',      client => this.guard(client, () => this.endTurn()))
    this.onMessage('build',
      (client, msg: { spaceId: number }) =>
        this.guard(client, () => this.build(msg?.spaceId))
    )

    console.log(`[GameRoom] Created — roomId=${this.roomId}`)
  }

  onJoin(client: Client, options: JoinOptions) {
    if (this.state.phase !== 'waiting') return
    const player = new PlayerState()
    player.id      = client.sessionId
    player.name    = (options.name ?? 'Jugador').slice(0, 20)
    player.tokenId = options.tokenId ?? 'maiz'
    player.balance = STARTING_BALANCE
    if (this.state.players.length === 0) {
      player.isHost     = true
      this.state.hostId = client.sessionId
      this.state.educationalMode = !!options.educationalMode
    }
    this.state.players.push(player)
    console.log(`[GameRoom] ${player.name} joined (${this.state.players.length}/${this.maxClients})`)
  }

  onLeave(client: Client, _consented: boolean) {
    const idx = this.state.players.findIndex((p: PlayerState) => p.id === client.sessionId)
    if (idx < 0) return
    const player = this.state.players[idx]
    if (!player) return
    if (this.state.phase === 'waiting') {
      this.state.players.splice(idx, 1)
      const newHost = this.state.players[0]
      if (this.state.hostId === client.sessionId && newHost) {
        newHost.isHost = true
        this.state.hostId = newHost.id
      }
    } else {
      player.bankrupt = true
      if (this.state.players[this.state.currentPlayerIndex]?.id === client.sessionId) {
        this.endTurn()
      }
      this.checkGameOver()
    }
    console.log(`[GameRoom] ${player?.name ?? client.sessionId} left`)
  }

  onDispose() {
    console.log(`[GameRoom] Disposing ${this.roomId}`)
  }

  // ── Setup helpers ──────────────────────────────────────────────────────────

  private populateBoard() {
    for (const s of BOARD_DATA) {
      const b = new BoardSpaceState()
      b.id    = s.id
      b.type  = s.type
      b.group = s.group
      b.name  = s.name
      b.price = s.price
      b.hcost = s.hcost
      this.state.board.push(b)
    }
  }

  private populateDecks() {
    const cosecha = shuffle([...COSECHA_DECK])
    const riesgo  = shuffle([...RIESGO_DECK])
    cosecha.forEach(c => this.state.cosechaDeckIds.push(c.id))
    riesgo .forEach(c => this.state.riesgoDeckIds .push(c.id))
  }

  // ── Guards ─────────────────────────────────────────────────────────────────

  private guard(client: Client, fn: () => void) {
    if (this.state.phase !== 'playing') return
    const current = this.state.players[this.state.currentPlayerIndex]
    if (!current || current.id !== client.sessionId) return
    fn()
  }

  // ── Turn actions (ported from gameStore.ts) ────────────────────────────────

  private rollDice() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player || player.bankrupt) return
    if (player.jailed) { this.state.pending = 'jail_choice'; return }

    const d1 = rollD6(), d2 = rollD6()
    const doubles = d1 === d2
    const total = d1 + d2
    this.state.lastDice.d1 = d1
    this.state.lastDice.d2 = d2
    this.state.lastDice.doubles = doubles

    if (doubles) {
      this.state.doublesCount++
      if (this.state.doublesCount >= 3) {
        player.position = JAIL_POSITION
        player.jailed = true
        player.jailTurns = 0
        this.state.doublesCount = 0
        this.state.pending = 'end'
        return
      }
    } else {
      this.state.doublesCount = 0
    }

    const prevPos = player.position
    player.position = (player.position + total) % 40
    if (player.position < prevPos && player.position !== 0) player.balance += GO_AMOUNT

    const space = this.state.board[player.position]
    if (!space) { this.state.pending = 'end'; return }

    switch (space.type) {
      case 'go':
        player.balance += GO_AMOUNT
        this.state.pending = 'end'
        break
      case 'jail':
        this.state.pending = 'end'
        break
      case 'gotojail':
        player.position = JAIL_POSITION
        player.jailed = true
        player.jailTurns = 0
        this.state.doublesCount = 0
        this.state.pending = 'end'
        break
      case 'free':
        this.state.pending = 'end'
        break
      case 'tax':
        this.state.pendingAmount = space.price
        this.state.pending = 'pay_tax'
        break
      case 'cosecha':
        this.state.pending = 'cosecha'
        break
      case 'riesgo':
        this.state.pending = 'riesgo'
        break
      case 'prop':
      case 'station':
      case 'utility':
        if (!space.ownerId) {
          this.state.pending = 'buy'
        } else if (space.ownerId === player.id) {
          this.state.pending = 'end'
        } else {
          const owner = this.state.players.find((p: PlayerState) => p.id === space.ownerId)
          if (!owner || owner.bankrupt || space.mortgaged) {
            this.state.pending = 'end'
            break
          }
          let rent = 0
          if (space.type === 'utility') {
            const ownerUtils = this.state.board.filter((x: BoardSpaceState) => x.type === 'utility' && x.ownerId === space.ownerId).length
            rent = total * (ownerUtils === 2 ? 10 : 4)
          } else {
            const board = this.toEngineBoard()
            const players = this.toEnginePlayers()
            const engineSpace = board[player.position]
            rent = calcRent(engineSpace, board, players)
          }
          this.state.pendingAmount = rent
          this.state.pending = 'pay_rent'
        }
        break
      default:
        this.state.pending = 'end'
    }
  }

  private confirmBuy() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player) return
    const space = this.state.board[player.position]
    if (!space || player.balance < space.price) return
    player.balance -= space.price
    space.ownerId = player.id
    player.properties.push(space.id)
    this.state.pending = 'end'
  }

  private skipBuy() {
    this.state.pending = 'end'
  }

  private confirmRent() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player) return
    const space = this.state.board[player.position]
    const amount = this.state.pendingAmount
    player.balance -= amount
    if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
    const owner = this.state.players.find((p: PlayerState) => p.id === space?.ownerId)
    if (owner) owner.balance += amount
    this.state.pendingAmount = 0
    this.state.pending = 'end'
  }

  private confirmTax() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player) return
    player.balance -= this.state.pendingAmount
    if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
    this.state.pendingAmount = 0
    this.state.pending = 'end'
  }

  private drawCard() {
    const isCosecha = this.state.pending === 'cosecha'
    const deckIds = isCosecha ? this.state.cosechaDeckIds : this.state.riesgoDeckIds
    if (deckIds.length === 0) return
    const cardId = deckIds.shift()!
    const source = isCosecha ? COSECHA_DECK : RIESGO_DECK
    const card = source.find(c => c.id === cardId)
    if (!card) { this.state.pending = 'end'; return }
    this.state.pendingCard.id    = card.id
    this.state.pendingCard.type  = card.type
    this.state.pendingCard.icon  = card.icon
    this.state.pendingCard.title = card.title
    this.state.pendingCard.text  = card.text
    this.state.pendingCard.effectJson = JSON.stringify(card.effect)
    this.state.hasPendingCard = true
    this.state.pending = 'apply_card'
  }

  private applyCard() {
    if (!this.state.hasPendingCard) return
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player) return
    const effect = JSON.parse(this.state.pendingCard.effectJson) as Card['effect']

    switch (effect.action) {
      case 'collect':
        player.balance += effect.amount
        break
      case 'pay':
        player.balance -= effect.amount
        if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
        break
      case 'move':
        player.position = effect.to
        break
      case 'move_relative':
        player.position = Math.max(0, (player.position + effect.steps + 40) % 40)
        break
      case 'go_to_jail':
        player.position = JAIL_POSITION
        player.jailed = true
        player.jailTurns = 0
        break
      case 'jail_free':
        player.jailFreeCards++
        break
      case 'collect_from_players':
        this.state.players.forEach((p: PlayerState) => {
          if (p.id !== player.id && !p.bankrupt) {
            const pay = Math.min(p.balance, effect.amount)
            p.balance -= pay
            player.balance += pay
          }
        })
        break
      case 'pay_per_building':
        this.state.board.forEach((sp: BoardSpaceState) => {
          if (sp.ownerId === player.id && sp.buildings > 0) {
            const cost = sp.buildings < 5
              ? sp.buildings * effect.house
              : effect.hotel
            player.balance -= cost
          }
        })
        if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
        break
    }
    this.state.hasPendingCard = false
    this.state.pendingCard.id = ''
    this.state.pending = 'end'
  }

  private payJailFine() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player || player.balance < JAIL_FINE) return
    player.balance -= JAIL_FINE
    player.jailed = false
    player.jailTurns = 0
    this.state.pending = 'roll'
  }

  private rollForJail() {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player) return
    const d1 = rollD6(), d2 = rollD6()
    this.state.lastDice.d1 = d1
    this.state.lastDice.d2 = d2
    this.state.lastDice.doubles = d1 === d2
    if (d1 === d2) {
      player.jailed = false
      player.jailTurns = 0
      player.position = (JAIL_POSITION + d1 + d2) % 40
      this.state.pending = 'end'
    } else {
      player.jailTurns++
      if (player.jailTurns >= MAX_JAIL_TURNS) {
        player.balance -= JAIL_FINE
        if (player.balance < 0) { player.bankrupt = true; player.balance = 0 }
        player.jailed = false
        player.jailTurns = 0
      }
      this.state.pending = 'end'
    }
  }

  private build(spaceId: number) {
    const player = this.state.players[this.state.currentPlayerIndex]
    if (!player || player.bankrupt) return
    const board = this.toEngineBoard()
    const players = this.toEnginePlayers()
    const r = canBuild(spaceId, player.id, board, players)
    if (!r.canBuild) return
    const space = this.state.board[spaceId]
    if (!space) return
    player.balance -= space.hcost
    space.buildings++
  }

  private endTurn() {
    const alive = this.state.players.filter((p: PlayerState) => !p.bankrupt)
    if (alive.length <= 1) {
      this.state.winnerId = alive[0]?.id ?? ''
      this.state.phase = 'game_over'
      this.state.pending = 'game_over'
      return
    }
    const doubles = this.state.lastDice.doubles
    const currentBankrupt = !!this.state.players[this.state.currentPlayerIndex]?.bankrupt
    if (doubles && !currentBankrupt) {
      this.state.pending = 'roll'
    } else {
      this.state.currentPlayerIndex = this.nextPlayerIndex()
      this.state.turnCount++
      this.state.pending = 'roll'
    }
    this.state.lastDice.d1 = 0
    this.state.lastDice.d2 = 0
    this.state.lastDice.doubles = false
  }

  private nextPlayerIndex(): number {
    const total = this.state.players.length
    let idx = (this.state.currentPlayerIndex + 1) % total
    let safety = total
    while (this.state.players[idx]?.bankrupt && safety-- > 0) {
      idx = (idx + 1) % total
    }
    return idx
  }

  private checkGameOver() {
    const alive = this.state.players.filter((p: PlayerState) => !p.bankrupt)
    if (alive.length <= 1) {
      this.state.winnerId = alive[0]?.id ?? ''
      this.state.phase = 'game_over'
      this.state.pending = 'game_over'
    }
  }

  // ── Adapters: convert Colyseus schema → plain shapes for game-engine ───────

  private toEngineBoard() {
    return this.state.board.map((s: BoardSpaceState) => {
      const orig = BOARD_DATA[s.id]
      return {
        id: s.id,
        type: s.type as never,
        group: s.group,
        name: s.name,
        price: s.price,
        hcost: s.hcost,
        rents: orig.rents,
        ownerId: s.ownerId || null,
        buildings: s.buildings,
        mortgaged: s.mortgaged,
      }
    })
  }

  private toEnginePlayers() {
    return this.state.players.map((p: PlayerState) => ({
      id: p.id,
      name: p.name,
      tokenId: p.tokenId as never,
      balance: p.balance,
      position: p.position,
      jailed: p.jailed,
      jailTurns: p.jailTurns,
      jailFreeCards: p.jailFreeCards,
      bankrupt: p.bankrupt,
      isAI: p.isAI,
      difficulty: p.difficulty as never,
      properties: Array.from(p.properties).filter((n): n is number => typeof n === 'number'),
    }))
  }
}
