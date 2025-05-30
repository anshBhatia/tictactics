import React from 'react';
import Board from '../components/Board';
import PlayerInfo from '../components/PlayerInfo';
import GameStatus from '../components/GameStatus';
import GameHeading from '../components/GameHeading';
import useOnlineGameLogic from '../hooks/useOnlineGameLogic';

function OnlineGame({ roomData, onBackToStart }) {
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
    disconnectedPlayer
  } = useOnlineGameLogic(roomData);

  // Determine player names and info
  const isPlayerX = currentPlayerSymbol === 'X';
  const player1Name = isPlayerX ? roomData.playerName : roomData.hostName;
  const player2Name = isPlayerX ? roomData.playerName : roomData.hostName;

  const player1IsActive = isXNext && (isPlayerX ? isMyTurn : !isMyTurn);
  const player2IsActive = !isXNext && (isPlayerX ? !isMyTurn : isMyTurn);

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
      />

      <GameStatus 
        isXNext={isXNext} 
        winningLine={winningLine}
        currentPlayer={isXNext ? 'O' : 'X'}
        isOnline={true}
        isMyTurn={isMyTurn}
        currentPlayerSymbol={currentPlayerSymbol}
      />

      {gameState === 'waiting' && (
        <div className="waiting-message">
          <p>Waiting for both players to connect...</p>
        </div>
      )}

      {!isMyTurn && gameState === 'playing' && !winningLine && (
        <div className="turn-indicator">
          <p>Waiting for opponent's move...</p>
        </div>
      )}

      {disconnectedPlayer && (
        <div className="disconnection-message">
          <p>{disconnectedPlayer} has left the game</p>
        </div>
      )}

      {winningLine && (
        <div className="game-end-buttons">
          <button className="play-again-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default OnlineGame; 