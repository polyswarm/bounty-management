// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
import BountyInfo from '../BountyInfo';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Welcome from '../Welcome';
// Component imports
import HttpApp from './http';
import config from './config';
import strings from './strings';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    const {bounties, first} = this.preloadLocalStorage();
    this.http = new HttpApp(config.url, config.wsUrl);
    this.state = {
      isUnlocked: false,
      walletList: [],
      active: 0,
      bounties: bounties,
      create: false,
      first: first,
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
    this.onCloseWelcome = this.onCloseWelcome.bind(this);
    this.onWalletChangeHandler = this.onWalletChangeHandler.bind(this);
    this.getData = this.getData.bind(this);
    this.getWallets = this.getWallets.bind(this);
  }

  componentDidUpdate(_, prevState) {
    const { state: { bounties } } = this;
    const { bounties: prevBounties } = prevState;
    const storageOutOfSync =  JSON.stringify(bounties) !== JSON.stringify(prevBounties);
    if(storageOutOfSync) {
      this.storeBounties(bounties);
    }
  }

  componentDidMount() {
    this.getWallets();
    this.getData();
  }

  render() {
    const {url} = config;
    const { state: { active, bounties, create, first, isUnlocked, walletList } } = this;

    return (
      <div className='App'>
        {first && (
          <Welcome onClick={this.onCloseWelcome}/>
        )}
        {!first && (
          <React.Fragment>
            <Sidebar bounties={bounties}
              active={active}
              remove={this.onRemoveBounty}
              select={this.onSelectBounty}/>
            <Header title={(bounties.length === 0 || create || active < 0) ? strings.create : bounties[active].guid}
              create={create}
              onClick={this.onCreateBounty}/>
            <div className='App-Content'>
              { (bounties.length === 0 || create || active < 0 ) && (
                <BountyCreate url={url}
                  isUnlocked={isUnlocked}
                  walletList={walletList}
                  onWalletChange={this.onWalletChangeHandler}
                  addBounty={this.onAddBounty}/>
              )}
              { !create && active >=0 && active < bounties.length && (
                <BountyInfo bounty={bounties[active]}/>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  onAddBounty(guid) {
    const bounties = this.state.bounties.slice();
    const bounty = {
      guid: guid,
      update: false,
      author: '',
      amount: '',
      artifactURI: '',
      expirationBlock: '',
      resolved: '',
      verdicts: '',
    };
    bounties.push(bounty);
    this.setState({bounties: bounties});
  }

  onCreateBounty() {
    this.setState({create: true, active: -1});
  }

  onCloseWelcome() {
    this.setState({first: false});
    this.markSeen();
  }

  onRemoveBounty(index) {
    const bounties = this.state.bounties.slice();
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties.splice(index, 1);
      this.setState({bounties: bounties});
    }
  }

  onSelectBounty(index) {
    const bounties = this.state.bounties.slice();
    if (index !== null && index >= 0 && index < bounties.length) {
      const bounty = bounties[index];
      bounty.updated = false;
      bounties[index] = bounty;
      this.setState({active: index, create: false, bounties: bounties});
    }
  }

  onWalletChangeHandler(store) {
    this.setState({isUnlocked: store});
  }

  pullLocalBounties() {
    const bounties = this.state.bounties.slice();
    return bounties;
  };

  updateOnAssertion(assertion) {
    const bounties = this.state.bounties.slice();
    const guid = assertion.guid;
    const index = bounties.findIndex((bounty) => bounty.guid === guid);
    // let index = -1;
    // bounties.forEach((bounty, i) => {
    //   if (bounty.guid === guid) {
    //     index = i;
    //   }
    // });
    if (index >= 0) {
      const bounty = bounties[index];
      const a = {};
      a[assertion.author] = {
        bid: assertion.bid,
        metadata: assertion.metadata,
        verdicts: assertion.verdicts,
      };
      bounty.assertsions.push(a);
      const modified = bounty.artifacts.map((file, index) => {
        const f = file;
        if (!a.verdicts[index]) {
          f.good++;
        }
        f.total++;
        file.assertions.push({
          author: assertion.author,
          bid: assertion.bid,
          verdict: a.verdicts[index],
          metadata: assertion.metadata
        });
        return f;
      });
      bounty.artifacts = modified;
      bounty.update = true;
      bounties[index] = bounty;
    }
    this.setState({bounties: bounties});
  }

  getData() {
    const http = this.http;
    http.listenForAssertions(this.pullLocalBounties, this.updateOnAssertion);
    const bounties = this.state.bounties.slice();
    const promises = bounties.map((bounty) => {
      return http.getBounty(bounty)
        .then(b => {
          if (Object.keys(b) !== Object.keys(bounty)) {
            b.update = true;
          }
          return b;
        })
        .catch(() => bounty);
    });
    Promise.all(promises).then((values) => {
      // get updated state after download finishes
      const bounties = this.state.bounties.slice();
      values.forEach((value) => {
        const foundIndex = bounties.findIndex((bounty) => bounty.guid === value.guid);
        if (foundIndex >= 0) {
          bounties[foundIndex] = value;
        }
      });
      this.setState({bounties: bounties});
    });
  }

  getWallets() {
    const http = this.http;
    http.getWallets()
      .then(accounts => {
        this.setState({walletList: accounts});
      });

    http.getUnlockedWallet()
      .then((success) => this.setState({isUnlocked: success}));
  }

  storeBounties(bounties) {
    if (this.hasLocalStorage()) {
      localStorage.setItem('bounties', JSON.stringify(bounties));
    }
  }

  hasLocalStorage() {
    try {
      localStorage.setItem('x', 'y');
      localStorage.removeItem('x');
      return true;
    } catch(e) {
      return false;
    }
  }

  markSeen() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('seen', JSON.stringify(true));
    }
  }

  preloadLocalStorage() {
    if (this.hasLocalStorage) {
      const bounties = JSON.parse(localStorage.getItem('bounties')) || [];
      const first = !JSON.parse(localStorage.getItem('seen'));
      return {bounties, first};
    } else {
      return {bounties: [], first: true};
    }
  }
}

export default App;
