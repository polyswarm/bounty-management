// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
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
      unlocking: false,
      error: false,
      password: '',
      address: 0,
    };

    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.onChangeStore = this.onChangeStore.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.onUnlock = this.onUnlock.bind(this);
    this.createWallet = this.createWallet.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  render() {
    const { props: { walletList } } = this;
    const { state: { open, unlocking, error, password, address, store } } = this;
    return (
      <div className='ModalPassword'>
        {open && (
          <React.Fragment>
            <div className='ModalBackground'
              onClick={this.onCloseClick}>
            </div>
            <div className='ModalContent'>
              <header className='ModalContentHeader'>
                {walletList.length > 0 ? strings.header : strings.createHeader}
              </header>
              <form>
                {walletList.length > 0 && (
                  <React.Fragment>
                    <label htmlFor='address'>
                      {strings.address}
                    </label>
                    <select id='address'
                      value={walletList[address]}
                      onChange={this.onChangeAddress}>
                      {
                        walletList.map((wallet) => {
                          return(
                            <option key={wallet}
                              value={wallet}>
                              {wallet}
                            </option>
                          );
                        })
                      }
                    </select>
                  </React.Fragment>
                )}
                <label htmlFor='password'>
                  {strings.password}
                </label>
                <input id='password'
                  type='password'
                  value={password}
                  onChange={this.onChangePassword}/>
                {false && (
                  <span>
                    <input id='store'
                      type='checkbox'
                      value={store}
                      onChange={this.onChangeStore}/>
                    <label htmlFor='store'>
                      {strings.store}
                    </label>
                  </span>
                )}
                <div className='ModalError'>
                  {error && (
                    strings.error
                  )}
                </div>
              </form>
              <span className='Modal-Button-Bar'>
                <Button
                  flat
                  disabled={unlocking}
                  onClick={this.onUnlockClick}>
                  {walletList.length > 0 ? strings.unlock : strings.create}
                </Button>
                <Button
                  flat
                  cancel
                  disabled={unlocking}
                  onClick={this.onCloseClick}>
                  {strings.cancel}
                </Button>
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  onWalletChangeHandler() {
    const { props: { onWalletChange }, state: {store} } = this;
    if (onWalletChange) {
      onWalletChange(store);
    }
  }

  onChangeStore(event) {
    this.setState({store: event.target.checked});
  }

  onChangePassword(event) {
    this.setState({password: event.target.value});
  }

  onChangeAddress(event) {
    const { props: { walletList } } = this;
    const value = event.target.value;
    const index = walletList.findIndex((v) => v === value);
    this.setState({address: index});
  }

  onCloseClick() {
    const { state: { unlocking } } = this;
    if (!unlocking) {
      this.close();
    }
  }

  onUnlockClick() {
    const { state: { address, password } } = this;
    const { props: { walletList } } = this;
    if (walletList && walletList.length > 0) {
      this.onUnlock(walletList[address], password);
    } else {
      this.createWallet(password);
    }

  }

  onUnlock(address, password) {
    const { props: { url } } = this;
    this.setState({unlocking: true, error: false});
    const http = new HttpAccount(url);
    http.unlockWallet(address, password)
      .then(success => {
        this.setState({unlocking: false, error: !success});
        if (success) {
          this.onWalletChangeHandler();
          this.close();
        }
      });
  }

  createWallet(password) {
    const { props: { url } } = this;
    this.setState({unlocking: true, error: false});
    const http = new HttpAccount(url);
    http.createWallet(password)
      .then(success => {
        this.setState({unlocking: false, error: !success});
        if (success) {
          this.onWalletChangeHandler();
          this.close();
        }
      });
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
  walletList: PropTypes.array,
  onWalletChange: PropTypes.func,
};
export default ModalPassword;
