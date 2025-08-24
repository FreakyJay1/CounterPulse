import React, { useState } from 'react';
import ProductEntry from '../components/ProductEntry';
import ProductList from '../components/ProductList';
import { useUser } from '../utils/UserContext';
import { useFeedback } from '../utils/FeedbackContext';
import axios from 'axios';
import useProductStore from '../store/productStore';

const InventoryPage = () => {
  const { role } = useUser();
  const { message, setMessage } = useFeedback();
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  React.useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const lowStockProducts = products.filter(p => p.quantity < 3 && p.quantity > 0);

  React.useEffect(() => {
    if (message) {
      console.log('SUCCESS MESSAGE SET:', message);
    } else {
      console.log('SUCCESS MESSAGE CLEARED');
    }
  }, [message]);

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const downloadReport = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/report/shop', {
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'shop_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Inventory</h2>
      {message && (
        <div id="debug-green-feedback" style={{
          color: '#155724',
          background: '#d4edda',
          border: '5px dashed #28a745',
          borderRadius: 8,
          padding: '18px 24px',
          marginBottom: 20,
          fontWeight: 'bold',
          fontSize: 22,
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(40,167,69,0.15)',
          minHeight: 40,
          opacity: 1
        }}>
          {message}
        </div>
      )}
      {role === 'owner' && (
        <>
          <ProductEntry setMessage={setMessage} />
          <button onClick={downloadReport} style={{ margin: '10px 0' }}>Download Shop Report (PDF)</button>
        </>
      )}
      <ProductList setMessage={setMessage} />
    </div>
  );
};

export default InventoryPage;
