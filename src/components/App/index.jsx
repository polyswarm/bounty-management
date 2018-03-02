// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import Upload from '../Upload';
// Component imports
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="BountyManager hex-background">
        <p className="BountyManager-Intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Upload />
      </div>
    );
  }

}

export default App;
