import React from 'react';
import { Link } from 'react-router';

export function HomePage(props) {
    return (
        <section id="homepage">
            <h1>Start building your astonishing resume now!</h1>
            <h2 className='mb-1'>Free, easy access to optimization tools</h2>
            <div className="p-5">
                <Link className="button" to="/login"> Get Started! </Link>
                <div className="card p-2 mt-5 mw-75 mx-auto d-flex justify-content-center">
                    <img src="/img/screen_grab_mockup.png" alt="Website Features Preview" className="card-image" />
                </div>
            </div>
        </section>
    )
}