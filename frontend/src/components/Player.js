import './styles.css';
import React from 'react';
import facilitatorIcon from '../images/facilitator.png'
import connectedIcon from '../images/online.png'
import playedIcon from '../images/played.png'
import guessedIcon from '../images/guessed.png'

function Player({name, online, played, guessed, isMe, isFaciliator}) {
  return (
    <div className={isMe=='true'?'player-div-you':'player-div'}>
      {name}
      <img className={online==='Online'?'img-player-on':'img-player-off'} src={connectedIcon} alt="online" title="Connected?" />
      {isFaciliator==='true'?<img className='img-player-on' src={facilitatorIcon} alt="facilitator" title="Facilitator" /> : <span /> }
      {played==='Played'?<img className='img-player-on' src={playedIcon} alt="played" title="Submitted 2 truths and a lie" /> : <span /> }
      {guessed==='Guessed'?<img className='img-player-on' src={guessedIcon} alt="guessed" title="Submitted guess for this round" /> : <span /> }
    </div>
  )
}

export default Player;