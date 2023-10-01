import React, { useEffect, useState } from 'react';

function GuessTtl( {onClick, props, player} ) {
  const [lie, setLie] = useState('');

  useEffect(() => {
    setLie(props.item1);
  }, [props]);

  const handleClick = (event) => {
    onClick(lie);
  };

  const onChangeValue = (event) => {
    console.log('event.target.value = ' +  event.target.value)
    if (event.target.checked) {
      setLie(event.target.value);
    }
  };

  const cannotGuessOwn = () => {
    return (<div>The other players are guessing which of your items is a lie</div>)
  }

  const guess = () => {
    return (
      <div>
        <div>
          <div className='section'>Guess lie of {props.name}</div>
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
            
          </div>
        </div>
        <button onClick={handleClick}>Send Guess</button>

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
