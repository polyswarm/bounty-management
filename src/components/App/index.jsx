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
        <BountyCreate url={url}/>
      </div>
    );
  }
}

export default App;
