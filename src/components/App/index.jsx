// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
// Component imports
import config from './config';
import './styles.css';

class App extends Component {
  render() {
    const {url} = config;
    return (
      <div className='BountyManager hex-background'>
        <p className='BountyManager-Intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <BountyCreate url={url}/>
      </div>
    );
  }
}

export default App;
