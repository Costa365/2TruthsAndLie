import React, { useEffect, useState } from 'react';

function GuessTtl( {onClick, props, player} ) {
  const [lie, setLie] = useState('');

  const [btnText, setBtnText] = useState('Submit Guess');

  useEffect(() => {
    setLie(props.item1);
    setBtnText('Submit Guess');
  }, [props]);
  

  const handleClick = (event) => {
    onClick(lie);
    setBtnText('Resubmit Guess');
  };

  const onChangeValue = (event) => {
    console.log('event.target.value = ' +  event.target.value)
    if (event.target.checked) {
      setLie(event.target.value);
    }
  };

  const cannotGuessOwn = () => {
    return (
      <div>
        <div className='instructions-text'>
          The other players are guessing which of your statements is a lie
        </div>
        <div className='guess-summary'>
          <ul className='guess-summary-ul'>
            <li className='guess-summary-item'>1. {props.item1}</li>
            <li className='guess-summary-item'>2. {props.item2}</li>
            <li className='guess-summary-item'>3. {props.item3}</li>
          </ul>
        </div>
      </div>)
  }

  const guess = () => {
    return (
      <div>
        <div className='instructions-text'>Guess lie of <b>{props.name}</b></div>
        <div className='guess-area'>
          <div className='guess'>
            <input
              type='radio'
              checked={lie === props.item1} 
              id='item1'
              name='item1'
              value={props.item1}
              onChange={onChangeValue}
            />
            <label htmlFor='item1'>{props.item1}</label>
          </div>
          <div className='guess'>
            <input
              type='radio'
              checked={lie === props.item2} 
              id='item2'
              name='item2'
              value={props.item2}
              onChange={onChangeValue}
            />
            <label htmlFor='item2'>{props.item2}</label>
          </div>
          <div className='guess'>
            <input
              type='radio'
              checked={lie === props.item3} 
              id='item3'
              name='item3'
              value={props.item3}
              onChange={onChangeValue}
            />
            <label htmlFor='item3'>{props.item3}</label>
          </div>
          <div className='section'>
            <button onClick={handleClick}>{btnText}</button>
          </div>
        </div>
      </div>
    );
  }

  if(player === props.name){
    return cannotGuessOwn();
  }
  else {
    return guess();
  }
}

export default GuessTtl;
