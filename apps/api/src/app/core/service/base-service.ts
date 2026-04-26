import { CrudService } from '@ackplus/nest-crud';
import { RoleNameEnum } from '@libs/types';
import { Repository } from 'typeorm';

import { AuthHelper } from '../auth/auth.helper';
import { CoreEntity } from '../typeorm/core.entity';


export class BaseService<T extends CoreEntity> extends CrudService<any> {

    protected fileFields = [];

    constructor(
        override readonly repository: Repository<T>,
    ) {
        super(repository);
    }

    protected isUserRole() {
        const payload = AuthHelper.getTokenPayload();
        return !payload?.roles?.some((role) => [RoleNameEnum.ADMIN, RoleNameEnum.SUPER_ADMIN].includes(role?.name as RoleNameEnum));
    }


    protected isSuperAdmin() {
        const payload = AuthHelper.getTokenPayload();
        return payload?.roles?.some((role) => role?.name === RoleNameEnum.SUPER_ADMIN);
    }

}
