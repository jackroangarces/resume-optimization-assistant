import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router';

import './index.css'

import App from './components/App.jsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC09aALk4Z_5eXIJkHPcAgCZsVcYZ4vIMM",
  authDomain: "resume-optimization-syst-543be.firebaseapp.com",
  projectId: "resume-optimization-syst-543be",
  storageBucket: "resume-optimization-syst-543be.firebasestorage.app",
  messagingSenderId: "646591678306",
  appId: "1:646591678306:web:e364c7ef23823b8b970e3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
