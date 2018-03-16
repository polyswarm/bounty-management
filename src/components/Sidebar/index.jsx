// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Imports
import ListItem from '../ListItem';
// Component Imports
import strings from './strings';
import './styles.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.onSelectBounty = this.onSelectBounty.bind(this);
  }

  render() {
    const { props: { bounties, active } } = this;
    return (
      <div className='Sidebar'>
        <header className='Sidebar-Header'>
          <img src='/img/polyswarm.svg'
            alt={strings.logo}/>
        </header>
        <ul className='Sidebar-Content'>
          {bounties && bounties.length > 0 && (
            bounties.map((bounty, index) => {
              return(
                <ListItem className={`item-${index}`}
                  active={index === active}
                  alert={bounty.updated}
                  key={bounty.guid}
                  onClick={() => {this.onSelectBounty(index);}}
                  remove={() => {this.onBountyRemoved(index);}}>
                  {bounty.guid}
                </ListItem>
              );
            })
          )}
        </ul>
      </div>
    );
  }

  onSelectBounty(index) {
    const { props: { select } } = this;
    if (select) {
      select(index);
    }
  }

  onBountyRemoved(index) {
    const { props: { remove } } = this;
    if (remove) {
      remove(index);
    }
  }

}

Sidebar.defaultProps = {
  bounties: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default Sidebar;
