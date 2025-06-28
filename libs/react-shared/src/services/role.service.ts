import { IPaginationResult, IRole, IRoleGetInput } from '@libs/types';

import { CRUDService } from './crud-service';
import { instanceApi } from '../config';


export class RoleService extends CRUDService<IRole> {

    protected apiPath = 'role';

    getRoles(request: IRoleGetInput) {
        return instanceApi.get<IPaginationResult<IRole>>(`${this.apiPath}`, { params: request }).then((res) => res.data);
    }

    getRoleByGuard(guard: string, request?: IRoleGetInput) {
        return instanceApi.get<IRole[]>(`${this.apiPath}/${guard}`, { params: request }).then((res) => res.data);
    }

    getRoleById(id: string) {
        return instanceApi.get<IRole>(`${this.apiPath}/by-id/${id}`).then((res) => res.data);
    }

}
