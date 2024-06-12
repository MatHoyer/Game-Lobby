import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store';
import { Copy, Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const Lobby = () => {
  const params = useParams();
  const game = useGameStore();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(params.id ? params.id : '');
  };

  return (
    <div className="flex flex-col space-y-5 items-center">
      <h1 className="text-center text-4xl">Lobby</h1>
      <Button onClick={copyToClipboard}>
        <p className="mr-3">Copy ID</p>
        <Copy />
      </Button>
      <div className="flex flex-col justify-center items-center">
        {game.players.map((player, i) => (
          <div key={i} className="flex space-x-2">
            <p>{player}</p>
            {i === 0 && <Crown />}
          </div>
        ))}
      </div>
    </div>
  );
};
