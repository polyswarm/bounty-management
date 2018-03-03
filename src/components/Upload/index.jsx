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
    this.state = {
      files: [],
    };
  }

  render() {
    const { state: { files } } = this;
    return(
      <div className='Upload'>
        <div className='Container'>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          <FileList files={files}/>
        </div>
      </div>
    );
  }

  onMultipleFilesSelected(files) {
    const { state: { files: f } } = this;
    const combined = f.concat(files)
    this.setState({ files: combined });
  }
}
export default Upload;
