import React from 'react';
import Login from './Login';
import Register from './Register';

function AuthPage({ onLoginSuccess }) {
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Welcome</h1>
      <Login onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

export default AuthPage;