import React, { useEffect, useState } from 'react';

const DashboardPage = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [salesByProduct, setSalesByProduct] = useState([]);
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState(0);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};
    fetch('http://localhost:5000/api/sales/report/total', { headers })
      .then(res => res.json())
      .then(data => setTotalSales(data.total || 0));
    fetch('http://localhost:5000/api/sales/report/by-product', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSalesByProduct(data);
          setError(null);
        } else if (data && data.error) {
          setSalesByProduct([]);
          if (data.error === 'Invalid token' || data.error === 'Forbidden') {
            setError('You are not authorized to view this data. Please log in again.');
          } else {
            setError(data.error);
          }
        } else {
          setSalesByProduct([]);
          setError('Unexpected response from server.');
        }
      })
      .catch(() => {
        setSalesByProduct([]);
        setError('Failed to fetch sales by product.');
      });
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
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Product</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Quantity Sold</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Total Revenue</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Average Price</th>
              <th style={{ border: '1px solid #ccc', padding: 4 }}>Number of Sales</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(salesByProduct) ? salesByProduct : []).map(product => (
              <tr key={product.name}>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{product.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{product.quantity}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>R{product.total.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>R{product.average.toFixed(2)}</td>
                <td style={{ border: '1px solid #ccc', padding: 4 }}>{product.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
