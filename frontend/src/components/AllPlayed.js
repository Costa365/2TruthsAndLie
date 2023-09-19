import './styles.css';
import React from 'react';

function AllPlayed({onClick}) {
  
  return (
    <div className='section'>
      <button onClick={onClick}>All Played</button>
    </div>
  );
}

export default AllPlayed;