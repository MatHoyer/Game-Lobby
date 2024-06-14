import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Router } from './Router';
import { NavBar } from './components/Navbar';
import socket from './lib/socket';
import { TGame, useGameStore, useUserStore } from './store';

export const App = () => {
  const navigate = useNavigate();
  const user = useUserStore();
  const game = useGameStore();

  useEffect(() => {
    socket.connect();

    socket.on('updated-name', (name: string) => {
      if (name === '') console.log('name already used');
      user.setName(name);
    });

    socket.on('lobby-created', (gameID: string) => {
      navigate(`/gameid/${gameID}`);
    });

    socket.on('games', (games: TGame[]) => {
      game.setGames(games);
    });

    socket.on('player-list', (players: string[]) => {
      console.log(players);
      game.setPlayers(players);
    });

    return () => {
      socket.off('updated-name');
      socket.off('lobby-created');
      socket.off('games');
      socket.off('player-list');
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex justify-center">
        <Router />
      </div>
    </>
  );
};
