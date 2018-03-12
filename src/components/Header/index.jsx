import React, { Component } from 'react';
import './styles.css';

class Header extends Component {

  render() {
    const { props: { title } } = this;
    return (
      <header className='Header'>
        <h1>{title}</h1>
      </header>
    );
  }

}

export default Header;
