import React, { useEffect, useState } from 'react';
import useProductStore from '../store/productStore';

const DashboardPage = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [salesByProduct, setSalesByProduct] = useState({});
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales/report/total')
      .then(res => res.json())
      .then(data => setTotalSales(data.total || 0));
    fetch('http://localhost:5000/api/sales/report/by-product')
      .then(res => res.json())
      .then(setSalesByProduct);
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(setSales);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    let profitSum = 0;
    sales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      const cost = product ? product.costPrice : 0;
      profitSum += (sale.total - cost * sale.quantity);
    });
    setProfit(profitSum);
  }, [sales, products]);

  return (
    <div>
      <h2>Dashboard</h2>
      <div>Total Sales: ${Number(totalSales || 0).toFixed(2)}</div>
      <div>Estimated Profit: ${Number(profit || 0).toFixed(2)}</div>
      <h3>Best-Selling Products</h3>
      <ul>
        {Object.entries(salesByProduct).map(([productId, total]) => (
          <li key={productId}>Product ID {productId}: ${Number(total || 0).toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardPage;
