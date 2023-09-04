import React, { Component } from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Create from "./Create";
import Join from "./Join";
import Game from "./Game";
import NoMatch from "./NoMatch";
import './styles.css';


export default class App extends Component {

  constructor(props) {
    super(props);
    
    this.Comp =
        <div>
          <Routes>
            <Route exact path='/' element={ <Create/> } />
            <Route exact path="/join/:gameid/:player?" element={ <Join/> } />
            <Route exact path="/game/:gameid/:player" element={ <Game/> } />
            <Route element={ <NoMatch/> } />
          </Routes>
        </div>
  }

  render() {
    return (
      <Router>
      <div className="container styles-main">
        {this.Comp}
      </div>
      </Router>
    );
  }
}