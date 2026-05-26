import React from 'react';

const GameStatus = ({ isXNext, winningLine, currentPlayer, isOnline = false, isMyTurn = false, currentPlayerSymbol = null, disconnectedPlayer = null }) => {
  const getStatusMessage = () => {
    // Handle player disconnection first - exact text from Figma
    if (disconnectedPlayer) {
      return `${disconnectedPlayer} left the game`;
    }
    
    if (winningLine) {
      if (isOnline) {
        // For online games, check if the winner is the current player - exact text from Figma
        const winner = isXNext ? 'O' : 'X'; // Winner is the opposite of current turn
        return winner === currentPlayerSymbol ? 'YOu Lost!' : 'YOu WON!';
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

  const getStatusColor = () => {
    // Handle player disconnection - orange color from Figma
    if (disconnectedPlayer) {
      return '#e36911';
    }
    
    if (winningLine && isOnline) {
      const winner = isXNext ? 'O' : 'X';
      // Green for win, orange for loss - exact colors from Figma
      return winner === currentPlayerSymbol ? '#e36911' : '#a5f79f';
    }
    
    // Default color for other states
    return 'var(--text-color)';
  };

  return (
    <div className="game-status" style={{ color: getStatusColor(), fontWeight: 'bold', textTransform: 'uppercase' }}>
      {getStatusMessage()}
    </div>
  );
};

export default GameStatus; 