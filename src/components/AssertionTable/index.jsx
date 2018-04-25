import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import AssertionRow from '../AssertionRow';
// Component imports
import strings from './strings';

class AssertionTable extends Component {

  render() {
    const { props: { assertions } } = this;
    return (
      <table className='AssertionTable'>
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
            /*
             * FIXME We need some sort of time/block number for the assertions.
             * Using index in the key, is bad form (and issues warnings.)
             */
            assertions.map((assertion, index) => {
              return (
                <AssertionRow
                  key={assertion.author+assertion.bid+assertion.metadata+assertion.verdict+index}
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
