import { instanceApi, toFormData } from "@libs/utils";
import { CRUDService } from "./crud-service";


export class RoleService extends CRUDService<any> {
  protected apiPath = 'role';

}
