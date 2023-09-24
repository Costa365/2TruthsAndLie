import './styles.css';
import React, { useEffect, useState } from 'react';

function Status({status}) {
  const [waitingClass, setWaitingClass] = useState('status-off');
  const [startedClass, setStartedClass] = useState('status-off');
  const [guessingClass, setGuessingClass] = useState('status-off');
  const [resultsClass, setResultsClass] = useState('status-off');

  useEffect(() => {
    switch(status) {
      case 'WAITING':
        setWaitingClass('status-on'); setStartedClass('status-off');
        setGuessingClass('status-off'); setResultsClass('status-off');
        break;
      case 'STARTED':
        setWaitingClass('status-off'); setStartedClass('status-on');
        setGuessingClass('status-off'); setResultsClass('status-off');
        break;
      case 'GUESS':
        setWaitingClass('status-off'); setStartedClass('status-off');
        setGuessingClass('status-on'); setResultsClass('status-off');
        break;
      case 'RESULTS':
        setWaitingClass('status-off'); setStartedClass('status-off');
        setGuessingClass('status-off'); setResultsClass('status-on');
        break;
    }
  }, [status]);
  
  return (
    <div className='status-div'>
      <span className={waitingClass}>Waiting For Players</span>&nbsp;&nbsp;|&nbsp;&nbsp;
      <span className={startedClass}>Players Playing</span>&nbsp;&nbsp;|&nbsp;&nbsp;
      <span className={guessingClass}>Players Guessing</span>&nbsp;&nbsp;|&nbsp;&nbsp;
      <span className={resultsClass}>Game Finished</span>
    </div>
  );
}

export default Status;