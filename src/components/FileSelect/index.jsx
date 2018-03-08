import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import RemoveButton from '../RemoveButton';
// Component imports
import strings from './strings';
import './styles.css';

class FileSelect extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { file } } = this;
    return(
      <div className='FileProgress'>
        <p className='FileProgress-Name'>{file.name}</p>
        <span className='FileProgress-Remove'>
          <RemoveButton onClick={this.onClickHandler}>
            {strings.remove}
          </RemoveButton>
        </span>
      </div>
    );
  }

  onClickHandler() {
    const { props: { remove } } = this;
    if (remove) {
      remove();
    }
  }
}

FileSelect.proptypes = {
  file: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
};

export default FileSelect;
