import React from 'react';
import useProductStore from '../store/productStore';

const ProductList = () => {
  const products = useProductStore((state) => state.products);
  const removeProduct = useProductStore((state) => state.removeProduct);

  if (products.length === 0) {
    return <div>No products added yet.</div>;
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price.toFixed(2)}
          <button onClick={() => removeProduct(product.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default ProductList;

