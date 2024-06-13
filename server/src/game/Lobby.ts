import { Server } from 'socket.io';
import { Player } from '../Player/Player';
import { createGame, games } from './games';
import { IGame } from './games/IGame';
import { TPlayerGame } from './types';

type TState = 'waiting' | 'playing' | 'finished';

export class Lobby {
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
    this.broadcast('update-gameName', this.game?.name);
  }

  removePlayer(player: Player) {
    this.players = this.players.filter((p) => p.player.id !== player.id);
    this.broadcast(
      'player-list',
      this.players.map(({ player }) => player.name)
    );
    player.socket.leave(this.id);
  }

  updateGameType(name: string) {
    this.game = createGame(name, this.players);
    this.broadcast('update-gameName', name);
  }

  broadcast(event: string, message: any) {
    this.io.to(this.id).emit(event, message);
  }
}
