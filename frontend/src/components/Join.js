import './styles.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from './Header';

function Join() {
  const [inputText, setInputText] = useState('');
  let { gameid, player } = useParams();

  let navigate = useNavigate(); 

  useEffect(() => {
    if(player!==undefined){
      navigate(`/game/${gameid}/${player}`); 
    }
  })

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    navigate(`/game/${gameid}/${inputText}`); 
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleButtonClick();
    }
  };

  return (
    <div className="App">
      <Header />
      <div className='section'>
        <input
          type="text"
          placeholder="Enter Your Name"
          value={inputText}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
        />
        <button onClick={handleButtonClick}>Join Game</button>
      </div>

    </div>
  );
}

export default Join;
