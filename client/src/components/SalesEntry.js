import React, { useState, useEffect } from 'react';
import { useFeedback } from '../utils/FeedbackContext';

const SalesEntry = ({ products, onSaleLogged }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const { setMessage } = useFeedback();

  useEffect(() => {
    const selected = products.find(p => p.id === Number(productId));
    if (selected) {
      setTotal(selected.price * quantity);
    } else {
      setTotal(0);
    }
  }, [productId, quantity, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || quantity < 1) return;
    const res = await fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(productId), quantity, total })
    });
    if (res.ok) {
      setProductId('');
      setQuantity(1);
      setTotal(0);
      setMessage('Sale logged successfully!');
      if (onSaleLogged) onSaleLogged();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to log sale.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log Sale</h3>
      <select value={productId} onChange={e => setProductId(e.target.value)} required>
        <option value=''>Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name} (R{p.price})</option>
        ))}
      </select>
      <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
      <span>Total: R{total}</span>
      <button type='submit'>Log Sale</button>
    </form>
  );
};

export default SalesEntry;
