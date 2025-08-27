import React, { useState, useEffect } from 'react';
import useProductStore from '../store/productStore';

const defaultActionItem = { task: '', responsible: '', deadline: '' };

const ShopReportForm = ({ onClose, initialValues = {}, autoDownload = false }) => {
  const { products, fetchProducts } = useProductStore();
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    shopName: '',
    reportDate: new Date().toISOString().slice(0, 10),
    preparedBy: '',
    overviewStatus: '',
    overviewHighlight: '',
    overviewChallenge: '',
    cashSales: '',
    cardSales: '',
    airtimeSales: '',
    numTransactions: '',
    cashCountEnd: '',
    fastMovingItems: [{ name: '', qty: '' }],
    restockItems: [''],
    slowExpiredItems: [''],
    inventoryNotes: '',
    feedbackPositive: [''],
    feedbackSuggestions: [''],
    actionItems: [ { ...defaultActionItem } ],
    signatureName: '',
    ...initialValues // override with initial values if provided
  });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchDataAndFill() {
      await fetchProducts();
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.0.108:5000/api/sales', {
        headers: { Authorization: 'Bearer ' + token }
      });
      let salesData = [];

      try {
        salesData = await res.json();
      } catch (e) { salesData = []; }
      setSales(salesData);

      let cashSales = 0, cardSales = 0, airtimeSales = 0, numTransactions = 0, cashCountEnd = 0;
      if (Array.isArray(salesData)) {
        numTransactions = salesData.length;
        cashSales = salesData.reduce((sum, s) => sum + (s.total || 0), 0);
      }

      let fastMovingItems = [], restockItems = [], slowExpiredItems = [];
      if (Array.isArray(products) && products.length > 0) {
        fastMovingItems = products.slice(0, 3).map(p => ({ name: p.name, qty: p.qty != null ? p.qty.toString() : '' }));
        restockItems = products.slice(3, 5).map(p => {
          const prod = products.find(prod => prod.name === p.name);
          return { name: p.name, qty: prod && prod.qty != null ? prod.qty.toString() : '' };
        });
        slowExpiredItems = products.slice(5, 7).map(p => p.name);
      }
      setForm(f => ({
        ...f,
        cashSales: cashSales.toString(),
        cardSales: cardSales.toString(),
        airtimeSales: airtimeSales.toString(),
        numTransactions: numTransactions.toString(),
        cashCountEnd: cashSales.toString(),
        fastMovingItems,
        restockItems,
        slowExpiredItems
      }));
    }
    fetchDataAndFill();
  }, [fetchProducts]);

  useEffect(() => {
    if (autoDownload) {
      setTimeout(() => {
        document.getElementById('shop-report-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }, 200);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, idx, subfield, value) => {
    const arr = [...form[field]];
    if (subfield) arr[idx][subfield] = value;
    else arr[idx] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field, item) => {
    setForm({ ...form, [field]: [...form[field], item] });
  };
  const removeArrayItem = (field, idx) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const res = await fetch('http://192.168.0.108:5000/api/report/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shop_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloading(false);
      if (onClose) onClose();
    } catch (err) {
      alert('Failed to download report: ' + err.message);
      setDownloading(false);
    }
  };

  const getFastMovingItems = () => products.slice(0, 3);
  const getRestockItems = () => products.slice(3, 5);
  const getSlowExpiredItems = () => products.slice(5, 7);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,34,54,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }}>
      <form id="shop-report-form" onSubmit={handleSubmit} style={{ background: '#f8fafc', borderRadius: 22, boxShadow: '0 8px 40px rgba(30,34,54,0.22)', padding: 0, minWidth: 440, maxWidth: 760, maxHeight: '92vh', overflowY: 'auto', position: 'relative', border: '1.5px solid #e9eef3' }}>
        {/* Sticky Header */}
        <div style={{ background: '#27ae60', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '28px 0 16px 0', textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 32, letterSpacing: 1, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(30,34,54,0.08)' }}>Shop Report
          <button type="button" onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#fff', fontSize: 32, fontWeight: 700, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: '0 36px' }}>
          {/* Section 1 */}
          <div style={{ margin: '32px 0 12px 0', fontWeight: 900, color: '#27ae60', fontSize: 22, borderBottom: '2.5px solid #e9eef3', paddingBottom: 6, letterSpacing: 0.5 }}>1. Daily/Shift Overview</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={{ fontWeight: 700, color: '#1a2236' }}>Shop Name/Location
                <input name="shopName" value={form.shopName} onChange={handleChange} required style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontWeight: 700, color: '#1a2236' }}>Date of Report
                <input name="reportDate" type="date" value={form.reportDate} onChange={handleChange} required style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label style={{ fontWeight: 700, color: '#1a2236' }}>Report Prepared By
                <input name="preparedBy" value={form.preparedBy} onChange={handleChange} required style={{ width: '100%', marginTop: 4, marginBottom: 16, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label>Overall Status
                <input name="overviewStatus" value={form.overviewStatus} onChange={handleChange} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label>Key Highlight
                <input name="overviewHighlight" value={form.overviewHighlight} onChange={handleChange} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <label>Main Challenge
                <input name="overviewChallenge" value={form.overviewChallenge} onChange={handleChange} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
              </label>
            </div>
          </div>
          <div style={{ height: 1, background: '#e9eef3', margin: '18px 0 28px 0' }} />
          {/* Section 2 */}
          <div style={{ margin: '0 0 12px 0', fontWeight: 900, color: '#27ae60', fontSize: 22, borderBottom: '2.5px solid #e9eef3', paddingBottom: 6, letterSpacing: 0.5 }}>2. Sales & Cash Flow Summary</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18, background: '#f4f7fa', borderRadius: 12, padding: 16 }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Total Cash Sales
                <input name="cashSales" value={form.cashSales} readOnly tabIndex={-1} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Total Card/Digital Sales
                <input name="cardSales" value={form.cardSales} readOnly tabIndex={-1} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Airtime/Electricity Sales
                <input name="airtimeSales" value={form.airtimeSales} readOnly tabIndex={-1} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Number of Transactions
                <input name="numTransactions" value={form.numTransactions} readOnly tabIndex={-1} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label>Cash Count at End of Day
                <input name="cashCountEnd" value={form.cashCountEnd} readOnly tabIndex={-1} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </label>
            </div>
          </div>
          <div style={{ height: 1, background: '#e9eef3', margin: '18px 0 28px 0' }} />
          {/* Section 3 */}
          <div style={{ margin: '0 0 12px 0', fontWeight: 900, color: '#27ae60', fontSize: 22, borderBottom: '2.5px solid #e9eef3', paddingBottom: 6, letterSpacing: 0.5 }}>3. Inventory & Stock Levels</div>
          <div style={{ background: '#f4f7fa', borderRadius: 12, padding: 16, marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 4 }}>Fast-Moving Items (Low Stock)</div>
                {getFastMovingItems().map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input placeholder="Item Name" value={item.name || ''} readOnly tabIndex={-1} style={{ flex: 2, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
                    {/* Remove Qty label and placeholder, just show value in a span */}
                    <span style={{ width: 60, textAlign: 'center', fontWeight: 600, color: '#1a2236', background: '#e9eef3', borderRadius: 6, display: 'inline-block' }}>{item.qty != null ? item.qty : ''}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 4 }}>Items Needing Restock (Urgent)</div>
                {getRestockItems().map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <input placeholder="Item Name" value={item.name || ''} readOnly tabIndex={-1} style={{ flex: 2, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
                    <span style={{ width: 60, textAlign: 'center', fontWeight: 600, color: '#1a2236', background: '#e9eef3', borderRadius: 6, display: 'inline-block' }}>{item.qty != null ? item.qty : ''}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#1a2236', margin: '18px 0 4px 0' }}>Slow-Moving/Expired Items</div>
            {getSlowExpiredItems().map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                <input placeholder="Item Name" value={item.name || ''} readOnly tabIndex={-1} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15, background: '#e9eef3', cursor: 'not-allowed', color: '#888' }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700, color: '#1a2236' }}>Inventory Notes
              <input name="inventoryNotes" value={form.inventoryNotes} onChange={handleChange} style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
            </label>
          </div>
          <div style={{ height: 1, background: '#e9eef3', margin: '18px 0 28px 0' }} />
          {/* Section 4 */}
          <div style={{ margin: '0 0 12px 0', fontWeight: 900, color: '#27ae60', fontSize: 22, borderBottom: '2.5px solid #e9eef3', paddingBottom: 6, letterSpacing: 0.5 }}>4. Customer & Community Feedback</div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 4 }}>Positive Feedback</div>
              {form.feedbackPositive.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                  <input placeholder="Feedback" value={item} onChange={e => handleArrayChange('feedbackPositive', idx, null, e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15 }} />
                  <button type="button" onClick={() => removeArrayItem('feedbackPositive', idx)} style={{ color: '#e74c3c', background: 'none', border: 'none', fontWeight: 700, fontSize: 18 }}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('feedbackPositive', '')} style={{ marginBottom: 8, marginTop: 4, background: '#e9eef3', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, color: '#1a2236', cursor: 'pointer' }}>+ Add Feedback</button>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontWeight: 700, color: '#1a2236', marginBottom: 4 }}>Suggestions/Complaints</div>
              {form.feedbackSuggestions.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                  <input placeholder="Suggestion/Complaint" value={item} onChange={e => handleArrayChange('feedbackSuggestions', idx, null, e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15 }} />
                  <button type="button" onClick={() => removeArrayItem('feedbackSuggestions', idx)} style={{ color: '#e74c3c', background: 'none', border: 'none', fontWeight: 700, fontSize: 18 }}>×</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('feedbackSuggestions', '')} style={{ marginBottom: 8, marginTop: 4, background: '#e9eef3', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, color: '#1a2236', cursor: 'pointer' }}>+ Add Suggestion</button>
            </div>
          </div>
          <div style={{ height: 1, background: '#e9eef3', margin: '18px 0 28px 0' }} />
          {/* Section 5 */}
          <div style={{ margin: '0 0 12px 0', fontWeight: 900, color: '#27ae60', fontSize: 22, borderBottom: '2.5px solid #e9eef3', paddingBottom: 6, letterSpacing: 0.5 }}>5. Action Items & Next Steps</div>
          <div style={{ marginBottom: 24 }}>
            {form.actionItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 2 }}>
                <input placeholder="Task" value={item.task} onChange={e => handleArrayChange('actionItems', idx, 'task', e.target.value)} style={{ flex: 2, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15 }} />
                <input placeholder="Responsible" value={item.responsible} onChange={e => handleArrayChange('actionItems', idx, 'responsible', e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15 }} />
                <input type="date" placeholder="Deadline" value={item.deadline} onChange={e => handleArrayChange('actionItems', idx, 'deadline', e.target.value)} style={{ flex: 1, padding: 6, borderRadius: 6, border: '1.5px solid #d1d5db', fontSize: 15 }} />
                <button type="button" onClick={() => removeArrayItem('actionItems', idx)} style={{ color: '#e74c3c', background: 'none', border: 'none', fontWeight: 700, fontSize: 18 }}>×</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('actionItems', { ...defaultActionItem })} style={{ marginBottom: 8, marginTop: 4, background: '#e9eef3', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, color: '#1a2236', cursor: 'pointer' }}>+ Add Action Item</button>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontWeight: 700, color: '#1a2236' }}>Signature (Your Printed Name)
              <input name="signatureName" value={form.signatureName} onChange={handleChange} required style={{ width: '100%', marginTop: 4, marginBottom: 12, padding: 8, borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 16 }} />
            </label>
          </div>
          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
            <button type="submit" disabled={downloading} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 12, padding: '18px 56px', fontWeight: 900, fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>
              {downloading ? 'Generating PDF...' : 'Download Shop Report'}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: 32, background: '#e9eef3', color: '#1a2236', border: 'none', borderRadius: 12, padding: '18px 40px', fontWeight: 800, fontSize: 20, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopReportForm;
