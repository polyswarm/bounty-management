// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
// Component imports
import strings from './strings';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.onCloseClick = this.onCloseClick.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  render() {
    const { props: { message, title } } = this;
    const { state: { open } } = this;
    return (
      <div className='Modal'>
        {open && (
          <React.Fragment>
            <div className='ModalBackground'>
            </div>
            <div className='ModalContent'>
              <header className='ModalContentHeader'>
                {title}
              </header>
              <p>{message}</p>
              <span className='Modal-Button-Bar'>
                <Button
                  flat
                  onClick={this.onCloseClick}>
                  {strings.ok}
                </Button>
              </span>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  onCloseClick() {
    this.close();
  }

  open() {
    this.setState({open: true});
  }

  close() {
    this.setState({open: false});
  }
}

Modal.proptypes = {
  title: PropTypes.string,
};
export default Modal;
