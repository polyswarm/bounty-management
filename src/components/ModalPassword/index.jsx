import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component imports
import HttpAccount from './http';
import './styles.css';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: false,
      open: false,
    };

    this.onBackgroundClick = this.onBackgroundClick.bind(this);
  }

  render() {
    const { state: { open } } = this;
    return (
      <div className='ModalPassword'>
        {open && (
          <div className='ModalBackground'
            onClick={this.onBackgroundClick}>
            <div className='ModalContent'>
            </div>
          </div>
        )}
      </div>
    );
  }

  onAccountSet() {
    const { props: { accountSet }, state: {store} } = this;
    if (accountSet && store) {
      accountSet();
    }
  }

  onBackgroundClick() {
    this.close();
  }

  onUnlock(address, password) {
    const { props: { url } } = this;
    if (url) {
      const http = HttpAccount(url);
      http.unlockAccount(address, password)
        .then(success => {
          if (success) {
            this.onAccountSet();
            this.close();
          }
        });
    }
  }

  open() {
    this.setState({open: true});
  }

  close() {
    this.setState({open: false});
  }
}

ModalPassword.proptypes = {
  url: PropTypes.string,
  accounts: PropTypes.array,
  accountSet: PropTypes.func,
};
export default ModalPassword;
