import React, {Component} from 'react';
import './styles.css';
import strings from './strings';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
    this.onFileChanged = this.onFileChanged.bind(this);
  }

  render() {
    const {file} = this.state;
    return(
      <form>
        <input id='file' className='hidden' type='file' onChange={this.onFileChanged} />
        {file && (
          <React.Fragment>
            <label htmlFor='file' className='selected'>{file.split('\\').pop()}</label>
            <button>{strings.send}</button>
          </React.Fragment>
        )}
        {!file && (
          <label htmlFor='file'>{strings.selectFile}</label>
        )}
      </form>
    );
  }

  onFileChanged(event) {
    if (event.target.value) {
        this.setState({file: event.target.value})
    }
  }
}
export default Upload;
