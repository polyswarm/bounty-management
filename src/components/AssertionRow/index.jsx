import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Component Imports
import strings from './strings';
import './styles.css';

class AssertionRow extends Component {

  render() {
    const { props: { assertion } } = this;
    const verdictClass = `Assertion-${AssertionRow.computeClass(assertion.verdict)}`;
    const verdictString = assertion.verdict ? strings.bad : strings.good;
    return (
      <tr className='AssertionRow'>
        <td>{assertion.author}</td>
        <td className={verdictClass}>{verdictString}</td>
        <td>{assertion.metadata}</td>
        <td>{assertion.bid}</td>
      </tr>
    );
  }

  static computeClass(verdict) {
    if (verdict) {
      return 'Malignant';
    } else {
      return 'Benign';
    }
  }

}

AssertionRow.proptypes = {
  assertion: PropTypes.object.isRequired,
};
export default AssertionRow;
