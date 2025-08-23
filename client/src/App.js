import React, { useEffect } from 'react';
import ProductEntry from './components/ProductEntry';
import ProductList from './components/ProductList';
import SalesEntry from './components/SalesEntry';
import SalesList from './components/SalesList';
import useProductStore from './store/productStore';

function App() {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>CounterPulse Inventory</h2>
      <ProductEntry />
      <ProductList />
      <hr />
      <SalesEntry products={products} onSaleLogged={fetchProducts} />
      <SalesList />
    </div>
  );
}

export default App;
