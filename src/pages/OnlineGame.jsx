import React, { useState } from 'react';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import GameStatus from '../components/GameStatus';
import GameHeading from '../components/GameHeading';
import Toast from '../components/Toast';
import useOnlineGameLogic from '../hooks/useOnlineGameLogic';

function OnlineGame({ roomData, onBackToStart }) {
  const [toastMessage, setToastMessage] = useState(null);
  
  const { 
    board, 
    isXNext, 
    winningLine, 
    disappearingCell, 
    fadedCell, 
    handleClick,
    resetGame,
    currentPlayerSymbol,
    isMyTurn,
    gameState,
    disconnectedPlayer,
    opponentName
  } = useOnlineGameLogic(roomData, setToastMessage);

  // Determine player names and info
  const myName = roomData.playerName;
  const opponent = opponentName || 'Opponent';

  // Player 1 is always the current user, Player 2 is always the opponent
  const player1Name = myName;
  const player2Name = opponent;

  const player1IsActive = isMyTurn;
  const player2IsActive = !isMyTurn;

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <div className="game-container">
      <div className="game-title-container">
        <GameHeading />
      </div>
      
      <div className="players-container">
        <PlayerInfo 
          player={player1Name}
          emoji={'👤'} 
          isActive={player1IsActive}
        />
        <div className="versus-badge">
          <span className="versus-text">Versus</span>
        </div>
        <PlayerInfo 
          player={player2Name}
          emoji={'👾'} 
          isActive={player2IsActive}
        />
      </div>

      <Board 
        board={board}
        onCellClick={handleClick}
        winningLine={winningLine}
        disappearingCell={disappearingCell}
        fadedCell={fadedCell}
        isXNext={isXNext}
        isOnline={true}
        currentPlayerSymbol={currentPlayerSymbol}
      />

      <div style={{ marginTop: '32px' }}>
        <GameStatus 
          isXNext={isXNext} 
          winningLine={winningLine}
          currentPlayer={isXNext ? 'O' : 'X'}
          isOnline={true}
          isMyTurn={isMyTurn}
          currentPlayerSymbol={currentPlayerSymbol}
        />
      </div>

      {winningLine && (
        <div className="game-end-buttons">
          <button className="play-again-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={closeToast} />
      )}
    </div>
  );
}

export default OnlineGame; 