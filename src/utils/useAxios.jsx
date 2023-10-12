import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAxios = () => {
  const { setLogin, setAuthTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({});

  axiosInstance.interceptors.request.use(
    function (config) {
      let localStorageData = localStorage.getItem('admin');
      if (localStorage && typeof localStorageData === 'string') {
        localStorageData = JSON.parse(localStorageData);
        const accessToken = localStorageData?.accessToken;
        const decodeToken = jwtDecode(localStorageData?.accessToken);
        const expires = decodeToken.exp;
        if (Date.now() >= expires * 1000) {
          setLogin(false);
          localStorage.removeItem('admin');
          localStorage.removeItem('login');
          setAuthTokens(null);
        }
        config.headers = { authorization: `Bearer ${accessToken}` };
        return config;
      } else return config;
    },
    function (err) {
      return Promise.reject(err);
    },
  );

  return axiosInstance;
};

export default useAxios;
