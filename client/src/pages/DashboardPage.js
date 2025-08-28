import React from 'react';

const DashboardPage = () => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2px 12px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 12, color: '#1a2236' }}>CounterPulse <span role="img" aria-label="box">📦</span></h1>
      <p style={{ fontWeight: 600, color: '#1a2236', fontSize: '1.1rem', marginBottom: 18 }}>
        The heartbeat of your hustle.
      </p>
      <span style={{ display: 'inline-block', background: '#eafaf1', color: '#27ae60', fontWeight: 700, borderRadius: 8, padding: '4px 14px', fontSize: 14, marginBottom: 18 }}>
        Hackathon MVP
      </span>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>The Problem</h2>
      <p style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6, marginBottom: 0 }}>
        Spaza shop owners and informal traders are the backbone of our communities, but they often operate with one hand tied behind their back. Managing stock with memory or scattered notebooks leads to constant uncertainty: popular items run out, disappointing customers and losing sales; perishable goods expire, wasting money; and most importantly, <b>profit is just a guess</b>. This makes sustainable growth nearly impossible.
      </p>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>The Solution: CounterPulse</h2>
      <p style={{ fontSize: '1rem', color: '#333', lineHeight: 1.6, marginBottom: 0 }}>
        <b>CounterPulse</b> is a lightweight, offline-first Progressive Web App (PWA) designed specifically for the needs of informal traders. It replaces guesswork with data, empowering any small business owner to manage their inventory, track sales, and see their real-time profit—all from a desktop or laptop, with or without an internet connection.
      </p>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>Key Features (MVP)</h2>
      <ul style={{ margin: '10px 0 0 22px', color: '#444', fontSize: '1rem', lineHeight: 1.7 }}>
        <li>📲 <b>Offline-First Reliability:</b> The app works flawlessly without an internet connection. All sales and stock updates are saved locally and synced securely to the cloud when the user is back online.</li>
        <li>🖥️ <b>Desktop-First Experience:</b> Designed for desktop and laptop use—optimized layouts, mouse/keyboard navigation, and external barcode scanner support make it easy to use on any computer.</li>
        <li>🔍 <b>Barcode Scanning:</b> Use an external barcode scanner or manual entry for product barcodes in sales and inventory.</li>
        <li>📈 <b>Simple Profit Dashboard:</b> At a glance, users can see their daily/weekly profit, total revenue, and best-selling items, turning raw sales data into business intelligence.</li>
        <li>🔔 <b>Smart Low-Stock Alerts:</b> CounterPulse automatically highlights products that are running low, helping owners reorder in time and never miss a sale.</li>
      </ul>
      <h2 style={{ color: '#28304a', marginTop: 24, marginBottom: 8, fontSize: '1.2rem' }}>Desktop Experience</h2>
      <ul style={{ margin: '10px 0 0 22px', color: '#444', fontSize: '1rem', lineHeight: 1.7 }}>
        <li>🖥️ Optimized for desktop and laptop screens with responsive layouts.</li>
        <li>🔍 Supports external barcode scanners for quick product lookup and sales.</li>
        <li>📦 Installable as a PWA for a native-like experience on desktops.</li>
        <li>🔄 Works offline and syncs data when back online.</li>
      </ul>
    </div>
  );
};

export default DashboardPage;
