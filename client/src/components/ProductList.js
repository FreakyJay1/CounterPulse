import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';
import { useUser } from '../utils/UserContext';
import BarcodeScanner from './BarcodeScanner';
import ProductEntry from './ProductEntry';

const ProductList = ({ setMessage }) => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const { role } = useUser();

  // Search and scanner state
  const [search, setSearch] = useState('');
  const [barcode, setBarcode] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (search || barcode) {
      searchProducts(search || barcode);
    } else {
      fetchProducts();
    }
  }, [search, barcode, fetchProducts, searchProducts]);

  const handleRemove = async (id) => {
    await removeProduct(id);
    setMessage && setMessage('Product removed successfully!');
    setTimeout(() => setMessage && setMessage(''), 1200);
    await fetchProducts();
  };

  if (products.length === 0) {
    return <div>No products added yet.</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => { setSearch(e.target.value); setBarcode(''); }}
        />
        <BarcodeScanner onDetected={code => { setBarcode(code); setSearch(''); }} />
        {(search || barcode) && (
          <button onClick={() => { setSearch(''); setBarcode(''); }}>Clear</button>
        )}
      </div>
      {(role === 'owner' || role === 'assistant') && products.filter(p => p.quantity < 3 && p.quantity > 0).length > 0 && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#ff9800',
          color: 'white',
          padding: '16px 28px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: 18,
          border: '2px solid #ff9800',
          marginBottom: 20
        }}>
          Low stock alert: {products.filter(p => p.quantity < 3 && p.quantity > 0).map(p => `${p.name} (Qty: ${p.quantity})`).join(', ')}
        </div>
      )}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} ({product.category}) - R{product.price.toFixed(2)} | Qty: {product.quantity}
            {role === 'owner' && product.costPrice !== undefined && (
              <span style={{ color: '#888', marginLeft: 8 }}>
                Cost: R{product.costPrice.toFixed(2)}
              </span>
            )}
            {barcode && <span style={{ color: 'green', marginLeft: 8 }}>Price: R{product.price.toFixed(2)}</span>}
            {role === 'owner' && (
              <>
                <button onClick={() => setEditingProduct(product)}>Edit</button>
                <button onClick={() => handleRemove(product.id)}>Remove</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {editingProduct && (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 16, position: 'fixed', top: '20%', left: '30%', zIndex: 1000 }}>
          <ProductEntry editProduct={editingProduct} onClose={() => setEditingProduct(null)} setMessage={setMessage} />
        </div>
      )}
    </>
  );
};

export default ProductList;
