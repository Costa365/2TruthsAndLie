import React, { useState } from 'react';

function GuessTtl( {onClick, props} ) {
  const [lie, setLie] = useState(1);

  const handleClick = (event) => {
    console.log("selected lie = " +  lie)
    onClick({"Lie":lie});
  };

  const onChangeValue = (event) => {
    console.log("event.target.value = " +  event.target.value)
    if (event.target.checked) {
      setLie(event.target.value);
    }
  };

  return (
    <div>
      <div>
        <div>Guess lie of {props.name}</div>
        <label>
          <input type="radio" value="1" checked={lie === "1"} onChange={onChangeValue} />
          <span>{props.item1}</span>
        </label>
        <label>
          <input type="radio" value="2" checked={lie === "2"} onChange={onChangeValue} />
          <span>{props.item2}</span>
        </label>
        <label>
          <input type="radio" value="3" checked={lie === "3"} onChange={onChangeValue} />
          <span>{props.item3}</span>
        </label>
      </div>
      <button onClick={handleClick}>Send Guess</button>
    </div>
  );
}

export default GuessTtl;
