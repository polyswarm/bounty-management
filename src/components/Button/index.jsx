// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Component Imports
import './styles.css';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }
  
  render () {
    const { props: { children } } = this;
    return (
      <button className='Button'
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

Button.proptypes = {
  onClick: PropTypes.func.isRequired,
};

export default Button;
