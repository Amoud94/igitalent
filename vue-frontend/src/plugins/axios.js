// axios
import axios from 'axios';
var qs = require('qs');
let baseURL =  location.hostname.includes('local') ? "http://localhost:3000/api" : "url/api";

const http = axios.create({
  baseURL: baseURL,
  headers: { 'x-auth-token': window.localStorage.getItem('x-auth-token') || '', 'Content-Type': 'application/json' },
  paramsSerializer: function (params) {
    return qs.stringify(params)
  }
});

http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
      const originalRequest = error.config;
      if (!window.location.pathname.startsWith('/register')) {
        window.localStorage.removeItem('x-auth-token');
        if (error.response.data == 'INEXISTING_ACCOUNT') window.open('/account-not-found', '_self');
        else window.open('', '_self');
      }
      return Promise.reject(error);
  }
);

export default http;