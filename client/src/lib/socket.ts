import { io } from 'socket.io-client';

// export const socket = io('http://localhost:3000', { autoConnect: true });
export const socket = io('http://games-back.mathieuhoyer.fr:3000', { autoConnect: true });

export default socket;
