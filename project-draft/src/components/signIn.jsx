import React, {useState} from 'react';

export function SignIn(props) {

    {/* // State variables here
    // const [username, setUsername] = useState(' ');
    // const [password, setPassword] = useState(' '); */}
    const {login} = props;
    const [username, setUsername] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        login(username); // will add conditionals for invalid usernames here
    }


    return (
        <div className="container">
                <p className="sign-up">Sign in</p>
                <form onSubmit={handleSubmit}>
                <div className="user-input">
                    <input 
                        type="text" 
                        placeholder="Enter Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
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

export function Register(props) {

    // State variables here


    // return DOM of register component here

}