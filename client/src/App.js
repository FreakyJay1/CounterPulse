import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import useProductStore from './store/productStore';
import { UserProvider, useUser } from './utils/UserContext';
import { FeedbackProvider } from './utils/FeedbackContext';
import AuthPage from './pages/AuthPage';
import InventoryPage from './pages/InventoryPage';

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SalesPage = React.lazy(() => import('./pages/SalesPage'));

function RoleSwitcher() {
  const { role, setRole } = useUser();
  return (
    <div style={{ marginBottom: 16 }}>
      <label>Role: </label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="owner">Shop Owner</option>
        <option value="assistant">Shop Assistant</option>
      </select>
    </div>
  );
}

function AppContent() {
  const { fetchProducts } = useProductStore();
  const { role, token, login, logout } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchProducts();
    setIsReady(true);
  }, [fetchProducts]);

  if (!token) {
    return <AuthPage onAuth={login} />;
  }

  return (
    <Router>
      <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <button onClick={logout} style={{ float: 'right' }}>Logout</button>
        <h2>CounterPulse Inventory</h2>
        <nav style={{ marginBottom: 16 }}>
          <Link to="/">Inventory</Link>
          {role === 'owner' && <span> | <Link to="/dashboard">Dashboard</Link></span>}
          <span> | <Link to="/sales">Sales</Link></span>
        </nav>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<InventoryPage />} />
            {role === 'owner' && <Route path="/dashboard" element={<DashboardPage />} />}
            <Route path="/sales" element={<SalesPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <UserProvider>
      <FeedbackProvider>
        <AppContent />
      </FeedbackProvider>
    </UserProvider>
  );
}
