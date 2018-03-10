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
    this.state = {
      selected: 0,
    };
    this.onSelectBounty = this.onSelectBounty.bind(this);
  }

  render() {
    const { props: { bounties }, state: { selected } } = this;
    return (
      <div className='Sidebar'>
        <header className='Sidebar-Header'>
          <img src='/img/polyswarm.svg'
            alt={strings.logo}/>
        </header>
        <div className='Sidebar-Content'>
          {bounties && bounties.length > 0 && (
            bounties.map((bounty, index) => {
              return(<ListItem
                className={`item-${index}`}
                active={index === selected}
                key={bounty.guid}
                onClick={() => {this.onSelectBounty(index);}}
                remove={() => {this.onBountyRemoved(index);}}
                item={bounty.guid}/>);
            })
          )}
        </div>
      </div>
    );
  }

  onSelectBounty(index) {
    const { props: { select } } = this;
    if (select) {
      select(index);
      this.setState({selected: index});
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
