import React from 'react';

const CREATOR_URL = 'https://x.com/anshpng';
const FEEDBACK_EMAIL = 'mailto:anshbhatia.png@gmail.com';

export function OnlineWordmark({ showTagline = true, compact = false }) {
  return (
    <div className={`online-wordmark ${compact ? 'online-wordmark--compact' : ''}`}>
      <div className="online-wordmark__title">
        <span className="online-wordmark__xo">XO</span>
        <span className="online-wordmark__down">DOWN</span>
      </div>
      {showTagline && (
        <p className="online-wordmark__tagline">
          A tic tac toe game that can never end in a draw
        </p>
      )}
    </div>
  );
}

export function OnlineMetaBar({ variant = 'rich', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`online-meta online-meta--compact ${className}`.trim()}>
        <a
          className="online-meta__text-link"
          href={CREATOR_URL}
          target="_blank"
          rel="noreferrer"
        >
          by @ansh.png
          <span className="material-symbols-rounded" aria-hidden="true">arrow_outward</span>
        </a>
        <a className="online-meta__text-link" href={FEEDBACK_EMAIL}>
          <span className="material-symbols-rounded">add_comment</span>
          Give Feedback
        </a>
      </div>
    );
  }

  return (
    <div className={`online-meta online-meta--rich ${className}`.trim()}>
      <a className="online-meta__icon-button" href={FEEDBACK_EMAIL} aria-label="Feedback">
        <span className="material-symbols-rounded">add_comment</span>
      </a>
      <a
        className="online-meta__pill"
        href={CREATOR_URL}
        target="_blank"
        rel="noreferrer"
      >
        <span className="online-meta__pill-label">Created by:</span>
        <span className="online-meta__pill-handle">@ansh.png</span>
        <span className="material-symbols-rounded online-meta__pill-link" aria-hidden="true">arrow_outward</span>
      </a>
    </div>
  );
}
