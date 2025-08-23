import React, { useEffect } from 'react';
import useProductStore from '../store/productStore';

const ProductList = () => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const removeProduct = useProductStore((state) => state.removeProduct);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (products.length === 0) {
    return <div>No products added yet.</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} ({product.category}) - ${product.price.toFixed(2)} | Qty: {product.quantity}
          <button onClick={() => removeProduct(product.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;
