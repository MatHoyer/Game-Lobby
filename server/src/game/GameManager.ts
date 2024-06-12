import { randomUUID } from 'crypto';
import { Server } from 'socket.io';
import { Player } from '../Player/Player';
import { Game } from './Game';

export class GameManager {
  #games: Record<string, Game>;

  constructor() {
    this.#games = {};
  }

  createGame(data: { owner: Player; io: Server }) {
    const gameID = randomUUID();
    this.#games[gameID] = new Game(gameID, data.owner, data.io);
    return gameID;
  }

  deleteGame(id: string) {
    this.#games[id].broadcast('deleted-game', '');
    delete this.#games[id];
  }

  getGame(id: string) {
    return this.#games[id];
  }

  getPlayerGames(playerID: string) {
    return Object.values(this.#games).filter((game) => game.players.some((player) => player.player.id === playerID));
  }
}
