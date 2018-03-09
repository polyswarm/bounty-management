// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component Imports
// import strings from './strings';
import './styles.css';

class Manager extends Component {

  render() {
    return (
      <div className='Manager'>
        Placeholder
      </div>
    );
  }

}
Manager.defaultProps = {
  bounties: PropTypes.array.isRequired,
};
export default Manager;
