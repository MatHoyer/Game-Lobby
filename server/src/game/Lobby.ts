import { Server } from 'socket.io';
import { Player } from '../Player/Player';

type TGame = {
  name: string;
  minPlayers: number;
  maxPlayers: number;
  data: any;
};

const getEmptyPuissance4Board = () => {
  return Array(7)
    .fill(0)
    .map(() => Array(6).fill('')) as string[][];
};

const games: TGame[] = [
  {
    name: 'puissance 4',
    minPlayers: 2,
    maxPlayers: 2,
    data: {
      board: getEmptyPuissance4Board(),
    },
  },
];

type TState = 'waiting' | 'playing' | 'finished';

export class Lobby {
  id: string;
  players: Player[];
  state: TState;
  io: Server;
  game: TGame;

  constructor(gameID: string, player: Player, io: Server) {
    this.id = gameID;
    this.players = [player];
    this.state = 'waiting';
    this.game = {
      name: '',
      minPlayers: 2,
      maxPlayers: 2,
      data: {},
    };
    this.io = io;
    player.socket.join(this.id);
    this.broadcast('player-list', [player.name]);
    this.broadcast(
      'games',
      games.map((game) => ({
        name: game.name,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers,
      }))
    );
  }

  isOwner(player: Player) {
    return player === this.players[0];
  }

  addPlayer(player: Player) {
    this.players.push(player);
    player.socket.join(this.id);
    this.broadcast(
      'player-list',
      this.players.map((player) => player.name)
    );
    this.broadcast('update-gameName', this.game?.name);
  }

  removePlayer(player: Player) {
    this.players = this.players.filter((p) => p.id !== player.id);
    this.broadcast(
      'player-list',
      this.players.map((player) => player.name)
    );
    player.socket.leave(this.id);
  }

  updateGameType(name: string) {
    this.broadcast('update-gameName', name);
    const game = games.find((game) => game.name === name);
    if (!game) return;
    game.data.board = getEmptyPuissance4Board();
    this.game = game;
  }

  broadcast(event: string, message: any) {
    this.io.to(this.id).emit(event, message);
  }
}
