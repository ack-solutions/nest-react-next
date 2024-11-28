import { IPage } from '@libs/types';
import { CRUDService } from '@libs/react-core';

export class PageService extends CRUDService<IPage> {
    protected apiPath = 'page';
}
