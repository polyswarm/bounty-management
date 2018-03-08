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
    const { props: { disabled, children, cancel } } = this;
    const cancelClass = cancel ? ' cancel' : '';
    return (
      <button
        disabled={disabled}
        className={`Button${cancelClass}`}
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
  cancel: PropTypes.bool,
};

export default Button;
