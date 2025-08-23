import React, { useState, useEffect } from 'react';

const SalesEntry = ({ products, onSaleLogged }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

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
    await fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(productId), quantity, total })
    });
    setProductId('');
    setQuantity(1);
    setTotal(0);
    if (onSaleLogged) onSaleLogged();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log Sale</h3>
      <select value={productId} onChange={e => setProductId(e.target.value)} required>
        <option value=''>Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
        ))}
      </select>
      <input type='number' min='1' value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
      <span>Total: ${total}</span>
      <button type='submit'>Log Sale</button>
    </form>
  );
};

export default SalesEntry;

