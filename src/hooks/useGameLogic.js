import { useState, useCallback, useEffect } from 'react';
import { findBestMove } from '../utils/botLogic';

const useGameLogic = (gameMode, botDifficulty = 3) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winningLine, setWinningLine] = useState(null);
  const [disappearingCell, setDisappearingCell] = useState(null);
  const [moveHistory, setMoveHistory] = useState({
    X: [], // Array of {position, timestamp}
    O: []
  });
  const [fadedCell, setFadedCell] = useState(null);

  // Update faded cell whenever the turn changes
  useEffect(() => {
    const currentPlayer = isXNext ? 'X' : 'O';
    const playerMoves = moveHistory[currentPlayer];
    
    // Only show faded cell if:
    // 1. There's no winner, or
    // 2. There is a winner AND player has more than 3 moves (won on 4th+ move)
    if ((!winningLine && playerMoves.length >= 3) || 
        (winningLine && playerMoves.length > 3)) {
      setFadedCell(playerMoves[0].position);
    } else {
      setFadedCell(null);
    }
  }, [isXNext, moveHistory, winningLine]);

  // Bot's turn logic
  useEffect(() => {
    if (gameMode === 'computer' && !isXNext && !winningLine) {
      // Add a small delay to make it look like the bot is thinking
      const botMoveTimer = setTimeout(() => {
        // Find the best move for the bot (O) using the selected difficulty
        const botMoveIndex = findBestMove(board, moveHistory, botDifficulty);

        // If a valid move is found, apply it
        if (botMoveIndex !== -1 && board[botMoveIndex] === null) {
          handleClick(botMoveIndex, true); // Pass isBotMove = true
        }
      }, 800); // Slightly longer delay to show the bot is "thinking"

      return () => clearTimeout(botMoveTimer);
    }
  }, [board, isXNext, gameMode, winningLine, moveHistory, botDifficulty]);

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

  const handleClick = useCallback((index, isBotMove = false) => {
    // Prevent action if cell is occupied or game has a winner
    if (board[index] || winningLine) return;
    // Prevent player from playing out of turn in bot mode (but allow bot)
    if (gameMode === 'computer' && !isXNext && !isBotMove) return;

    const currentPlayer = isXNext ? 'X' : 'O';
    const newMove = {
      position: index,
      timestamp: Date.now()
    };

    let newPlayerMoves = [...moveHistory[currentPlayer]];
    let oldestMove = null;

    // First, check if adding this move creates a win
    const potentialMoves = [...newPlayerMoves, newMove].slice(-3);
    const potentialWin = checkWinner(potentialMoves);

    if (potentialWin) {
      // It's a winning move - update board and state without removing any marks
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      
      const updatedMoves = [...newPlayerMoves, newMove];
      setBoard(newBoard);
      setMoveHistory({
        ...moveHistory,
        [currentPlayer]: updatedMoves
      });
      setWinningLine(potentialWin);
      return;
    }

    // Not a winning move - proceed with normal logic
    if (newPlayerMoves.length === 3) {
      oldestMove = newPlayerMoves[0];
      newPlayerMoves = newPlayerMoves.slice(1);
    }

    // Add new move
    newPlayerMoves.push(newMove);

    // Update board state
    const newBoard = [...board];
    if (oldestMove) {
      newBoard[oldestMove.position] = null;
    }
    newBoard[index] = currentPlayer;

    // Update all state
    setBoard(newBoard);
    setMoveHistory({
      ...moveHistory,
      [currentPlayer]: newPlayerMoves
    });
    setIsXNext(!isXNext);

    // Handle visual animation for removed mark
    if (oldestMove) {
      setDisappearingCell(oldestMove.position);
      setTimeout(() => {
        setDisappearingCell(null);
      }, 500);
    }
  }, [board, isXNext, winningLine, moveHistory, gameMode]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine(null);
    setDisappearingCell(null);
    setMoveHistory({ X: [], O: [] });
    setFadedCell(null);
  }, []);

  return {
    board,
    isXNext,
    winningLine,
    disappearingCell,
    fadedCell,
    handleClick,
    resetGame
  };
};

export default useGameLogic; 