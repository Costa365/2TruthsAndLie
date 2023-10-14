import './styles.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Join() {
  const [inputText, setInputText] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  let { gameid, player } = useParams();

  let navigate = useNavigate(); 

  useEffect(() => {
    if(player!==undefined){
      navigate(`/game/${gameid}/${player}`); 
    }
  })

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setButtonDisabled(event.target.value.length === 0);
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
    <div className='App'>
      <Header />
      <div className='section'>
        <input
          className='name'
          type='text'
          placeholder='Enter Your Name'
          value={inputText}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
        />
        <button 
          className={buttonDisabled ? 'button-disabled' : 'button-enabled'} 
          disabled={buttonDisabled} 
          title={buttonDisabled ? 'Your name is required' : ''}
          id='button' onClick={handleButtonClick}>Join Game
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Join;
