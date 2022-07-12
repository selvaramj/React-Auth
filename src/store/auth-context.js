import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

let logoutTimer;
const calculateExpiringTime = (expiresIn) => {
  const currentTime = new Date().getTime();
  const remainingTime = new Date(expiresIn).getTime() - currentTime;
  console.log('ExpiresIn ', remainingTime);
  return remainingTime;
};
const retrieveStoredToken = () => {
  const token = localStorage.getItem('token');
  const expiresIn = localStorage.getItem('expiresIn');
  const expiringTime = calculateExpiringTime(expiresIn);
  if (expiringTime < 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    return null;
  }

  return { token, expiresIn };
};
export const AuthContextProvider = (props) => {
  let initialToken;
  const storedToken = retrieveStoredToken();
  if (storedToken) {
    initialToken = storedToken.token;
  }
  const [token, setToken] = useState(initialToken);
  const userLoggedIn = !!token;
  console.log(storedToken);

  const logoutHandler = () => {
    console.log('Logout Function');
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  const loginHandler = (token, expiresIn) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn);
    const expiringTime = calculateExpiringTime(expiresIn);
    logoutTimer = setTimeout(logoutHandler, expiringTime);
  };

  useEffect(() => {
    if (token) {
      const expiresIn = calculateExpiringTime(storedToken.expiresIn);
      logoutTimer = setTimeout(logoutHandler, expiresIn);
      console.log('UseEFFect', expiresIn);
    }
  }, [storedToken]);

  const contextValue = {
    token,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
