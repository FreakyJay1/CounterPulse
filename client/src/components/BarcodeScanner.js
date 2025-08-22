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
    <div>
      <button type="button" onClick={() => setScanning((s) => !s)}>
        {scanning ? 'Stop Scanning' : 'Scan Barcode'}
      </button>
      {scanning && (
        <div style={{ width: 300, margin: '1rem auto' }}>
          <BarcodeReader
            onError={handleError}
            onScan={handleScan}
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
