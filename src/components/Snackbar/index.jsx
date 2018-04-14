// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Manager imports

class Snackbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message } = this.props;
    return(
      <p className='Snackbar'>
        {message}
      </p>
    );
  }

}
Snackbar.proptypes = {
  message: PropTypes.string
};
export default Snackbar;