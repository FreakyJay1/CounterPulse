import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';

const DashboardPage = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [salesByProduct, setSalesByProduct] = useState({});
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};
    fetch('http://localhost:5000/api/sales/report/total', { headers })
      .then(res => res.json())
      .then(data => setTotalSales(data.total || 0));
    fetch('http://localhost:5000/api/sales/report/by-product', { headers })
      .then(res => res.json())
      .then(setSalesByProduct);
    fetch('http://localhost:5000/api/sales', { headers })
      .then(res => res.json())
      .then(setSales);
    fetch('http://localhost:5000/api/products', { headers })
      .then(res => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    let profitSum = 0;
    sales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        profitSum += (sale.total - (product.costPrice * sale.quantity));
      }
    });
    setProfit(profitSum);
  }, [sales, products]);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Dashboard</h2>
      <div>Total Sales: <b>{totalSales}</b></div>
      <div>Profit: <b>{profit}</b></div>
      <div style={{ marginTop: 20 }}>
        <h4>Sales by Product</h4>
        <ul>
          {Object.entries(salesByProduct).map(([name, total]) => (
            <li key={name}>{name}: {total}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
