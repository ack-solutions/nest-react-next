import { IPage } from "@libs/types";
import { CRUDService } from "./crud-service";

export class PageService extends CRUDService<IPage> {
    protected apiPath = 'page';

}
