import React, {useState} from 'react';
import { Routes, Route } from 'react-router';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HomePage } from './StaticPages.jsx';
import { SignIn } from './signIn.jsx';


function App(props) {
    return (
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element = {<HomePage />} />
            <Route path="/login" element = {<SignIn />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
}

export default App;

