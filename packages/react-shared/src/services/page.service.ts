import { IPage } from '@libs/types';

import { CRUDService } from './crud-service';


export class PageService extends CRUDService<IPage> {

    protected apiPath = 'page';

    getPageBySlug(slug) {
        return this.instanceApi.get<IPage>(`${this.apiPath}/slug-or-id/${slug}`).then((resp) => {
            return resp?.data;
        });
    }

}
