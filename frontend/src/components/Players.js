import './styles.css';
import React from 'react';
import Player from './Player';

function Players({players, player, facilitator}) {

  const renderPlayers = () => {
    let playerList=[];    
    for (let playerName in players) {
      let status = players[playerName]["online"]?"Online":"Offline";
      if(playerName === facilitator){
        status += "⚙️"
      }
      let played = players[playerName]["played"]?"Played":"";
      let guessed = players[playerName]["guessed"]?"Guessed":"";
      if(player===playerName){
        playerList.push(<Player key={playerName} name={playerName} online={status} played={played} guessed={guessed}></Player>);
        //playerList.push(<li key={playerName}><b>{playerName}</b> ({status}) {played} {guessed}</li>);
      }
      else{
        playerList.push(<Player key={playerName} name={playerName} online={status} played={played} guessed={guessed}></Player>);
        //playerList.push(<li key={playerName}>{playerName} ({status}) {played} {guessed}</li>);
      }
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