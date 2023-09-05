import './styles.css';
import React from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";

function Game() {
  let { gameid, player } = useParams();

  if(player!=null){
    useWebSocket(`ws://localhost:8000/ws/${gameid}/${player}`, {
      onOpen: () => {
        console.log('WebSocket connection established.');
      }
    });  
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>2 Truths And A Lie</p>
      </header>

      <h1>{player}</h1>

      <div>
        This is the game
      </div>

    </div>
  );
}

export default Game;
