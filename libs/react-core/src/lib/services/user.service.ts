
import { IUser } from "@libs/types";
import { toFormData } from "../utils";
import { CRUDService } from "./crud-service";


export class UserService extends CRUDService<any> {
  protected apiPath = 'user';
  protected override  hasFileUpload = true;

  getMe() {
    return this.instanceApi.get<any>(`${this.apiPath}/me`)
  }

  // updateProfile(request: Partial<IUser>) {
  //   return this.instanceApi.put<IUser>(`${this.apiPath}/update/profile`, toFormData(request));
  // }

  updateProfile(request: Partial<IUser>) {
    return this.instanceApi.put<IUser>(`${this.apiPath}/update/profile`, request).then((resp) => {
      return this.mapResponse(resp.data);
    })
  }

  tabCount() {
    return this.instanceApi.get(`${this.apiPath}/count`)
  }

  monthPresentDays() {
    return this.instanceApi.get(`${this.apiPath}/month-present-days`)
  }

  changePassword(request: any) {
    return this.instanceApi.post(`${this.apiPath }/change-password`, request).then((resp) => {
      return resp.data;
    })
  }

}
