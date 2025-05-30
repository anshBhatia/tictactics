import React from 'react';

const GameStatus = ({ isXNext, winningLine, currentPlayer, isOnline = false, isMyTurn = false, currentPlayerSymbol = null }) => {
  const getStatusMessage = () => {
    if (winningLine) {
      if (isOnline) {
        // For online games, check if the winner is the current player
        const winner = isXNext ? 'O' : 'X'; // Winner is the opposite of current turn
        return winner === currentPlayerSymbol ? 'You lost, better luck next time :/' : 'YOU WON! 🎊';
      } else {
        // For offline games, use existing logic
        return !isXNext ? 'You lost, better luck next time :/' : 'YOU WON! 🎊';
      }
    }
    
    if (isOnline) {
      // For online games, show personalized turn messages
      return isMyTurn ? 'Your turn' : 'Waiting for opponent...';
    } else {
      // For offline games, use existing logic
      return isXNext ? 'Your turn' : 'Player 2 is making a move...';
    }
  };

  return (
    <div className="game-status">
      {getStatusMessage()}
    </div>
  );
};

export default GameStatus; 