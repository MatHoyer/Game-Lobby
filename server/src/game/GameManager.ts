import { randomUUID } from 'crypto';
import { Game } from './Game';

export class GameManager {
  games: Record<string, Game>;

  constructor() {
    this.games = {};
  }

  createGame(data: { owner: string; id: string }) {
    const gameID = randomUUID();
    this.games[gameID] = new Game(gameID, { id: data.id, name: data.owner, owner: true });
    return gameID;
  }

  deleteGame(id: string) {
    delete this.games[id];
  }

  getPlayerGames(playerID: string) {
    return Object.values(this.games).filter((game) => game.players.some((player) => player.id === playerID));
  }
}
