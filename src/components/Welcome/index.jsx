// Vendor imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Bounty imports
import Button from '../Button';
// Component Imports
import strings from './strings';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accepted: false,
    };
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onCheckedHandler = this.onCheckedHandler.bind(this);
  }

  render() {
    const {accepted} = this.state;
    return (
      <div className='Welcome'>
        <div className='Welcome-Jumbo'>
          <h1>{strings.welcome}</h1>
          <h2>{strings.moreInfo}</h2>
          <form>
            <input type="checkbox"
              id="accept"
              onChange={this.onCheckedHandler}
              value={accepted}/>
            <label htmlFor="accept">{strings.accept}</label>
          </form>
          <Button className='Welcome-Close'
            disabled={!accepted}
            cancel
            onClick={this.onClickHandler}>
            {strings.getStarted}
          </Button>
        </div>
      </div>
    );
  }

  onClickHandler() {
    const { props: { onClick } } = this;
    if (onClick) {
      onClick();
    }
  }

  onCheckedHandler(event) {
    const checked = event.target.checked;
    this.setState({accepted: checked});
  }
}

Welcome.propTypes = {
  onClick: PropTypes.func,
};
export default Welcome;
