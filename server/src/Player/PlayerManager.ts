import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { Player } from './Player';

export class PlayerManager {
  players: Record<string, Player>;

  constructor() {
    this.players = {};
  }

  getPlayerFromSocket(socket: Socket) {
    return Object.values(this.players).find((player) => player.socket === socket);
  }

  getIdFromSocket(socket: Socket) {
    return Object.keys(this.players).find((id) => this.players[id].socket === socket);
  }

  createPlayer(player: { name: string; socket: Socket }) {
    const id = randomUUID();
    this.players[id] = new Player(id, player.name, player.socket);
    return id;
  }

  deletePlayer(socket: Socket) {
    const id = this.getIdFromSocket(socket);
    if (!id) return;
    delete this.players[id];
  }

  updatePlayerName(socket: Socket, name: string) {
    const player = this.getPlayerFromSocket(socket);
    if (!player) return false;
    const players = Object.values(this.players);
    if (players.some((player) => player.name === name)) return false;
    player.name = name;
    return true;
  }
}
