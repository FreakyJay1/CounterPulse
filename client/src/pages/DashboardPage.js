import React from 'react';

const DashboardPage = () => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2px 12px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 12, color: '#1a2236' }}>Welcome to CounterPulse</h1>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>The Problem</h2>
      <p style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6, marginBottom: 0 }}>
        Spaza shop owners and informal traders are the backbone of our communities, but they often operate with one hand tied behind their back. Managing stock with memory or scattered notebooks leads to constant uncertainty: popular items run out, disappointing customers and losing sales; perishable goods expire, wasting money; and most importantly, <b>profit is just a guess</b>. This makes sustainable growth nearly impossible.
      </p>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>The Solution</h2>
      <div style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6, marginBottom: 0 }}>
        <b>CounterPulse</b> is a lightweight, offline-first Progressive Web App (PWA) designed for informal traders. It empowers small business owners to manage inventory, track sales, and see real-time profit—all from a basic smartphone, with or without internet. <br /><br />
        <b>Key Features:</b>
        <ul style={{ margin: '10px 0 0 22px', color: '#444', fontSize: '1rem', lineHeight: 1.7 }}>
          <li>📲 <b>Offline-First Reliability:</b> Works without internet, syncs when online.</li>
          <li>📈 <b>Simple Profit Dashboard:</b> See profit, revenue, and best-sellers at a glance.</li>
          <li>🔔 <b>Smart Low-Stock Alerts:</b> Highlights products running low.</li>
          <li>📦 <b>Barcode Scanning:</b> Fast product lookup and sales logging.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
