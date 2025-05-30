const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tictactixx.netlify.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "https://tictactixx.netlify.app"],
  credentials: true
}));
app.use(express.json());

// In-memory storage for rooms (use a database in production)
const rooms = new Map();

// Game logic utilities
const checkWinner = (playerMoves) => {
  if (playerMoves.length !== 3) return null;

  const positions = playerMoves.map(move => move.position);
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (positions.includes(a) && positions.includes(b) && positions.includes(c)) {
      return line;
    }
  }
  return null;
};

const initializeGameState = () => ({
  board: Array(9).fill(null),
  isXNext: true,
  winningLine: null,
  moveHistory: { X: [], O: [] },
  gameState: 'playing'
});

function emitGameState(room) {
  if (!room.host || !room.guest) return;

  const hostGameState = {
    ...room.gameState,
    playerSymbol: room.host.symbol,
    isYourTurn: room.gameState.isXNext === (room.host.symbol === 'X'),
    gameState: 'playing',
    opponentName: room.guest.name
  };

  const guestGameState = {
    ...room.gameState,
    playerSymbol: room.guest.symbol,
    isYourTurn: room.gameState.isXNext === (room.guest.symbol === 'X'),
    gameState: 'playing',
    opponentName: room.host.name
  };

  console.log(`Sending to host (${room.host.name}):`, {
    opponentName: hostGameState.opponentName,
    playerSymbol: hostGameState.playerSymbol
  });
  
  console.log(`Sending to guest (${room.guest.name}):`, {
    opponentName: guestGameState.opponentName,
    playerSymbol: guestGameState.playerSymbol
  });

  // Send personalized game state to host using io.to() not socket.to()
  io.to(room.host.id).emit('game-state-update', hostGameState);

  // Send personalized game state to guest using io.to() not socket.to()
  io.to(room.guest.id).emit('game-state-update', guestGameState);

  console.log(`Game state emitted to room ${room.id}:`, {
    hostId: room.host.id,
    guestId: room.guest.id,
    hostTurn: hostGameState.isYourTurn,
    guestTurn: guestGameState.isYourTurn,
    currentPlayer: room.gameState.isXNext ? 'X' : 'O'
  });
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create-room', ({ playerName }, callback) => {
    try {
      const roomId = uuidv4().substring(0, 8).toUpperCase();
      const room = {
        id: roomId,
        host: {
          id: socket.id,
          name: playerName,
          symbol: 'X'
        },
        guest: null,
        gameState: initializeGameState(),
        createdAt: new Date()
      };

      rooms.set(roomId, room);
      socket.join(roomId);

      console.log(`Room ${roomId} created by ${playerName}`);
      
      callback({
        success: true,
        roomId,
        message: 'Room created successfully'
      });
    } catch (error) {
      console.error('Error creating room:', error);
      callback({
        success: false,
        error: 'Failed to create room'
      });
    }
  });

  socket.on('get-room-info', ({ roomId }, callback) => {
    try {
      const room = rooms.get(roomId);
      
      if (!room) {
        callback({
          success: false,
          error: 'Room not found'
        });
        return;
      }

      callback({
        success: true,
        roomInfo: {
          roomId: room.id,
          hostName: room.host.name,
          hasGuest: !!room.guest,
          createdAt: room.createdAt
        }
      });
    } catch (error) {
      console.error('Error getting room info:', error);
      callback({
        success: false,
        error: 'Failed to get room info'
      });
    }
  });

  socket.on('join-room', ({ roomId, playerName }, callback) => {
    try {
      const room = rooms.get(roomId);
      
      if (!room) {
        callback({
          success: false,
          error: 'Room not found'
        });
        return;
      }

      if (room.guest) {
        callback({
          success: false,
          error: 'Room is full'
        });
        return;
      }

      // Add guest to room
      room.guest = {
        id: socket.id,
        name: playerName,
        symbol: 'O'
      };

      socket.join(roomId);

      console.log(`${playerName} joined room ${roomId}`);

      // Notify the entire room that player joined
      io.to(roomId).emit('player-joined', {
        playerName,
        message: `${playerName} joined the game`
      });

      // Immediately emit game state to both players
      emitGameState(room);

      // Start the game notification to the entire room
      setTimeout(() => {
        io.to(roomId).emit('game-start', {
          players: {
            host: room.host,
            guest: room.guest
          },
          gameState: room.gameState
        });
        
        // Emit game state again after game start
        setTimeout(() => {
          emitGameState(room);
        }, 100);
      }, 500);

      callback({
        success: true,
        hostName: room.host.name,
        gameData: {
          players: {
            host: room.host,
            guest: room.guest
          }
        }
      });
    } catch (error) {
      console.error('Error joining room:', error);
      callback({
        success: false,
        error: 'Failed to join room'
      });
    }
  });

  socket.on('make-move', ({ roomId, position }) => {
    try {
      const room = rooms.get(roomId);
      if (!room || !room.guest) return;

      const { gameState } = room;
      if (gameState.board[position] || gameState.winningLine) return;

      // Determine which player is making the move
      const isHost = socket.id === room.host.id;
      const isGuest = socket.id === room.guest.id;
      
      if (!isHost && !isGuest) return;

      const currentPlayer = gameState.isXNext ? 'X' : 'O';
      const playerSymbol = isHost ? room.host.symbol : room.guest.symbol;
      
      // Check if it's the player's turn
      if (currentPlayer !== playerSymbol) return;

      const newMove = {
        position,
        timestamp: Date.now()
      };

      let newPlayerMoves = [...gameState.moveHistory[currentPlayer]];
      let oldestMove = null;

      // Check if this move creates a win
      const potentialMoves = [...newPlayerMoves, newMove].slice(-3);
      const potentialWin = checkWinner(potentialMoves);

      if (potentialWin) {
        // Winning move
        const newBoard = [...gameState.board];
        newBoard[position] = currentPlayer;
        
        gameState.board = newBoard;
        gameState.moveHistory[currentPlayer] = [...newPlayerMoves, newMove];
        gameState.winningLine = potentialWin;
        gameState.gameState = 'finished';
      } else {
        // Normal move
        if (newPlayerMoves.length === 3) {
          oldestMove = newPlayerMoves[0];
          newPlayerMoves = newPlayerMoves.slice(1);
        }

        newPlayerMoves.push(newMove);

        const newBoard = [...gameState.board];
        if (oldestMove) {
          newBoard[oldestMove.position] = null;
        }
        newBoard[position] = currentPlayer;

        gameState.board = newBoard;
        gameState.moveHistory[currentPlayer] = newPlayerMoves;
        gameState.isXNext = !gameState.isXNext;
      }

      // Emit updated game state to both players
      emitGameState(room);

      console.log(`Move made in room ${roomId} by ${isHost ? room.host.name : room.guest.name}`);
    } catch (error) {
      console.error('Error making move:', error);
    }
  });

  socket.on('restart-game', ({ roomId }) => {
    try {
      const room = rooms.get(roomId);
      if (!room) return;

      // Reset game state
      room.gameState = initializeGameState();

      // Emit restart to both players
      io.to(roomId).emit('game-restart', {
        message: 'Game restarted'
      });

      // Send new game state
      emitGameState(room);

      console.log(`Game restarted in room ${roomId}`);
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and clean up rooms where this user was a participant
    for (const [roomId, room] of rooms.entries()) {
      if (room.host.id === socket.id || (room.guest && room.guest.id === socket.id)) {
        // Get the disconnecting player's name
        const disconnectingPlayer = room.host.id === socket.id ? room.host : room.guest;
        
        // Notify other player
        socket.to(roomId).emit('player-disconnected', {
          message: 'Your opponent disconnected',
          playerName: disconnectingPlayer.name
        });
        
        // Clean up room if both players are gone
        if (!room.guest || room.guest.id === socket.id) {
          rooms.delete(roomId);
          console.log(`Room ${roomId} deleted`);
        } else {
          // Reset guest if guest disconnected
          room.guest = null;
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Clean up old rooms periodically (older than 1 hour)
setInterval(() => {
  const now = new Date();
  for (const [roomId, room] of rooms.entries()) {
    const roomAge = now - room.createdAt;
    if (roomAge > 60 * 60 * 1000) { // 1 hour
      rooms.delete(roomId);
      console.log(`Cleaned up old room: ${roomId}`);
    }
  }
}, 10 * 60 * 1000); // Check every 10 minutes 