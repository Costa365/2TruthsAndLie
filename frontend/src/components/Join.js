import './styles.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';
import { useParams, useNavigate } from "react-router-dom";

function Join() {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  let { gameid, player } = useParams();

  let navigate = useNavigate(); 

  useEffect(() => {
    if(player!=undefined){
      navigate(`/game/${gameid}/${player}`); 
    }
  })
  
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    navigate(`/game/${gameid}/${inputText}`); 
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
