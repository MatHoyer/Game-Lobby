import { TPlayerGame } from '../types';

export abstract class IGame {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  players: TPlayerGame[];
  data: any;

  constructor(players: TPlayerGame[]) {
    this.name = '';
    this.minPlayers = 0;
    this.maxPlayers = 0;
    this.players = players;
    this.data = {};
  }

  abstract loop(): void;
}
