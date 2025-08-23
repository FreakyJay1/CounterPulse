import React from 'react';
import ProductEntry from '../components/ProductEntry';
import ProductList from '../components/ProductList';
import { useUser } from '../utils/UserContext';

const InventoryPage = () => {
  const { role } = useUser();
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Inventory</h2>
      {role === 'owner' && <ProductEntry />}
      <ProductList />
    </div>
  );
};

export default InventoryPage;

