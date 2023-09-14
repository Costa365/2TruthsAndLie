import './styles.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Create() {
  const [inputText, setInputText] = useState('');
  
  let navigate = useNavigate(); 

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    const apiUrl = 'http://127.0.0.1:8000/game';
    
    axios.post(apiUrl, { type:'2 Truths And A Lie', name: inputText })
      .then((response) => {
        navigate(`/game/${response.data['id']}/${inputText}`); 
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error);
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
        <button onClick={handleButtonClick}>Create New Game</button>
      </div>

    </div>
  );
}

export default Create;
