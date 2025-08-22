import React, { useState } from 'react';
import useProductStore from '../store/productStore';
import BarcodeScanner from './BarcodeScanner';

const ProductEntry = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const addProduct = useProductStore((state) => state.addProduct);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    addProduct({ id: barcode || Date.now(), name, price: parseFloat(price), barcode });
    setName('');
    setPrice('');
    setBarcode('');
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
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Barcode (optional)"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        readOnly
      />
      <BarcodeScanner onDetected={setBarcode} />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductEntry;
