// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Button from '../Button';
import ModalPassword from '../ModalPassword';
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
    };
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new Http(url);
  }

  render() {
    const { state: { files, uploading, error } } = this;
    const { props: { url, walletList } } = this;
    return(
      <div className='Bounty-Create'>
        <ModalPassword ref={(modal) => this.modal = modal}
          url={url}
          walletList={walletList}
          onWalletChange={this.onWalletChangeHandler} />
        <div className='Container'>
          <FileList files={files}
            clear={this.onClearAll}
            removeFile={this.onFileRemoved}/>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected}/>
          {error && (
            <p className='Bounty-Create-Error'>{error}</p>
          )}
          <Button
            className='Bounty-Create-Upload'
            disabled={uploading || !files || files.length === 0 }
            onClick={this.onClickHandler}>
            {uploading && (strings.cancel)}
            {!uploading && (strings.createBounty)}
          </Button>
        </div>
      </div>
    );
  }

  onMultipleFilesSelected(files) {
    const f = this.state.files.slice();
    const combined = f.concat(files);
    this.setState({ files: combined });
  }

  onFileRemoved(index) {
    const files = this.state.files.slice();
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
      this.modal.open();
      // if (!isUnlocked) {
      //   this.modal.open();
      // } else {
      //   this.createBounty();
      // }
    }
  }

  onWalletChangeHandler(store) {
    const { props: { onWalletChange } } = this;
    if (onWalletChange) {
      onWalletChange(store);
    }
    this.createBounty();
  }

  onClearAll() {
    this.setState({ files: [], error: null, });
  }

  cancel() {
    const { http } = this;
    http.cancel();
  }

  createBounty() {
    const { props: { addBounty } } = this;
    const { state: { uploading} } = this;
    const files = this.state.files.slice();

    const http = this.http;
    if (!uploading && files && files.length > 0) {
      this.setState({uploading: true, error: null});
      http.uploadFiles(files)
        .then((artifact) => http.uploadBounty('6250000000000000000', artifact, 300))
        .then(result => {
          if (addBounty) {
            addBounty(result);
          }
        })
        .catch((error) => {
          let errorMessage;
          const { props: { onWalletChange } } = this;
          onWalletChange(false);
          if (!error || error.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
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
  isUnlocked: PropTypes.bool,
  walletList: PropTypes.array,
  onWalletChange: PropTypes.func,
  addBounty: PropTypes.func,
  url: PropTypes.string,
};
export default BountyCreate;
