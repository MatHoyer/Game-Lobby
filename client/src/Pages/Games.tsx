import { GameSelect } from '@/components/GameSelect';
import { Button } from '@/components/ui/button';
import { GameLobbyContext, useGameLobby } from '@/contexts/GameLobby';
import socket from '@/lib/socket';
import { useGameStore, useUserStore } from '@/store';
import { Copy, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Puissance4 } from './games/Puissance4';

const Lobby = () => {
  const { id, isOwner, setIsPlaying, selectedGame, setSelectedGame } = useGameLobby();
  const game = useGameStore();

  const wantedGame = game.games.find((g) => g.name === selectedGame);

  useEffect(() => {
    socket.on('update-gameName', (name) => {
      setSelectedGame(name);
    });

    socket.on('game-started', (starter: string) => {
      console.log(starter);
      setIsPlaying(true);
      game.setStarter(starter);
    });

    return () => {
      socket.off('update-gameName');
      socket.off('game-started');
    };
  }, []);

  const cantStart = () => {
    if (!wantedGame) return true;
    if (wantedGame.minPlayers > game.players.length || wantedGame.maxPlayers < game.players.length) return true;
  };

  const handleSelect = (value: string) => {
    setSelectedGame(value);
    socket.emit('game-selected', { id, name: value });
  };

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = id || '';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
      {isOwner && (
        <Button
          disabled={cantStart()}
          onClick={() => {
            socket.emit('start-game', id);
          }}
        >
          Start
        </Button>
      )}
    </div>
  );
};

const Game = () => {
  const { setIsPlaying, selectedGame, setSelectedGame } = useGameLobby();
  console.log(selectedGame);
  switch (selectedGame) {
    case 'puissance 4':
      return <Puissance4 />;
    default:
      setSelectedGame('');
      setIsPlaying(false);
      return <></>;
  }
};

export const Games = () => {
  const params = useParams();
  const game = useGameStore();
  const user = useUserStore();
  const navigate = useNavigate();
  const isOwner = user.name === game.players[0];

  const [selectedGame, setSelectedGame] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    socket.on('deleted-lobby', () => {
      navigate('/');
    });

    return () => {
      socket.off('deleted-lobby');

      if (isOwner) socket.emit('delete-lobby', params.id);
      else socket.emit('leave-lobby', params.id);
    };
  }, []);

  return (
    <GameLobbyContext.Provider value={{ id: params.id || '', isOwner, setIsPlaying, selectedGame, setSelectedGame }}>
      {isPlaying ? <Game /> : <Lobby />}
    </GameLobbyContext.Provider>
  );
};
