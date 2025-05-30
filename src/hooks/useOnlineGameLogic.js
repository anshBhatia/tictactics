import { useState, useCallback, useEffect } from 'react';
import socketService from '../utils/socketService';

const useOnlineGameLogic = (roomData) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winningLine, setWinningLine] = useState(null);
  const [disappearingCell, setDisappearingCell] = useState(null);
  const [moveHistory, setMoveHistory] = useState({
    X: [], // Array of {position, timestamp}
    O: []
  });
  const [fadedCell, setFadedCell] = useState(null);
  const [currentPlayerSymbol, setCurrentPlayerSymbol] = useState(null);
  const [gameState, setGameState] = useState('waiting'); // 'waiting', 'playing', 'finished'
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);
  const [opponentName, setOpponentName] = useState(null);

  // Update faded cell whenever the turn changes
  useEffect(() => {
    const currentPlayer = isXNext ? 'X' : 'O';
    const playerMoves = moveHistory[currentPlayer];
    
    if ((!winningLine && playerMoves.length >= 3) || 
        (winningLine && playerMoves.length > 3)) {
      setFadedCell(playerMoves[0].position);
    } else {
      setFadedCell(null);
    }
  }, [isXNext, moveHistory, winningLine]);

  // Set up socket listeners
  useEffect(() => {
    if (!roomData) return;

    console.log('Setting up socket listeners for room:', roomData.roomId, 'isHost:', roomData.isHost);

    // Listen for game state updates
    socketService.onGameStateUpdate((data) => {
      console.log('Game state update received:', data);
      setBoard(data.board || Array(9).fill(null));
      setIsXNext(data.isXNext !== undefined ? data.isXNext : true);
      setWinningLine(data.winningLine || null);
      setMoveHistory(data.moveHistory || { X: [], O: [] });
      setCurrentPlayerSymbol(data.playerSymbol);
      setIsMyTurn(data.isYourTurn || false);
      setGameState(data.gameState || 'playing');
      setOpponentName(data.opponentName || null);
      
      console.log('Updated state:', {
        playerSymbol: data.playerSymbol,
        isMyTurn: data.isYourTurn,
        gameState: data.gameState,
        isXNext: data.isXNext,
        opponentName: data.opponentName
      });
    });

    // Listen for moves
    socketService.onMoveMade((data) => {
      console.log('Move made:', data);
      // The game state update will handle the board changes
    });

    // Listen for game restart
    socketService.onGameRestart((data) => {
      console.log('Game restarted:', data);
      resetGame();
    });

    // Listen for player disconnection
    socketService.onPlayerDisconnected((data) => {
      console.log('Player disconnected:', data);
      setGameState('finished');
      setDisconnectedPlayer(data.playerName || 'Opponent');
    });

    // Listen for game start
    socketService.onGameStart((data) => {
      console.log('Game start received:', data);
      setGameState('playing');
      
      // Determine player symbol and initial turn state
      if (data.players) {
        const isHost = roomData.isHost;
        const mySymbol = isHost ? data.players.host.symbol : data.players.guest.symbol;
        console.log('Setting player symbol:', mySymbol, 'isHost:', isHost);
        setCurrentPlayerSymbol(mySymbol);
        // X always goes first, so if I'm X, it's my turn initially
        const myTurn = mySymbol === 'X';
        setIsMyTurn(myTurn);
        console.log('Initial turn set:', myTurn);
      }
    });

    // Listen for player joined (for host)
    socketService.onPlayerJoined((data) => {
      console.log('Player joined:', data);
      // For the host, this means we can start the game soon
      if (roomData.isHost) {
        console.log('Host received player joined notification');
      }
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [roomData]);

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

  const handleClick = useCallback((index) => {
    // Prevent action if cell is occupied, game has a winner, or it's not player's turn
    if (board[index] || winningLine || !isMyTurn || gameState !== 'playing') {
      console.log('Move blocked:', { 
        cellOccupied: !!board[index], 
        hasWinner: !!winningLine, 
        isMyTurn, 
        gameState 
      });
      return;
    }

    console.log('Making move at position:', index);
    // Send move to server
    socketService.makeMove(roomData.roomId, index);
  }, [board, winningLine, isMyTurn, gameState, roomData]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine(null);
    setDisappearingCell(null);
    setMoveHistory({ X: [], O: [] });
    setFadedCell(null);
    setGameState('playing');
  }, []);

  const handleRestart = useCallback(() => {
    if (roomData) {
      socketService.restartGame(roomData.roomId);
    }
  }, [roomData]);

  return {
    board,
    isXNext,
    winningLine,
    disappearingCell,
    fadedCell,
    handleClick,
    resetGame: handleRestart,
    currentPlayerSymbol,
    isMyTurn,
    gameState,
    disconnectedPlayer,
    opponentName
  };
};

export default useOnlineGameLogic; 