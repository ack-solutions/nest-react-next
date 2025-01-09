import { ISetting } from '@libs/types';

import { CRUDService } from './crud-service';
import { instanceApi } from '../utils';


export class SettingService extends CRUDService<ISetting> {

    protected apiPath = 'setting';


    updateSetting(request: Partial<ISetting>) {
        request = this.mapRequest(request);
        return instanceApi.post<ISetting>(`${this.apiPath}/setting`, request).then((resp) => {
            return this.mapResponse(resp.data);
        });
    }

    getPublicSettings() {
        return this.instanceApi.get(`${this.apiPath}/public`).then((resp) => {
            return resp.data;
        });
    }

}
