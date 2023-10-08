import './styles.css';
import React from 'react';

function AllPlayed({onClick}) {
  
  return (
    <div className='section'>
      <button className='admin-button' onClick={onClick}>Proceed To Next Stage</button>
    </div>
  );
}

export default AllPlayed;