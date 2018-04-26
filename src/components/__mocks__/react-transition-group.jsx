// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CSSTransition extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const show = this.props.in;
    const {props: {children}} = this;
    return (
      <div>
        {show && (
          <div>
            {children('entered')}
          </div>
        )}
      </div>
    );
  }

}
CSSTransition.proptypes = {
  children: PropTypes.func
};

class TransitionGroup extends Component {
  render() {
    const {props: {children}} = this;
    return(
      <div>
        {children}
      </div>
    );
  }
}
export {CSSTransition, TransitionGroup};