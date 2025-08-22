import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { register } from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for offline support
register();
