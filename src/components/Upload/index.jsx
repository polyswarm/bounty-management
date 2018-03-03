// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
// Component imports
import './styles.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
  }

  render() {
    return(
      <div className='Upload'>
        <div className='Container'>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          <FileList />
        </div>
      </div>
    );
  }

  onMultipleFilesSelected(files) {

  }
}
export default Upload;
