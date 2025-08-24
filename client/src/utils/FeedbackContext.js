import React, { createContext, useContext, useState } from 'react';

const FeedbackContext = createContext();

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <FeedbackContext.Provider value={{ message, setMessage }}>
      {children}
      {message && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#4caf50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999,
          fontWeight: 'bold',
          fontSize: 16
        }}>
          {message}
        </div>
      )}
    </FeedbackContext.Provider>
  );
};
