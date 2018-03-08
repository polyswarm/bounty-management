// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Component Imports
import './styles.css';

class Progressbar extends Component {

  render() {
    const { props: { progress } } = this;
    let p = progress;
    if (!p || p < 0) {
      p = 0;
    } else if (p > 100) {
      p = 100;
    }
    const style = {width: `${p}%`};
    return (
      <div { ...this.props} className='Progressbar'>
        <div className='Progressbar-Fill' style={style} />
      </div>
    );
  }
}

Progressbar.propTypes = {
  progress: PropTypes.number
};

export default Progressbar;
