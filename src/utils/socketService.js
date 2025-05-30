import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

const socketService = {
  // Connection methods
  connect: () => socket.connect(),
  disconnect: () => socket.disconnect(),
  
  // Room methods
  createRoom: (playerName, callback) => {
    socket.emit('create-room', { playerName }, callback);
  },
  
  joinRoom: (roomId, playerName, callback) => {
    socket.emit('join-room', { roomId, playerName }, callback);
  },
  
  getRoomInfo: (roomId, callback) => {
    socket.emit('get-room-info', { roomId }, callback);
  },
  
  // Game methods
  makeMove: (roomId, position) => {
    socket.emit('make-move', { roomId, position });
  },
  
  restartGame: (roomId) => {
    socket.emit('restart-game', { roomId });
  },
  
  // Event listeners
  onGameStateUpdate: (callback) => {
    socket.on('game-state-update', callback);
  },
  
  onMoveMade: (callback) => {
    socket.on('move-made', callback);
  },
  
  onGameRestart: (callback) => {
    socket.on('game-restart', callback);
  },
  
  onPlayerDisconnected: (callback) => {
    socket.on('player-disconnected', callback);
  },
  
  onGameStart: (callback) => {
    socket.on('game-start', callback);
  },
  
  onPlayerJoined: (callback) => {
    socket.on('player-joined', callback);
  },
  
  // Cleanup
  removeAllListeners: () => {
    socket.removeAllListeners();
  }
};

export default socketService; 