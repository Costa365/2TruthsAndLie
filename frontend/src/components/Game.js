import './styles.css';
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";

function Game() {
  let { gameid, player } = useParams();
  const [players, setPlayers] = useState({});
  const [gameStatus, setGameStatus] = useState("");


  const updatePlayerStatus = (name, online) => {
    let playersDict = players;
    playersDict[name]=online;
    setPlayers(players => (playersDict));
  }

  const readPlayerStatus = (playerStatus) => {
    let playersDict = {}
    if(playerStatus.players!==undefined){
      for (let i = 0, len = playerStatus.players.length; i < len; i++) {
        playersDict[playerStatus.players[i].name]=playerStatus.players[i].online;
      }
    }
    setPlayers(players => (playersDict));
  }
  

  useEffect(() => {
    const url = `http://localhost:8000/game/${gameid}`;

    const fetchData = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            readPlayerStatus(json);
            setGameStatus(gameStatus => (json.state));
        } catch (error) {
            console.log("Error on reading games status from API", error);
        }
    };

    fetchData();
  }, []);

  const renderPlayers = () =>  {
    let playerList=[];    
    for (let player in players) {
      let status = players[player]?"Online":"Offline";
      playerList.push(<li key={player}>{player} ({status})</li>);
    }
    return playerList;
  };

  const handleEvent = (event) =>  {
    const eventType = event["event"];
    let player = "";

    switch(eventType) {
      case "connected":
        player = event["player"];
        updatePlayerStatus(player,true);
        console.log("Connected: "+player);
        break;
      case "disconnected":
        player = event["player"];
        updatePlayerStatus(player,false);
        console.log("Connected: "+player);
        break;
      case "started":
        console.log("Game Started");
        setGameStatus(gameStatus => ("GAME_STARTED"));
        break;
      case "played":
        
        break;
      case "guess":
        setGameStatus(gameStatus => ("GAME_VOTE"));
        
        break;
      case "guessed":
        
        break;
      case "results":
        
        break;
      default:
        console.log("Unknown event: " + eventType);
    }
    return 1;
  };

  if(player!=null){
    useWebSocket(`ws://localhost:8000/ws/${gameid}/${player}`, {
      onOpen: () => {
        console.log('WebSocket connection established.');
      },

      onMessage: (event) => {
        const json = JSON.parse(event.data);
        console.log('WS Event: '+JSON.stringify(json));
        handleEvent(json)
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
