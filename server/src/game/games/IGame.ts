import { TPlayerGame } from '../types';

export abstract class IGame<T> {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  players: TPlayerGame[];
  data: T;

  constructor(players: TPlayerGame[]) {
    this.name = '';
    this.minPlayers = 0;
    this.maxPlayers = 0;
    this.players = players;
    this.data = {} as T;
  }

  abstract loop(): void;
}
