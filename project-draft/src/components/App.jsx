import React, {useState} from 'react';
import { Routes, Route } from 'react-router';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HomePage } from './StaticPages.jsx';

function App(props) {
    return (
      <div>
        <Navbar />
        <main>
            <HomePage />
        </main>
        <Footer />
      </div>
    );
}

export default App;

