import axios from 'axios';
import moment from 'moment';

import { config } from './config';
import { UploadedFile } from '@libs/utils';


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
const isBrowser = typeof window !== 'undefined';
const getApiBaseUrl = () => {
    let url = '';
    const publicApiUrl = config.apiUrl;

    if (isBrowser && publicApiUrl) {
        url = publicApiUrl;
    } else if (!isBrowser) {
        // Safe access to process.env for server-side (Node.js)
        const serverApiUrl = typeof process !== 'undefined' ? process.env['SERVER_APP_API_URL'] : undefined;
        if (serverApiUrl) {
            url = serverApiUrl;
        }
    }

    if (!url && config.apiUrl) {
        url = config.apiUrl;
    }

    if (!url) {
        url = isBrowser ? 'http://localhost:3333' : 'http://api:3333';
        console.warn('[axios] API base URL is not set, using default:', url);
    }

    // Ensure URL ends with /api/
    if (url.endsWith('/api/')) return url;
    if (url.endsWith('/api')) return url + '/';
    return url + '/api/';
};

// Helper function to get token from localStorage
const getTokenFromStorage = (): string | null => {
    if (!isBrowser) return null;

    try {
        // Check for nest auth token first (newer format)
        const nestAuthToken = localStorage.getItem('nest_auth_access_token');
        if (nestAuthToken) return nestAuthToken;

        return null;
    } catch (error) {
        return null;
    }
};

// Axios request interceptor
axiosInstance.interceptors.request.use((config: any) => {
    // Dynamic base URL selection (from your existing code)
    config.baseURL = getApiBaseUrl();

    if (isBrowser) {
        const token = getTokenFromStorage();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
    } else {
    }

    if (config.params) {
        config.params = convertMomentToISO(config.params);
    }
    if (config.data) {
        config.data = convertMomentToISO(config.data);
    }
    return config;
});
export const instanceApi = axiosInstance;
