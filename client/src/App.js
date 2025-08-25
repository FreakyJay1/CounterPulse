import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useProductStore from './store/productStore';
import { UserProvider, useUser } from './utils/UserContext';
import { FeedbackProvider } from './utils/FeedbackContext';
import AuthPage from './pages/AuthPage';
import InventoryPage from './pages/InventoryPage';
import NavBar from './components/NavBar';

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SalesPage = React.lazy(() => import('./pages/SalesPage'));

function AppContent() {
  const { fetchProducts } = useProductStore();
  const { token, login } = useUser();
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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <NavBar />
        <main style={{ marginLeft: 240, flex: 1, padding: '40px 32px', background: '#f6f8fa' }}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </React.Suspense>
        </main>
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
