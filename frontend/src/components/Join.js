import './styles.css';
import React, { useState } from 'react';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";

function Join() {
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

  const handleButtonClick = () => {
    // THROW'S AN EXCEPTION. CAN ONLY BE DONE IN CTR
    useWebSocket(`ws://localhost:8000/ws/${gameid}/${inputText}`, {
      onOpen: () => {
        console.log('WebSocket connection established.');
      }
    }); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>2 Truths And A Lie</p>
      </header>

      <div>
        <input
          type="text"
          placeholder="Enter Name"
          value={inputText}
          onChange={handleInputChange}
        />
        <button onClick={handleButtonClick}>Join Game</button>
      </div>

    </div>
  );
}

export default Join;
