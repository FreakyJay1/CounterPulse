import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';
import './NavBar.css';
import logo from '../assets/counterpulse.png';

const NavBar = () => {
  const { token, role, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (token) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo-section">
        <img src={logo} alt="Company Logo" className="navbar-logo" />
        <span className="navbar-company">CounterPulse</span>
      </div>
      <ul className="navbar-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/inventory' ? 'active' : ''}>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li className={location.pathname === '/sales' ? 'active' : ''}>
          <Link to="/sales">Sales</Link>
        </li>
      </ul>
      {role === 'owner' && (
        <ul className="navbar-links">
          <li className={location.pathname === '/users' ? 'active' : ''}>
            <Link to="/users">User Management</Link>
          </li>
        </ul>
      )}
      <div className="navbar-profile-section">
        <img
          src={logo}
          alt="Profile"
          className="navbar-profile"
        />
        <div style={{ color: '#fff', fontSize: 14, marginBottom: 6 }}>{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest'}</div>
        <button className="navbar-auth-btn" onClick={handleAuth}>
          {token ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
