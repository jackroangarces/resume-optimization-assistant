import React from 'react';

import { Link } from 'react-router';

export function Navbar(props) {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/"><img id="logo" src="img/website_icon.jpeg" alt="Website Icon" /></Link>
                <h1 className="title">Resume Optimization System</h1>
                <h1 className="title-acronym">ROS</h1>
            </div>
            <div className="navbar-center">

            </div>
            <div className="navbar-right">
                <div id="nav-menu">
                    <img id="hamburger-menu" src="img/hamburger.png" />
                </div>
                <div id="nav-links-container">
                    <Link id="nav-links" to="/ai">AI Resume Optimizer</Link>
                    <Link id="nav-links" to="/my-resumes">My Resumes</Link>
                    <Link id="nav-links" to="/templates">Example Templates</Link>
                    <Link id="nav-links" to="/login">Login</Link>
                </div>
            </div>
        </nav>
    )
}