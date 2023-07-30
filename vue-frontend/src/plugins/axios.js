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
      if (error.response && originalRequest.url === `${baseURL}/users/refreshToken`) {
         if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.localStorage.removeItem('x-auth-token');
          window.localStorage.removeItem('x-refresh-token');
          window.open('/login', '_self')
        } 
          return Promise.reject(error);
      }
      if(error.response && (error.response.status == "401") && !originalRequest._retry) {
          originalRequest._retry = true;
          let refreshToken = window.localStorage.getItem('x-refresh-token');
          // if (!refreshToken) window.open('/login','_self');
          return http.post(`${baseURL}/users/refreshToken`,{ refreshToken })
              .then(function (res) {
                  if (res.status === 200) {
                      window.localStorage.setItem('x-auth-token', res.data.accessToken);
                      window.localStorage.setItem('x-refresh-token', res.data.refreshToken);
                      originalRequest.headers['x-auth-token'] = res.data.accessToken;
                  }
                  return http(originalRequest);
              });
      }
      return Promise.reject(error);
  }
);

export default http;