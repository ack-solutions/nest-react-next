import { instanceApi, toFormData } from "@libs/utils";
import { CRUDService } from "./crud-service";


export class PermissionService extends CRUDService<any> {
  protected apiPath = 'permission';

}
