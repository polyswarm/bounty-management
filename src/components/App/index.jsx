// Vendor imports
import React, { Component } from 'react';
// Bounty imports
import BountyCreate from '../BountyCreate';
import Manager from '../Manager';
import Sidebar from '../Sidebar';
// Component imports
import config from './config';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      bounties: [],
    };

    this.onRemoveBounty = this.onRemoveBounty.bind(this);
    this.onSelectBounty = this.onSelectBounty.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   // load bounties
  // }

  render() {
    const {url} = config;
    const { state: { active, bounties } } = this;
    return (
      <div className='App hex-background'>
        <Sidebar bounties={bounties}
          remove={this.onRemoveBounty}
          select={this.onSelectBounty}/>
        { active >= bounties.length && (
          <BountyCreate url={url}/>
        )}
        { active < bounties.length && (
          <Manager bounty={bounties[active]}/>
        )}
      </div>
    );
  }

  onSelectBounty(index) {
    const { state: { bounties } } = this;
    if (index !== null && index >= 0 && index < bounties.length) {
      this.setState({active: index});
    }
  }

  onRemoveBounty(index) {
    const { state: { bounties } } = this;
    if (index !== null && index >= 0 && index < bounties.length) {
      bounties.splice(index, 1);
      this.setState({bounties: bounties});
    }
  }
}

export default App;
