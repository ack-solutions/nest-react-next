// axios-instance.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { config } from './config';
import { UploadedFile } from '@libs/utils';

const isBrowser = typeof window !== 'undefined';

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
        console.warn('[axios] API base URL is not set, using default:', url);
    }

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
    if (val instanceof UploadedFile) return true;
    if (typeof File !== 'undefined' && val instanceof File) return true;
    if (typeof Blob !== 'undefined' && val instanceof Blob) return true;
    if (val instanceof ArrayBuffer) return true;
    return false;
};


/**
 * ----------------------------------------
 * Deep transform: Dayjs/Moment-like -> ISO string
 * - Non-mutating (returns a new structure)
 * - Leaves File/Blob/ArrayBuffer/Date as-is
 * ----------------------------------------
 */
const convertDateLikeToISO = (input: any): any => {
    if (input instanceof Date) return input;
    if (isFileLike(input)) return input;
    if (typeof FormData !== 'undefined' && input instanceof FormData) return input;
    if (typeof URLSearchParams !== 'undefined' && input instanceof URLSearchParams) return input;

    if (Array.isArray(input)) {
        return input.map(convertDateLikeToISO);
    }

    if (input !== null && typeof input === 'object') {
        const out: any = {};
        for (const key of Object.keys(input)) {
            out[key] = convertDateLikeToISO(input[key]);
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
    config?: any;
    originalError?: any;
};

export const normalizeAxiosError = (err: any): ApiError => {
    const axiosErr = err as AxiosError<any>;

    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

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
        config: axiosErr.config,
        originalError: err,
    };
};



/**
 * ----------------------------------------
 * Create Nest Auth axios instance
 * ----------------------------------------
 */
export const instanceNestAuth: AxiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true, // set true only if you use cookie-based auth (nest-auth)
    timeout: 30000,
});

/**
 * ----------------------------------------
 * Create ONE axios instance
 * ----------------------------------------
 */
export const instanceApi: AxiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true, // set true only if you use cookie-based auth (nest-auth)
    timeout: 30000,
});

/**
 * ----------------------------------------
 * Request interceptor
 * - baseURL set dynamically (optional)
 * - transform params/data (Dayjs -> ISO)
 * ----------------------------------------
 */
instanceApi.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    req.baseURL = getApiBaseUrl();

    if (req.params) req.params = convertDateLikeToISO(req.params);
    if (req.data) req.data = convertDateLikeToISO(req.data);

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
