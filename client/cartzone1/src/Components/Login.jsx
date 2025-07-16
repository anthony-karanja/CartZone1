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
            headers: { 'Content-Type': 'application/json' },
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
                if (data.user && data.user.id && data.access_token) {
                    login(data.user, data.access_token);
                    navigate('/');
                } else {
                    setError('Login successful, but user data or token is missing from response.');
                }
            })
            .catch(err => {
                setError(err.message || 'An unexpected error occurred.');
            });
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Log In</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
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
                {error && <p className="auth-message">{error}</p>}
            </form>
            <p className="switch-auth">
                Don't have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}

export default Login;
