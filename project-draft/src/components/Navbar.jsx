import React from 'react';

import { Link } from 'react-router';

export function Navbar(props) {

    const {username} = props;
    const {logout} = props;

    // you can set the username to any value for now just for
    // when you style it. comment out line 7 and you could use:
    //
    // const username = "BruhitsBK";

    if (username) {

        return (
            <nav className="navbar d-flex justify-content-between align-items-center text-white">
                <div className="navbar-left d-flex m-1">
                    <Link to="/"><img className="logo" src="img/website_icon.jpeg" alt="Website Icon" /></Link>
                    <h1 className="title fs-1">Resume Optimization System</h1>
                    <h1 className="title-acronym mx-auto pl-1 ">ROS</h1>
                </div>
                <div className="navbar-center">
                    <p>Welcome, {username}!</p>              {/* Displays username */}
                    <button onClick={logout}>Logout</button> {/* Displays logout button */}
                </div>
                <div className="navbar-right">
                    <div id="nav-menu">
                        <img className="hamburger-menu" src="img/hamburger.png" />
                    </div>
                    <div id="nav-links-container">
                        <Link id="nav-links" to="/ai">AI Resume Optimizer</Link>
                        <Link id="nav-links" to="/myresumes">My Resumes</Link>
                        <Link id="nav-links" to="/templates">Example Templates</Link>
                        <Link id="nav-links" to="/login">Login</Link>
                    </div>
                </div>
            </nav>
        )
    }

    else {
        return (
            <nav className="navbar d-flex justify-content-between align-items-center text-white">
                <div className="navbar-left d-flex m-1">
                    <Link to="/"><img className="logo" src="img/website_icon.jpeg" alt="Website Icon" /></Link>
                    <h1 className="title fs-1">Resume Optimization System</h1>
                    <h1 className="title-acronym mx-auto pl-1 ">ROS</h1>
                </div>
                <div className="navbar-center">
                    <p>Welcome, {username}!</p>              {/* Displays username */}
                    <button onClick={logout}>Logout</button> {/* Displays logout button */}
                </div>
                <div className="navbar-right">
                    <div id="nav-menu">
                        <img className="hamburger-menu" src="img/hamburger.png" />
                    </div>
                    <div id="nav-links-container">
                        <Link id="nav-links" to="/ai">AI Resume Optimizer</Link>
                        <Link id="nav-links" to="/myresumes">My Resumes</Link>
                        <Link id="nav-links" to="/templates">Example Templates</Link>
                        <Link id="nav-links" to="/login">Login</Link>
                    </div>
                </div>
            </nav>
        )
    }
}