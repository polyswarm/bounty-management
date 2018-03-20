// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
import BountyInfo from '../BountyInfo';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Welcome from '../Welcome';
// Component imports
import config from './config';
import strings from './strings';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    const {bounties, first} = this.preloadLocalStorage();
    this.http = new HttpApp(config.url);
    this.state = {
      isUnlocked: false,
      walletList: [],
      active: 0,
      bounties: bounties,
      create: false,
      first: first,
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onUpdateBounty = this.onUpdateBounty.bind(this);
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
    const storageOutOfSync =  bounties.length === prevBounties.length
        && bounties.every((current, index) => {
          const keys = Object.keys(current);
          const prev = prevBounties[index];
          return keys.map((k) => current[k] === prev[k])
            .reduce((accumulator, v) => accumulator && v);
        });
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

  onWalletChangeHandler(store) {
    this.setState({isUnlocked: store});
  }

  onAddBounty(guid) {
    const { state: { bounties } } = this;
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
    this.setState({bounties});
  }

  onCreateBounty() {
    this.setState({create: true, active: -1});
  }

  onCloseWelcome() {
    this.setState({first: false});
    this.markSeen();
  }

  onRemoveBounty(index) {
    const { state: { bounties } } = this;
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties.splice(index, 1);
      this.setState({bounties: bounties});
    }
  }

  onSelectBounty(index) {
    const { state: { bounties } } = this;
    if (index !== null && index >= 0 && index < bounties.length) {
      const bounty = bounties[index];
      bounty.updated = false;
      bounties[index] = bounty;
      this.setState({active: index, create: false, bounties: bounties});
    }
  }

  onUpdateBounty(guid, author, amount, artifactURI, expirationBlock, resolved, verdicts) {
    const { state: { bounties } } = this;
    const index = bounties.findIndex((o) => o.guid === guid);
    if (index >= 0) {
      bounties[index] = {
        guid: guid,
        update: true,
        author: author,
        amount: amount,
        artifactURI: artifactURI,
        expirationBlock: expirationBlock,
        resolved: resolved,
        verdicts: verdicts,
      };
      this.setState({bounties: bounties});
    }
  }

  pullLocalBounties() {
    const { state: { bounties } } = this;
    return bounties;
  };

  updateOnAssertion(assertion) {
    const { state: { bounties } } = this;
    const guid = assertion.guid;
    let index = -1;
    bounties.forEach((bounty, i) => {
      if (bounty.guid == guid) {
        index = i;
      }
    });
    if (index >= 0) {
      const bounty = bounites[index];
      const a = {};
      a[assertion.author] = {
        bid: assertion.bid,
        metadata: assertion.metadata,
        verdicts: assertion.verdicts,
      };
      bounty.assertsions.push(a);
      const modified = bounty.artifacts.map((file, index) =>{
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
      });
      bounty.artifacts = modified;
      bounty.update == true;
    }
    bounties[index] = bounty;
    this.setState({bounties: bounties});
  }

  getData() {
    const http = this.http;
    http.listenForAssertions(pullLocalBounties, updateOnAssertion);
    const { state: { bounties } } = this;
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
      this.setState({bounties: values});
    });
  }

  getWallets() {
    const http = this.http;
    http.getWallets()
      .then(accounts => {
        this.setState({walletList, accounts});
      });
    http.getUnlockedWallet()
      .then(this.setState({isUnlocked: true}));
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
