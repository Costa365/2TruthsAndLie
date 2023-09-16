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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="truth1">Truth:</label>
          <input
            type="text"
            id="truth1"
            name="truth1"
            value={formData.truth1}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="truth2">Truth:</label>
          <input
            type="text"
            id="truth2"
            name="truth2"
            value={formData.truth2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="lie">Lie:</label>
          <input
            type="text"
            id="lie"
            name="lie"
            value={formData.lie}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TtlInput;
