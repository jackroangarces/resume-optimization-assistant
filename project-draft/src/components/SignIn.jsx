import React, {useState} from 'react';

export function SignIn(props) {

    // setting the state of username, password, and error messages
    const {login} = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const registeredUsers = [{username:'redwall4lif', password:'seahawks48'}];
   

    const handleSubmit = (event) => {
        event.preventDefault();

        // Remember! It is bad practice to use querySelector in React
        // We have to use state to set input values. Text me if u need
        // help with that.

        let usernameInput = document.querySelector('.usernameInput').value;
        let passwordInput = document.querySelector('.passwordInput').value;
        let user = registeredUsers.find(user => user.username == usernameInput);
        let pw = registeredUsers.find(user => user.password == passwordInput);

        // will add conditionals for invalid usernames here

        if (user && pw) {
            setError('');
            login(user => username);
        } else if(!user) {
            setError('Username not found, please enter a valid username');
        } else if(!pw) {
            setError('Please enter the correct password');
        }
        setUsername('');
        setPassword('');
    }


    return (
        <div className="container">
                <form onSubmit={handleSubmit}>
                <div className="user-input column">
                <p className="sign-up">Sign in</p>
                {<p style={{color: 'red'}}>{error}</p>} {/*  Inline CSS is bad practice */}
                    <input 
                        type="text" 
                        placeholder="Enter Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <input 
                        type="text"
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit" className="sign-in">
                    Sign In
                </button>
            </form>
            <button className="register">
                <p>Register now!</p>
            </button>
        </div>
    );
}
