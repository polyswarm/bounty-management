// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import Uuid from 'uuid/v4';
// Bounty imports
import Button from '../Button';
// Component imports
import HttpAccount from './http';
import strings from './strings';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      unlocking: false,
      error: false,
      password: '',
      address: 0,
      eth: 0,
      nct: 0
    };

    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.onChangeStore = this.onChangeStore.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onUnlockClick = this.onUnlockClick.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.createWallet = this.createWallet.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
    this.addAccountRequest = this.addAccountRequest.bind(this);
    this.removeAccountRequest = this.removeAccountRequest.bind(this);
  }

  componentWillMount() {
    const { props: { walletList } } = this;
    const { state: { address } } = this;
    if (walletList && walletList.length > 0) {
      this.updateBalance(walletList[address]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { props: { walletList } } = this;
    const { state: { address } } = this;
    const { address: prevAddr } = prevState;
    const { walletList: prevWallets } = prevProps;

    if (walletList
      && walletList.length > 0 
      && (prevAddr !== address 
      || JSON.stringify(walletList) !== JSON.stringify(prevWallets))) {
      this.updateBalance(walletList[address]);
    }
  }

  render() {
    const { props: { walletList } } = this;
    const {
      state: { open, unlocking, error, password, address, nct, eth }
    } = this;
    return (
      <div className='ModalPassword'>
        {open && (
          <React.Fragment>
            <div className='ModalBackground' onClick={this.onCloseClick} />
            <div className='ModalContent'>
              <header className='ModalContentHeader'>
                {walletList.length > 0 ? strings.header : strings.createHeader}
              </header>
              <form>
                {walletList.length > 0 && (
                  <React.Fragment>
                    <label htmlFor='address'>{strings.address}</label>
                    <select
                      id='address'
                      value={walletList[address]}
                      onChange={this.onChangeAddress}>
                      {walletList.map(wallet => {
                        return (
                          <option key={wallet} value={wallet}>
                            {wallet}
                          </option>
                        );
                      })}
                    </select>
                    <label>Balances</label>
                    <div className='Balances'>
                      <p className='Balance'>NCT: {nct}</p>
                      <p className='Balance'>ETH: {eth}</p>
                    </div>
                  </React.Fragment>
                )}
                <label htmlFor='password'>{strings.password}</label>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onKeyPress={this.onKeyPress}
                  onChange={this.onChangePassword}
                />
                <div className='ModalError'>{error && strings.error}</div>
              </form>
              <p className='ModalMessage'>{strings.background}</p>
              <span className='Modal-Button-Bar'>
                <Button flat
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
    const { props: { onWalletChange }, state: { store } } = this;
    if (onWalletChange) {
      onWalletChange(store);
    }
  }

  onChangeStore(event) {
    this.setState({ store: event.target.checked });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeAddress(event) {
    const { props: { walletList } } = this;
    const value = event.target.value;
    const index = walletList.findIndex(v => v === value);
    this.setState({ address: index });
  }

  onCloseClick() {
    const { state: { unlocking } } = this;
    if (!unlocking) {
      this.close();
    }
  }

  onKeyPress(e) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.onUnlockClick();
    }
  }

  onUnlockClick() {
    const { state: { address, password } } = this;
    const { props: { walletList } } = this;
    if (walletList && walletList.length > 0) {
      this.unlockWallet(walletList[address], password);
    } else {
      this.createWallet(password);
    }
  }

  unlockWallet(address, password) {
    const { props: { url } } = this;
    this.setState({ unlocking: true, error: false });
    const http = new HttpAccount(url);
    const uuid = Uuid();
    this.addAccountRequest(strings.requestUnlockWallet, uuid);
    return http.unlockWallet(address, password).then(success => {
      this.setState({ unlocking: false, error: !success });
      if (success) {
        this.onWalletChangeHandler();
        this.close();
      }
      this.removeAccountRequest(strings.requestUnlockWallet, uuid);
    });
  }

  createWallet(password) {
    const { props: { url } } = this;
    this.setState({ unlocking: true, error: false });
    const http = new HttpAccount(url);
    const uuid = Uuid();
    this.addAccountRequest(strings.requestCreateWallet, uuid);
    return http.createWallet(password).then(success => {
      this.setState({ unlocking: false, error: !success });
      if (success) {
        this.onWalletChangeHandler();
        this.close();
      }
      this.removeAccountRequest(strings.requestCreateWallet, uuid);
    });
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ 
      open: false,
      password: ''
    });
  }

  addAccountRequest(title, id) {
    const { addRequest } = this.props;
    if (addRequest) {
      addRequest(title, id);
    }
  }

  removeAccountRequest(title, id) {
    const { removeRequest } = this.props;
    if (removeRequest) {
      removeRequest(title, id);
    }
  }

  updateBalance(address) {
    const { props: { url } } = this;
    const http = new HttpAccount(url);
    const uuid = Uuid();
    this.addAccountRequest(strings.requestBalance, uuid);
    
    const e = http.getEth(address).then(balance => {
      return new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000));
    }).then((b) => {
      this.setState({ eth: b.toNumber() });
    });
    const n = http.getNct(address).then(balance => {
      return new BigNumber(balance).dividedBy(new BigNumber(1000000000000000000));
    }).then((b) => {
      this.setState({ nct: b.toNumber() });
    });
    const promises = [e, n];
    return Promise.all(promises).then(() => {
      this.removeAccountRequest(strings.requestBalance, uuid);
    });
  }
}

ModalPassword.proptypes = {
  url: PropTypes.string,
  walletList: PropTypes.array,
  onWalletChange: PropTypes.func,
  addRequest: PropTypes.func,
  removeRequest: PropTypes.func
};
export default ModalPassword;
