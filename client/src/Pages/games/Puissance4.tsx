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
  const [timer, setTimer] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(30);
  const duration = 30;
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined);
  const [firstPlayed, setFirstPlayed] = useState(game.starter !== user.name);

  const [lastBoard, setLastBoard] = useState<string[][]>(Array(7).fill(Array(6).fill('')));
  const [board, setBoard] = useState<string[][]>(Array(7).fill(Array(6).fill('')));
  const [winner, setWinner] = useState('');

  const play = (col: number) => {
    if (!board[col].some((cell: string) => cell === '')) return;
    clearTimeout(timerId);
    setShouldPlay(false);
    socket.emit('game-played-puissance-4', { id, col: col });
  };

  const createTimer = () => {
    clearTimeout(timerId);
    const id = setTimeout(() => {
      const rows = board
        .map((row, index) => {
          if (row[0] === '') return index;
        })
        .filter((row) => row !== undefined);
      const random = Math.round(Math.random() * rows.length);
      const wantedRow = rows[random];
      console.log(wantedRow);
      if (wantedRow === undefined) play(-1);
      play(wantedRow as number);
    }, duration * 1000);
    setTimerId(id);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!shouldPlay) {
        if (timeRemaining <= 0) setTimeRemaining(duration);
        return;
      }
      setTimeRemaining(Math.round(duration - (Date.now() - timer) / 1000));
    }, 1000);
  }, [timer, timeRemaining]);

  useEffect(() => {
    if (!firstPlayed && shouldPlay) {
      setFirstPlayed(true);
      setTimer(Date.now());
      createTimer();
    }

    socket.on('game-play', () => {
      setShouldPlay(true);
      setTimeRemaining(duration);
      setTimer(Date.now());
      createTimer();
    });

    socket.on('game-end', (name: string) => {
      setWinner(name);
      setTimeout(() => navigate('/'), 3000);
    });

    socket.on('game-board', (receivedBoard: string[][]) => {
      setLastBoard(board);
      setBoard(receivedBoard);
    });

    return () => {
      socket.off('game-play');
      socket.off('game-end');
      socket.off('game-board');
    };
  }, [board]);

  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex items-center gap-3">
        {board.map((col, i) => {
          return (
            <div
              key={i}
              className="flex flex-col gap-3"
              onClick={() => {
                if (shouldPlay) play(i);
              }}
            >
              {col.map((cell, j) => {
                if (cell !== lastBoard[i][j]) cell += ' last';
                else cell = cell.split(' ')[0];
                const [name, status] = cell.split(' ');
                return (
                  <Circle
                    key={i + j}
                    color={status === 'last' ? 'yellow' : 'grey'}
                    fill={name === '' ? 'grey' : name === user.name ? 'blue' : 'red'}
                    className="size-11 sm:size-14 md:size-20 lg:size-24"
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {shouldPlay && (
        <div className="text-center text-2xl">
          <p>Your turn</p>
          <p>{timeRemaining}sec</p>
        </div>
      )}
      {winner !== '' && (
        <div className={cn('text-center text-2xl', winner === user.name ? 'text-green-500' : 'text-red-500')}>
          {winner === user.name ? 'You win' : 'You lose'}
        </div>
      )}
    </div>
  );
};
