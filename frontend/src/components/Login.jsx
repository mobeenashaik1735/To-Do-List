import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login({ switchToRegister }) {
  const auth = useContext(AuthContext);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!auth?.login) {
      setError('App failed to load auth. Please refresh the page.');
      return;
    }

    try {
      const result = auth.login(loginIdentifier, password);
      if (!result?.success) {
        setError(result?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2>Login to Dashboard</h2>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        
        <input 
          type="text" 
          placeholder="Username or Email" 
          value={loginIdentifier} 
          onChange={e => setLoginIdentifier(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        
        <button type="submit" className="btn-auth">Login</button>
      </form>
      
      <div className="auth-toggle-link" onClick={switchToRegister}>
        Don't have an account? Register here
      </div>
    </div>
  );
}