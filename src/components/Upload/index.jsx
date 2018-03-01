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
        <div>
          <input id='file' className='hidden' type='file' onChange={this.onFileChanged} />
          {file && (
            <label htmlFor='file'>{file.split('\\').pop()}</label>
          )}
          {!file && (
            <label htmlFor='file'>{strings.selectFile}</label>
          )}
        </div>
        <button>Swarm It</button>
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
