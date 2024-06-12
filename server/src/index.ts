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
    const p = pm.getPlayerFromSocket(socket);
    if (!p) return;
    const games = gm.getPlayerGames(p.id);
    games.forEach((game) => {
      if (game.players.find(({ player }) => p.id === player.id)?.owner === true) gm.deleteGame(game.id);
      else game.removePlayer(p);
    });
    pm.deletePlayer(socket);
    console.log('user disconnected');
  });

  socket.on('update-name', (name: string) => {
    console.log('update-name', name);
    const success = pm.updatePlayerName(socket, name);
    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;
    player.socket.emit('updated-name', success ? name : '');
  });

  socket.on('create-game', () => {
    console.log('create-game');
    const owner = pm.getPlayerFromSocket(socket);
    if (!owner) return;
    const gameID = gm.createGame({ owner, io });
    owner.socket.emit('game-created', { gameID });
  });

  socket.on('delete-game', (gameID: string) => {
    console.log('delete-game');
    gm.deleteGame(gameID);
    io.emit('game-deleted', { gameID: gameID });
  });

  socket.on('join-game', (gameID: string) => {
    console.log('join-game');
    const game = gm.getGame(gameID);
    if (!game) return;
    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;
    game.addPlayer(player);
  });
});

server.listen(port);
