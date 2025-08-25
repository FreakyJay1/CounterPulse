import React, { useState } from 'react';
import { useFeedback } from '../utils/FeedbackContext';

const API_URL = 'http://localhost:5000/api/users';

const AuthPage = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [error, setError] = useState('');
  const { setMessage } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      if (!isLogin) {
        setMessage('Sign up successful! Welcome.');
      }
      onAuth(data.token, data.role || role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fa' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, width: 370, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: isLogin ? '#1a2236' : '#f6f8fa',
              color: isLogin ? '#fff' : '#1a2236',
              border: 'none',
              borderRadius: '8px 0 0 8px',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: !isLogin ? '#1a2236' : '#f6f8fa',
              color: !isLogin ? '#fff' : '#1a2236',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Sign Up
          </button>
        </div>
        <h2 style={{ textAlign: 'center', color: '#1a2236', marginBottom: 24 }}>{isLogin ? 'Login to your account' : 'Create an account'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              autoFocus
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
            />
          </div>
          {!isLogin && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
              >
                <option value="owner">Owner</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          )}
          {error && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
          <button
            type="submit"
            style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer', marginTop: 8 }}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
