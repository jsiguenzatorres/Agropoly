import { Room, Client } from 'colyseus'
import { GameStateSchema, PlayerState } from '../schema/GameState'

export class GameRoom extends Room<GameStateSchema> {
  maxClients = 6

  onCreate(options: { aiCount?: number; educationalMode?: boolean }) {
    this.setState(new GameStateSchema())

    this.onMessage('roll_dice', (client, _msg) => {
      if (!this.isCurrentPlayer(client)) return
      // TODO: validate phase, roll dice, process result
      // See: AGROPOLY-REACT-Dev-Guide.md — PROMPT F5.1
    })

    this.onMessage('buy_property', (client, { spaceId }: { spaceId: number }) => {
      if (!this.isCurrentPlayer(client)) return
      // TODO: validate ownership + balance, update schema
    })

    this.onMessage('pass_property', (client, _msg) => {
      if (!this.isCurrentPlayer(client)) return
      // TODO: trigger auction
    })

    this.onMessage('build', (client, { spaceId }: { spaceId: number }) => {
      if (!this.isCurrentPlayer(client)) return
      // TODO: validate balanced build rule
    })

    this.onMessage('mortgage', (client, { spaceId, unmortgage }: { spaceId: number; unmortgage: boolean }) => {
      if (!this.isCurrentPlayer(client)) return
    })

    console.log(`[GameRoom] Created — AI players: ${options.aiCount ?? 0}`)
  }

  onJoin(client: Client, options: { name: string; tokenId: string }) {
    const player = new PlayerState()
    player.id = client.sessionId
    player.name = options.name ?? 'Jugador'
    player.tokenId = options.tokenId ?? 'maiz'
    this.state.players.push(player)
    console.log(`[GameRoom] ${player.name} joined`)
  }

  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.find(p => p.id === client.sessionId)
    if (player) player.bankrupt = true
    console.log(`[GameRoom] ${client.sessionId} left (consented: ${consented})`)
  }

  onDispose() {
    // TODO: save session to Supabase
    console.log('[GameRoom] Disposing')
  }

  private isCurrentPlayer(client: Client): boolean {
    const current = this.state.players[this.state.currentPlayerIndex]
    return current?.id === client.sessionId
  }
}
