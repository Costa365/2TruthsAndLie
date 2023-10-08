import './styles.css';
import React from 'react';

function AllGuessed({onClick}) {
  
  return (
    <div className='section'>
      <button className='admin-button' onClick={onClick}>Proceed To Next Stage</button>
    </div>
  );
}

export default AllGuessed;