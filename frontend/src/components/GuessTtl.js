import React, { useEffect, useState } from 'react';

function GuessTtl( {onClick, props, player} ) {
  const [lie, setLie] = useState(1);

  useEffect(() => {
    setLie(1);
  }, [props]);

  const handleClick = (event) => {
    console.log("selected lie = " +  lie)
    onClick(lie);
  };

  const onChangeValue = (event) => {
    console.log("event.target.value = " +  event.target.value)
    if (event.target.checked) {
      setLie(parseInt(event.target.value));
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
          <table><tbody>
          <tr><th><input type="radio" value="1" checked={lie === 1} onChange={onChangeValue} /><span>{props.item1}</span></th></tr>
          <tr><th><input type="radio" value="2" checked={lie === 2} onChange={onChangeValue} /><span>{props.item2}</span></th></tr>
          <tr><th><input type="radio" value="3" checked={lie === 3} onChange={onChangeValue} /><span>{props.item3}</span></th></tr>
          </tbody></table>
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
