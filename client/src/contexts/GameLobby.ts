import React, { useContext } from 'react';

export const GameLobbyContext = React.createContext<
  | {
      id: string;
      isOwner: boolean;
      setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
      selectedGame: string;
      setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

export const useGameLobby = () => {
  const c = useContext(GameLobbyContext);
  if (!c) throw new Error('404');
  return c;
};
