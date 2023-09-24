import './styles.css';
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";
import Start from './Start';
import Header from './Header';
import TtlInput from './TtlInput';
import AllPlayed from './AllPlayed';
import AllGuessed from './AllGuessed';
import GuessTtl from './GuessTtl';
import Status from './Status';

function Game() {
  let { gameid, player } = useParams();
  const [players, setPlayers] = useState({});
  const [gameStatus, setGameStatus] = useState("");
  const [facilitator, setFacilitator] = useState("");
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [playersTtl, setPlayersTtl] = useState({});

  const updatePlayerConnectionStatus = (name, online) => {
    let playersDict = players;
    if (!(name in playersDict)){
      playersDict[name]={"online":online,"played":false,"guessed":false};
    }
    else {
      playersDict[name]["online"]=online;
    }
    setPlayers(playersDict);
  }

  const updatePlayerPlayedStatus = (name, played) => {
    let playersDict = players;
    playersDict[name]["played"]=played;
    setPlayers(players => (playersDict));
  }

  const updatePlayerGuessedStatus = (name, guessed) => {
    let playersDict = players;
    playersDict[name]["guessed"]=guessed;
    setPlayers(players => (playersDict));
  }

  const clearPlayerGuessedStatus = (name, guessed) => {
    let playersDict = players;
    for (let key in playersDict){
      playersDict[key].guessed = false;
    }
    setPlayers(players => (playersDict));
  }


  const readPlayerStatus = (playerStatus) => {
    let playersDict = {}
    if(playerStatus.players!==undefined){
      for (let i = 0, len = playerStatus.players.length; i < len; i++) {
        playersDict[playerStatus.players[i].name]={
          "online":playerStatus.players[i].online,
          "played":playerStatus.players[i].played,
          "guessed":false};
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
            setGameStatus(json.state);
            setFacilitator(json.facilitator);
            setIsFacilitator(player === json.facilitator);
            setPlayersTtl(json.playBeingGuessed)
        } catch (error) {
            console.log("Error on reading games status from API", error);
        }
    };

    fetchData();
  }, []);

  const renderPlayers = () => {
    let playerList=[];    
    for (let playerName in players) {
      let status = players[playerName]["online"]?"Online":"Offline";
      if(playerName === facilitator){
        status += "⚙️"
      }
      let played = players[playerName]["played"]?"Played":"";
      let guessed = players[playerName]["guessed"]?"Guessed":"";
      if(player===playerName){
        playerList.push(<li key={playerName}><b>{playerName}</b> ({status}) {played} {guessed}</li>);
      }
      else{
        playerList.push(<li key={playerName}>{playerName} ({status}) {played} {guessed}</li>);
      }
    }
    return playerList;
  };

  const handleStartClick = () => {
    sendJsonMessage({"action": "start"});
  }

  const handleAllPlayedClick = () => {
    sendJsonMessage({"action": "all_played"});
  }

  const handleAllGuessedClick = () => {
    clearPlayerGuessedStatus();
    sendJsonMessage({"action": "all_guessed"});
  }

  const handleEvent = (event) =>  {
    const eventType = event["event"];
    let player = "";

    switch(eventType) {
      case "connected":
        player = event["player"];
        updatePlayerConnectionStatus(player,true);
        console.log("Connected: "+player);
        break;
      case "disconnected":
        player = event["player"];
        updatePlayerConnectionStatus(player,false);
        console.log("Connected: "+player);
        break;
      case "started":
        console.log("Game Started");
        setGameStatus(gameStatus => ("STARTED"));
        break;
      case "played":
        player = event["player"];
        updatePlayerPlayedStatus(player,true);
        console.log("Played: "+player);
        break;
      case "guess":
        setGameStatus(gameStatus => ("GUESS"));
        clearPlayerGuessedStatus();
        setPlayersTtl(event);
        console.log(event);
        console.log("All played");
        break;
      case "guessed":
        player = event["player"];
        updatePlayerGuessedStatus(player,true);
        console.log("Guessed: "+player);
        break;
      case "results":
        clearPlayerGuessedStatus();
        setGameStatus(gameStatus => ("RESULTS"));
        //{"event":"results","plays":[{"name":"Bob","truth1":"hkjhjhkjh","truth2":"hgfhgfhgfhgf","lie":"utuytytyut"},{"name":"Nick","truth1":"hjgjhgjhgjhg","truth2":"nvnhjhjh","lie":"nnbnvnbvnbvb"}],"guesses":[{"guesser":"Bob","player":"Nick","item":2},{"guesser":"Bob","player":"Bob","item":3},{"guesser":"Nick","player":"Nick","item":3},{"guesser":"Nick","player":"Bob","item":2}]}, 
        console.log(players);
        break;
      default:
        console.log("Unknown event: " + eventType);
    }
    return 1;
  };


  const { readyState, sendJsonMessage } = useWebSocket(`ws://localhost:8000/ws/${gameid}/${player}`, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },

    onMessage: (event) => {
      const json = JSON.parse(event.data);
      console.log('WS Event: '+JSON.stringify(json)+ ", readyState="+readyState.toString());
      handleEvent(json)
    }
    
  });  

  const handleTtlSubmit = (data) => {
    console.log('Form data submitted (handleTtlSubmit):', data);
    sendJsonMessage({
      "action": "play",
      "truth1": data.truth1,
      "truth2": data.truth2,
      "lie": data.lie
    });
  };

  const handleGuessSubmit = (guess) => {
    sendJsonMessage({"action": "guess", "item": guess});
  };

  return (
    <div className="App">
      <Header />
      <Status status={gameStatus}/>

      <div>
        <h2>Players</h2>
        <div className='parent'>
        <ul>
        {renderPlayers()}
        </ul>
        </div>
      </div>

      <div className='section'>
        {(gameStatus === 'STARTED') ? <TtlInput onSubmit={handleTtlSubmit} />: <div />}
      </div>

      <div className='section'>
        {(gameStatus === 'GUESS') ? <GuessTtl player={player} props={playersTtl} onClick={handleGuessSubmit} />:<div />}
      </div>

      <div className='facilitator'>
        <div className='section'>
          {isFacilitator ? <div>You're the facilitator. Players can join using this URL: <u>http://localhost:3000/join/{gameid}</u></div>: <div />}
        </div>

        <div className='section'>
          {(isFacilitator && (gameStatus === 'WAITING')) ? <Start onClick={handleStartClick} />:<div />}
        </div>

        <div className='section'>
          {(isFacilitator && (gameStatus === 'STARTED')) ? <AllPlayed onClick={handleAllPlayedClick} />:<div />}
        </div>

        <div className='section'>
          {(isFacilitator && (gameStatus === 'GUESS')) ? <AllGuessed onClick={handleAllGuessedClick} />:<div />}
        </div>
      </div>

    </div>
  );
}

export default Game;
