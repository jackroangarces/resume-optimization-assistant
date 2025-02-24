import React from 'react';

function Signin(props) {

    return (
    <div class="container">
            <p class="sign-up">Sign in</p>

            <div class="user-input">
                <label for="email"></label><input id="email" type="email" name="email" placeholder="Email or Phone"/>
            </div>
            <div class="user-input">
                <label for="password"></label><input id="password" type="password" name="password" placeholder="Password"/>
            </div>
            <div>
                <a href="#" class="forgot-password">Forgot Password?</a>
            </div>
            <button class="sign-in">
                <p>Sign In</p>
            </button>

            <p class="or">------ or ------</p>

            <button class="register">
                <p>Register now!</p>
            </button>
    </div>
    );
}