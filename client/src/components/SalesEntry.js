import React from 'react';

const SalesEntry = ({ products, onAddSale, onCancel, loading }) => {
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [quantities, setQuantities] = React.useState({});

  const handleProductChange = (productId, checked) => {
    setSelectedProducts(checked
      ? [...selectedProducts, productId]
      : selectedProducts.filter(id => id !== productId)
    );
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const saleProducts = selectedProducts.map(id => ({
      productId: id,
      quantity: Number(quantities[id]) || 1
    }));
    onAddSale(saleProducts);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, marginBottom: 18 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#232837' }}>Log Sale</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
        {products.map(product => (
          <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={e => handleProductChange(product.id, e.target.checked)}
            />
            <span style={{ fontWeight: 600, color: '#232837', fontSize: 15 }}>{product.name} (R{product.price})</span>
            <input
              type="number"
              min={1}
              max={product.quantity}
              value={quantities[product.id] || ''}
              onChange={e => handleQuantityChange(product.id, e.target.value)}
              style={{ width: 60, padding: 6, borderRadius: 6, border: '1px solid #e0e0e0', fontSize: 15 }}
              disabled={!selectedProducts.includes(product.id)}
              placeholder="Qty"
            />
            <span style={{ color: '#b0b6c3', fontSize: 13 }}>in stock: {product.quantity}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit"
          disabled={loading || selectedProducts.length === 0}
          style={{ flex: 1, padding: 12, borderRadius: 8, background: '#232837', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none' }}
        >
          {loading ? 'Logging...' : 'Log Sale'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ flex: 1, padding: 12, borderRadius: 8, background: '#e0e0e0', color: '#232837', fontWeight: 700, fontSize: 16, border: 'none' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SalesEntry;
