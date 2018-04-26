// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CSSTransition extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const show = this.props.in;
    const {children} = this.props;
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
export {CSSTransition};