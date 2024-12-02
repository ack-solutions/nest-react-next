import axios from 'axios';
import { API_URL } from '../config';

const instance = axios.create();
instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default instance;

const axiosInstance = axios.create({
    baseURL: `${API_URL}/api/`,
    withCredentials: false,
    headers: {
        "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    // "Access-Control-Allow-Headers": "Content-Type"
    }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

// axiosInstance.interceptors.request.use(config => {

//   config.paramsSerializer = params => {
//     // Qs is already included in the Axios package
//     return Qs.stringify(params, {
//       arrayFormat: undefined,
//       encode: false
//     });
//   };

//   return config;
// });


// axiosInstance.interceptors.request.use(req => {
//   const method = req.method.toUpperCase()
//   let body = ''
//   try {
//     const data = JSON.parse(req.data)
//     if (isObject(data)) {
//       body = Object.keys(data)?.length > 0 ? JSON.stringify(data) : '';
//     }
//   } catch (error) {
//     body = ''
//   }

//   const prefix = req.baseURL.replace(config.baseUrl, '')
//   let queryString = ''

//   if (req.params && Object.keys(req.params).length) {
//     queryString = "?" + Qs.stringify(req.params, {
//       arrayFormat: undefined,
//       encode: false
//     });
//   }
//   const str = method + prefix + req.url + queryString + body;
//   const salt = cryptoJs.SHA256(str, config.privateKey).toString();
//   const signatureKey = config.publicKey + '.' + salt;

//   req.headers.SignatureKey = signatureKey

//   return req;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

export const instanceApi = axiosInstance;
