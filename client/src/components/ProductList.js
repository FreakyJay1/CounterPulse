import React, { useEffect } from 'react';
import useProductStore from '../store/productStore';
import { useUser } from '../utils/UserContext';

const ProductList = () => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const { role } = useUser();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (products.length === 0) {
    return <div>No products added yet.</div>;
  }

  // Show a low-stock alert banner if any product is low
  const lowStockProducts = products.filter(p => p.quantity <= 3); // threshold can be adjusted

  return (
    <>
      {lowStockProducts.length > 0 && (
        <div style={{ color: 'red', marginBottom: 8 }}>
          Low stock alert: {lowStockProducts.map(p => `${p.name} (Qty: ${p.quantity})`).join(', ')}
        </div>
      )}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} ({product.category}) - ${product.price.toFixed(2)} | Qty: {product.quantity}
            {role === 'owner' && (
              <button onClick={() => removeProduct(product.id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProductList;
