import React, { useState } from 'react';

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = getQueryParam('token');
  const email = getQueryParam('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://192.168.0.108:5000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setMessage('Password has been set! You can now log in.');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!token || !email) {
    return <div style={{ maxWidth: 400, margin: '60px auto', color: '#e74c3c', fontWeight: 600 }}>Invalid or missing reset link.</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 36 }}>
      <h2 style={{ textAlign: 'center', color: '#1a2236', marginBottom: 24 }}>Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
          />
        </div>
        {error && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        {message && <div style={{ color: '#27ae60', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{message}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 18, cursor: 'pointer', marginTop: 8 }}
        >
          {loading ? 'Setting...' : 'Set Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

