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
  currentPlayerSymbol = null,
  mode = 'default' // 'multiplayer' for purple board, 'default' for normal
}) => {
  // Determine if current player won or lost
  let playerWon = false;
  if (isOnline && winningLine && currentPlayerSymbol) {
    // In online mode, check if the winner is the current player
    const winner = isXNext ? 'O' : 'X'; // Winner is opposite of current turn when game ends
    playerWon = winner === currentPlayerSymbol;
  }

  // Function to determine cell position type for styling
  const getCellPosition = (index) => {
    const positions = [
      'top-left',    // 0
      'top-center',  // 1
      'top-right',   // 2
      'middle-left', // 3
      'center',      // 4
      'middle-right',// 5
      'bottom-left', // 6
      'bottom-center',// 7
      'bottom-right' // 8
    ];
    return positions[index];
  };

  return (
    <div className="game-board-wrapper">
      <div className={`game-board ${mode === 'multiplayer' ? 'multiplayer-board' : ''} ${mode === 'bot' ? 'bot-board' : ''} ${mode === 'offline' ? 'offline-board' : ''}`}>
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
            position={getCellPosition(index)}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
};

export default Board; 
