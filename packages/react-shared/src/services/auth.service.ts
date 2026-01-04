import { ILoginSuccess, ILoginInput, IOtpSendInput, IRegisterInput, IVerifyOtpInput } from '@libs/types';

import { Service } from './service';


export class AuthService extends Service {

    apiPath = '';

    getToken() {
        return localStorage.getItem('token');
    }

    sendOtp(request?: IOtpSendInput) {
        return this.instanceApi.post('auth/send-otp', request);
    }

    login(request: ILoginInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/login', request);
    }

    register(request: IRegisterInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/register', request).then((resp) => {
            return resp.data;
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.clear();
    }

    verifyOtp(request: IVerifyOtpInput) {
        return this.instanceApi.post('auth/verify-otp', request);
    }

    resetPassword(request?: any) {
        return this.instanceApi.post('auth/reset-password', request);
    }

}
