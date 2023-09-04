import './styles.css';
import React, { useState } from 'react';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";

function Game() {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  let { gameid, player } = useParams();

  if(player!=null){
    useWebSocket(`ws://localhost:8000/ws/${gameid}/${player}`, {
      onOpen: () => {
        console.log('WebSocket connection established.');
      }
    });  
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

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
