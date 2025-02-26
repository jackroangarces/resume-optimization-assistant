import React from 'react';

export function HomePage(props) {
    return (
        <section id="homepage">
            <div className="container">
                <h1>Start building your astonishing resume now!</h1>
                <h2>Free, easy access to optimization tools</h2>
                <a href="login.html" className="button">Get Started</a>
                <div className="card">
                    <img src="img/screen_grab_mockup.png" alt="Website Features Preview" className="card-image" />
                </div>
            </div>
        </section>
    )
}