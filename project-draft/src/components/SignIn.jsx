import React, {useState} from 'react';
import { Link } from 'react-router';

export function SignIn(props) {

    // setting the state of username, password, and error messages
    const {login} = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const registeredUsers = [{username:'redwall4lif', password:'seahawks48'}];
   

    const handleSubmit = (event) => {
        event.preventDefault();

        let user = registeredUsers.find(user => user.username == username);
        let pw = registeredUsers.find(user => user.password == password);

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
                <p className="sign-in">Sign in</p>
                {<p className="text-danger">{error}</p>}
                    <input 
                        type="text" 
                        placeholder="Enter Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="user-input column">
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
            <Link className="button" to="/register">Register</Link>
        </div>
        
    );
}
