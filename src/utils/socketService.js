import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

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
  createRoom: (playerName) => {
    return new Promise((resolve, reject) => {
      socket.emit('create-room', { playerName }, (response) => {
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || 'Failed to create room'));
        }
      });
    });
  },
  
  joinRoom: (roomId, playerName) => {
    return new Promise((resolve, reject) => {
      socket.emit('join-room', { roomId, playerName }, (response) => {
        if (response && response.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || 'Failed to join room'));
        }
      });
    });
  },
  
  getRoomInfo: (roomId) => {
    return new Promise((resolve, reject) => {
      socket.emit('get-room-info', { roomId }, (response) => {
        if (response && response.success) {
          resolve(response.roomInfo);
        } else {
          reject(new Error(response?.error || 'Failed to get room info'));
        }
      });
    });
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