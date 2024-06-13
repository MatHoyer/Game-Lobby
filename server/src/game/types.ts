import { Player } from '../Player/Player';

export type TPlayerGame = {
  player: Player;
  owner: boolean;
};

export type TPuissance4Data = {
  map: string[];
  end: boolean;
  turn: { player: TPlayerGame; played: boolean };
};
