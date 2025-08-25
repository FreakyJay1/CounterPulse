import React, { useEffect, useState, useMemo } from 'react';
import SalesEntry from '../components/SalesEntry';
import SalesList from '../components/SalesList';
import useProductStore from '../store/productStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useUser } from '../utils/UserContext';

const API_SALES = 'http://192.168.0.108:5000/api/sales';
const API_REPORT = 'http://192.168.0.108:5000/api/report/shop';

const SalesPage = () => {
  const { products, fetchProducts } = useProductStore();
  const { role } = useUser();
  const [sales, setSales] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    const res = await fetch(API_SALES, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const data = await res.json();
    setSales(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      fetchSales();
    }
  }, [products]);

  useEffect(() => {
    if (sales.length > 0) {
      console.log('Sales:', sales);
    }
  }, [sales]);

  const handleSaleLogged = () => {
    fetchProducts();
    setShowEntry(false);
  };

  const { income, expense, chartData } = useMemo(() => {
    let income = 0, expense = 0;
    const hourly = {};
    sales.forEach(sale => {
      if (Array.isArray(sale.products)) {
        sale.products.forEach(product => {
          const date = new Date(sale.date);
          const hour = date.getHours().toString().padStart(2, '0') + ':00';
          if (!hourly[hour]) hourly[hour] = { hour, income: 0, expense: 0 };
          hourly[hour].income += (product.price || 0) * product.quantity;
          hourly[hour].expense += (product.costPrice || 0) * product.quantity;
          income += (product.price || 0) * product.quantity;
          expense += (product.costPrice || 0) * product.quantity;
        });
      }
    });
    for (let h = 0; h < 24; h++) {
      const hour = h.toString().padStart(2, '0') + ':00';
      if (!hourly[hour]) hourly[hour] = { hour, income: 0, expense: 0 };
    }
    const chartData = Object.values(hourly).sort((a, b) => a.hour.localeCompare(b.hour));
    return { income, expense, chartData };
  }, [sales, products]);

  const handleDownloadReport = () => {
    window.open(API_REPORT, '_blank');
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32, marginTop: -10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {role === 'owner' && (
          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 1, background: '#f7f7fa', borderRadius: 16, padding: 28, color: '#232837', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 16, color: '#b0b6c3', marginBottom: 8 }}>Expense</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#e74c3c' }}>R{expense.toFixed(2)}</div>
            </div>
            <div style={{ flex: 1, background: '#f7f7fa', borderRadius: 16, padding: 28, color: '#232837', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 16, color: '#b0b6c3', marginBottom: 8 }}>Income</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#27ae60' }}>R{income.toFixed(2)}</div>
            </div>
            <div style={{ flex: 1, background: '#f7f7fa', borderRadius: 16, padding: 28, color: '#232837', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setShowEntry(true)} style={{ width: '100%', padding: '12px 0', background: '#232837', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Log Sale</button>
              <button onClick={handleDownloadReport} style={{ width: '100%', padding: '12px 0', background: '#b0b6c3', color: '#232837', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Download Shop Report</button>
            </div>
          </div>
        )}
        {['assistance', 'assistant'].includes(role) && (
          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 1, background: '#f7f7fa', borderRadius: 16, padding: 28, color: '#232837', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setShowEntry(true)} style={{ width: '100%', padding: '12px 0', background: '#232837', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Log Sale</button>
            </div>
          </div>
        )}
        {role === 'owner' && (
          <div style={{ background: '#f7f7fa', borderRadius: 16, padding: 28, marginBottom: 32, color: '#232837', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Income & Expense Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e0e0e0" />
                <XAxis dataKey="hour" stroke="#b0b6c3" fontSize={13} />
                <YAxis stroke="#b0b6c3" fontSize={13} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="#e74c3c" strokeWidth={3} dot={false} name="Expense" />
                <Line type="monotone" dataKey="income" stroke="#27ae60" strokeWidth={3} dot={false} name="Income" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <SalesList sales={sales} />
        {showEntry && <SalesEntry products={products} onSaleLogged={handleSaleLogged} onClose={() => setShowEntry(false)} />}
      </div>
    </div>
  );
};

export default SalesPage;
