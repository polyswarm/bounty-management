import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component Imports
import './styles.css';

class FileResult extends Component {

  render() {
    const { props: { children, good, total } } = this;
    const indicator = this.computeIndicator(good, total);
    return (
      <div className='FileResult'>
        {children}
        { indicator && (
          <p className={`FileResult-Indicator-${indicator}`}>{good}{' / '}{total}</p>
        )}
      </div>
    );
  }

  computeIndicator(good, total) {
    const ratio = good / total;
    if ( good == null || total == null || total == 0) {
      return null;
    }else if (ratio >= .7) {
      return 'Good';
    } else if (ratio >= .5) {
      return 'Warning';
    } else {
      return 'Bad';
    }
  }
}

FileResult.proptypes = {
  name: PropTypes.string.isRequired,
  good: PropTypes.number,
  total: PropTypes.number,
};
export default FileResult;
