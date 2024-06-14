import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Server } from 'socket.io';
import { PlayerManager } from './Player/PlayerManager';
import { LobbyManager } from './game/LobbyManager';
import { isBoardFull } from './game/Puissance4Logics/isGridFull';
import { isWinPuissance4 } from './game/Puissance4Logics/isWinPuissance4';

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

const lm = new LobbyManager();
const pm = new PlayerManager();

io.on('connection', (socket) => {
  console.log('user connected');
  pm.createPlayer({ name: '', socket });

  socket.on('disconnect', () => {
    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;
    const games = lm.getPlayerGames(player.id);
    games.forEach((game) => {
      if (game.players[0] === player) lm.deleteGame(game.id);
      else game.removePlayer(player);
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

  socket.on('create-lobby', () => {
    console.log('create-lobby');
    const owner = pm.getPlayerFromSocket(socket);
    if (!owner) return;
    const gameID = lm.createGame({ owner, io });
    owner.socket.emit('lobby-created', gameID);
  });

  socket.on('delete-lobby', (gameID: string) => {
    console.log('delete-lobby');
    lm.deleteGame(gameID);
  });

  socket.on('join-lobby', (gameID: string) => {
    console.log('join-lobby');
    const game = lm.getGame(gameID);
    if (!game) return;
    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;
    game.addPlayer(player);
  });

  socket.on('leave-lobby', (gameID: string) => {
    console.log('leave-lobby');
    const game = lm.getGame(gameID);
    if (!game) return;
    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;
    game.removePlayer(player);
  });

  socket.on('game-selected', (data: { id: string; name: string }) => {
    console.log('game-selected');
    const game = lm.getGame(data.id);
    if (!game) return;
    game.updateGameType(data.name);
  });

  socket.on('start-game', (id: string) => {
    console.log('start-game');
    const game = lm.getGame(id);
    if (!game) return;
    game.broadcast('game-started', game.players[0].name);
  });

  // Puissance 4
  socket.on('game-played', (data: { id: string; col: number }) => {
    console.log('game-played');
    const { id, col } = data;
    const game = lm.getGame(id);
    if (!game) return;

    const player = pm.getPlayerFromSocket(socket);
    if (!player) return;

    const index = game.game.board[col].findIndex((cell) => cell !== '');
    if (index === -1) {
      game.game.board[col][5] = player.name;
    } else {
      if (!game.game.board[col].some((cell) => cell === '')) {
        player.socket.emit('game-play');
        return;
      }
      game.game.board[col][index - 1] = player.name;
    }
    game.broadcast('game-board', game.game.board);

    if (isWinPuissance4(game.game.board, player.name)) {
      game.broadcast('game-end', player.name);
      return;
    }
    if (isBoardFull(game.game.board)) {
      game.broadcast('game-end', '');
      return;
    }

    const players = game.players.filter((p) => p !== player);
    players[0].socket.emit('game-play');
  });
});

server.listen(port);
