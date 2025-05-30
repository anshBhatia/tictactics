import React from 'react';

const PlayerInfo = ({ player, emoji, isActive }) => {
  return (
    <div className={`player-card ${isActive ? 'active' : ''}`}>
      <div className="player-emoji">{emoji}</div>
      <div className="player-name">{player}</div>
    </div>
  );
};

export default PlayerInfo; 