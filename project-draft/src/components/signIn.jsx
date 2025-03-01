import React, {useState} from 'react';

export function SignIn(props) {

    {/* // State variables here
    // const [username, setUsername] = useState(' ');
    // const [password, setPassword] = useState(' '); */}
    const {login} = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const registeredUsers = [{username:'redwall4lif', password:'seahawks48'}];
   

    const handleSubmit = (event) => {
        event.preventDefault();

        let usernameInput = document.querySelector('.usernameInput').value;
        let passwordInput = document.querySelector('.passwordInput').value;
        let user = registeredUsers.find(user => user.username == usernameInput);
        let pw = registeredUsers.find(user => user.password == passwordInput);

        // will add conditionals for invalid usernames here

        if (user && pw) {
            setError('');
            login(user => user.username);
        } else if(user != true) {
            setError('Username not found, please enter a valid username');
        } else if(user && pw != true) {
            setError('Please enter the correct password');
        } 
        setUsername('');
        setPassword('');
    }


    return (
        <div className="container">
                <p className="sign-up">Sign in</p>
                <form onSubmit={handleSubmit}>
                <div className="user-input column">
                    {<p style={{color: 'red'}}>{error}</p>}
                    <input 
                        className="usernameInput"
                        type="text" 
                        placeholder="Enter Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <input 
                        className="passwordInput"
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
