import './styles.css';
import React from 'react';
import logo from '../images/logo.png'

function Header() {
  
  return (
    <header className='App-header'>
      <a href="/"><img src={logo} className='App-logo' alt='logo' /></a>
    </header>
  );
}

export default Header;