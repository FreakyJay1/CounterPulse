import React from 'react';
import { FaBoxOpen } from 'react-icons/fa';

const SalesList = ({ sales }) => {
  const latestSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: '#232837', letterSpacing: 1 }}>Sales History</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {latestSales.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#b0b6c3', padding: 24, background: '#fff', borderRadius: 12, fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>No sales yet.</div>
        ) : (
          latestSales.map(sale => {
            const totalIncome = sale.products.reduce((sum, p) => sum + ((p.price || 0) * p.quantity), 0);
            const totalExpense = sale.products.reduce((sum, p) => sum + ((p.costPrice || 0) * p.quantity), 0);
            return (
              <div key={sale.transactionId} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 22px', marginBottom: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: '#232837', fontSize: 16 }}>Sale on {sale.date ? new Date(sale.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</div>
                  <div>
                    <span style={{ background: '#27ae60', color: '#fff', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 15, marginRight: 8 }}>+R{totalIncome.toFixed(2)}</span>
                    <span style={{ background: '#e74c3c', color: '#fff', borderRadius: 8, padding: '4px 12px', fontWeight: 600, fontSize: 15 }}>-R{totalExpense.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sale.products.map(product => (
                    <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f7f7fa', borderRadius: 8, padding: '8px 12px' }}>
                      <span style={{ background: '#f7c948', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                        <FaBoxOpen size={16} color="#232837" />
                      </span>
                      <span style={{ color: '#232837', fontWeight: 600, fontSize: 15 }}>{product.productName}</span>
                      <span style={{ color: '#b0b6c3', fontSize: 13 }}>x{product.quantity}</span>
                      <span style={{ color: '#27ae60', fontWeight: 600, fontSize: 14, marginLeft: 'auto' }}>+R{((product.price || 0) * product.quantity).toFixed(2)}</span>
                      <span style={{ color: '#e74c3c', fontWeight: 600, fontSize: 14, marginLeft: 8 }}>-R{((product.costPrice || 0) * product.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SalesList;
