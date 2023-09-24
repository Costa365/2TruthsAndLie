import './styles.css';
import React from 'react';

function Player({name, online, played, guessed}) {
  
  return (
    <div className='player-div'>
      {name} | {online} | {played} | {guessed}
    </div>
  );
}

export default Player;