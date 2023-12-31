import './styles.css';
import React from 'react';

function Results({results}) {
  let scores = {};

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
        <th>Statement</th>
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
        guesses.split(", ").forEach(function (name) {
          if (name.length>0){
            if (!(name in scores)){
              scores[name]=0;
            }
            scores[name]++;
          }
        });
        count++;
      }
    }

    return(
      <div>
        <h3>Results</h3>
        <table className='results'>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

  const renderRankings = () => {
    let players = [];
    if (Object.keys(scores).length === 0){
      return(
        <div>
          <h3>Rankings</h3>
          <div>No players guessed correctly</div>
        </div>
      );
    }
    else {
      let items = Object.keys(scores).map(function(key) {
        return [key, scores[key]];
      });
      items.sort(function(first, second) {
        return second[1] - first[1];
      });
      for (var i = 0; i < items.length; i++) {
        players.push(
          <li className='summary-item' key={i.toString()}>
            {items[i][0]} (Correct Guesses: {items[i][1]})
          </li>
        );
      }
      return(
        <div className='summary'>
          <h3>Rankings</h3>
          <ol className='summary-ul'>
            {players}
          </ol>
        </div>
      );
    }
  }

  return (
    <div>
      {renderResults()}
      {renderRankings()}
    </div>
  );
}

export default Results;