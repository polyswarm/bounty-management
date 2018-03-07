// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Button from '../Button';
// Component imports
import strings from './strings';
import './styles.css';
import Http from './http';

class BountyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
    };
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
  }

  render() {
    const { state: { files, uploading }, props: { url } } = this;
    return(
      <div className='Bounty-Create'>
        <div className='Container'>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          <FileList files={files}
            removeFile={this.onFileRemoved}/>
          <Button
            disabled={!url || !files || files.length === 0 || uploading}
            onClick={this.onCreateBounty}>{strings.createBounty}</Button>
        </div>
      </div>
    );
  }

  onMultipleFilesSelected(files) {
    const { state: { files: f } } = this;
    const combined = f.concat(files);
    this.setState({ files: combined });
  }

  onFileRemoved(index) {
    const { state: { files } } = this;
    if (index > 0 && index < files.length) {
      files.splice(index, 1);
      this.setState({ files: files });
    }
  }

  onCreateBounty() {
    const {
      props: { url, trackBounty },
      state: {files, uploading}
    } = this;

    const http = new Http(url);
    if (url && trackBounty && !uploading && files && files.length > 0) {
      this.setState({uploading: true});
      http.uploadFiles(files)
        .then((artifacts) => http.uploadBounty(10, artifacts, 300))
        .then(guid => {
          trackBounty(guid);
        })
        .catch(() => {})
        .then(() => this.setState({uploading: false}));
    }
  }
}

BountyCreate.propTypes = {
  url: PropTypes.string,
  trackBounty: PropTypes.func,
};
export default BountyCreate;
