// Vendor imports
import React, {Component} from 'react';
// Bounty imports

// Extra imports
import strings from './strings'
import './styles.css'

class DropTarget extends Component {
  render() {
    return(
      <div className='Drop-Target'>
        <p>{strings.dragAndDrop}</p>
      </div>
    )
  }
}
export default DropTarget;
