import './styles.css';
import React from 'react';

function Player({name, online, played, guessed, isMe, isFaciliator}) {
  
  return (
    <div className='player-div'>
      {name} ({isMe}) ({isFaciliator}) | {online} | {played} | {guessed}
    </div>
  );
}

export default Player;