import { io } from 'socket.io-client';

export const socket = io(import.meta.env.MODE === "development" ? "http://localhost:5000" : "/", {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
});
