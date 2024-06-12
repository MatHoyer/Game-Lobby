import { create } from 'zustand';

type UserStore = {
  name: string;
  setName: (name: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}));

type GameStore = {
  name: string;
  players: string[];
  setName: (name: string) => void;
  setPlayers: (players: string[]) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  name: '',
  players: [],
  setName: (name) => set({ name }),
  setPlayers: (players) => set({ players }),
}));
