// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
// Bounty Imports
import ListItem from '../ListItem';
import RequestSpinner from '../RequestSpinner';
// Component Imports
import strings from './strings';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.onSelectBounty = this.onSelectBounty.bind(this);
  }

  render() {
    const { props: { bounties, active, requests } } = this;
    return (
      <div className='Sidebar'>
        <header className='Sidebar-Header'>
          <img className='Sidebar-Header-Logo'
            src='../public/img/polyswarm.svg'
            alt={strings.logo}/>
          <RequestSpinner requests={requests}/>
        </header>
        <ul className='Sidebar-Content'>
          <TransitionGroup>
            {bounties && bounties.length > 0 && (
              bounties.map((bounty, index) => {
                return(
                  <CSSTransition
                    key={bounty.guid}
                    timeout={300}
                    classNames='item'>
                    {() => (
                      <ListItem className={`item-${index}`}
                        active={index === active}
                        alert={bounty.updated}
                        onClick={() => {this.onSelectBounty(index);}}
                        remove={() => {this.onBountyRemoved(index);}}>
                        {bounty.guid}
                      </ListItem>
                    )}
                  </CSSTransition>
                );
              })
            )}
          </TransitionGroup>
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
