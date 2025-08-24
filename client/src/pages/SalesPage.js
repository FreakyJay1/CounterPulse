import React from 'react';
import SalesEntry from '../components/SalesEntry';
import SalesList from '../components/SalesList';
import useProductStore from '../store/productStore';

const SalesPage = () => {
  const { products, fetchProducts } = useProductStore();
  React.useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Sales</h2>
      <SalesEntry products={products} onSaleLogged={fetchProducts} />
      <SalesList />
    </div>
  );
};

export default SalesPage;
