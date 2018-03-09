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
    this.state = {
      hover: false,
    };

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  render () {
    const { props: { item, remove }, state: { hover } } = this;
    return(
      <div className='ListItem'
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <p className='ListItem-Name'>{item}</p>
        {remove && hover && (
          <span className='ListItem-Remove'>
            <RemoveButton onClick={this.onClickHandler}>
              <img className='redx' src='/img/red-x.svg' alt={strings.remove}/>
            </RemoveButton>
          </span>
        )}
      </div>
    );
  }

  onClickHandler() {
    const { props: { remove } } = this;
    if (remove) {
      remove();
    }
  }

  onMouseEnter() {
    this.setState({hover: true});
  }

  onMouseLeave() {
    this.setState({hover: false});
  }
}

ListItem.proptypes = {
  item: PropTypes.string.isRequired,
  remove: PropTypes.func,
};

export default ListItem;
