// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import RemoveButton from '../RemoveButton';
import Button from '../Button';
// Component imports
import HttpAccount from './http';
import strings from './strings';
import './styles.css';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: false,
      open: false,
      uploading: false,
      error: false,
      password: '',
      address: '',
    };

    this.onAccountSet = this.onAccountSet.bind(this);
    this.onChangeStore = this.onChangeStore.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.onUnlock = this.onUnlock.bind(this);
  }

  render() {
    const { props: { accounts },
      state: { open, uploading, error, password, address, store } } = this;
    return (
      <div className='ModalPassword'>
        {open && (
          <React.Fragment>
            <div className='ModalBackground'
              onClick={this.onCloseClick}>
            </div>
            <div className='ModalContent'>
              <form>
                <select id='address'
                  value={address}
                  onChange={this.onChangeAddress}>
                  {
                    accounts.map((account) => {
                      return(
                        <option key={account}
                          value={account}>
                          {account}
                        </option>
                      );
                    })
                  }
                </select>
                <label htmlFor='password'>
                  {strings.password}
                </label>
                <input id='password'
                  type='password'
                  value={password}
                  onChange={this.onChangePassword}/>
                <label htmlFor='store'>
                  {strings.store}
                </label>
                <input id='store'
                  type='checkbox'
                  value={store}
                  onChange={this.onChangeStore}/>
                <div className='ModalError'>
                  {error && (
                    strings.error
                  )}
                </div>
                <span>
                  <RemoveButton
                    disabled={uploading}
                    onClick={this.onCloseClick}>
                    {strings.cancel}
                  </RemoveButton>
                  <Button
                    disabled={uploading}
                    onClick={this.onUnlockClick}>
                    {strings.unlock}
                  </Button>
                </span>
              </form>
            </div>
          </React.Fragment>
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

  onChangeStore(event) {
    this.setState({store: event.checked});
  }

  onChangePassword(event) {
    this.setState({password: event.target.value});
  }

  onChangeAddress(event) {
    this.setState({address: event.target.value});
  }

  onCloseClick() {
    const { state: { uploading } } = this;
    if (!uploading) {
      this.close();
    }
  }

  onUnlockClick() {
    const { props: { address, password } } = this;
    this.onUnlock(address, password);
  }

  onUnlock(address, password) {
    const { props: { url } } = this;
    if (url) {
      this.setState({uploading: true, error: false});
      const http = HttpAccount(url);
      http.unlockAccount(address, password)
        .then(success => {
          this.setState({uploading: false, error: !success});
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
