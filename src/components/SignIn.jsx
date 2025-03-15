import React, { useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';

export function SignIn(props) {

    const {login} = props;
    const db = getDatabase();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
   

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        const userRef = ref(db, 'userData/' + username);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === password) {
                    login(username);
                    navigate('/myresumes');
                    localStorage.setItem('loggedInUser', username);
                } else {
                    setError('Incorrect password. Please try again.');
                }
            } else {
                setError('Username not found. Please enter a valid username.');
            }
        }).catch((error) => {
            console.error('Error fetching user data: ', error);
            setError('An error occurred. Please try again later.');
        });
        setUsername('');
        setPassword('');
    }


    return (
        <div className="container">
                <form onSubmit={handleSubmit}>
                <div className="user-input column">
                <p className="sign-in-header">Sign in</p>
                {<p className="text-danger">{error}</p>}
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="user-input column">
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit" className="button">
                    Sign In
                </button>
                <p className="new-acc-suggestion">Don't have an account? Register now!</p>
            <Link className="button" to="/register">Register</Link>
            </form>
        </div>
    );
}
