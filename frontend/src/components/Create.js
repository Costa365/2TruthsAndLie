import './styles.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

function Create() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('Share 3 things about yourself: 2 truths and 1 lie, then click "Submit"');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  let navigate = useNavigate(); 

  const beUrl = process.env.REACT_APP_BACKEND;

  const handleNameChange = (event) => {
    setName(event.target.value);
    setButtonDisabled(event.target.value.length === 0);
  };

  const handleInstructionsChange = (event) => {
    setInstructions(event.target.value);
  };

  const handleButtonClick = () => {
    const apiUrl = `${beUrl}/game`;
    
    axios.post(apiUrl, { type:'2 Truths And A Lie', name: name, instructions })
      .then((response) => {
        navigate(`/game/${response.data['id']}/${name}`); 
      })
      .catch((error) => {
        console.error('Error sending data to the API:', error);
      });
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      handleButtonClick();
    }
  };

  return (
    <div className='App'>
      <Header />
      <div>
        <div className='player-instructions'>
          "2 Truths and a Lie" makes team-building fun for remote teams. By sharing three statements, team 
          members spark conversations, building understanding and camaraderie virtually. It encourages 
          interaction, curiosity, and laughter, creating a more cohesive remote team environment. It's a simple 
          yet effective way to connect people across distances and strengthen the bonds within a team.
        </div>
        <div className='player-instructions'>
          Enter your name, edit the instructions if required and then click "Create New Game". You are now the
          the facilitator and can invite players by copying the URL and sharing it with the players, who can then 
          enter their name and join the game.
        </div>
      </div>
      <div className='section'>
        <input
          id='name'
          autoComplete = 'false'
          className='name'
          type='text'
          placeholder='Enter Your Name'
          value={name}
          onChange={handleNameChange}
          onKeyUp={handleKeyUp}
        />
        <button 
          className={buttonDisabled ? 'button-disabled' : 'button-enabled'} 
          disabled={buttonDisabled} 
          title={buttonDisabled ? 'Your name is required' : ''}
          id='button' onClick={handleButtonClick}>Create New Game
        </button>
        <div className='instructions-div'>
          <div className='instructions-text'>Instructions:</div>
          <input
            id='instructions'
            autoComplete = 'false'
            className='instructions'
            type='text'
            placeholder='Enter Game Instructions'
            value={instructions}
            onChange={handleInstructionsChange}
            onKeyUp={handleKeyUp}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Create;
