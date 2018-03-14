import React, { Component } from 'react';
import {Jumbotron} from 'react-bootstrap';
import Button from '../Button';
// Component Imports
import strings from './strings';
import './styles.css';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  render() {
    return (
      <div className='Welcome'>
        <Jumbotron className='Welcome-Jumbo'>
          <h1>{strings.welcome}</h1>
          <p>{strings.moreInfo}</p>
          <Button className='Welcome-Close' onClick={this.onClickHandler}>
            {strings.getStarted}
          </Button>
        </Jumbotron>
      </div>
    );
  }

  onClickHandler() {
    const { props: { onClick } } = this;
    if (onClick) {
      onClick();
    }
  }
}

export default Welcome;
