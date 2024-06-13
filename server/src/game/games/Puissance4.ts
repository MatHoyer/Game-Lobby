import { TPlayerGame, TPuissance4Data } from '../types';
import { IGame } from './IGame';

export class Puissance4 extends IGame<TPuissance4Data> {
  constructor(players: TPlayerGame[]) {
    super(players);
    this.name = 'puissance 4';
    this.minPlayers = 2;
    this.maxPlayers = 2;
    this.data = {
      map: Array(7).fill(Array(6).fill('')) as string[],
      end: false,
      turn: {
        player: this.players[Math.floor(Math.random() * this.players.length)],
        played: false,
      },
    };
  }

  nextPlayer() {
    const prevPlayer = this.data.turn.player;
    const id = this.players.findIndex(({ player }) => player.id === prevPlayer.player.id);
    if (!id) this.data.end = true;
    const nextPlayer = this.players[id];
    this.data.turn.player = nextPlayer;
    this.data.turn.played = false;
    nextPlayer.player.socket.emit('game', 'play');
  }

  loop() {
    while (!this.data.end) {
      if (this.data.turn.played) this.nextPlayer();
    }
  }
}
