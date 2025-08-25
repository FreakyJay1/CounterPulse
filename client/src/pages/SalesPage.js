import React, { useEffect, useState } from 'react';
import SalesEntry from '../components/SalesEntry';
import SalesList from '../components/SalesList';
import useProductStore from '../store/productStore';

const SalesPage = () => {
  const { products, fetchProducts } = useProductStore();
  const [sales, setSales] = useState([]);
  const [showEntry, setShowEntry] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetch('http://192.168.0.108:5000/api/sales', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(setSales);
  }, [fetchProducts]);

  // Calculate Expense (cost price) and Income (product price)
  let expense = 0, income = 0;
  sales.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      expense += (product.costPrice || 0) * sale.quantity;
      income += (product.price || 0) * sale.quantity;
    }
  });

  const handleDownloadReport = () => {
    window.open('http://192.168.0.108:5000/api/report/shop', '_blank');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ color: '#1a2236', marginBottom: 32 }}>Sales Overview</h2>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Expense</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#e74c3c' }}>R{expense.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Income</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#27ae60' }}>R{income.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setShowEntry(true)} style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Log Sale</button>
          <button onClick={handleDownloadReport} style={{ width: '100%', padding: '12px 0', background: '#28304a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Download Shop Report</button>
        </div>
      </div>
      {showEntry && (
        <div style={{ marginBottom: 32 }}>
          <SalesEntry products={products} onSaleLogged={() => setShowEntry(false)} />
        </div>
      )}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
        <SalesList />
      </div>
    </div>
  );
};

export default SalesPage;
