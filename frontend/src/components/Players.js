import './styles.css';
import React from 'react';
import Player from './Player';

function Players({players, player, facilitator}) {

  const renderPlayers = () => {
    let playerList=[];    
    for (let playerName in players) {
      let status = players[playerName]["online"]?"Online":"Offline";
      let isFaciliator = (playerName === facilitator);
      let played = players[playerName]["played"]?"Played":"";
      let guessed = players[playerName]["guessed"]?"Guessed":"";
      let isMe = (player===playerName);
      playerList.push(<Player key={playerName} 
        name={playerName} online={status} 
        played={played} guessed={guessed} 
        isMe={isMe.toString()} 
        isFaciliator={isFaciliator.toString()}></Player>);
    }
    return playerList;
  };
  
  return (
    <div className='players-div'>
      {renderPlayers()}
    </div>
  );
}

export default Players;