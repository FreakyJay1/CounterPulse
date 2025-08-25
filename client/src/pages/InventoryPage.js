import React, { useState } from 'react';
import ProductEntry from '../components/ProductEntry';
import useProductStore from '../store/productStore';
import axios from 'axios';
import { useUser } from '../utils/UserContext';
import BarcodeScanner from '../components/BarcodeScanner';

const InventoryPage = () => {
  const { role } = useUser();
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  React.useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 10000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      await axios.delete(`http://192.168.0.108:5000/api/products/${productId}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      fetchProducts();
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleSearch = () => {
    const found = products.find(p => p.name.toLowerCase() === searchTerm.trim().toLowerCase());
    setSearchResult(found || null);
  };

  const handleScan = (barcode) => {
    setShowScanner(false);
    const found = products.find(p => p.barcode === barcode);
    setSearchResult(found || null);
  };

  const closeDetails = () => setSearchResult(null);

  // Helper to get status and color
  const getStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', color: '#e74c3c', bg: '#fdecea' };
    if (quantity < 3) return { label: 'Low Stock', color: '#f39c12', bg: '#fff6e3' };
    return { label: 'In Stock', color: '#27ae60', bg: '#eafaf1' };
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ color: '#1a2236', margin: 0 }}>Inventory</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 15, background: '#f8fafc', marginRight: 4 }}
          />
          <button onClick={handleSearch} style={{ background: '#28304a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Search</button>
          <button onClick={() => setShowScanner(true)} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Scan</button>
          {role !== 'assistant' && (
            <button onClick={handleAdd} style={{ background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Add Product</button>
          )}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#f6f8fa', height: 56 }}>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Product</th>
              <th style={{ padding: 16, textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Barcode</th>
              <th style={{ padding: 16, textAlign: 'right', fontWeight: 700, fontSize: 15 }}>Quantity</th>
              <th style={{ padding: 16, textAlign: 'right', fontWeight: 700, fontSize: 15 }}>Price</th>
              <th style={{ padding: 16, textAlign: 'right', fontWeight: 700, fontSize: 15 }}>Cost Price</th>
              <th style={{ padding: 16, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Status</th>
              {role !== 'assistant' && (
                <th style={{ padding: 16, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={role !== 'assistant' ? 7 : 6} style={{ textAlign: 'center', padding: 32, color: '#888' }}>No products found.</td></tr>
            ) : products.map(product => {
              const status = getStatus(product.quantity);
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0', height: 56 }}>
                  <td style={{ padding: 16 }}>{product.name}</td>
                  <td style={{ padding: 16 }}>{product.barcode}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>{product.quantity}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>R{product.price?.toFixed(2)}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>R{product.costPrice?.toFixed(2)}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 12, fontWeight: 600, fontSize: 14, color: status.color, background: status.bg }}>
                      {status.label}
                    </span>
                  </td>
                  {role !== 'assistant' && (
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <button onClick={() => handleEdit(product)} style={{ marginRight: 8, background: '#1a2236', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleRemove(product.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer' }}>Remove</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && role !== 'assistant' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: 32, minWidth: 400, minHeight: 200 }}>
            <ProductEntry product={editingProduct} onSaved={handleFormClose} onCancel={handleFormClose} />
          </div>
        </div>
      )}
      {showScanner && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: 32, minWidth: 400, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BarcodeScanner onDetected={handleScan} onCancel={() => setShowScanner(false)} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setShowScanner(false)} style={{ marginTop: 24, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {searchResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 24px rgba(0,0,0,0.14)', padding: 36, minWidth: 420, minHeight: 220, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#1a2236', marginBottom: 18, fontWeight: 700, fontSize: 26, letterSpacing: 1 }}>Product Details</h2>
            <div style={{ width: '100%', marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Name:</span> {searchResult.name}</div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Barcode:</span> {searchResult.barcode}</div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Category:</span> {searchResult.category}</div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Quantity:</span> {searchResult.quantity}</div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Price:</span> <span style={{ color: '#27ae60', fontWeight: 700 }}>R{searchResult.price?.toFixed(2)}</span></div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Cost Price:</span> <span style={{ color: '#e67e22', fontWeight: 700 }}>R{searchResult.costPrice?.toFixed(2)}</span></div>
              <div><span style={{ fontWeight: 600, color: '#28304a' }}>Status:</span> <span style={{ display: 'inline-block', marginLeft: 8, padding: '4px 14px', borderRadius: 12, fontWeight: 600, fontSize: 14, color: getStatus(searchResult.quantity).color, background: getStatus(searchResult.quantity).bg }}>{getStatus(searchResult.quantity).label}</span></div>
            </div>
            <button onClick={closeDetails} style={{ marginTop: 10, background: '#28304a', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
