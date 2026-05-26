import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import useGameLogic from '../hooks/useGameLogic';
import { OnlineMetaBar, OnlineWordmark } from '../components/OnlineModeChrome';
import '../components/OnlineMode.css';

function OfflineGame() {
  const { mode } = useParams();
  const navigate = useNavigate();
  
  // Always use depth 3 for the bot
  const botDifficulty = 3;

  const { 
    board, 
    isXNext, 
    winningLine, 
    disappearingCell, 
    fadedCell, 
    handleClick,
    resetGame 
  } = useGameLogic(mode, botDifficulty);

  const player1Name = 'Player 1';
  const player2Name = mode === 'computer' ? 'Computer' : 'Player 2';
  const accentMain = mode === 'computer' ? '#e36911' : '#139b2c';
  const accentLight = mode === 'computer' ? '#f88e41' : '#5dd673';
  const winnerLabel = winningLine ? (isXNext ? player1Name : player2Name) : '';
  const statusText = winningLine
    ? mode === 'computer'
      ? (isXNext ? 'You WON!' : 'You Lost!')
      : `${winnerLabel} WON!`
    : isXNext
      ? "Player 1's turn"
      : mode === 'computer'
        ? 'Bot is making a move...'
        : "Player 2's turn";
  const boardMode = mode === 'computer' ? 'bot' : 'offline';

  return (
    <div className="online-screen local-screen">
      <div className="online-screen__inner">
        <div className="online-screen__desktop-meta">
          <OnlineMetaBar />
        </div>

        <div className="local-game">
          <div className="local-game__header">
            <OnlineWordmark compact showTagline={false} />
          </div>

          <section className={`local-game__panel ${winningLine ? 'local-game__panel--finished' : ''}`}>
            <div className="local-game__players">
              <div
                className={`local-game__player ${!winningLine && isXNext ? 'local-game__player--active' : 'local-game__player--inactive'}`}
                style={{ '--local-main': accentMain } }
              >
                {player1Name}
              </div>
              <div
                className={`local-game__player ${!winningLine && !isXNext ? 'local-game__player--active' : 'local-game__player--inactive'}`}
                style={{ '--local-main': accentMain } }
              >
                {player2Name}
              </div>
            </div>

            <div className="local-game__board" style={{ '--local-main': accentMain, '--local-light': accentLight }}>
              <Board
                board={board}
                onCellClick={handleClick}
                winningLine={winningLine}
                disappearingCell={disappearingCell}
                fadedCell={fadedCell}
                isXNext={isXNext}
                mode={boardMode}
              />
            </div>

            <p className="local-game__status">{statusText}</p>

            {winningLine && (
              <div className="local-game__end-actions">
                <button type="button" className="online-button online-button--secondary" onClick={() => navigate('/')}>
                  <span className="material-symbols-rounded" aria-hidden="true">home</span>
                  Home
                </button>
                <button type="button" className="online-button online-button--primary" onClick={resetGame}>
                  <span className="material-symbols-rounded">replay</span>
                  Play Again
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="online-screen__mobile-meta online-screen__mobile-meta--compact">
          <OnlineMetaBar variant="compact" />
        </div>
      </div>
    </div>
  );
}

export default OfflineGame; 
