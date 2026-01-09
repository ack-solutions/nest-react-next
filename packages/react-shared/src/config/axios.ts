// axios-instance.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import moment from 'moment';

import { config } from './config';
import { UploadedFile } from '@libs/utils';

const isBrowser = typeof window !== 'undefined';

/**
 * ----------------------------------------
 * Base URL resolver
 * ----------------------------------------
 */
const getApiBaseUrl = (): string => {
    let url = '';

    const publicApiUrl = config.apiUrl;

    if (isBrowser && publicApiUrl) {
        url = publicApiUrl;
    } else if (!isBrowser) {
        const serverApiUrl =
            typeof process !== 'undefined' ? process.env['SERVER_APP_API_URL'] : undefined;
        if (serverApiUrl) url = serverApiUrl;
    }

    if (!url && config.apiUrl) url = config.apiUrl;

    if (!url) {
        url = isBrowser ? 'http://localhost:3333' : 'http://api:3333';
        // eslint-disable-next-line no-console
        console.warn('[axios] API base URL is not set, using default:', url);
    }

    // Ensure URL ends with /api/
    if (url.endsWith('/api/')) return url;
    if (url.endsWith('/api')) return url + '/';
    return url + '/api/';
};

/**
 * ----------------------------------------
 * Helpers: detect binary/file-like objects
 * ----------------------------------------
 */
const isFileLike = (val: any): boolean => {
    if (!val) return false;

    // UploadedFile (your custom type)
    if (val instanceof UploadedFile) return true;

    // Browser file types
    if (typeof File !== 'undefined' && val instanceof File) return true;
    if (typeof Blob !== 'undefined' && val instanceof Blob) return true;

    // Node/binary
    if (val instanceof ArrayBuffer) return true;

    return false;
};

/**
 * ----------------------------------------
 * Deep transform: Moment -> ISO string
 * - Non-mutating (returns a new structure)
 * - Leaves File/Blob/ArrayBuffer/Date as-is
 * ----------------------------------------
 */
const convertMomentToISO = (input: any): any => {
    if (moment.isMoment(input)) {
        // ✅ consistent JSON-friendly string
        return input.toISOString();
    }

    if (input instanceof Date) return input;
    if (isFileLike(input)) return input;

    if (Array.isArray(input)) {
        return input.map(convertMomentToISO);
    }

    if (input !== null && typeof input === 'object') {
        const out: any = {};
        for (const key of Object.keys(input)) {
            out[key] = convertMomentToISO(input[key]);
        }
        return out;
    }

    return input;
};

/**
 * ----------------------------------------
 * Error normalizer (keeps useful info)
 * ----------------------------------------
 */
export type ApiError = {
    message: string;
    status?: number;
    code?: string;
    data?: any;
    url?: string;
    method?: string;
};

const normalizeAxiosError = (err: any): ApiError => {
    const axiosErr = err as AxiosError<any>;

    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    // Try best message extraction
    const message =
        (typeof data === 'string' && data) ||
        data?.message ||
        axiosErr.message ||
        'Something went wrong';

    return {
        message,
        status,
        code: (data && (data.code as string)) || axiosErr.code,
        data,
        url: axiosErr.config?.url,
        method: axiosErr.config?.method?.toUpperCase(),
    };
};

/**
 * ----------------------------------------
 * Create ONE axios instance
 * ----------------------------------------
 */
export const instanceApi: AxiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true, // set true only if you use cookie-based auth
    timeout: 30000,
});

/**
 * ----------------------------------------
 * Request interceptor
 * - baseURL set dynamically (optional)
 * - attach bearer token in browser
 * - transform params/data (moment -> ISO)
 * ----------------------------------------
 */
instanceApi.interceptors.request.use((req: AxiosRequestConfig & any) => {
    // If you really need dynamic baseURL each request:
    req.baseURL = getApiBaseUrl();

    // Transform params / body safely (non-mutating)
    if (req.params) req.params = convertMomentToISO(req.params);
    if (req.data) req.data = convertMomentToISO(req.data);

    return req;
});

/**
 * ----------------------------------------
 * Response interceptor
 * - reject with normalized error
 * ----------------------------------------
 */
instanceApi.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject(normalizeAxiosError(error)),
);

/**
 * Optional: default export for convenience
 */
export default instanceApi;
