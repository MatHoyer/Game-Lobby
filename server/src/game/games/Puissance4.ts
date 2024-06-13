import { TPlayerGame } from '../types';
import { IGame } from './IGame';

export class Puissance4 extends IGame {
  constructor(players: TPlayerGame[]) {
    super(players);
    this.name = 'puissance 4';
    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.data = {
      map: Array(7).fill(Array(6).fill(null)),
      playerTurn: this.players[Math.floor(Math.random() * this.players.length)],
    };
  }

  loop() {}
}
