import React, { useState } from 'react';
import { useFeedback } from '../utils/FeedbackContext';

const API_URL = 'http://192.168.0.108:5000/api/users';

const AuthPage = ({ onAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setMessage } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');
      localStorage.setItem('role', data.role);
      onAuth(data.token, data.role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fa' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36, width: 370, maxWidth: '90vw' }}>
        <h2 style={{ textAlign: 'center', color: '#1a2236', marginBottom: 24 }}>Login to your account</h2>
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
          {error && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
          <button
            type="submit"
            style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer', marginTop: 8 }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
