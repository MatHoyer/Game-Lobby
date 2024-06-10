import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import socket from '@/lib/socket';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Puissance4 = () => {
  const [gameID, setGameID] = useState<string | null>(null);
  const gameName = 'puissance-4';

  return (
    <div className="flex flex-col justify-center items-center space-y-5">
      <h1 className="text-4xl">Puissance 4</h1>
      <Button onClick={() => socket.emit('create-game', { gameName })}>Create Game</Button>
      <Input type="text" onChange={(e) => setGameID(e.target.value)} placeholder="Game ID"></Input>
      <Button disabled={!gameID}>
        <Link to={gameID || '/puissance-4'}>Join Game</Link>
      </Button>
    </div>
  );
};
