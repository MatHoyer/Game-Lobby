import { Server } from 'socket.io';
import { Player } from '../Player/Player';
import { IGame, games } from './games/IGame';

type TState = 'waiting' | 'playing' | 'finished';

type TPlayerGame = {
  player: Player;
  owner: boolean;
};

export class Game {
  id: string;
  players: TPlayerGame[];
  state: TState;
  io: Server;
  game: IGame | null;

  constructor(gameID: string, player: Player, io: Server) {
    this.id = gameID;
    this.players = [{ player, owner: true }];
    this.state = 'waiting';
    this.io = io;
    this.game = null;
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

  addPlayer(player: Player) {
    this.players.push({ player, owner: false });
    player.socket.join(this.id);
    this.broadcast(
      'player-list',
      this.players.map(({ player }) => player.name)
    );
  }

  removePlayer(player: Player) {
    player.socket.leave(this.id);
    this.players = this.players.filter((p) => p.player.id !== player.id);
    this.broadcast(
      'player-list',
      this.players.map(({ player }) => player.name)
    );
  }

  updateGameType(name: string) {
    this.game = games.find((game) => game.name === name) || null;
    this.broadcast('update-gameName', name);
  }

  broadcast(event: string, message: any) {
    this.io.to(this.id).emit(event, message);
  }
}
