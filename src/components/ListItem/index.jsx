import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import RemoveButton from '../RemoveButton';
// Component imports
import strings from './strings';
import './styles.css';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { item } } = this;
    return(
      <div className='ListItem'>
        <p className='ListItem-Name'>{item}</p>
        <span className='ListItem-Remove'>
          <RemoveButton onClick={this.onClickHandler}>
            {strings.remove}
          </RemoveButton>
        </span>
      </div>
    );
  }

  onClickHandler() {
    const { props: { remove } } = this;
    if (remove) {
      remove();
    }
  }
}

ListItem.proptypes = {
  item: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
};

export default ListItem;
