import React from 'react';
import { useUser } from '../utils/UserContext';

const DashboardPage = () => {
  const { user } = useUser();
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontWeight: 700, fontSize: 28, color: '#232837', marginBottom: 10 }}>Welcome to Stok-Smart</h1>
      <h2 style={{ fontWeight: 600, fontSize: 20, color: '#2d7ff9', marginBottom: 8 }}>Problem</h2>
      <p style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6, marginBottom: 0 }}>
        Small shop owners struggle to efficiently manage inventory, track sales, and generate reports, often relying on manual or outdated systems that lead to errors and lost revenue.
      </p>
      <h2 style={{ fontWeight: 600, fontSize: 20, color: '#2d7ff9', margin: '18px 0 8px 0' }}>Solution & Key Features</h2>
      <ul style={{ margin: '10px 0 0 22px', color: '#444', fontSize: '1rem', lineHeight: 1.7 }}>
        <li>Easy product and inventory management</li>
        <li>Barcode scanning for quick product lookup</li>
        <li>Sales logging and real-time sales history</li>
        <li>Income and expense tracking with visual trends</li>
        <li>Role-based access for owners and assistants</li>
        <li>Downloadable shop reports</li>
        <li>Modern, responsive UI for desktop and mobile</li>
      </ul>
    </div>
  );
};

export default DashboardPage;
