import { IChangeEmailInput, IChangePhoneNumberInput, IDeleteAccountInput, ISetPasswordInput, IUser } from '@libs/types';

import { CRUDService } from './crud-service';


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

}
