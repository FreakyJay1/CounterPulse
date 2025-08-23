import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(null); // null until login
  const [token, setToken] = useState(null);
  const login = (jwt, userRole) => {
    setToken(jwt);
    setRole(userRole);
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', userRole);
  };
  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };
  // On mount, restore from localStorage
  React.useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');
    if (t && r) {
      setToken(t);
      setRole(r);
    }
  }, []);
  return (
    <UserContext.Provider value={{ role, setRole, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
