import './styles.css';
import React from 'react';

function AllPlayed({onClick}) {
  
  return (
    <div>
      <button onClick={onClick}>All Played</button>
    </div>
  );
}

export default AllPlayed;