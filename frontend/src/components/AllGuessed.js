import './styles.css';
import React from 'react';

function AllGuessed({onClick}) {
  
  return (
    <div>
      <button onClick={onClick}>All Guessed</button>
    </div>
  );
}

export default AllGuessed;