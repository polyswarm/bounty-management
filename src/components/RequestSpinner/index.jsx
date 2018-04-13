// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Manager imports
// Component imports
import strings from './strings.js';

class RequestSpinner extends Component {
  render() {
    const { requests } = this.props;

    return (
      <span className='RequestSpinner'>
        {requests && requests.length > 0 && (
          <img className='RequestSpinner-Icon'
            src='../public/img/nct-coin.svg'
            alt={strings.token}/>
        )}
      </span>
    );
  }

}
RequestSpinner.proptypes = {
  requests: PropTypes.array
};
export default RequestSpinner;