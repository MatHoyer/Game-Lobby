import { TPlayerGame } from '../types';
import { IGame } from './IGame';
import { Puissance4 } from './Puissance4';

export const games: IGame[] = [new Puissance4([])];
export const createGame = (name: string, players: TPlayerGame[]) => {
  switch (name) {
    case 'puissance 4':
      return new Puissance4(players);
    default:
      return null;
  }
};
