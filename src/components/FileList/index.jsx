// Vendor imports
import React from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import FileProgress from '../FileProgress';
// Component Imports
import strings from './strings';
import './styles.css';

class FileList  extends React.Component {
  constructor(props) {
    super(props);
    this.onRemoveClickHandler = this.onRemoveClickHandler.bind(this);
  }

  render () {
    const { props: { files } } = this;
    return (
      <div className='File-List'>
        <header>
          {strings.title}{' '}{files.length}
        </header>
        <div className='List'>
          {files && (
            files.map((f) => {
              const name = f.name;
              return(
                <FileProgress
                  key={name}
                  file={f}
                  remove={() => {this.onRemoveClickHandler(f);}} />
              );
            })
          )}
        </div>
      </div>
    );
  }

  onRemoveClickHandler(file) {
    const { props: { remove } } = this;
    if (remove) {
      remove(file);
    }
  }
}

FileList.proptypes = {
  files: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
};

export default FileList;
