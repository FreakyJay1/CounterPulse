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
            Product: {sale.productName || sale.productId} | Qty: {sale.quantity} | Total: R{sale.total} | Date: {sale.date ? new Date(sale.date).toLocaleString() : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesList;
