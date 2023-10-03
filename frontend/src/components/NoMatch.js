import React, { Component } from 'react';
import Header from './Header';
import error from '../images/error.png'
import Footer from './Footer';

export default class NoMatch extends Component {
  
  render() {
    return (
      <div className='App'>
        <Header />
        <div className='error'><img className='error-img' src={error} alt='error' />Page not found - check the URL</div>
        <Footer />
      </div>
    );
  }
}