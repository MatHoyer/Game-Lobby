import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import socket from '@/lib/socket';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [gameID, setGameID] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center space-y-5">
      <h1 className="text-4xl">Mat Games</h1>
      <Button onClick={() => socket.emit('create-lobby')}>Create Game</Button>
      <Input type="text" onChange={(e) => setGameID(e.target.value)} placeholder="Game ID"></Input>
      <Button
        disabled={!gameID}
        onClick={() => {
          socket.emit('join-lobby', gameID);
          navigate('/gameid/' + gameID);
        }}
      >
        Join Game
      </Button>
    </div>
  );
};
