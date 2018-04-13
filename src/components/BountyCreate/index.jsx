// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uuid from 'uuid/v4';
// Bounty imports
import DropTarget from '../DropTarget';
import FileList from '../FileList';
import Button from '../Button';
import ModalPassword from '../ModalPassword';
// Component imports
import strings from './strings';
import Http from './http';

class BountyCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      error: null
    };
    this.onMultipleFilesSelected = this.onMultipleFilesSelected.bind(this);
    this.onFileRemoved = this.onFileRemoved.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClearAll = this.onClearAll.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.addCreateBountyRequest = this.addCreateBountyRequest.bind(this);
    this.removeCreateBountyRequest = this.removeCreateBountyRequest.bind(this);
  }

  componentDidMount() {
    const { props: { url } } = this;
    this.http = new Http(url);
  }

  render() {
    const { state: { files, error } } = this;
    const { props: { url, walletList, addRequest, removeRequest } } = this;
    return (
      <div className='Bounty-Create'>
        <ModalPassword
          ref={modal => (this.modal = modal)}
          url={url}
          walletList={walletList}
          onWalletChange={this.onWalletChangeHandler}
          addRequest={addRequest}
          removeRequest={removeRequest}/>
        <div className='Container'>
          <FileList
            files={files}
            clear={this.onClearAll}
            removeFile={this.onFileRemoved}/>
          <DropTarget onFilesSelected={this.onMultipleFilesSelected} />
          {error && <p className='Bounty-Create-Error'>{error}</p>}
          <Button
            className='Bounty-Create-Upload'
            disabled={!files || files.length === 0}
            onClick={this.onClickHandler}>
            {strings.createBounty}
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
      this.setState({ files: files, error: null });
    }
  }

  onClickHandler() {
    this.modal.open();
  }

  onWalletChangeHandler(didUnlock, store) {
    const { props: { onWalletChange } } = this;
    if (onWalletChange) {
      onWalletChange(store);
    }
    if (didUnlock) {
      this.createBounty();
    }
  }

  onClearAll() {
    this.setState({ files: [], error: null });
  }

  cancel() {
    const { http } = this;
    http.cancel();
  }

  createBounty() {
    const { props: { addBounty } } = this;
    const files = this.state.files.slice();

    const http = this.http;
    if (files && files.length > 0) {
      const uuid = Uuid();
      this.addCreateBountyRequest(uuid);
      this.setState({ files: [], error: null });
      return http.uploadFiles(files)
        .then(artifact =>
          http.uploadBounty('62500000000000000', artifact, 300)
        )
        .then(result => {
          if (addBounty) {
            addBounty(result);
          }
        })
        .catch(error => {
          let errorMessage;
          if (!error || !error.message || error.message.length === 0) {
            errorMessage = strings.error;
          } else {
            errorMessage = error.message;
          }
          this.setState({ error: errorMessage });

          //Update app
          const { props: { onWalletChange, onError } } = this;
          if (onWalletChange) {
            onWalletChange(false);
          }
          if (onError) {
            onError(errorMessage);
          }
        })
        .then(() => {
          this.removeCreateBountyRequest(uuid);
        });
    } else {
      return null;
    }
  }

  addCreateBountyRequest(id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(strings.requestCreateBounty, id);
    }
  }

  removeCreateBountyRequest(id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(strings.requestCreateBounty, id);
    }
  }
}

BountyCreate.propTypes = {
  isUnlocked: PropTypes.bool,
  walletList: PropTypes.array,
  onWalletChange: PropTypes.func,
  onError: PropTypes.func,
  addBounty: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func,
  url: PropTypes.string
};
export default BountyCreate;
