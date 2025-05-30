import React from 'react';
import StartScreenHeading from './StartScreenHeading';

function StartScreen({ onSelectMode }) {
  return (
    <div className="start-screen">
      <div className="start-title-box">
        <StartScreenHeading />
      </div>
      <div className="start-cards-container">
        <div className="start-card start-card-full" onClick={() => onSelectMode('online')}>
          <span className="mode-icon">📱</span>
          <span className="mode-text">Play with a friend (online)</span>
        </div>
        <div className="start-card-row">
          <div className="start-card" onClick={() => onSelectMode('computer')}>
            <span className="mode-icon">🤖</span>
            <span className="mode-text">Play with a Bot</span>
          </div>
          <div className="start-card" onClick={() => onSelectMode('offline')}>
            <span className="mode-icon">🧑‍🤝‍🧑</span>
            <span className="mode-text">Play with a friend (offline)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen; 