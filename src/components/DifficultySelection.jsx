import React from 'react';

function DifficultySelection({ onSelectDifficulty, onBack }) {
  return (
    <div className="start-screen">
      <div className="start-title-box">
        <h1 className="start-title">
          <span className="tic">Choose</span>
          <span className="tac">Difficulty</span>
        </h1>
        <div className="start-subtitle">Select your challenge level</div>
      </div>
      <div className="start-cards-container">
        <div className="start-card" onClick={() => onSelectDifficulty(1)}>
          <span className="mode-icon">🟢</span>
          <span className="mode-text">Easy</span>
          <span className="difficulty-description">Casual play</span>
        </div>
        <div className="start-card" onClick={() => onSelectDifficulty(3)}>
          <span className="mode-icon">🟡</span>
          <span className="mode-text">Medium</span>
          <span className="difficulty-description">Balanced challenge</span>
        </div>
        <div className="start-card" onClick={() => onSelectDifficulty(5)}>
          <span className="mode-icon">🔴</span>
          <span className="mode-text">Hard</span>
          <span className="difficulty-description">Strategic master</span>
        </div>
      </div>
      <div className="difficulty-back-button-container">
        <button className="difficulty-back-button" onClick={onBack}>
          ← Back to Mode Selection
        </button>
      </div>
    </div>
  );
}

export default DifficultySelection; 