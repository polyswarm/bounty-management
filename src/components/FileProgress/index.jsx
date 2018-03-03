import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component Imports
import strings from './strings';
import './styles.css';

class FileProgress extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render () {
    const { props: { file, progress} } = this;
    return(
      <span className='FileProgress'>
        <div>
          <p className='FileProgress-Name'>{file.name}</p>
          <progress>{progress}</progress>
        </div>
        <button onClick={this.onClickHandler}>
          {strings.remove}
        </button>
      </span>
    );
  }

  onClickHandler() {
    const { props: { remove } } = this;
    if (remove) {
      remove();
    }
  }
}

FileProgress.proptypes = {
  file: PropTypes.string.isRequired,
  progress: PropTypes.number,
  remove: PropTypes.func.isRequired,
};

export default FileProgress;
