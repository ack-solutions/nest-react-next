import { instanceApi, toFormData } from "@libs/utils";
import { CRUDService } from "./crud-service";


export class UserService extends CRUDService<any> {
  protected apiPath = 'user';
  // override  hasFileUpload = true;

  getMe() {
    return this.instanceApi.get<any>(`${this.apiPath}/me`)
  }

  updateProfile(request: any) {
    return instanceApi.put<any>('user/profile', toFormData(request));
  }

  tabCount() {
    return this.instanceApi.get(`${this.apiPath}/count`)
  }

  monthPresentDays() {
    return this.instanceApi.get(`${this.apiPath}/month-present-days`)
  }

  changePassword(request: any) {
    return this.instanceApi.post(`${this.apiPath }/change-password`, request);
  }

}
