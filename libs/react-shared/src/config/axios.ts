import { UploadedFile } from '@libs/utils';
import axios from 'axios';
import moment from 'moment';

import { config } from './config';


const instance = axios.create();
instance.interceptors.response.use(
    response => response,
    error => Promise.reject(
        (error.response && error.response.data) || 'Something went wrong',
    ),
);

export default instance;

const axiosInstance = axios.create({
    baseURL: `${config.apiUrl}/api/`,
    withCredentials: false,
    // headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    //     // "Access-Control-Allow-Headers": "Content-Type"
    // },
    timeout: 10000,
    // paramsSerializer: params => {
    //   const newParams = {};
    //   for (const key in params) {
    //     if (params[key] === '') {
    //       newParams[key] = null;
    //     } else {
    //       newParams[key] = params[key];
    //     }
    //   }
    //   return new URLSearchParams(newParams).toString();
    // }
});

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => Promise.reject(
//         error.response && error.response.data || 'Something went wrong',
//     ),
// );

// Recursive function to convert moment or Date to ISO string
function convertMomentToISO(obj: any): any {
    if (moment.isMoment(obj)) {
        return obj.toDate();
    }

    if (
        obj instanceof UploadedFile ||
        obj instanceof File ||
        obj instanceof Blob ||
        obj instanceof ArrayBuffer ||
        obj instanceof Date
    ) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertMomentToISO);
    }

    if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            obj[key] = convertMomentToISO(obj[key]);
        }
    }

    return obj;
}

// Axios request interceptor
axiosInstance.interceptors.request.use(config => {
    if (config.params) {
        config.params = convertMomentToISO(config.params);
    }
    if (config.data) {
        config.data = convertMomentToISO(config.data);
    }
    return config;
});
export const instanceApi = axiosInstance;
