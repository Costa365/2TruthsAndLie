import './styles.css';
import React from 'react';

function AllGuessed({onClick}) {
  
  return (
    <div className='section'>
      <button onClick={onClick}>All Guessed</button>
    </div>
  );
}

export default AllGuessed;