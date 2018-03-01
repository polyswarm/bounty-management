// Vendor imports
import React, {Component} from 'react';
// Bounty imports

// Extra imports
import strings from './strings'
import './styles.css'

class UploadDropTarget extends Component {
  render() {
    return(
      <div className='Drop-Target'>
        {strings.dragAndDrop}
      </div>
    )
  }
}
export default UploadDropTarget;
