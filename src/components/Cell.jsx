import React from 'react';
import './GamePieces.css';

const Cell = ({ value, onClick, isWinning, isLosing, isDisappearing, isFaded, isOpponentTurn }) => {
  return (
    <div
      onClick={onClick}
      className={`game-cell ${isWinning ? 'winning' : ''} ${isLosing ? 'losing' : ''} ${
        isDisappearing ? 'fade-out' : ''
      } ${isFaded ? 'faded' : ''} ${isOpponentTurn ? 'opponent-turn' : ''}`}
    >
      {value && (
        <div className="cell-content">
          <div className={`game-piece ${value.toLowerCase()}-mark`} />
        </div>
      )}
    </div>
  );
};

export default React.memo(Cell); 