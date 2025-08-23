import React, { useEffect, useState } from 'react';

const SalesList = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(setSales);
  }, []);

  return (
    <div>
      <h3>Sales History</h3>
      <ul>
        {sales.map(sale => (
          <li key={sale.id}>
            Product ID: {sale.productId} | Qty: {sale.quantity} | Total: ${sale.total} | Date: {new Date(sale.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;

