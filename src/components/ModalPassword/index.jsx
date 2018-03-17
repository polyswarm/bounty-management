import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component imports
import './styles.css';

class ModalPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.onBackgroundClick = this.onBackgroundClick.bind(this);
  }

  render() {
    const { state: { open } } = this;
    return (
      <div className='ModalPassword'>
        {open && (
          <div className='ModalBackground'
            onClick={this.onBackgroundClick}>
            <div className='ModalContent'>
            </div>
          </div>
        )}
      </div>
    );
  }

  onBackgroundClick() {
    this.close();
  }

  open() {
    this.setState({open: true});
  }

  close() {
    this.setState({open: false});
  }
}

ModalPassword.proptypes = {
  accounts: PropTypes.array,
};
export default ModalPassword;
