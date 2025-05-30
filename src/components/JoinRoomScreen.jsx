import React, { useState, useEffect } from 'react';
import socketService from '../utils/socketService';

function JoinRoomScreen({ roomId, hostName, onBack, onJoinSuccess }) {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayHostName, setDisplayHostName] = useState(hostName || 'Unknown');

  // Try to get room info when component mounts
  useEffect(() => {
    const getRoomInfo = async () => {
      try {
        await socketService.connect();
        const roomInfo = await socketService.getRoomInfo(roomId);
        setDisplayHostName(roomInfo.hostName);
        console.log('Room info fetched:', roomInfo);
      } catch (error) {
        console.error('Failed to get room info:', error);
        // Keep the default 'Unknown' if we can't fetch the info
      }
    };

    if (roomId && !hostName) {
      getRoomInfo();
    }
  }, [roomId, hostName]);

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Connect to socket server if not already connected
      if (!socketService.isConnected) {
        await socketService.connect();
      }
      
      // Join room
      const response = await socketService.joinRoom(roomId, playerName.trim());
      
      if (response.success) {
        // Update host name from server response
        if (response.hostName) {
          setDisplayHostName(response.hostName);
        }
        
        onJoinSuccess({
          roomId,
          playerName: playerName.trim(),
          hostName: response.hostName || displayHostName,
          isHost: false,
          gameData: response.gameData
        });
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      setError(error.message || 'Failed to join room. Please check the link and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-room-screen">
      {/* App title */}
      <div className="app-title-container">
        <h1 className="app-title">Tic Tac Tix</h1>
      </div>

      {/* Main content */}
      <div className="join-room-content">
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
            onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
        </div>

        <div className="host-info">
          <p className="shared-by-text">
            Shared by <strong>{displayHostName}</strong>
          </p>
          <p className="room-info">
            Room ID: <strong>{roomId}</strong>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          className="join-game-button"
          onClick={handleJoinRoom}
          disabled={isLoading || !playerName.trim()}
        >
          {isLoading ? 'Joining...' : '🎮 Join Game'}
        </button>

        <button 
          className="back-to-home-button"
          onClick={onBack}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default JoinRoomScreen; 