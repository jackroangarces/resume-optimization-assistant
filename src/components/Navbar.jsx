import React, { useState } from 'react';

import { Link } from 'react-router';

export function Navbar(props) {
    
    const [menuOpen, setMenuOpen] = useState(false);

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
                <div id="nav-menu" className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
                    <img className="hamburger-menu" src="img/hamburger.png" alt="Menu" />
                </div>
                
                <div className={`navbar-right ${menuOpen ? 'active' : ''}`}>
 
 
                     <div id="nav-links-container">
                         <Link id="nav-links" to="/myresumes">My Resumes</Link>
                         <Link id="nav-links" to="/templates">Example Templates</Link>
 
 
                 </div>
                 <div className="navbar-center">
                        <span>Welcome, {username}!</span>
                        <button className="logout-button ms-3" onClick={logout}>Logout</button>
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

                <div id="nav-menu" className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
                    <img className="hamburger-menu" src="img/hamburger.png" alt="Menu" />
                </div>
                
                <div className={`navbar-right ${menuOpen ? 'active' : ''}`}>
                    
                    <div id="nav-links-container">
                        <Link id="nav-links" to="/myresumes">My Resumes</Link>
                        <Link id="nav-links" to="/templates">Example Templates</Link>
                        {/* <Link id="nav-links" to="/login">Login</Link> */}
                        {username ? (
                        <span className="user-info">
                            Welcome, {username} <span className="separator">|</span>
                            <button className="logout-button" onClick={logout}>Logout</button>
                        </span>
                    ) : (
                        <Link id="nav-links" to="/login">Login</Link>
                    )}
                    </div>
                </div>
            </nav>
        )
    }
}