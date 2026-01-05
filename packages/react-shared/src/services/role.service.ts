import { IPaginationResult, IRole, IRoleGetInput, ISuccessResponse } from '@libs/types';

import { CRUDService } from './crud-service';
import { instanceApi } from '../config';
import { Service } from './service';


export class RoleService extends Service {

    protected apiPath = 'role';

    getRoles(request: IRoleGetInput) {
        return instanceApi.get<IRole[]>(`${this.apiPath}`, { params: request }).then((res) => res.data);
    }

    getRoleByGuard(guard: string, request?: IRoleGetInput) {
        return instanceApi.get<IRole[]>(`${this.apiPath}/${guard}`, { params: request }).then((res) => res.data);
    }

    getRoleById(id: string) {
        return instanceApi.get<IRole>(`${this.apiPath}/by-id/${id}`).then((res) => res.data);
    }

    create(role: Partial<IRole>) {
        return instanceApi.post<IRole>(`${this.apiPath}`, role).then((res) => res.data);
    }

    update(id: string, role: Partial<IRole>) {
        return instanceApi.put<IRole>(`${this.apiPath}/${id}`, role).then((res) => res.data);
    }

    delete(id: string) {
        return instanceApi.delete<ISuccessResponse>(`${this.apiPath}/${id}`).then((res) => res.data);
    }

}
