import { Client, Room } from 'colyseus.js'

const SERVER_URL = import.meta.env.VITE_COLYSEUS_URL ?? 'ws://localhost:2567'

let _client: Client | null = null
export function colyseusClient(): Client {
  if (!_client) _client = new Client(SERVER_URL)
  return _client
}

export interface RoomJoinOptions {
  name: string
  tokenId: string
  educationalMode?: boolean
  spectator?: boolean
}

export async function createRoom(opts: RoomJoinOptions): Promise<Room> {
  return await colyseusClient().create('game_room', opts)
}

export async function joinRoomById(roomId: string, opts: RoomJoinOptions): Promise<Room> {
  return await colyseusClient().joinById(roomId, opts)
}
