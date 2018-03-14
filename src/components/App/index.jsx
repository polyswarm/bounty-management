// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
import Manager from '../Manager';
import Sidebar from '../Sidebar';
import Header from '../Header';
import Welcome from '../Welcome';
// Component imports
import config from './config';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    const {bounties, first} = this.preloadLocalStorage();
    this.state = {
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
  }

  componentDidUpdate(_, prevState) {
    const { state: { bounties } } = this;
    const { bounties: prevBounties } = prevState;
    const needsRefresh =  bounties.length === prevBounties.length
        && bounties.every((current, index) => {
          const keys = Object.keys(current);
          const prev = prevBounties[index];
          return keys.map((k) => current[k] === prev[k])
            .reduce((accumulator, v) => accumulator && v);
        });
    if(needsRefresh) {
      this.storeBounties(bounties);
    }
  }

  render() {
    const {url} = config;
    const { state: { active, bounties, create, first } } = this;
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
            <Header title={'Polyswarm'} onClick={this.onCreateBounty}/>
            <div className='App-Content'>
              { (bounties.length === 0 || create) && (
                <BountyCreate url={url} addBounty={this.onAddBounty}/>
              )}
              { !create && active < bounties.length && (
                <Manager bounty={bounties[active]}/>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    );
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
      this.setState({active: index, create: false});
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
