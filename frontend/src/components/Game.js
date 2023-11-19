import './styles.css';
import React, { useState, useEffect } from 'react';
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
  const {gameid, player} = useParams();
  const [players, setPlayers] = useState({});
  const [gameStatus, setGameStatus] = useState('');
  const [facilitator, setFacilitator] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [playersTtl, setPlayersTtl] = useState({});
  const [results, setResults] = useState({});
  const [wsStatus, setWsStatus] = useState('CONNECTING');
  const [allDone, setAllDone] = useState(false);

  const beUrl = process.env.REACT_APP_BACKEND;
  const wsUrl = process.env.REACT_APP_WSOCK;
  const feUrl = window.location.origin;

  useEffect(() => {
    readGameStatus();
  }, []);

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

  const readGameStatus = () => {
        const url = `${beUrl}/game/${gameid}`;
    const fetchData = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            readPlayerStatus(json);
            setGameStatus(json.state);
            setFacilitator(json.facilitator);
            setInstructions(json.instructions);
            setIsFacilitator(player === json.facilitator);
            setPlayersTtl(json.playBeingGuessed);
            setResults(json);
        } catch (error) {
            console.log('Error on reading games status from API', error);
        }
    };
    fetchData();
  }

  const handleStartClick = () => {
    sendJsonMessage({'action': 'start'});
  }

  const handleAllPlayedClick = () => {
    setAllDone(false);
    sendJsonMessage({'action': 'proceed_from_play'});
  }

  const handleAllGuessedClick = () => {
    clearPlayerGuessedStatus();
    sendJsonMessage({'action': 'proceed_from_guess'});
  }

  const handleEvent = (event) =>  {
    const eventType = event['event'];
    let playerName = '';

    switch(eventType) {
      case 'connected':
        playerName = event['player'];
        updatePlayerConnectionStatus(playerName,true);
        if(playerName === player){
          readGameStatus();
        }
        console.log('Connected: '+playerName);
        break;
      case 'disconnected':
        playerName = event['player'];
        updatePlayerConnectionStatus(playerName,false);
        console.log('Disconnected: '+playerName);
        break;
      case 'started':
        console.log('Game Started');
        setGameStatus(gameStatus => ('STARTED'));
        break;
      case 'played':
        playerName = event['player'];
        updatePlayerPlayedStatus(playerName,true);
        console.log('Played: '+playerName);
        break;
      case 'all_played':
        console.log('All players have submitted 2 truths and a lie'); 
        if (isFacilitator){
          setAllDone(true);
        }
        break;
      case 'guess':
        setGameStatus(gameStatus => ('GUESS'));
        clearPlayerGuessedStatus();
        setPlayersTtl(event);
        setAllDone(false);
        console.log(event);
        console.log('Entered the GUESS state');
        break;
      case 'guessed':
        playerName = event['player'];
        updatePlayerGuessedStatus(playerName,true);
        console.log('Guessed: '+playerName);
        break;
      case 'all_guessed':
        console.log('All players have guessed'); 
        if (isFacilitator){
          setAllDone(true);
        }
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
    },

    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    // attemptNumber will be 0 the first time it attempts to reconnect, so this equation 
    // results in a reconnect pattern of 1 second, 2 seconds, 4 seconds, 8 seconds, and 
    // then caps at 10 seconds until the maximum number of attempts is reached
    reconnectInterval: (attemptNumber) =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),

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
          {(gameStatus !== 'RESULTS') ? <div className='facilitator-text'>You're the facilitator. Players can join using this URL: <u>{feUrl}/join/{gameid}</u> </div>: <div>You're the facilitator.</div>}
          {(gameStatus === 'WAITING') ? <div className='facilitator-text'>When all the players have joined, click "Start Game".</div>: <div />}
        </div>

        <div className='section'>
          {(gameStatus === 'WAITING') ? <Start onClick={handleStartClick} />:<div />}
        </div>

        <div className='section'>
          {(gameStatus === 'STARTED' && allDone) ? <div className='facilitator-info'>All players have submitted 2 truths and a lie. Ready for next stage.</div> : <div />}
          {(gameStatus === 'STARTED') ? <AllPlayed onClick={handleAllPlayedClick} />:<div />}
        </div>

        <div className='section'>
          {(gameStatus === 'GUESS' && allDone) ? <div className='facilitator-info'>All players have submitted their guesses</div> : <div />}
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
          {(gameStatus === 'WAITING') ? <div>
            
            <div className='player-instructions'> 
              When all the players have joined, {facilitator} will start the game.
              You'll then be able to submit 3 statements: two truths and a lie. When all players have submitted their
              statements, the faciliator when move the game to the next stage, where you'll vote for which of the 
              other players' statements you think is a lie. Finally, we'll see which of the statements were false
              and the players' guesses.
            </div>

            <div className='player-instructions'> 
              Player statuses are shown at the top of the game page, so everyone can see who is online and who has 
              submitted their statements and guesses.
            </div>

             </div>: <div />}
        </div>

        <div className='section'>
          {(gameStatus === 'STARTED') ? <TtlInput onSubmit={handleTtlSubmit} instructions={instructions} />: <div />}
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
      errorText = `There is already a player called ${player} in the game - try a different name`;
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
