import React, { useState } from 'react';

function TtlInput({ onSubmit }) {
  const [formData, setFormData] = useState({
    truth1: '',
    truth2: '',
    lie: '',
  });

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
  };

  return (
    <div className='statements'>
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
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default TtlInput;
