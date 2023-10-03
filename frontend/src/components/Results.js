import './styles.css';
import React from 'react';

function Results({results}) {

  const getGuessesForItem = (name,item) => {
    let guesses = '';

    if('guesses' in results) {
      for(let i = 0; i < results['guesses'].length; i++) {
        let guess = results['guesses'][i];
        if (guess.player === name && guess.item === item){
          if(guesses !== ''){
            guesses += ', ' 
          }
          guesses += guess.guesser;
        }
      }
    }
    return guesses;
  }

  const renderResults = () => {
    let rows=[];
    let count=0;
    rows.push(
      <tr key='header'>
        <th>Player</th>
        <th>Item</th>
        <th>Play</th>
        <th>Guesses</th>
      </tr>);

    if('plays' in results) {
      for(let i = 0; i < results['plays'].length; i++) {
        let play = results['plays'][i];
        let name = play['name'];
        let truth1 = play['truth1'];
        let truth2 = play['truth2'];
        let lie = play['lie'];
        let guesses = getGuessesForItem(name,truth1);
        rows.push(
          <tr key={count}>
            <td rowSpan='3'>{name}</td>
            <td >Truth 1</td>
            <td>{truth1}</td>
            <td>{guesses}</td>
          </tr>
        );
        count++;
        guesses = getGuessesForItem(name,truth2);
        rows.push(
          <tr key={count}>
            <td>Truth 2</td>
            <td>{truth2}</td>
            <td>{guesses}</td>
          </tr>
        );
        count++;
        guesses = getGuessesForItem(name,lie);
        rows.push(
          <tr key={count}>
            <td>Lie</td>
            <td>{lie}</td>
            <td>{guesses}</td>
          </tr>
        );
        count++;
      }
    }

    return(
      <table className='center'>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      {renderResults()}
    </div>
  );
}

export default Results;