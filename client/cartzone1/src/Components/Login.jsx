import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Auth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        fetch('http://localhost:5555/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Login failed. Please try again.');
                });
            }
            return response.json(); 
        })
        .then(data => {
            console.log("Backend response data:", data);

            if (data.user && data.user.id && data.access_token) {
                console.log("User ID from backend:", data.user.id);
                login(data.user, data.access_token);

                navigate('/');
            } else {
                setError('Login successful, but user data or token is missing from response.');
                console.error('Missing user data/token in login response:', data);
            }
        })
        .catch(err => {
            console.error('Network or unexpected error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again later.');
        });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
                {error && <p className="error-message">{error}</p>}
                <p>
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </form>
        </div>
    );
}

export default Login;