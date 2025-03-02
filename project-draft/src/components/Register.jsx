import React, {useState} from 'react';

export function Register(props) {

    const {login} = props;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const registeredUsers = [{username:'redwall4lif', password:'seahawks48'}];


    const handleSubmit = (event) => {
        event.preventDefault();

        let user = registeredUsers.find(user => user.username != username);

        if (user && password >= 8 && password == confirmPassword) {
            setError('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');

            // does not work in logging in as the signed-up user yet
            login(user => username);

        } else if (!user) {
            setError('This username already exists. Please enter a different username');
        } else if (user && password <= 8) {
            setError('Password needs to be at least 8 characters');
        } else if (password != confirmPassword) {
            setError('Password and confirm password input needs to be the same');
        } 
    };

    return (

        <div className="container">
            <form onSubmit={handleSubmit}>
            <div className="user-input column">
            <p className="sign-up">Sign Up</p>
            {<p className="text-danger">{error}</p>}
            <p>Enter a username</p>
                <input className="enter-username"
                    placeholder="Enter Username" 
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
            </div>
            <div className="user-input column">
            <p>Enter a password</p>
                <input className="enter-password"
                    placeholder="Enter password"
                    type="text"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="user-input column">
            <p>Confirm your entered password</p>
                <input className="confirm-password"
                    placeholder="Confirm password"
                    type="text"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
            </div>
                <button type="submit" className="sign-up">
                    Sign Up
                </button>
            </form>
        </div>
    );
}