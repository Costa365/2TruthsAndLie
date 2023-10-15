import React, { useState } from 'react';

function TtlInput({ onSubmit, instructions }) {
  const [formData, setFormData] = useState({
    truth1: '',
    truth2: '',
    lie: '',
  });
  
  const [btnText, setBtnText] = useState('Submit');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setBtnText('Resubmit');
  };

  return (
    <div className='statement-area'>
      <div className='instructions-text'>
        {instructions}
      </div>
      <form onSubmit={handleSubmit}>
        <div className='statement'>
          <label htmlFor='truth1'>Truth:</label>
          <input
            type='text'
            id='truth1'
            name='truth1'
            value={formData.truth1}
            onChange={handleInputChange}
          />
        </div>
        <div className='statement'>
          <label htmlFor='truth2'>Truth:</label>
          <input
            type='text'
            id='truth2'
            name='truth2'
            value={formData.truth2}
            onChange={handleInputChange}
          />
        </div>
        <div className='statement'>
          <label htmlFor='lie'>Lie:</label>
          <input
            type='text'
            id='lie'
            name='lie'
            value={formData.lie}
            onChange={handleInputChange}
          />
        </div>
        <div className='section'>
          <button id='btnSubmit' type='submit'>{btnText}</button>
        </div>
      </form>
    </div>
  );
}

export default TtlInput;
