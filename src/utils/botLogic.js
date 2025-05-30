// Helper function to evaluate the board state
function evaluate(board) {
  // Check rows for winner
  for (let row = 0; row < 3; row++) {
    if (board[row * 3] && board[row * 3] === board[row * 3 + 1] && board[row * 3 + 1] === board[row * 3 + 2]) {
      if (board[row * 3] === 'O') return 10; // Bot wins
      if (board[row * 3] === 'X') return -10; // Human wins
    }
  }

  // Check columns for winner
  for (let col = 0; col < 3; col++) {
    if (board[col] && board[col] === board[col + 3] && board[col + 3] === board[col + 6]) {
      if (board[col] === 'O') return 10; // Bot wins
      if (board[col] === 'X') return -10; // Human wins
    }
  }

  // Check diagonals for winner
  if (board[0] && board[0] === board[4] && board[4] === board[8]) {
    if (board[0] === 'O') return 10; // Bot wins
    if (board[0] === 'X') return -10; // Human wins
  }
  if (board[2] && board[2] === board[4] && board[4] === board[6]) {
    if (board[2] === 'O') return 10; // Bot wins
    if (board[2] === 'X') return -10; // Human wins
  }

  return 0; // No winner
}

// Helper function to check if there are moves left on the board
function isMovesLeft(board) {
  return board.includes(null);
}

// Check if a player has won with exactly 3 marks (following your game's win condition)
function checkWinWith3Marks(playerMoves) {
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
}

// Simulate making a move and handle disappearing logic
function simulateMove(board, moveHistory, player, position, timestamp) {
  const newBoard = [...board];
  const newMoveHistory = {
    X: [...moveHistory.X],
    O: [...moveHistory.O]
  };

  const newMove = { position, timestamp };
  let playerMoves = [...newMoveHistory[player]];
  let disappearedPosition = null;

  // Check if this move would create a win (before applying disappearing logic)
  const potentialMoves = [...playerMoves, newMove].slice(-3);
  const potentialWin = checkWinWith3Marks(potentialMoves);

  if (potentialWin) {
    // It's a winning move - just place the mark without removing old ones
    newBoard[position] = player;
    newMoveHistory[player] = [...playerMoves, newMove];
    return { 
      board: newBoard, 
      moveHistory: newMoveHistory, 
      isWinningMove: true,
      winningLine: potentialWin,
      disappearedPosition 
    };
  }

  // Handle disappearing logic for non-winning moves
  if (playerMoves.length === 3) {
    // Remove the oldest move
    const oldestMove = playerMoves[0];
    disappearedPosition = oldestMove.position;
    newBoard[oldestMove.position] = null;
    playerMoves = playerMoves.slice(1);
  }

  // Add the new move
  playerMoves.push(newMove);
  newBoard[position] = player;
  newMoveHistory[player] = playerMoves;

  return { 
    board: newBoard, 
    moveHistory: newMoveHistory, 
    isWinningMove: false,
    winningLine: null,
    disappearedPosition 
  };
}

// Enhanced minimax function that accounts for disappearing moves
function minimax(board, moveHistory, depth, isMaximizingPlayer, maxDepth, timestamp = Date.now()) {
  // Check for terminal states first
  
  // Check if either player has won with exactly 3 marks
  const xWin = checkWinWith3Marks(moveHistory.X);
  const oWin = checkWinWith3Marks(moveHistory.O);
  
  if (oWin) return 10 - depth; // Bot wins (prefer shorter wins)
  if (xWin) return -10 + depth; // Human wins (prefer longer losses)
  
  // Check if board is full (draw)
  if (!isMovesLeft(board)) return 0;
  
  // Check if max depth reached
  if (depth === maxDepth) {
    return evaluate(board);
  }

  const currentPlayer = isMaximizingPlayer ? 'O' : 'X';

  if (isMaximizingPlayer) {
    let bestVal = -Infinity;

    // Try all possible moves
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        // Simulate the move
        const simulationResult = simulateMove(
          board, 
          moveHistory, 
          currentPlayer, 
          i, 
          timestamp + depth
        );

        // If it's a winning move, return immediately with high value
        if (simulationResult.isWinningMove) {
          return 10 - depth;
        }

        // Recursively evaluate this move
        const moveVal = minimax(
          simulationResult.board,
          simulationResult.moveHistory,
          depth + 1,
          false,
          maxDepth,
          timestamp
        );

        bestVal = Math.max(bestVal, moveVal);
      }
    }
    return bestVal;
  } else {
    let bestVal = Infinity;

    // Try all possible moves
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        // Simulate the move
        const simulationResult = simulateMove(
          board, 
          moveHistory, 
          currentPlayer, 
          i, 
          timestamp + depth
        );

        // If it's a winning move for human, return immediately with low value
        if (simulationResult.isWinningMove) {
          return -10 + depth;
        }

        // Recursively evaluate this move
        const moveVal = minimax(
          simulationResult.board,
          simulationResult.moveHistory,
          depth + 1,
          true,
          maxDepth,
          timestamp
        );

        bestVal = Math.min(bestVal, moveVal);
      }
    }
    return bestVal;
  }
}

// Main function to find the best move for the computer
export function findBestMove(board, moveHistory, maxDepth = 3) {
  let bestVal = -Infinity;
  let bestMove = -1;
  const timestamp = Date.now();

  // Try all possible moves for the bot (O)
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      // Simulate this move
      const simulationResult = simulateMove(
        board, 
        moveHistory, 
        'O', 
        i, 
        timestamp
      );

      // If it's an immediate winning move, take it
      if (simulationResult.isWinningMove) {
        return i;
      }

      // Otherwise, evaluate using minimax
      const moveVal = minimax(
        simulationResult.board,
        simulationResult.moveHistory,
        0,
        false, // Next move will be human's (minimizing)
        maxDepth,
        timestamp
      );

      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = i;
      }
    }
  }

  return bestMove;
} 