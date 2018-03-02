// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import DropTarget from '../DropTarget';
import FileButton from '../FileButton';
// Misc
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
  }

  render() {
    return (
      <div className="BountyManager hex-background">
        <p className="BountyManager-Intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
        <FileButton onFileSelected={this.onFileSelected}/>
      </div>
    );
  }

  onFileSelected(file) {
    this.onMultipleFilesSelected([file]);
  }

  onMultipleFilesSelected(files) {

  }
}

export default App;
