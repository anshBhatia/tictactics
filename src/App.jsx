import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import PlayerInfo from './components/PlayerInfo';
import GameStatus from './components/GameStatus';
import StartScreen from './components/StartScreen';
import GameHeading from './components/GameHeading';
import CreateRoomScreen from './components/CreateRoomScreen';
import WaitingRoomScreen from './components/WaitingRoomScreen';
import JoinRoomScreen from './components/JoinRoomScreen';
import OnlineGame from './pages/OnlineGame';
import useGameLogic from './hooks/useGameLogic';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [appState, setAppState] = useState('start'); // 'start', 'create-room', 'waiting-room', 'join-room', 'online-game', 'offline-game'
  const [roomData, setRoomData] = useState(null);
  const [joinRoomId, setJoinRoomId] = useState(null);
  
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
  } = useGameLogic(gameMode, botDifficulty);

  // Check for room join URL parameter on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const joinParam = urlParams.get('join');
    
    if (joinParam) {
      setJoinRoomId(joinParam);
      setAppState('join-room');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleModeSelect = (mode) => {
    if (mode === 'online') {
      setAppState('create-room');
    } else {
      setGameMode(mode);
      setAppState('offline-game');
      resetGame();
    }
  };

  const handleBackToStart = () => {
    setGameMode(null);
    setAppState('start');
    setRoomData(null);
    setJoinRoomId(null);
  };

  const handleRoomCreated = (data) => {
    setRoomData(data);
    setAppState('waiting-room');
  };

  const handleGameStart = (data) => {
    setRoomData(prev => ({ ...prev, ...data }));
    setAppState('online-game');
  };

  const handleJoinSuccess = (data) => {
    setRoomData(data);
    setAppState('online-game');
  };

  // Render different screens based on app state
  if (appState === 'start') {
    return <StartScreen onSelectMode={handleModeSelect} />;
  }

  if (appState === 'create-room') {
    return (
      <CreateRoomScreen 
        onBack={handleBackToStart}
        onRoomCreated={handleRoomCreated}
      />
    );
  }

  if (appState === 'waiting-room') {
    return (
      <WaitingRoomScreen 
        roomData={roomData}
        onGameStart={handleGameStart}
        onBack={handleBackToStart}
      />
    );
  }

  if (appState === 'join-room') {
    return (
      <JoinRoomScreen 
        roomId={joinRoomId}
        onBack={handleBackToStart}
        onJoinSuccess={handleJoinSuccess}
      />
    );
  }

  if (appState === 'online-game') {
    return (
      <OnlineGame 
        roomData={roomData}
        onBackToStart={handleBackToStart}
      />
    );
  }

  // Offline game (existing logic)
  if (appState === 'offline-game') {
    // Dynamic player names based on game mode
    const player1Name = 'Player 1';
    const player2Name = gameMode === 'computer' ? 'Computer' : 'Player 2';

    return (
      <div className="game-container">
        <div className="game-title-container">
          <GameHeading />
        </div>
        <div className="players-container">
          <PlayerInfo 
            player={player1Name}
            emoji={'👤'} 
            isActive={isXNext} 
          />
          <div className="versus-badge">
            <span className="versus-text">Versus</span>
          </div>
          <PlayerInfo 
            player={player2Name}
            emoji={gameMode === 'computer' ? '🤖' : '👾'} 
            isActive={!isXNext} 
          />
        </div>
        <Board 
          board={board}
          onCellClick={handleClick}
          winningLine={winningLine}
          disappearingCell={disappearingCell}
          fadedCell={fadedCell}
          isXNext={isXNext}
        />
        <GameStatus 
          isXNext={isXNext} 
          winningLine={winningLine}
          currentPlayer={isXNext ? 'O' : 'X'}
        />
        {winningLine && (
          <div className="game-end-buttons">
          <button className="play-again-button" onClick={resetGame}>
            Play Again
          </button>
            <button className="change-mode-button" onClick={handleBackToStart}>
              Change Mode
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;
