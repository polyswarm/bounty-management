import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionRow from '../AssertionRow';
// Component imports
import strings from './strings';
import './styles.css';

class AssertionTable extends Component {

  render() {
    const { props: { assertions } } = this;
    return (
      <table className='AssertionTable' cellPadding='10'>
        <thead>
          <tr>
            <th>{strings.author}</th>
            <th>{strings.verdict}</th>
            <th>{strings.metadata}</th>
            <th>{strings.bid}</th>
          </tr>
        </thead>
        <tbody>
          {
            assertions.map((assertion) => {
              return (
                <AssertionRow
                  key={assertion.author+assertion.bid+assertion.metadata+assertion.verdict}
                  assertion={assertion}/>
              );
            })
          }
        </tbody>
      </table>
    );
  }

}
AssertionRow.proptypes = {
  assertions: PropTypes.array.isRequired,
};
export default AssertionTable;
