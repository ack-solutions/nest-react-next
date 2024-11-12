import { instanceApi, toFormData } from "@mlm/utils";
import { CRUDService } from "./crud-service";


export class PermissionService extends CRUDService<any> {
  protected apiPath = 'permission';

}
