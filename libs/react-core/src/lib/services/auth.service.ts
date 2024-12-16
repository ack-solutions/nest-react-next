import { ILoginInput, ILoginSuccess } from "@libs/types";

import { Service } from "./service";


export class AuthService extends Service {

    getToken() {
        return localStorage.getItem('token');
    }


    sendLoginOtp(request?: any) {
        return this.instanceApi.post(`auth/send-login-otp`, request).then((resp) => {
            return resp.data;
        });
    }

    sendRegisterOtp(request?: any) {
        return this.instanceApi.post(`auth/send-register-otp`, request).then((resp) => {
            return resp.data;
        });
    }

    login(request: ILoginInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/login', request).then((resp) => {
            return resp.data;
        })
    }

    register(request: any) {
        return this.instanceApi.post<ILoginSuccess>('auth/register', request).then((resp) => {
            return resp.data;
        })
    }


    forgotPassword(request: any) {
        return this.instanceApi.post('auth/forget_pass', request).then((resp) => {
            return resp.data;
        })
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.clear();
    }

    sendOtp(request?: any) {
        return this.instanceApi.post('auth/otp', request).then((resp) => {
            return resp
        })
    }

    verifyOtp(request: any) {
        return this.instanceApi.post(`auth/otp/verify`, request).then((resp) => {
            return resp.data;
        })
    }



    resetPassword(request?: any) {
        return this.instanceApi.post(`auth/reset-password`, request).then((resp) => {
            return resp.data;
        });
    }
}
