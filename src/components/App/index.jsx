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
        <Sidebar bounties={bounties} select={this.onSelectBounty}/>
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
    if (index) {
      this.setState({active: index});
    }
  }
}

export default App;
