import React, { Component } from 'react';
import Header from './Header';

export default class NoMatch extends Component {
  
  render() {
    return (
      <div className='App'>
        <Header />
          <div>Page not found - check the URL</div>
      </div>
    );
  }
}