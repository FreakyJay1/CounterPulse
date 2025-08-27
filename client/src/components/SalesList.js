import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const SalesList = ({ sales, products }) => {
  const latestSales = [...sales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <h3 style={{ marginBottom: 8, color: '#1a2236', fontWeight: 800, fontSize: 22, letterSpacing: 1, borderBottom: '2px solid #e9eef3', paddingBottom: 8, marginTop: 0 }}>Latest Sales</h3>
      {latestSales.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: 32, fontSize: 18, background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span role="img" aria-label="info" style={{ fontSize: 24, marginRight: 8 }}>ℹ️</span>
          No sales recorded yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {latestSales.map(sale => (
            sale.SaleItems && sale.SaleItems.length > 0 && (
              <div key={sale.id} style={{ background: '#fff', borderRadius: 18, padding: 28, boxShadow: '0 6px 24px rgba(30,34,54,0.08)', border: '1.5px solid #e9eef3', maxWidth: 700, margin: '0 auto', transition: 'box-shadow 0.2s', cursor: 'pointer', position: 'relative' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,34,54,0.13)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(30,34,54,0.08)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: '#1a2236', fontSize: 18, letterSpacing: 0.5, display: 'flex', alignItems: 'center' }}>
                    <span role="img" aria-label="receipt" style={{ marginRight: 10, fontSize: 22 }}>🧾</span>
                    <span style={{ background: '#f4f7fa', borderRadius: 8, padding: '4px 12px', fontSize: 15, color: '#28304a', marginRight: 10 }}>
                      {sale.date ? (
                        new Date(sale.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })
                      ) : 'N/A'}
                    </span>
                    <span style={{ color: '#888', fontSize: 14 }}>
                      {sale.date ? (
                        new Date(sale.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ) : 'N/A'}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', background: '#27ae60', borderRadius: 8, padding: '6px 18px', fontSize: 18, boxShadow: '0 2px 8px rgba(39,174,96,0.08)' }}>Total: R{sale.total}</div>
                </div>
                <table style={{ width: '100%', marginBottom: 8, borderCollapse: 'separate', borderSpacing: 0, fontSize: 15, background: '#f9fafb', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(30,34,54,0.03)' }}>
                  <thead>
                    <tr style={{ background: '#e9eef3' }}>
                      <th style={{ textAlign: 'left', padding: 10, fontWeight: 700, color: '#1a2236' }}>Product</th>
                      <th style={{ textAlign: 'right', padding: 10, fontWeight: 700, color: '#1a2236' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: 10, fontWeight: 700, color: '#1a2236' }}>Price</th>
                      <th style={{ textAlign: 'right', padding: 10, fontWeight: 700, color: '#1a2236' }}>Cost</th>
                      <th style={{ textAlign: 'right', padding: 10, fontWeight: 700, color: '#1a2236' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.SaleItems.map((item, idx) => {
                      const product = item.Product || products.find(p => p.id === item.productId);
                      return (
                        <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f4f7fa' }}>
                          <td style={{ padding: 10, fontWeight: 600, color: '#28304a', display: 'flex', alignItems: 'center' }}>
                            <span role="img" aria-label="box" style={{ marginRight: 8, fontSize: 18 }}>📦</span>
                            {product ? product.name : 'Unknown Product'}
                          </td>
                          <td style={{ textAlign: 'right', padding: 10 }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: 10, color: '#27ae60', fontWeight: 600 }}>R{product ? product.price : '-'}</td>
                          <td style={{ textAlign: 'right', padding: 10, color: '#e74c3c', fontWeight: 600 }}>R{product ? product.costPrice : '-'}</td>
                          <td style={{ textAlign: 'right', padding: 10, fontWeight: 700, color: '#1a2236' }}>R{item.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export const SalesGraph = ({ sales, products }) => {
  const grouped = {};
  sales.forEach(sale => {
    const day = sale.date ? new Date(sale.date).toISOString().slice(0, 10) : 'N/A';
    if (!grouped[day]) grouped[day] = { income: 0, expense: 0 };
    if (sale.SaleItems) {
      sale.SaleItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          grouped[day].income += (product.price || 0) * item.quantity;
          grouped[day].expense += (product.costPrice || 0) * item.quantity;
        }
      });
    }
  });
  const data = Object.entries(grouped).map(([date, { income, expense }]) => ({
    date,
    income,
    expense,
    profit: income - expense
  })).sort((a, b) => new Date(a.date) - new Date(b.date)); // oldest on left, newest on right
  console.log('SalesGraph data order:', data.map(d => d.date));

  function formatDateLabel(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB'); // e.g. 27/08/2025
  }

  return (
    <div style={{ width: '100%', height: 260, marginBottom: 32, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
      <h3 style={{ marginBottom: 16, color: '#1a2236', fontWeight: 700 }}>Sales Trend (24h)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDateLabel} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={v => `R${v}`} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#27ae60" strokeWidth={2} dot={{ r: 3 }} name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#e74c3c" strokeWidth={2} dot={{ r: 3 }} name="Expense" />
          <Line type="monotone" dataKey="profit" stroke="#1a2236" strokeWidth={2} dot={{ r: 3 }} name="Profit" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesList;
