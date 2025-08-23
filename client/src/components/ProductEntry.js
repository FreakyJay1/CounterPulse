import React, { useState } from 'react';
import useProductStore from '../store/productStore';
import BarcodeScanner from './BarcodeScanner';

const ProductEntry = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const addProduct = useProductStore((state) => state.addProduct);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price || !quantity || !costPrice) return;
    await addProduct({ name, category, price: parseFloat(price), costPrice: parseFloat(costPrice), barcode, quantity: parseInt(quantity, 10) });
    setName('');
    setCategory('');
    setPrice('');
    setBarcode('');
    setQuantity('');
    setCostPrice('');
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
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductEntry;
