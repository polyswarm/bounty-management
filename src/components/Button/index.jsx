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
    const { props: { disabled, children, cancel, flat } } = this;
    const computedClass = this.computeClass(cancel, flat);
    return (
      <button
        disabled={disabled}
        className={`Button${computedClass}`}
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

  computeClass(cancel, flat) {
    if (cancel && flat) {
      return ' flat-cancel';
    } else if (flat) {
      return ' flat';
    } else if (cancel) {
      return ' cancel';
    } else {
      return '';
    }
  }
}

Button.proptypes = {
  onClick: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
};

export default Button;
