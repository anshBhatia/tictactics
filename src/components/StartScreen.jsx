import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Squircle } from 'corner-smoothing';
import { OnlineMetaBar, OnlineWordmark } from './OnlineModeChrome';
import './OnlineMode.css';
import './StartScreen.css';

// Card/game color constants for use in their respective games
export const ONLINE_GAME_COLOR = '#9564FE';
export const BOT_GAME_COLOR = '#E36911';
export const OFFLINE_GAME_COLOR = '#139B2C';

function StartScreen() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const carouselCards = [
    {
      heading: 'Challenge a Bot',
      subheading: 'Try beating the AI Uprising at this game (Spoiler Alert: It won\'t be easy)',
      button: 'Play with Bot',
      onClick: () => navigate('/play/computer'),
      bg: BOT_GAME_COLOR,
      textWidth: 236,
      buttonWidth: 130,
    },
    {
      heading: 'Play Offline',
      subheading: 'Challenge the person sitting right beside you even if you don\'t know them',
      button: 'Play offline',
      onClick: () => navigate('/play/offline'),
      bg: OFFLINE_GAME_COLOR,
      textWidth: 236,
      buttonWidth: 115,
    },
    {
      heading: 'PLAY ONLINE WITH A FRIEND',
      subheading: 'Challenge a friend at a "not so boring" game of Tic Tac Toe',
      button: 'Coming soon',
      bg: ONLINE_GAME_COLOR,
      textWidth: 272,
      buttonWidth: 130,
      disabled: true,
    },
  ];

  return (
    <div className="start-screen">
      <div className="start-screen__desktop-meta">
        <OnlineMetaBar />
      </div>

      <div className="start-screen__inner">
        <div className="start-screen__intro">
          <OnlineWordmark />
        </div>

        <div className="start-screen__desktop-grid">
          {carouselCards.map((card, idx) => (
            <Squircle
              key={idx}
              cornerRadius={32}
              cornerSmoothing={1}
              style={{
                background: card.bg,
                padding: '35px 39px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                boxSizing: 'border-box',
                flexShrink: 0,
                scrollSnapAlign: 'center',
              }}
              className="carousel-card carousel-card--desktop"
            >
              <div className="carousel-heading-container" style={{ width: `${card.textWidth}px` }}>
                <div className="carousel-heading">{card.heading}</div>
                <div className="carousel-subheading">{card.subheading}</div>
              </div>
              <Squircle
                as="button"
                cornerRadius={10}
                cornerSmoothing={1}
                style={{
                  display: 'flex',
                  padding: '12px 14px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FFF',
                  border: 'none',
                  cursor: card.disabled ? 'not-allowed' : 'pointer',
                  marginTop: 20,
                  width: `${card.buttonWidth}px`,
                  opacity: card.disabled ? 0.62 : 1,
                }}
                onClick={card.onClick}
                disabled={card.disabled}
                className="carousel-btn"
              >
                <span className="carousel-btn-text">
                  {card.button}
                </span>
              </Squircle>

            </Squircle>
          ))}
        </div>

        <div className="carousel-outer-wrapper">
          <div
            className="carousel-native"
            ref={carouselRef}
          >
            {carouselCards.map((card, idx) => (
              <Squircle
                key={idx}
                cornerRadius={32}
                cornerSmoothing={1}
                style={{
                  background: card.bg,
                  padding: '35px 39px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                }}
                className="carousel-card"
              >
                <div className="carousel-heading-container" style={{ width: `${card.textWidth}px` }}>
                  <div className="carousel-heading">{card.heading}</div>
                  <div className="carousel-subheading">{card.subheading}</div>
                </div>
                <Squircle
                  as="button"
                  cornerRadius={10}
                  cornerSmoothing={1}
                  style={{
                    display: 'flex',
                    padding: '12px 14px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    background: '#FFF',
                    border: 'none',
                    cursor: card.disabled ? 'not-allowed' : 'pointer',
                    marginTop: 20,
                    width: `${card.buttonWidth}px`,
                    opacity: card.disabled ? 0.62 : 1,
                  }}
                  onClick={card.onClick}
                  disabled={card.disabled}
                  className="carousel-btn"
                >
                  <span className="carousel-btn-text">
                    {card.button}
                  </span>
                </Squircle>
              </Squircle>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen; 
