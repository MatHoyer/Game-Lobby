import { create } from 'zustand';

type UserStore = {
  name: string;
  setName: (name: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}));

export type TGame = {
  name: string;
  minPlayers: number;
  maxPlayers: number;
};
type GameStore = {
  name: string;
  players: string[];
  games: TGame[];
  setName: (name: string) => void;
  setPlayers: (players: string[]) => void;
  setGames: (games: TGame[]) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  name: '',
  players: [],
  games: [],
  setName: (name) => set({ name }),
  setPlayers: (players) => set({ players }),
  setGames: (games) => set({ games }),
}));
