import React, { useState, useEffect } from 'react';
import socketService from '../utils/socketService';

function WaitingRoomScreen({ roomData, onGameStart, onBack }) {
  const [copied, setCopied] = useState(false);
  const [waitingForPlayer, setWaitingForPlayer] = useState(true);

  useEffect(() => {
    // Listen for player joining
    socketService.onPlayerJoined((data) => {
      console.log('Player joined:', data);
      setWaitingForPlayer(false);
    });

    // Listen for game start
    socketService.onGameStart((data) => {
      console.log('Game starting:', data);
      onGameStart(data);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [onGameStart]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomData.gameLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Tic Tac Toe game!',
          text: `${roomData.playerName} invited you to play Tic Tac Toe`,
          url: roomData.gameLink,
        });
      } catch (err) {
        console.error('Failed to share:', err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="waiting-room-screen">
      {/* Back button */}
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          🔙
        </button>
      </div>

      {/* Main content */}
      <div className="waiting-room-content">
        <div className="waiting-illustration">
          <span className="mode-icon-large">🎮</span>
        </div>
        
        <h1 className="waiting-title">Waiting for Player 2</h1>
        
        <div className="player-info">
          <span className="player-avatar">👤</span>
          <span className="player-name">{roomData.playerName}</span>
          <span className="player-role">Host</span>
        </div>

        <div className="share-section">
          <p className="share-instruction">
            Share this link with your friend to start playing
          </p>
          
          <div className="link-container">
            <input
              type="text"
              className="share-link-input"
              value={roomData.gameLink}
              readOnly
            />
            <button className="copy-button" onClick={copyToClipboard}>
              📋
            </button>
          </div>
          
          <div className="share-buttons">
            <button className="share-button primary" onClick={shareLink}>
              Share Game
            </button>
          </div>
        </div>

        <div className="waiting-indicator">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Waiting for opponent to join...</p>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomScreen; 