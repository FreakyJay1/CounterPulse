import React, { useEffect, useState, useCallback } from 'react';
import SalesEntry from '../components/SalesEntry';
import SalesList, { SalesGraph } from '../components/SalesList';
import useProductStore from '../store/productStore';

const SalesPage = () => {
  const { products, fetchProducts } = useProductStore();
  const [sales, setSales] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products, then sales
  const refreshData = useCallback(async () => {
    setProductsLoading(true);
    await fetchProducts();
    setProductsLoading(false);
    fetch('http://192.168.0.108:5000/api/sales', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSales(data);
        else setSales([]); // fallback if error or not array
      });
  }, [fetchProducts]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Calculate Expense (cost price), Income (product price), and Profit
  let expense = 0, income = 0;
  if (!productsLoading && products.length > 0) {
    sales.forEach(sale => {
      if (sale.SaleItems) {
        sale.SaleItems.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            expense += (product.costPrice || 0) * item.quantity;
            income += (product.price || 0) * item.quantity;
          }
        });
      }
    });
  }
  const profit = income - expense;

  const handleDownloadReport = () => {
    window.open('http://192.168.0.108:5000/api/report/shop', '_blank');
  };

  if (productsLoading || products.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#888', fontSize: 20 }}>Loading sales dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ color: '#1a2236', marginBottom: 32, fontWeight: 800, letterSpacing: 1 }}>Sales Overview</h2>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Expense</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#e74c3c' }}>R{expense.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Income</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#27ae60' }}>R{income.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Profit</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1a2236' }}>R{profit.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setShowEntry(true)} style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Log Sale</button>
          <button onClick={handleDownloadReport} style={{ width: '100%', padding: '12px 0', background: '#28304a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Download Shop Report</button>
        </div>
      </div>
      <SalesGraph sales={sales} products={products} />
      {showEntry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ minWidth: 350, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <SalesEntry products={products} onSaleLogged={() => { setShowEntry(false); refreshData(); }} onCancel={() => setShowEntry(false)} />
          </div>
        </div>
      )}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
        <SalesList sales={sales} products={products} />
      </div>
    </div>
  );
};

export default SalesPage;
