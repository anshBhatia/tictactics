import React, { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      {message}
    </div>
  );
};

export default Toast; 