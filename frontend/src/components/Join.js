import './styles.css';
import React, { useState } from 'react';
import axios from 'axios';

function Join() {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleButtonClick = () => {
    const apiUrl = 'http://127.0.0.1:8000/game';
    
    axios.post(apiUrl, { type:'2 Truths And A Lie', name: inputText })
      .then((response) => {
        alert(response.data['id']);
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
        <button onClick={handleButtonClick}>Join Game</button>
      </div>

    </div>
  );
}

export default Join;
