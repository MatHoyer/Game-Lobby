import { useGameLobby } from '@/contexts/GameLobby';
import socket from '@/lib/socket';
import { cn } from '@/lib/utils';
import { useGameStore, useUserStore } from '@/store';
import { Circle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Puissance4 = () => {
  const { id } = useGameLobby();
  const game = useGameStore();
  const user = useUserStore();
  const navigate = useNavigate();
  const [shouldPlay, setShouldPlay] = useState(game.starter === user.name);

  const [board, setBoard] = useState<string[][]>(Array(7).fill(Array(6).fill('')));
  const [winner, setWinner] = useState('');

  useEffect(() => {
    socket.on('game-play', () => {
      setShouldPlay(true);
    });

    socket.on('game-end', (name: string) => {
      setWinner(name);
      setTimeout(() => navigate('/'), 3000);
    });

    socket.on('game-board', (board: string[][]) => {
      setBoard(board);
    });

    return () => {
      socket.off('game-play');
      socket.off('game-end');
      socket.off('game-board');
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex items-center gap-3">
        {board.map((col, i) => {
          return (
            <div
              key={i}
              className="flex flex-col gap-3"
              onClick={() => {
                if (!shouldPlay) return;
                socket.emit('game-played-puissance-4', { id, col: i });
                setShouldPlay(false);
              }}
            >
              {col.map((cell, j) => {
                return (
                  <Circle
                    key={i + j}
                    color={'grey'}
                    fill={cell === '' ? 'grey' : cell === user.name ? 'blue' : 'red'}
                    size={90}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {shouldPlay && <div className="text-center text-2xl">Your turn</div>}
      {winner !== '' && (
        <div className={cn('text-center text-2xl', winner === user.name ? 'text-green-500' : 'text-red-500')}>
          {winner === user.name ? 'You win' : 'You lose'}
        </div>
      )}
    </div>
  );
};
