// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty Manager imports
import Button from '../Button';
// Component imports
import strings from './strings';
class Snackbar extends Component {
  constructor(props) {
    super(props);
    this.dismiss = this.dismiss.bind(this);
  }

  render() {
    const { message } = this.props;
    return(
      <div className='Snackbar'>
        <p>
          {message}
        </p>
        <Button flat
          onClick={this.dismiss}>
          {strings.dismiss}
        </Button>
      </div>
    );
  }

  dismiss() {
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    }
  }
}
Snackbar.proptypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func
};
export default Snackbar;