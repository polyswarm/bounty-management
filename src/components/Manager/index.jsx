// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
// Component Imports
import strings from './strings';
import './styles.css';

class Manager extends Component {

  render() {
    return (
      <div>
        <Link to='/create'>{strings.create}</Link>
      </div>
    );
  }

}
Manager.defaultProps = {
  bounties: PropTypes.array.isRequired,
};
export default Manager;
