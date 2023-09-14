import './styles.css';
import React from 'react';

function Start({onClick }) {
  
  return (
    <div>
      <button onClick={onClick}>Start Game</button>
    </div>
  );
}

export default Start;