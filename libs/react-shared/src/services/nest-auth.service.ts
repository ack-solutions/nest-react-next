import { ILoginInput, ILoginSuccess, IRegisterInput, IVerifyOtpInput } from '@libs/types';

import { Service } from './service';


export class NestAuthService extends Service {

    apiPath = '';

    public tenantId = '1';


    login(request: ILoginInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/login', {
            ...request,
            // tenantId: this.tenantId,
        });
    }

    register(request: IRegisterInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/signup', request).then((resp) => {
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
