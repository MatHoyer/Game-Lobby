import { TNewGame } from './games/TNewGame';

type TState = 'waiting' | 'playing' | 'finished';

type TPlayer = {
  id: string;
  name: string;
  owner: boolean;
};

export class Game {
  id: string;
  players: TPlayer[];
  state: TState;
  game: TNewGame | null;

  constructor(gameID: string, player: TPlayer) {
    this.id = gameID;
    this.players = [player];
    this.state = 'waiting';
    this.game = null;
  }

  addPlayer(player: TPlayer) {
    this.players.push(player);
  }

  removePlayer(player: TPlayer) {
    this.players = this.players.filter((p) => p.name !== player.name);
  }

  startGame() {
    this.state = 'playing';
  }

  finishGame() {
    this.state = 'finished';
  }
}
