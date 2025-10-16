import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleAuth} className="login-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        {error && <p className="error-message">{error}</p>}
        <p className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </p>
      </form>
    </div>
  );
};

export default Login;
