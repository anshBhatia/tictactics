import React from 'react';

const PlayerInfo = ({ player, isActive }) => {
  return (
    <div className={`multiplayer-player-card ${isActive ? 'active' : 'inactive'}`}>
      <div className="player-name-text">
        {player}
      </div>
    </div>
  );
};

export default PlayerInfo; 