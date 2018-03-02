// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import DropTarget from '../DropTarget';
import FileButton from '../FileButton';
// Component imports
import './styles.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
  }

  render() {
    return(
      <div className='Upload'>
        <div className='Upload-Form'>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          <FileButton onFileSelected={this.onFileSelected}/>
        </div>
      </div>
    );
  }

  onFileSelected(file) {
    this.onMultipleFilesSelected([file]);
  }

  onMultipleFilesSelected(files) {

  }
}
export default Upload;
