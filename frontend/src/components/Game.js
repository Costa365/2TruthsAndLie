import './styles.css';
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from 'react-router-dom';
import Start from './Start';
import Header from './Header';
import Footer from './Footer';
import TtlInput from './TtlInput';
import AllPlayed from './AllPlayed';
import AllGuessed from './AllGuessed';
import GuessTtl from './GuessTtl';
import Status from './Status';
import Players from './Players';
import Results from './Results';
import spinner from '../images/spinner.gif'
import error from '../images/error.png'

function Game() {
  let { gameid, player } = useParams();
  const [players, setPlayers] = useState({});
  const [gameStatus, setGameStatus] = useState('');
  const [facilitator, setFacilitator] = useState('');
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [playersTtl, setPlayersTtl] = useState({});
  const [results, setResults] = useState({});
  const [wsStatus, setWsStatus] = useState('CONNECTING');

  const beUrl = process.env.REACT_APP_BACKEND;
  const wsUrl = process.env.REACT_APP_WSOCK;
  const feUrl = window.location.origin;

  const updatePlayerConnectionStatus = (name, online) => {
    let playersDict = players;
    if (!(name in playersDict)){
      playersDict[name]={'online':online,'played':false,'guessed':false};
    }
    else {
      playersDict[name]['online']=online;
    }
    setPlayers(playersDict);
  }

  const updatePlayerPlayedStatus = (name, played) => {
    let playersDict = players;
    playersDict[name]['played']=played;
    setPlayers(players => (playersDict));
  }

  const updatePlayerGuessedStatus = (name, guessed) => {
    let playersDict = players;
    playersDict[name]['guessed']=guessed;
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
          'online':playerStatus.players[i].online,
          'played':playerStatus.players[i].played,
          'guessed':false};
      }
    }
    setPlayers(players => (playersDict));
  }

  useEffect(() => {
    const url = `${beUrl}/game/${gameid}`;

    const fetchData = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            readPlayerStatus(json);
            setGameStatus(json.state);
            setFacilitator(json.facilitator);
            setIsFacilitator(player === json.facilitator);
            setPlayersTtl(json.playBeingGuessed);
            setResults(json);
        } catch (error) {
            console.log('Error on reading games status from API', error);
        }
    };

    fetchData();
  }, []);

  const handleStartClick = () => {
    sendJsonMessage({'action': 'start'});
  }

  const handleAllPlayedClick = () => {
    sendJsonMessage({'action': 'all_played'});
  }

  const handleAllGuessedClick = () => {
    clearPlayerGuessedStatus();
    sendJsonMessage({'action': 'all_guessed'});
  }

  const handleEvent = (event) =>  {
    const eventType = event['event'];
    let player = '';

    switch(eventType) {
      case 'connected':
        player = event['player'];
        updatePlayerConnectionStatus(player,true);
        console.log('Connected: '+player);
        break;
      case 'disconnected':
        player = event['player'];
        updatePlayerConnectionStatus(player,false);
        console.log('Disconnected: '+player);
        break;
      case 'started':
        console.log('Game Started');
        setGameStatus(gameStatus => ('STARTED'));
        break;
      case 'played':
        player = event['player'];
        updatePlayerPlayedStatus(player,true);
        console.log('Played: '+player);
        break;
      case 'guess':
        setGameStatus(gameStatus => ('GUESS'));
        clearPlayerGuessedStatus();
        setPlayersTtl(event);
        console.log(event);
        console.log('All played');
        break;
      case 'guessed':
        player = event['player'];
        updatePlayerGuessedStatus(player,true);
        console.log('Guessed: '+player);
        break;
      case 'results':
        clearPlayerGuessedStatus();
        setGameStatus(gameStatus => ('RESULTS'));
        setResults(event);
        console.log(players);
        break;
      default:
        console.log('Unknown event: ' + eventType);
    }
    return 1;
  };


  const { readyState, sendJsonMessage } = useWebSocket(`${wsUrl}/${gameid}/${player}`, {
    onOpen: () => {
      setWsStatus('CONNECTED');
      console.log('WebSocket connection established.');
    },

    onMessage: (event) => {
      const json = JSON.parse(event.data);
      console.log('WS Event: '+JSON.stringify(json)+ ', readyState='+readyState.toString());
      handleEvent(json)
    },

    onError: (error) => {
      setWsStatus('ERROR');
    }
  });  

  const handleTtlSubmit = (data) => {
    console.log('Form data submitted (handleTtlSubmit):', data);
    sendJsonMessage({
      'action': 'play',
      'truth1': data.truth1,
      'truth2': data.truth2,
      'lie': data.lie
    });
  };

  const handleGuessSubmit = (guess) => {
    sendJsonMessage({'action': 'guess', 'item': guess});
  };

  const getFacilitator = () => {
    return (
      <div className='facilitator'>
        <div className='section'>
          {(gameStatus !== 'RESULTS') ? <div>You're the facilitator. Players can join using this URL: <u>{feUrl}/join/{gameid}</u></div>: <div>You're the facilitator.</div>}
        </div>

        <div className='section'>
          {(gameStatus === 'WAITING') ? <Start onClick={handleStartClick} />:<div />}
        </div>

        <div className='section'>
          {(gameStatus === 'STARTED') ? <AllPlayed onClick={handleAllPlayedClick} />:<div />}
        </div>

        <div className='section'>
          {(gameStatus === 'GUESS') ? <AllGuessed onClick={handleAllGuessedClick} />:<div />}
        </div>
      </div>
    );
  }

  const getPage = () => {
    return(
      <span>
        <Players players={players} player={player} facilitator={facilitator} />

        <div className='section'>
          {(gameStatus === 'STARTED') ? <TtlInput onSubmit={handleTtlSubmit} />: <div />}
        </div>

        <div className='section'>
          {(gameStatus === 'GUESS') ? <GuessTtl player={player} props={playersTtl} onClick={handleGuessSubmit} />:<div />}
        </div>

        <div className='section'>
          {(gameStatus === 'RESULTS') ? <Results results={results} />:<div />}
        </div>

        {(isFacilitator && getFacilitator())}

      </span>
    );
  };

  const getError = () => {
    let errorText = 'Unable to connect to the game, please check that the URL is correct';

    if(player in players){
      errorText = 'There is already a player called {player} in the game - try a different name';
    }

    if((gameStatus === 'RESULTS')){
      errorText = 'Unable to join the game because it has finished';
    }

    return (<div className='error'><img className='error-img' src={error} alt='error' />{errorText}</div>)
  };

  return (
    <div className='App'>
      <Header />
      <Status status={gameStatus}/>
      {(wsStatus === 'CONNECTED') ? getPage() : (wsStatus === 'CONNECTING') ? <div><img src={spinner} alt='spinner' /></div> : getError()}
      <Footer />
    </div>
  );
}

export default Game;
