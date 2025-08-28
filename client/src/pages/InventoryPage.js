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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0', background: '#f7fafd', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <span role="img" aria-label="box" style={{ fontSize: 36, marginRight: 8 }}>📦</span>
        <h2 style={{ color: '#1a2236', margin: 0, fontWeight: 900, fontSize: 34, letterSpacing: 1 }}>Inventory</h2>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '18px 24px', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <span role="img" aria-label="search" style={{ fontSize: 20, marginRight: 4, color: '#888' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#f8fafc', marginRight: 4, flex: 1 }}
          />
          <button onClick={handleSearch} style={{ background: '#28304a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="search">🔎</span> Search
          </button>
          <button
            onClick={() => setShowScanner(true)}
            style={{
              background: '#27ae60',
              color: '#fff',
              border: 'none',
              borderRadius: 32,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(39,174,96,0.10)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#219150'}
            onMouseOut={e => e.currentTarget.style.background = '#27ae60'}
          >
            <span role="img" aria-label="barcode" style={{ fontSize: 20 }}>📷</span>
            Scan
          </button>
          {role !== 'assistant' && (
            <button onClick={handleAdd} style={{ background: '#1a2236', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="add">➕</span> Add Product
            </button>
          )}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 0, overflow: 'hidden', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 17 }}>
          <thead>
            <tr style={{ background: '#f6f8fa', height: 56 }}>
              <th style={{ padding: 18, textAlign: 'left', fontWeight: 800, fontSize: 16 }}>Product</th>
              <th style={{ padding: 18, textAlign: 'left', fontWeight: 800, fontSize: 16 }}>Barcode</th>
              <th style={{ padding: 18, textAlign: 'right', fontWeight: 800, fontSize: 16 }}>Quantity</th>
              <th style={{ padding: 18, textAlign: 'right', fontWeight: 800, fontSize: 16 }}>Price</th>
              {role !== 'assistant' && (
                <th style={{ padding: 18, textAlign: 'right', fontWeight: 800, fontSize: 16 }}>Cost Price</th>
              )}
              <th style={{ padding: 18, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>Status</th>
              {role !== 'assistant' && (
                <th style={{ padding: 18, textAlign: 'center', fontWeight: 800, fontSize: 16 }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={role !== 'assistant' ? 7 : 6} style={{ textAlign: 'center', padding: 48, color: '#888', fontSize: 20 }}>
                <span role="img" aria-label="empty" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>📭</span>
                No products found.
              </td></tr>
            ) : products.map((product, idx) => {
              const status = getStatus(product.quantity);
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0', height: 60, background: idx % 2 === 0 ? '#fff' : '#f7fafd', transition: 'background 0.2s' }}>
                  <td style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#28304a' }}>
                    <span role="img" aria-label="box" style={{ fontSize: 22 }}>📦</span>
                    {product.name}
                  </td>
                  <td style={{ padding: 18 }}>{product.barcode}</td>
                  <td style={{ padding: 18, textAlign: 'right' }}>{product.quantity}</td>
                  <td style={{ padding: 18, textAlign: 'right', color: '#27ae60', fontWeight: 700 }}>R{product.price?.toFixed(2)}</td>
                  {role !== 'assistant' && (
                    <td style={{ padding: 18, textAlign: 'right', color: '#e67e22', fontWeight: 700 }}>R{product.costPrice?.toFixed(2)}</td>
                  )}
                  <td style={{ padding: 18, textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 18px', borderRadius: 16, fontWeight: 800, fontSize: 15, color: status.color, background: status.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                      {status.label === 'In Stock' && <span role="img" aria-label="check">✅</span>}
                      {status.label === 'Low Stock' && <span role="img" aria-label="warning">⚠️</span>}
                      {status.label === 'Out of Stock' && <span role="img" aria-label="cross">❌</span>}
                      {status.label}
                    </span>
                  </td>
                  {role !== 'assistant' && (
                    <td style={{ padding: 18, textAlign: 'center' }}>
                      <button onClick={() => handleEdit(product)} style={{ marginRight: 8, background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span role="img" aria-label="edit">✏️</span> Edit
                      </button>
                      <button onClick={() => handleRemove(product.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span role="img" aria-label="remove">🗑️</span> Remove
                      </button>
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
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(30,34,54,0.18)', padding: 0, minWidth: 420, minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', maxWidth: '90vw' }}>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px 12px 32px', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderBottom: '1.5px solid #e9eef3', background: '#f4f7fa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span role="img" aria-label="barcode" style={{ fontSize: 28 }}>📷</span>
                <span style={{ fontWeight: 800, fontSize: 22, color: '#1a2236', letterSpacing: 1 }}>Scan Product Barcode</span>
              </div>
              <button onClick={() => setShowScanner(false)} style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: 28, fontWeight: 700, cursor: 'pointer', marginLeft: 12, lineHeight: 1 }} title="Close">×</button>
            </div>
            <div style={{ padding: '24px 32px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff' }}>
              <div style={{ marginBottom: 18, color: '#888', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>Point your camera at the product barcode to search inventory.</div>
              <div style={{ background: '#f9fafb', borderRadius: 14, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 18, width: 320, maxWidth: '80vw' }}>
                <BarcodeScanner onDetected={handleScan} onCancel={() => setShowScanner(false)} />
              </div>
              <button onClick={() => setShowScanner(false)} style={{ marginTop: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 36px', fontWeight: 700, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.08)' }}>Cancel</button>
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
              {role !== 'assistant' && (
                <div><span style={{ fontWeight: 600, color: '#28304a' }}>Cost Price:</span> <span style={{ color: '#e67e22', fontWeight: 700 }}>R{searchResult.costPrice?.toFixed(2)}</span></div>
              )}
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
