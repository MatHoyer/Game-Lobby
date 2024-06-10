export class TNewGame {
  gameName: string;
  data: any;
  loop: () => void;

  constructor(gameName: string) {
    this.gameName = gameName;
    this.data = {};
    this.loop = async () => {};
  }
}
