// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
import Manager from '../Manager';
import Sidebar from '../Sidebar';
import Header from '../Header';
// Component imports
import config from './config';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      bounties: this.preloadLocalStorage(),
      create: false,
    };

    this.onAddBounty = this.onAddBounty.bind(this);
    this.onUpdateBounty = this.onUpdateBounty.bind(this);
    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
    this.onCreateBounty = this.onCreateBounty.bind(this);
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
    const { state: { active, bounties, create } } = this;
    return (
      <div className='App hex-background'>
        <Sidebar bounties={bounties}
          active={active}
          remove={this.onRemoveBounty}
          select={this.onSelectBounty}/>
        <Header title={'Polyswarm'} onClick={this.onCreateBounty}/>
        <div className='App-Content'>
          { (bounties.length == 0 || create) && (
            <BountyCreate url={url} addBounty={this.onAddBounty}/>
          )}
          { !create && active < bounties.length && (
            <Manager bounty={bounties[active]}/>
          )}
        </div>
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
      localStorage.setItem('bounties', bounties);
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

  preloadLocalStorage() {
    if (this.hasLocalStorage) {
      return  localStorage.getItem('bounties') || [];
    } else {
      return [];
    }
  }
}

export default App;
