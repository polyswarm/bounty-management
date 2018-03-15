// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import FileList from '../FileList';
// Component Imports
import './styles.css';

class BountyInfo extends Component {

  render() {
    // const { props: { bounty } } = this;
    // const files = bounty.artifacts;
    // const assertions = bounty.assertions;
    const files = [];
    return (
      <div className='Bounty-Info'>
        <div className='Bounty-Info-Container'>
          <FileList className='Bounty-Info-Files' files={files} immutable />
        </div>
      </div>
    );
  }
}

BountyInfo.propTypes = {
  bounty: PropTypes.object.isRequired,
};
export default BountyInfo;
