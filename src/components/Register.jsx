import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { getDatabase, ref, set, child, get } from 'firebase/database';

export function Register(props) {

    const {login} = props;
    const db = getDatabase();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        // CHECK FOR ERRORS
        if (password.length < 8) {
            setError('Password needs to be at least 8 characters');
            return;
        } else if (password !== confirmPassword) {
            setError('Password and confirm password input need to be the same');
            return;
        }

        const usersRef = ref(db, 'userData');
        const userCheckRef = child(usersRef, username);

        get(userCheckRef).then((snapshot) => {
            if (snapshot.exists()) {
                // CHECK IF USER EXISTS
                setError('This username already exists. Please enter a different username');
            } else {
                // CREATE NEW USER IN DATABASE
                setError('');
                const newUserRef = ref(db, 'userData/' + username);
                set(newUserRef, {
                    username: username,
                    password: password,  // Hash password before storing for security??? (add later)
                    resumes: [],
                }).then(() => {
                    console.log("success");
                    setError('');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                    
                    login(username); 
                    navigate('/myresumes');
                }).catch((error) => {
                    console.error("Error checking user data: ", error);
                    setError('Error occurred. Please try again later');
                });
            }
        }).catch((error) => {
            console.error("Error checking user data: ", error);
            setError('Error occurred. Please try again later');
        });
    };

    return (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="user-input column">
              <p className="sign-in-header">Sign Up</p>
              {error && <p className="text-danger">{error}</p>}
              <p className="enter-username">Enter a username</p>
              <input
                className="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="user-input column">
              <p className="enter-password">Enter a password</p>
              <input
                className="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="user-input column">
              <p className="confirm-password">Confirm your entered password</p>
              <input
                className="confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
            <button type="submit" className="button">
              Sign Up
            </button>
          </form>
        </div>
      );
    }