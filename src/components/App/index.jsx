// Vendor imports
import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
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
    this.renderManager = this.renderManager.bind(this);
    this.renderCreate = this.renderCreate.bind(this);
    this.state = {
      bounties: [],
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   // load bounties
  // }

  render() {
    return (
      <div className='App hex-background'>
        <Sidebar />
        <Switch>
          <Route exact path='/' render={this.renderManager}/>
          <Route path='/create' render={this.renderCreate}/>
        </Switch>
      </div>
    );
  }

  renderCreate() {
    const {url} = config;
    return (
      <BountyCreate url={url}/>
    );
  }

  renderManager() {
    const { state: { bounties } } = this;
    return(
      <Manager bounties={bounties}/>
    );
  }
}

export default App;
