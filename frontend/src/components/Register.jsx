import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Register({ switchToLogin }) {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!auth?.register) {
      setError('App failed to load auth. Please refresh the page.');
      return;
    }

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = auth.register(username, email, password);
      if (!result?.success) {
        setError(result?.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-auth">Register</button>
      </form>
      <div className="auth-toggle-link" onClick={switchToLogin}>
        Already have an account? Login here
      </div>
    </div>
  );
}
