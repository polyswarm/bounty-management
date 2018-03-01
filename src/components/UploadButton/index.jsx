import React, {Component} from 'react';
import './styles.css';
import strings from './strings';

class UploadButton extends Component {
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
        <label htmlFor='file'>{strings.selectFile}</label>
      </form>
    );
  }

  onFileChanged(event) {
    if (event.target.value) {
        this.setState({file: event.target.value})
    }
  }
}
export default UploadButton;
