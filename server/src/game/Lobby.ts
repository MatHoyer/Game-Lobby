import { Server } from 'socket.io';
import { Player } from '../Player/Player';

const games = [
  {
    name: 'puissance 4',
    minPlayers: 2,
    maxPlayers: 2,
    board: Array(7)
      .fill(0)
      .map(() => Array(6).fill('')) as string[][],
  },
];

type TState = 'waiting' | 'playing' | 'finished';

export class Lobby {
  id: string;
  players: Player[];
  state: TState;
  io: Server;
  game: (typeof games)[0];

  constructor(gameID: string, player: Player, io: Server) {
    this.id = gameID;
    this.players = [player];
    this.state = 'waiting';
    this.game = {
      name: '',
      minPlayers: 2,
      maxPlayers: 2,
      board: Array(7)
        .fill(0)
        .map(() => Array(6).fill('')) as string[][],
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
  }

  broadcast(event: string, message: any) {
    this.io.to(this.id).emit(event, message);
  }
}
