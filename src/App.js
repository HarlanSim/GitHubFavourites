import React, { Component } from 'react';
import Modal from './Modal';

class App extends Component {
  render() {
    const modalTitle = "My GitHub Favourites";
    return (
      <Modal title={modalTitle} leftPanel="Hello" rightPanel="World"/>
    );
  }
}

export default App;
