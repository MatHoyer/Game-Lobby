import { GameSelect } from '@/components/GameSelect';
import { Button } from '@/components/ui/button';
import socket from '@/lib/socket';
import { useGameStore, useUserStore } from '@/store';
import { Copy, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Lobby = () => {
  const params = useParams();
  const game = useGameStore();
  const user = useUserStore();
  const [selectedGame, setSelectedGame] = useState<string>('');

  const wantedGame = game.games.find((g) => g.name === selectedGame);

  useEffect(() => {
    socket.on('update-gameName', (name) => {
      setSelectedGame(name);
    });
    return () => {
      socket.off('update-gameName');
      if (isOwner) socket.emit('delete-game', params.id);
      else socket.emit('leave-game', params.id);
    };
  }, []);

  const cantStart = () => {
    if (!wantedGame) return true;
    if (wantedGame.minPlayers > game.players.length || wantedGame.maxPlayers < game.players.length) return true;
  };

  const isOwner = user.name === game.players[0];

  const handleSelect = (value: string) => {
    setSelectedGame(value);
    socket.emit('game-selected', { id: params.id, name: value });
  };

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
      {isOwner ? (
        <GameSelect values={game.games.map((g) => g.name)} handleSelect={handleSelect} />
      ) : (
        <div>{selectedGame ? selectedGame : 'No game selected yet'}</div>
      )}
      <div className="flex flex-col justify-center items-center">
        {game.players.map((player, i) => (
          <div key={i} className="flex space-x-2">
            <p>{player}</p>
            {i === 0 && <Crown />}
          </div>
        ))}
      </div>
      {isOwner && <Button disabled={cantStart()}>Start</Button>}
    </div>
  );
};
