import React, {useState} from 'react';

export function SignIn(props) {

    {/* // State variables here
    // const [username, setUsername] = useState(' ');
    // const [password, setPassword] = useState(' '); */}


    return (
        <div className="container">
                <p className="sign-up">Sign in</p>

                <div className="user-input">
                    <label for="email"></label><input id="email" type="email" name="email" placeholder="Email or Phone"/>
                </div>
                <div className="user-input">
                    <label for="password"></label><input id="password" type="password" name="password" placeholder="Password"/>
                </div>
                <div>
                    <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                <button className="sign-in">
                    <p>Sign In</p>
                </button>

                <p className="or">------ or ------</p>

                <button className="register">
                    <p>Register now!</p>
                </button>
        </div>
    );
}

export function Register(props) {

    // State variables here


    // return DOM of register component here

}