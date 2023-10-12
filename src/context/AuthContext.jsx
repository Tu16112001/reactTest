import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext('');

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(() =>
    localStorage.getItem('login') ? JSON.parse(localStorage.getItem('login')) : false,
  );
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('admin')) : null,
  );
  let contextData = {
    login: login,
    authTokens: authTokens,
    setLogin: setLogin,
    setAuthTokens: setAuthTokens,
  };
  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
