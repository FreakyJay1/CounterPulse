import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';
import BarcodeScanner from './BarcodeScanner';

const ProductEntry = ({ editProduct, onClose, setMessage }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [error, setError] = useState('');
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name || '');
      setCategory(editProduct.category || '');
      setPrice(editProduct.price?.toString() || '');
      setBarcode(editProduct.barcode || '');
      setQuantity(editProduct.quantity?.toString() || '');
      setCostPrice(editProduct.costPrice?.toString() || '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setBarcode('');
      setQuantity('');
      setCostPrice('');
    }
  }, [editProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !category || !price || !quantity || !costPrice) return;
    try {
      if (editProduct && editProduct.id) {
        const updatePayload = {
          id: editProduct.id,
          name,
          category,
          price: parseFloat(price),
          costPrice: parseFloat(costPrice),
          barcode,
          quantity: parseInt(quantity, 10)
        };
        await updateProduct(updatePayload);
        setMessage && setMessage('Product updated successfully!');
        await fetchProducts();
        if (onClose) onClose();
      } else {
        await addProduct({ name, category, price: parseFloat(price), costPrice: parseFloat(costPrice), barcode, quantity: parseInt(quantity, 10) });
        setMessage && setMessage('Product added successfully!');
        setName('');
        setCategory('');
        setPrice('');
        setBarcode('');
        setQuantity('');
        setCostPrice('');
        await fetchProducts();
      }
    } catch (err) {
      setError('Failed to save product.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cost Price"
        value={costPrice}
        onChange={(e) => setCostPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Barcode (optional)"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        readOnly
      />
      <BarcodeScanner onDetected={setBarcode} />
      {editProduct ? (
        <>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </>
      ) : (
        <button type="submit">Add Product</button>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ProductEntry;
