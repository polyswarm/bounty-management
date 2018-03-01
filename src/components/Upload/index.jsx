import React, {Component} from 'react';
import {Button, FormGroup, InputGroup, ControlLabel, FormControl} from 'react-bootstrap';

class Upload extends Component {
  state ={
    selected: null,
  }
  render() {
    return(
      <form>
        <FormGroup bsSize='large'>
          <ControlLabel>Choose a file to upload</ControlLabel>
          <InputGroup>
            <FormControl
              type='text'
              placeholder='Choose a file'
              value={this.state.selected}
              />
            <InputGroup.Button>
              <Button>Browse</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        <input className='hidden' type='file' />
        <FormGroup>
          <Button>Swarm It</Button>
        </FormGroup>
      </form>
    );
  }
}
export default Upload;
