import { serve } from '@hono/node-server';
import { randomUUID } from 'crypto';
import { Hono } from 'hono';
import { Server } from 'socket.io';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = 3000;
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

type TState = 'waiting' | 'playing' | 'finished';

type TGame = {
  gameID: string;
  gameName: string;
  players: string[];
  state: TState;
  data: any;
};
const games: Record<string, TGame> = {};
const starterData: Record<string, any> = {
  'puissance-4': {
    grid: Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => null)),
    currentPlayer: '',
  },
  '...': {},
};

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('test', (data) => {
    console.log(data);
  });

  socket.on('create-game', (data: { playerName: string; gameName: string }) => {
    console.log('create-game');
    const gameID = randomUUID();
    const game: TGame = {
      gameID,
      gameName: data.gameName,
      players: [data.playerName],
      state: 'waiting',
      data: starterData[data.gameName],
    };
    games[gameID] = game;
    io.emit('game-created', { gameID });
  });

  socket.on('delete-game', (data: { gameID: string }) => {
    console.log('delete-game');
    delete games[data.gameID];
    io.emit('game-deleted', { gameID: data.gameID });
  });
});

server.listen(port);
