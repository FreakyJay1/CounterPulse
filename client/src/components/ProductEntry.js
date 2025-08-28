import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import { useUser } from '../utils/UserContext';
import BarcodeScanner from './BarcodeScanner';

const ProductEntry = ({ product, onSaved, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const { role } = useUser();

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price?.toString() || '');
      setBarcode(product.barcode || '');
      setQuantity(product.quantity?.toString() || '');
      setCostPrice(product.costPrice?.toString() || '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setBarcode('');
      setQuantity('');
      setCostPrice('');
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !category || !price || !quantity || !costPrice) {
      setError('All fields are required.');
      return;
    }
    try {
      if (product && product.id) {
        const updatePayload = {
          id: product.id,
          name,
          category,
          price: parseFloat(price),
          costPrice: parseFloat(costPrice),
          barcode,
          quantity: parseInt(quantity, 10)
        };
        await updateProduct(updatePayload);
        setSuccess('Product updated successfully!');
      } else {
        const addPayload = {
          name,
          category,
          price: parseFloat(price),
          costPrice: parseFloat(costPrice),
          barcode,
          quantity: parseInt(quantity, 10)
        };
        await addProduct(addPayload);
        setSuccess('Product added successfully!');
      }
      setTimeout(() => {
        if (onSaved) onSaved();
      }, 1800);
    } catch (err) {
      setError('Failed to save product.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 420, width: '100%' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 2px 24px rgba(30,34,54,0.10)',
        minWidth: 340,
        maxWidth: 420,
        width: '100%',
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        position: 'relative',
      }}>
        <h3 style={{ margin: 0, color: '#1a2236', fontWeight: 800, fontSize: 26, textAlign: 'center', letterSpacing: 1 }}>{product ? 'Edit Product' : 'Add Product'}</h3>
        {error && <div style={{ background: '#ffeaea', color: '#e74c3c', borderRadius: 8, padding: '10px 0', textAlign: 'center', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ background: '#eafaf1', color: '#27ae60', borderRadius: 8, padding: '10px 0', textAlign: 'center', fontWeight: 600 }}>{success}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={labelStyle}>Product Name</label>
          <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={labelStyle}>Category</label>
          <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={labelStyle}>Price</label>
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} min="0" step="0.01" />
          </div>
          {role === 'owner' && (
            <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={labelStyle}>Cost Price</label>
              <input type="number" placeholder="Cost Price" value={costPrice} onChange={e => setCostPrice(e.target.value)} style={inputStyle} min="0" step="0.01" />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>Barcode</label>
            <input type="text" placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
            <button type="button" onClick={() => setShowScanner(true)} style={{ ...scanBtnStyle, width: '100%', height: 40 }}>Scan</button>
          </div>
          <div style={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'flex-end' }}>
            <label style={labelStyle}>Quantity</label>
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} style={inputStyle} min="0" />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
          <button type="button" onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
          <button type="submit" style={saveBtnStyle}>{product ? 'Update' : 'Add'}</button>
        </div>
        {showScanner && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 24px rgba(0,0,0,0.14)', padding: 36, minWidth: 420, minHeight: 220, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: '#1a2236', marginBottom: 18, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>Scan Product Barcode</h2>
              <BarcodeScanner onDetected={code => { setBarcode(code); setShowScanner(false); }} />
              <button onClick={() => setShowScanner(false)} style={{ marginTop: 18, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 6,
  border: '1px solid #d1d5db',
  fontSize: 15,
  outline: 'none',
  background: '#f8fafc',
};

const saveBtnStyle = {
  background: '#1a2236',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 28px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
};

const cancelBtnStyle = {
  background: '#e0e0e0',
  color: '#1a2236',
  border: 'none',
  borderRadius: 6,
  padding: '10px 22px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
};

const labelStyle = {
  fontWeight: 600,
  color: '#28304a',
  fontSize: 15,
  marginBottom: 2,
  letterSpacing: 0.2,
};

const scanBtnStyle = {
  background: '#27ae60',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(39,174,96,0.08)',
  transition: 'background 0.2s, box-shadow 0.2s',
};

export default ProductEntry;
