import { ISetting } from '@libs/types';

import { CRUDService } from './crud-service';


export class SettingService extends CRUDService<ISetting> {

    protected apiPath = 'setting';

    updateSettings(request: any) {
        return this.instanceApi.post<any>(`${this.apiPath}/update-setting`, request).then(({ data }) => data);
    }

}
