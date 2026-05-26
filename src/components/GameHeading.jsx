import React from 'react';

const GameHeading = ({ showDescription = false, centerAlign = false }) => (
  <div className={`heading-container ${centerAlign ? 'center-aligned' : ''}`}>
    <div className="xodown-heading">
      <span className="xodown-xo">XO</span>
      <span className="xodown-down">DOWN</span>
    </div>
    {showDescription && (
      <div className="xodown-desc">
        A tic tac toe game that can never end in a draw
      </div>
    )}
  </div>
);

export default GameHeading; 