import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Server } from 'socket.io';
import { PlayerManager } from './Player/PlayerManager';
import { GameManager } from './game/GameManager';

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

const gm = new GameManager();
const pm = new PlayerManager();

io.on('connection', (socket) => {
  console.log('user connected');
  pm.createPlayer({ name: '', socket });

  socket.on('disconnect', () => {
    pm.deletePlayer(socket);
    const id = pm.getIdFromSocket(socket);
    if (!id) return;
    const games = gm.getPlayerGames(id);
    games.forEach((game) => {
      gm.deleteGame(game.id);
    });
    console.log('user disconnected');
  });

  socket.on('update-name', (data: { name: string }) => {
    console.log('update-name', data.name);
    pm.updatePlayerName(socket, data.name);
  });

  socket.on('create-game', (data: { name: string }) => {
    console.log('create-game');
    const id = pm.getIdFromSocket(socket);
    if (!id) return;
    const gameID = gm.createGame({ id, owner: data.name });
    io.emit('game-created', { gameID });
  });

  socket.on('delete-game', (data: { gameID: string }) => {
    console.log('delete-game');
    gm.deleteGame(data.gameID);
    io.emit('game-deleted', { gameID: data.gameID });
  });
});

server.listen(port);
