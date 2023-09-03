import React, { Component } from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Create from "./Create";
import Join from "./Join";
import NoMatch from "./NoMatch";
import './styles.css';


export default class App extends Component {

  constructor(props) {
    super(props);
    
    this.Comp =
        <div>
          <Routes>
            <Route exact path='/' element={ <Create/> } />
            <Route path='/join' element={ <Join/> } />
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