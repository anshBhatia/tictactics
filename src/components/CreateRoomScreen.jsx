import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socketService from '../utils/socketService';

function CreateRoomScreen({ onBack, onRoomCreated }) {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Connect to socket server
      await socketService.connect();
      
      // Create room
      const response = await socketService.createRoom(playerName.trim());
      
      if (response.success) {
        const gameLink = `${window.location.origin}${window.location.pathname}?join=${response.roomId}`;
        
        onRoomCreated({
          roomId: response.roomId,
          playerName: playerName.trim(),
          gameLink,
          isHost: true
        });
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="create-room-screen">
      {/* Back button */}
      <div className="back-button-container">
        <button className="back-button" onClick={onBack}>
          🔙
        </button>
      </div>

      {/* Main content */}
      <div className="create-room-content">
        <div className="mode-illustration">
          <span className="mode-icon-large">📱</span>
          <h2 className="mode-title">Play with a friend (online)</h2>
        </div>

        <div className="name-input-section">
          <div className="player-icon">👤</div>
          <input
            type="text"
            placeholder="Enter your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="name-input"
            maxLength={20}
            disabled={isLoading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          className="share-link-button"
          onClick={handleCreateRoom}
          disabled={isLoading || !playerName.trim()}
        >
          {isLoading ? 'Creating...' : '🔗 Share game link'}
        </button>
      </div>
    </div>
  );
}

export default CreateRoomScreen; 