import React, { useState } from 'react';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import useGameLogic from '../hooks/useGameLogic';

const Game = () => {
  const [players, setPlayers] = useState({
    X: 'Player 1',
    O: 'Computer'
  });

  const {
    board,
    currentPlayer,
    winningLine,
    gameOver,
    disappearingCell,
    handleMove,
    resetGame
  } = useGameLogic();

  const getStatusText = () => {
    if (gameOver) {
      return `${players[currentPlayer]} wins!`;
    }
    return currentPlayer === 'X' ? 'Your turn' : 'Computer is making a move...';
  };

  return (
    <div className="game-container">
      <h1 className="game-title">
        <span>Tic </span>
        <span>Tac </span>
        <span>Tix</span>
      </h1>
      
      <PlayerInfo
        players={players}
        currentPlayer={currentPlayer}
      />

      <Board
        board={board}
        onCellClick={handleMove}
        winningLine={winningLine}
        disappearingCell={disappearingCell}
      />

      <div className="status-text">
        {getStatusText()}
      </div>

      {gameOver && (
        <button
          onClick={resetGame}
          className="play-again-button"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default Game; 