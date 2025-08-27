import React, { useEffect, useState, useCallback } from 'react';
import SalesEntry from '../components/SalesEntry';
import SalesList, { SalesGraph } from '../components/SalesList';
import useProductStore from '../store/productStore';
import ShopReportForm from '../components/ShopReportForm';

const SalesPage = () => {
  const { products, fetchProducts } = useProductStore();
  const [sales, setSales] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportInitialValues, setReportInitialValues] = useState(null);

  const refreshData = useCallback(async () => {
    setProductsLoading(true);
    await fetchProducts();
    setProductsLoading(false);
    fetch('http://192.168.0.108:5000/api/sales', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSales(data);
        else setSales([]); // fallback if error or not array
      });
  }, [fetchProducts]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  let expense = 0, income = 0;
  if (!productsLoading && products.length > 0) {
    sales.forEach(sale => {
      if (sale.SaleItems) {
        sale.SaleItems.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            expense += (product.costPrice || 0) * item.quantity;
            income += (product.price || 0) * item.quantity;
          }
        });
      }
    });
  }
  const profit = income - expense;

  const prepareShopReportInitialValues = () => {
    const shopName = 'Main Shop'; // Change as needed
    let preparedBy = localStorage.getItem('userName') || 'Shop User';
    let cashSales = 0, cardSales = 0, airtimeSales = 0, numTransactions = 0, cashCountEnd = 0;

    sales.forEach(sale => {
      if (sale.paymentType === 'cash') cashSales += sale.total;
      else if (sale.paymentType === 'card') cardSales += sale.total;
      else if (sale.paymentType === 'airtime') airtimeSales += sale.total;
      numTransactions++;
      if (sale.paymentType === 'cash' && sale.cashCountEnd) cashCountEnd = sale.cashCountEnd;
    });

    const fastMovingItems = products.filter(p => p.quantity > 0 && p.quantity < 5).map(p => ({ name: p.name, qty: p.quantity }));
    const restockItems = products.filter(p => p.quantity === 0).map(p => p.name);
    const slowExpiredItems = products.filter(p => p.quantity > 10).map(p => p.name); // Example: slow if >10 in stock
    return {
      shopName,
      preparedBy,
      cashSales: cashSales.toFixed(2),
      cardSales: cardSales.toFixed(2),
      airtimeSales: airtimeSales.toFixed(2),
      numTransactions: numTransactions.toString(),
      cashCountEnd: cashCountEnd ? cashCountEnd.toString() : '',
      fastMovingItems: fastMovingItems.length ? fastMovingItems : [{ name: '', qty: '' }],
      restockItems: restockItems.length ? restockItems : [''],
      slowExpiredItems: slowExpiredItems.length ? slowExpiredItems : [''],
    };
  };

  const handleOpenReportForm = () => {
    const initialValues = prepareShopReportInitialValues();
    setReportInitialValues(initialValues);
    setShowReportForm(true);
  };

  if (productsLoading || products.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#888', fontSize: 20 }}>Loading sales dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ color: '#1a2236', marginBottom: 32, fontWeight: 800, letterSpacing: 1 }}>Sales Overview</h2>
      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Expense</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#e74c3c' }}>R{expense.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Income</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#27ae60' }}>R{income.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>Profit</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1a2236' }}>R{profit.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setShowEntry(true)} style={{ width: '100%', padding: '12px 0', background: '#1a2236', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Log Sale</button>
          <button onClick={handleOpenReportForm} style={{ width: '100%', padding: '12px 0', background: '#28304a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>Download Shop Report</button>
        </div>
      </div>
      <SalesGraph sales={sales} products={products} />
      {showEntry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ minWidth: 350, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <SalesEntry products={products} onSaleLogged={() => { setShowEntry(false); refreshData(); }} onCancel={() => setShowEntry(false)} />
          </div>
        </div>
      )}
      {showReportForm && <ShopReportForm onClose={() => setShowReportForm(false)} initialValues={reportInitialValues} autoDownload={false} />}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
        <SalesList sales={sales} products={products} />
      </div>
    </div>
  );
};

export default SalesPage;
