import { ILoginInput, ILoginSuccess } from "@mlm/types";
import { Service } from "./service";
export class AuthService extends Service {

    getToken() {
        return localStorage.getItem('token');
    }


    sendLoginOtp(request?: any) {
        return this.instanceApi.post(`auth/send-login-otp`, request);
    }

    sendRegisterOtp(request?: any) {
        return this.instanceApi.post(`auth/send-register-otp`, request);
    }

    login(request: ILoginInput) {
        return this.instanceApi.post<ILoginSuccess>('auth/login', request)
    }

    register(request: any) {
        return this.instanceApi.post<ILoginSuccess>('auth/register', request)
    }


    forgotPassword(request: any) {
        return this.instanceApi.post('auth/forget_pass', request)
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
        return this.instanceApi.post(`auth/otp/verify`, request)
    }



    resetPassword(request?: any) {
        return this.instanceApi.post(`auth/reset-password`, request);
    }
}
