// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Button from '../Button';
import Progressbar from '../Progressbar';
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
      error: null,
      progress: 0,
    };
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new Http(url);
  }

  render() {
    const { state: { files, uploading, error, progress }, props: { url } } = this;
    return(
      <div className='Bounty-Create'>
        <div className='Container'>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          <FileList files={files}
            removeFile={this.onFileRemoved}/>
          {uploading && !error && (
            <Progressbar progress={progress}/>
          )}
          {error && (
            <p className='Bounty-Create-Error'>{error}</p>
          )}
          <Button
            cancel={uploading}
            className='Bounty-Create-Upload'
            disabled={!url || !files || files.length === 0 }
            onClick={this.onClickHandler}>
            {uploading && (strings.cancel)}
            {!uploading && (strings.createBounty)}
          </Button>
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
    if (index >= 0 && index < files.length) {
      files.splice(index, 1);
      this.setState({ files: files, error: null, });
    }
  }

  onClickHandler() {
    const { state: { uploading } } = this;
    if (uploading) {
      this.cancel();
    } else {
      this.createBounty();
    }
  }

  cancel() {
    const { http } = this;
    http.cancel();
  }

  createBounty() {
    const {
      props: { url, trackBounty },
      state: {files, uploading}
    } = this;

    const http = this.http;
    if (url && !uploading && files && files.length > 0) {
      this.setState({uploading: true, error: null});
      http.uploadFiles(files)
        .then((artifacts) => http.uploadBounty(10, artifacts, 300))
        .then(guid => {
          if (trackBounty) {
            trackBounty(guid);
          }
        })
        .catch((error) => {
          let errorMessage;
          if (!error || error.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error;
          }
          this.setState({error: errorMessage});
        })
        .then(() => this.setState({
          uploading: false,
        }));
    }
  }
}

BountyCreate.propTypes = {
  url: PropTypes.string,
  trackBounty: PropTypes.func,
};
export default BountyCreate;
