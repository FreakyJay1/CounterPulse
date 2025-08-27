import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';

const BarcodeScanner = ({ onDetected }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScanning(false);
      setError(null);
      onDetected(data);
    }
  };

  const handleError = (err) => {
    setError('Camera error');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <button
        type="button"
        onClick={() => setScanning((s) => !s)}
        style={{
          margin: '0 auto',
          background: scanning ? '#e74c3c' : '#27ae60',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '14px 36px',
          fontWeight: 700,
          fontSize: 18,
          cursor: 'pointer',
          boxShadow: scanning ? '0 2px 8px rgba(231,76,60,0.08)' : '0 2px 8px rgba(39,174,96,0.08)',
          marginBottom: scanning ? 24 : 0,
          transition: 'background 0.2s, box-shadow 0.2s',
          minWidth: 180
        }}
      >
        {scanning ? 'Stop Scanning' : 'Scan Barcode'}
      </button>
      {scanning && (
        <div style={{ width: 320, margin: '1.5rem auto 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BarcodeReader
            onError={handleError}
            onScan={handleScan}
          />
          {error && <div style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
