import { IChangeEmailInput, IChangePhoneNumberInput, IDeleteAccountInput, IMfaDevice, ISetPasswordInput, IUser } from '@libs/types';

import { CRUDService } from './crud-service';


export interface ICanToggleMfaResponse {
    access: boolean;
    avaibleMethods: string[];
}

export class UserService extends CRUDService<any> {

    protected apiPath = 'user';


    getMe() {
        return this.instanceApi
            .get<any>(`${this.apiPath}/me`)
            .then(({ data }) => {
                return data;
            });
    }


    updateProfile(request: Partial<IUser>) {
        return this.instanceApi
            .put<IUser>(`${this.apiPath}/update/profile`, request)
            .then((resp) => {
                return this.mapResponse(resp.data);
            });
    }

    tabCount() {
        return this.instanceApi.get(`${this.apiPath}/count`);
    }

    monthPresentDays() {
        return this.instanceApi.get(`${this.apiPath}/month-present-days`);
    }

    changePassword(request: any) {
        return this.instanceApi
            .post(`${this.apiPath}/change-password`, request)
            .then((resp) => {
                return resp.data;
            });
    }

    setPassword(userId: string, request: ISetPasswordInput) {
        return this.instanceApi
            .put(`${this.apiPath}/set-password/${userId}`, request)
            .then((resp) => {
                return resp.data;
            });
    }

    changeEmail(request: IChangeEmailInput) {
        return this.instanceApi.post(`${this.apiPath}/change-email`, request).then(({ data }) => data);
    }

    changePhone(request: IChangePhoneNumberInput) {
        return this.instanceApi.post(`${this.apiPath}/change-phone`, request).then(({ data }) => data);
    }

    deleteAccount(request: IDeleteAccountInput) {
        return this.instanceApi.delete(`${this.apiPath}/delete-account`, { data: request }).then(({ data }) => data);
    }

    // MFA Management Methods (Admin)

    /**
     * Check if MFA can be toggled for users
     */
    canToggleMfa(): Promise<ICanToggleMfaResponse> {
        return this.instanceApi
            .get<ICanToggleMfaResponse>(`${this.apiPath}/can-toggle-mfa`)
            .then(({ data }) => data);
    }

    /**
     * Toggle MFA for a specific user (Admin)
     */
    toggleMfa(userId: string, enable: boolean): Promise<{ message: string }> {
        return this.instanceApi
            .put<{ message: string }>(`${this.apiPath}/toggle-mfa/${userId}`, { enable })
            .then(({ data }) => data);
    }

    /**
     * Get MFA/TOTP devices for a specific user (Admin)
     */
    getMfaDevices(userId: string): Promise<IMfaDevice[]> {
        return this.instanceApi
            .get<IMfaDevice[]>(`${this.apiPath}/mfa-devices/${userId}`)
            .then(({ data }) => data);
    }

    /**
     * Remove a specific MFA device (Admin)
     */
    removeMfaDevice(deviceId: string): Promise<{ message: string }> {
        return this.instanceApi
            .delete<{ message: string }>(`${this.apiPath}/mfa-devices/${deviceId}`)
            .then(({ data }) => data);
    }

}
