import { io, type Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket | null = null;

/**
 * Lazily creates and connects the shared socket. Safe to call repeatedly —
 * reuses the existing instance if already connected.
 */
export function connectSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true, // sends the httpOnly access-token cookie so the backend can identify the user
      autoConnect: false,
    });
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
}

export function getSocket(): Socket | null {
  return socket;
}
