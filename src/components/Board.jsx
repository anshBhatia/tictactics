import React from 'react';
import Cell from './Cell';

const Board = ({ board, onCellClick, winningLine, disappearingCell, fadedCell, isXNext }) => {
  return (
    <div className="game-board-wrapper">
      <div className="game-board">
        {board.map((value, index) => (
          <Cell
            key={index}
            value={value}
            onClick={() => onCellClick(index)}
            isWinning={winningLine?.includes(index)}
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