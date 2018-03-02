// Vendor imports
import React, {Component} from 'react';
// Bounty imports

// Extra imports
import strings from './strings'
import './styles.css'

class DropTarget extends Component {
  constructor(props) {
    super(props)
    this.onDropHandler = this.onDropHandler.bind(this);
    this.onDragOverHandler = this.onDragOverHandler.bind(this);
    this.onDragEnterHandler = this.onDragEnterHandler.bind(this);
    this.onDragLeaveHandler = this.onDragLeaveHandler.bind(this);
  }

  render() {
    return(
      <div className='Drop-Target'
        ref={(target) => {this.target = target}}
        onDrop={this.onDropHandler}
        onDragOver={this.onDragOverHandler}
        onDragEnter={this.onDragEnterHandler}
        onDragLeave={this.onDragLeaveHandler}>
        <p>{strings.dragAndDrop}</p>
      </div>
    )
  }

  onDropHandler(event) {
    const {onFilesSelected} = this.props;
    // Don't want file to open
    event.preventDefault();

    let files = [];

    if (onFilesSelected) {
      let items;
      if (event.dataTransfer.items) {
        items = event.dataTransfer.items;
      } else {
        items = event.dataTransfer.files;
      }
      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          files.push(item.getAsFile())
        }
      }
      onFilesSelected(files);
    }

    this.removeDragData(event);
    this.target.classList.remove('drag');
  }

  onDragOverHandler(event) {
    event.preventDefault();
  }

  onDragEnterHandler(event) {
    event.preventDefault();
    this.target.classList.add('drag');
  }

  onDragLeaveHandler(event) {
    event.preventDefault();
    this.target.classList.remove('drag');
  }

  removeDragData(event) {
    if (event.dataTransfer.items) {
      event.dataTransfer.items.clear();
    } else {
      event.dataTransfer.clearData();
    }
  }
}
export default DropTarget;
