import React, { useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';

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

    const auth = getAuth();

    const firebaseUIConfig = {
        
        signInOptions: [ GoogleAuthProvider.PROVIDER_ID,
          { provider: EmailAuthProvider.PROVIDER_ID, requiredDisplayName: true },
        ],
        signInFlow: 'popup', //don't redirect to authenticate
        credentialHelper: 'none', //don't show the email account chooser
        callbacks: { //"lifecycle" callbacks
          signInSuccessWithAuthResult: () => {
            login(username);
            navigate('/myresumes');
            return false; //don't redirect after authentication
          }
        }
      }

    return (
        <div>

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

            
            <StyledFirebaseAuth firebaseAuth={auth} uiConfig={firebaseUIConfig} />

        </div> 
        </div>
    );
}
