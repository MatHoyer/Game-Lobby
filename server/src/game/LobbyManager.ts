import { randomUUID } from 'crypto';
import { Server } from 'socket.io';
import { Player } from '../Player/Player';
import { Lobby } from './Lobby';

export class LobbyManager {
  #games: Record<string, Lobby>;

  constructor() {
    this.#games = {};
  }

  createGame(data: { owner: Player; io: Server }) {
    const gameID = randomUUID();
    this.#games[gameID] = new Lobby(gameID, data.owner, data.io);
    return gameID;
  }

  deleteGame(id: string) {
    if (!this.#games[id]) return;
    this.#games[id].broadcast('deleted-lobby', '');
    delete this.#games[id];
  }

  getGame(id: string) {
    return this.#games[id];
  }

  getPlayerGames(playerID: string) {
    return Object.values(this.#games).filter((game) => game.players.some((player) => player.id === playerID));
  }
}
