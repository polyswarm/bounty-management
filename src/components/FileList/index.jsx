// Vendor imports
import React from 'react';
import PropTypes from 'prop-types';
// Bounty imports
// import FileProgress from '../FileProgress';
// Component Imports
import strings from './strings';
import './styles.css';

class FileList  extends React.Component {
  render () {
    const { props: { files } } = this;
    return (
      <div className='File-List'>
        <header>
          {strings.title}
        </header>
        <div className='List'>
          {files && (
            files.map(() => {
              return(
                <p>asdf</p>
                // <FileProgress />
              );
            })
          )}
        </div>
      </div>
    );
  }
}

FileList.proptypes = {
  files: PropTypes.array
};

export default FileList;
