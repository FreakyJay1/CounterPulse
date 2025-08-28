import React, { useState } from 'react';
import { useFeedback } from '../utils/FeedbackContext';
import BarcodeScanner from './BarcodeScanner';
import { queueAction } from '../utils/offlineQueue';

const SalesEntry = ({ products, onSaleLogged, onCancel }) => {
  const [items, setItems] = useState([]); // { productId, quantity, total }
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { setMessage } = useFeedback();

  const handleAddItem = () => {
    const product = products.find(p => p.id === Number(selectedProductId));
    if (!product || quantity < 1) return;
    const existing = items.find(item => item.productId === product.id);
    if (existing) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * product.price }
          : item
      ));
    } else {
      setItems([
        ...items,
        { productId: product.id, quantity, total: quantity * product.price, name: product.name, price: product.price }
      ]);
    }
    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        setMessage('A selected product no longer exists.');
        return;
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        setMessage('Quantity must be a positive integer.');
        return;
      }
      if (product.quantity < item.quantity) {
        setMessage(`Not enough stock for ${product.name}. Available: ${product.quantity}`);
        return;
      }
    }
    const salePayload = { items: items.map(({ productId, quantity, total }) => ({ productId, quantity, total })) };
    if (!navigator.onLine) {
      const clientId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      queueAction({ type: 'LOG_SALE', payload: { ...salePayload, clientId } });
      setItems([]);
      setMessage('Sale queued (offline).');
      if (onSaleLogged) onSaleLogged();
      return;
    }
    try {
      const res = await fetch('http://192.168.0.108:5000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salePayload)
      });
      if (res.ok) {
        setItems([]);
        setMessage('Sale logged successfully!');
        if (onSaleLogged) onSaleLogged();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Failed to log sale.');
      }
    } catch (err) {
      queueAction({ type: 'LOG_SALE', payload: salePayload });
      setItems([]);
      setMessage('Sale queued (offline due to network error).');
      if (onSaleLogged) onSaleLogged();
    }
  };

  const handleBarcodeDetected = (barcode) => {
    const product = products.find(p => p.barcode === barcode);
    if (!product) {
      setMessage('Product not found for scanned barcode.');
      return;
    }
    const existing = items.find(item => item.productId === product.id);
    if (existing) {
      setItems(items.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * product.price }
          : item
      ));
    } else {
      setItems([
        ...items,
        { productId: product.id, quantity: 1, total: product.price, name: product.name, price: product.price }
      ]);
    }
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 18, padding: 32, boxShadow: '0 8px 32px rgba(30,34,54,0.10)', maxWidth: 650, margin: '0 auto', marginTop: 32, marginBottom: 32, border: '1.5px solid #e9eef3', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <span role="img" aria-label="cart" style={{ fontSize: 32, marginRight: 16 }}>🛒</span>
        <h3 style={{ margin: 0, color: '#1a2236', fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>Log Sale</h3>
      </div>
      <div style={{ marginBottom: 24, padding: 18, background: '#f4f7fa', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <BarcodeScanner onDetected={handleBarcodeDetected} />
      </div>
      <div style={{ textAlign: 'center', color: '#888', fontWeight: 600, margin: '12px 0 18px 0' }}>or add product manually</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} style={{ flex: 2, borderRadius: 8, border: '1px solid #d1d5db', padding: 10, fontSize: 16, background: '#f9fafb' }}>
          <option value=''>Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} (R{p.price})</option>
          ))}
        </select>
        <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value))} required style={{ flex: 1, borderRadius: 8, border: '1px solid #d1d5db', padding: 10, fontSize: 16, background: '#f9fafb' }} />
        <button type='button' onClick={handleAddItem} style={{ flex: 1, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span role="img" aria-label="add">➕</span> Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px rgba(30,34,54,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#f9fafb' }}>
            <thead>
              <tr style={{ background: '#e9eef3' }}>
                <th style={{ textAlign: 'left', padding: 12, fontWeight: 700, color: '#1a2236' }}>Product</th>
                <th style={{ textAlign: 'right', padding: 12, fontWeight: 700, color: '#1a2236' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: 12, fontWeight: 700, color: '#1a2236' }}>Price</th>
                <th style={{ textAlign: 'right', padding: 12, fontWeight: 700, color: '#1a2236' }}>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.productId} style={{ background: '#fff', borderBottom: '1px solid #e9eef3', transition: 'background 0.2s' }}>
                  <td style={{ padding: 12, fontWeight: 600, color: '#28304a', display: 'flex', alignItems: 'center' }}>
                    <span role="img" aria-label="box" style={{ marginRight: 8, fontSize: 18 }}>📦</span>
                    {item.name}
                  </td>
                  <td style={{ textAlign: 'right', padding: 12 }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right', padding: 12, color: '#27ae60', fontWeight: 600 }}>R{item.price}</td>
                  <td style={{ textAlign: 'right', padding: 12, fontWeight: 700, color: '#1a2236' }}>R{item.total}</td>
                  <td style={{ textAlign: 'center', padding: 12 }}>
                    <button type='button' onClick={() => handleRemoveItem(item.productId)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18 }} title="Remove">
                      <span role="img" aria-label="remove">❌</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ textAlign: 'right', fontWeight: 800, marginBottom: 28, fontSize: 22, color: '#1a2236', letterSpacing: 1 }}>
        Total: <span style={{ color: '#27ae60' }}>R{total.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <button type='submit' disabled={items.length === 0} style={{ flex: 1, padding: '16px 0', background: items.length === 0 ? '#d1d5db' : '#1a2236', color: '#fff', border: 'none', borderRadius: 10, fontSize: 20, fontWeight: 800, cursor: items.length === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s', boxShadow: '0 2px 8px rgba(30,34,54,0.08)' }}>
          <span role="img" aria-label="log">💾</span> Log Sale
        </button>
        <button type='button' onClick={onCancel} style={{ flex: 1, padding: '16px 0', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 10, fontSize: 20, fontWeight: 800, cursor: 'pointer', marginLeft: 12, boxShadow: '0 2px 8px rgba(231,76,60,0.08)' }}>
          <span role="img" aria-label="cancel">🚫</span> Cancel
        </button>
      </div>
    </form>
  );
};

export default SalesEntry;
