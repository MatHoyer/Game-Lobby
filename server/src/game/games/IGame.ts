import { Puissance4 } from './Puissance4';

export interface IGame {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  data: any;
  loop: () => void;
}

export const games = [Puissance4];
