import React from 'react';
import ProductEntry from './components/ProductEntry';
import ProductList from './components/ProductList';

function App() {
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>CounterPulse Inventory</h2>
      <ProductEntry />
      <ProductList />
    </div>
  );
}

export default App;

