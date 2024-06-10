import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Router } from './Router';
import { NavBar } from './components/Navbar';
import socket from './lib/socket';

export const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();

    type TGameCreated = {
      gameID: string;
    };
    socket.on('game-created', (data: TGameCreated) => {
      navigate(`/gameid/${data.gameID}`);
    });

    return () => {
      socket.off('game-created');
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
