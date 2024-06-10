import { Socket } from 'socket.io';

export class Player {
  id: string;
  name: string;
  socket: Socket;

  constructor(id: string, name: string, socket: Socket) {
    this.id = id;
    this.name = name;
    this.socket = socket;
  }
}
