import React, {useState} from 'react';
import { Routes, Route } from 'react-router';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

function App(props) {
    return (
      <div>
        <Navbar />
        <main></main>
        <Footer />
      </div>
    );
}

export default App;

