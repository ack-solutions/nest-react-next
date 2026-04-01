import { IForgotPasswordInput, ILoginInput, ILoginSuccess, IMfaStatus, IRegisterInput, IResetPasswordWithTokenInput, IResetPasswordWithTokenResponse, IVerifyForgotPasswordOtpInput, IVerifyOtpInput } from '@libs/types';

import { Service } from './service';


export class NestAuthService extends Service {

    apiPath = '';

    login(request: ILoginInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/login', {
            ...request,
        });
    }

    register(request: IRegisterInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/signup', request).then((resp) => {
            return resp.data;
        });
    }

    forgotPassword(request: IForgotPasswordInput) {
        return this.instanceApi.post('auth/forgot-password', request);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.clear();
    }

    verifyOtp(request: IVerifyOtpInput) {
        return this.instanceApi.post('auth/verify-otp', request);
    }

    verifyForgotPasswordOtp(request: IVerifyForgotPasswordOtpInput) {
        return this.instanceApi.post('auth/verify-forgot-password-otp', request);
    }

    resetPassword(request?: any) {
        return this.instanceApi.post('auth/reset-password', request);
    }

    resetPasswordWithToken(request?: IResetPasswordWithTokenInput) {
        return this.instanceApi.post<IResetPasswordWithTokenResponse>('auth/reset-password-with-token', request);
    }

    getMfaStatus() {
        return this.instanceApi.get<IMfaStatus>('auth/mfa/status');
    }

}
