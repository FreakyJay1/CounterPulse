import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import { useFeedback } from '../utils/FeedbackContext';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', role: 'owner' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const { setFeedback } = useFeedback();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post('/api/users/login', form);
        setUser(res.data.user);
        setFeedback({ type: 'success', message: 'Login successful!' });
        navigate('/');
      } else {
        const res = await axios.post('/api/users/register', form);
        setUser(res.data.user);
        setFeedback({ type: 'success', message: 'Sign up successful!' });
        navigate('/');
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 36, width: 340 }}>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 18, color: '#232837', textAlign: 'center' }}>{isLogin ? 'Login' : 'Sign Up'}</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16 }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16 }}
            required
          />
          {!isLogin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ width: '100%', padding: 12, marginBottom: 14, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 16 }}
              required
            >
              <option value="owner">Owner</option>
              <option value="assistant">Assistant</option>
            </select>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 12, borderRadius: 8, background: '#232837', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', marginBottom: 10 }}
          >
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#2d7ff9', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
