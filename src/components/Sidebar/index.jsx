// Vendor imports
import React, { Component } from 'react';
// Component Imports
import strings from './strings';
import './styles.css';

class Sidebar extends Component {

  render() {
    const { props: { bounties } } = this;
    return (
      <div className='Sidebar'>
        <header className='Sidebar-Header'>
          <img src='/img/polyswarm.svg'
            alt={strings.logo}/>
        </header>
        <div className='Sidebar-Content'>
          {bounties && (
            bounties.map((bounty) => {
              return(<p>{bounty}</p>);
            })
          )}
        </div>
      </div>
    );
  }
}

export default Sidebar;
