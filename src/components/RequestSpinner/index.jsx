// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Manager imports
// Component imports
import './styles.css';

class RequestSpinner extends Component {
  render() {
    const { requests } = this.props;

    return (
      <React.Fragment>
        {requests && requests.length > 0 && (
          <img className='Request-Spinner'
            src='img/nct-coin.svg'/>
        )}
      </React.Fragment>
    );
  }

}
RequestSpinner.proptypes = {
  requests: PropTypes.array
};
export default RequestSpinner;