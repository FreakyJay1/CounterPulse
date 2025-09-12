import React, { useState, useEffect } from 'react';

const UserManagementPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('assistant');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setUsers([]);
      setError('Failed to fetch users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/create-by-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ username, email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setMessage('User created! An email has been sent for password setup.');
      setUsername('');
      setEmail('');
      setRole('assistant');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setShowForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ username, email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      setMessage('User updated!');
      setEditingUser(null);
      setUsername('');
      setEmail('');
      setRole('assistant');
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setMessage('User deleted!');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setUsername('');
    setEmail('');
    setRole('assistant');
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    setUsername('');
    setEmail('');
    setRole('assistant');
  };

  console.log('UserManagementPage users:', users);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0', background: '#f7fafd', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <span role="img" aria-label="user" style={{ fontSize: 36, marginRight: 8 }}>👤</span>
        <h2 style={{ color: '#1a2236', margin: 0, fontWeight: 900, fontSize: 34, letterSpacing: 1 }}>User Management</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <button onClick={handleAdd} style={{ background: '#1a2236', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="add">➕</span> Add User
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 0, overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17 }}>
          <thead>
            <tr style={{ background: '#f6f8fa', height: 56 }}>
              <th style={{ padding: 18, textAlign: 'left', fontWeight: 800, fontSize: 16 }}>Username</th>
              <th style={{ padding: 18, textAlign: 'left', fontWeight: 800, fontSize: 16 }}>Email</th>
              <th style={{ padding: 18, textAlign: 'left', fontWeight: 800, fontSize: 16 }}>Role</th>
              <th style={{ padding: 18, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: 48, color: '#888', fontSize: 20 }}>
                <span role="img" aria-label="empty" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>📭</span>
                No users found.
              </td></tr>
            ) : users.map((user, idx) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0', height: 60, background: idx % 2 === 0 ? '#fff' : '#f7fafd', transition: 'background 0.2s' }}>
                <td style={{ padding: 18, fontWeight: 700, color: '#28304a' }}>{user.username}</td>
                <td style={{ padding: 18 }}>{user.email}</td>
                <td style={{ padding: 18 }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td style={{ padding: 18, textAlign: 'center' }}>
                  <button onClick={() => handleEditUser(user)} style={{ background: '#f39c12', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(showForm || editingUser) && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,40,60,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 36, minWidth: 380, maxWidth: 420 }}>
            <h3 style={{ textAlign: 'center', color: '#1a2236', marginBottom: 24 }}>{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Username</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', marginBottom: 6, color: '#28304a', fontWeight: 500 }}>Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 16 }}
                >
                  <option value="owner">Owner</option>
                  <option value="assistant">Shop Assistant</option>
                </select>
              </div>
              {error && <div style={{ color: '#e74c3c', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
              {message && <div style={{ color: '#27ae60', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{message}</div>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 18 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '12px 32px', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 18, cursor: 'pointer' }}
                >
                  {loading ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
                </button>
                <button type="button" onClick={handleFormClose} style={{ background: '#e9eef3', color: '#1a2236', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 600, fontSize: 18, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
