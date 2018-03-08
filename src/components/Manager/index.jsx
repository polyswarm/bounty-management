// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component Imports
import strings from './strings';
import './styles.css';

class Manager extends Component {

  render() {
    return (
      <div>
        <a href='/create'>{strings.create}</a>
      </div>
    );
  }

}
Manager.defaultProps = {
  bounties: PropTypes.array.isRequired,
};
export default Manager;
