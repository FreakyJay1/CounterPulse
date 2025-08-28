import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import { useUser } from '../utils/UserContext';

const ProductEntry = ({ product, onSaved, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    <form onSubmit={handleSubmit} style={{ minWidth: 340, maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h3 style={{ margin: 0, color: '#1a2236', fontWeight: 700, fontSize: 22, textAlign: 'center' }}>{product ? 'Edit Product' : 'Add Product'}</h3>
      {error && <div style={{ color: '#e74c3c', marginBottom: 8, textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: '#27ae60', marginBottom: 8, textAlign: 'center' }}>{success}</div>}
      <input type="text" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} style={inputStyle} />
      <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} min="0" step="0.01" />
      {role === 'owner' && (
        <input type="number" placeholder="Cost Price" value={costPrice} onChange={e => setCostPrice(e.target.value)} style={inputStyle} min="0" step="0.01" />
      )}
      <input type="text" placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} style={inputStyle} />
      <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} style={inputStyle} min="0" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>Cancel</button>
        <button type="submit" style={saveBtnStyle}>{product ? 'Update' : 'Save'}</button>
      </div>
    </form>
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

export default ProductEntry;
