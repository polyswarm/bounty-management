// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Component Imports
import './styles.css';

class RemoveButton extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { children } } = this;
    return (
      <button { ...this.props} className='Remove-Button'
        onClick={this.onClickHandler}>
        {children}
      </button>
    );
  }

  onClickHandler() {
    const { props: { onClick } } = this;
    if (onClick) {
      onClick();
    }
  }
}

RemoveButton.proptypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
