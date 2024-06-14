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
  starter: string;
};
type GameStore = {
  name: string;
  players: string[];
  games: TGame[];
  starter: string;
  setName: (name: string) => void;
  setPlayers: (players: string[]) => void;
  setGames: (games: TGame[]) => void;
  setStarter: (starter: string) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  name: '',
  players: [],
  games: [],
  starter: '',
  setName: (name) => set({ name }),
  setPlayers: (players) => set({ players }),
  setGames: (games) => set({ games }),
  setStarter: (starter) => set({ starter }),
}));
