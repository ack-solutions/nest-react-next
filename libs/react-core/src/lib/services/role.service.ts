import { CRUDService } from "./crud-service";


export class RoleService extends CRUDService<any> {
  protected apiPath = 'role';

}
