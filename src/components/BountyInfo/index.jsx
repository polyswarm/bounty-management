// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import FileList from '../FileList';
import AssertionTable from '../AssertionTable';
// Component Imports
import './styles.css';

class BountyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };

    this.onFileClickHandler = this.onFileClickHandler.bind(this);
  }

  render() {
    const { props: { bounty }, state: { active } } = this;
    const files = bounty.artifacts || [];
    let assertions = [];
    if (files[active] && files[active].assertions) {
      assertions = files[active].assertions;
    }

    return (
      <div className='Bounty-Info'>
        <div className='Bounty-Info-Container'>
          <FileList className='Bounty-Info-Files'
            files={files}
            onClick={this.onFileClickHandler}
            active={active}
            readonly />
          <AssertionTable className='Bounty-Info-Assertions'
            assertions={assertions} />
        </div>
      </div>
    );
  }

  onFileClickHandler(index) {
    this.setState({active: index});
  }
}

BountyInfo.propTypes = {
  bounty: PropTypes.object.isRequired,
};
export default BountyInfo;
