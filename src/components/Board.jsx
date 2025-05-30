import React from 'react';
import Cell from './Cell';

const Board = ({ 
  board, 
  onCellClick, 
  winningLine, 
  disappearingCell, 
  fadedCell, 
  isXNext, 
  isOnline = false, 
  currentPlayerSymbol = null 
}) => {
  // Determine if current player won or lost
  let playerWon = false;
  if (isOnline && winningLine && currentPlayerSymbol) {
    // In online mode, check if the winner is the current player
    const winner = isXNext ? 'O' : 'X'; // Winner is opposite of current turn when game ends
    playerWon = winner === currentPlayerSymbol;
  }

  return (
    <div className="game-board-wrapper">
      <div className="game-board">
        {board.map((value, index) => (
          <Cell
            key={index}
            value={value}
            onClick={() => onCellClick(index)}
            isWinning={winningLine?.includes(index)}
            isLosing={isOnline && winningLine?.includes(index) && !playerWon}
            isDisappearing={disappearingCell === index}
            isFaded={fadedCell === index}
            isOpponentTurn={value === null && !isXNext}
          />
        ))}
      </div>
    </div>
  );
};

export default Board; 