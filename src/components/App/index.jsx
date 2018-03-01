// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import UploadButton from '../UploadButton';
// Misc
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="BountyManager hex-background">
        <p className="BountyManager-Intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <UploadButton />
      </div>
    );
  }
}

export default App;
