import './styles.css';
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";

function Game() {
  let { gameid, player } = useParams();
  const [gameStatus, setGameStatus] = useState({});


  useEffect(() => {
    const url = `http://localhost:8000/game/${gameid}`;

    const fetchData = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setGameStatus(gameStatus => (json));
        } catch (error) {
            console.log("Error on reading games status from API", error);
        }
    };

    fetchData();
  }, []);

  const renderPlayers = () =>  {
    let playerList1=[]
    if(gameStatus.players!==undefined){
      for (let i = 0, len = gameStatus.players.length; i < len; i++) {
        let status = gameStatus.players[i].online?"Online":"Offline";
        playerList1.push(<li key={i}>{gameStatus.players[i].name} ({status})</li>);
      }
    }
    return playerList1
  };

  if(player!=null){
    useWebSocket(`ws://localhost:8000/ws/${gameid}/${player}`, {
      onOpen: () => {
        console.log('WebSocket connection established.');
      },

      onMessage: (event) => {
        const json = JSON.parse(event.data);
        console.log('WS Event: '+JSON.stringify(json));

        // Create handleEvent method - thisSession.hasOwnProperty('merchant_id')
      }
      
    });  
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>2 Truths And A Lie</p>
      </header>

      <h1>{player}</h1>
      <div>
        Game Status: {gameStatus.state}
      </div>

      <div>
        Players: 
        <ul>
        {renderPlayers()}
        </ul>
      </div>

    </div>
  );
}

export default Game;
