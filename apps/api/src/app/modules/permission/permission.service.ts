import { IPermission } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Permission } from './permission.entity';
import { CrudService } from '../../core/crud';
import { Role } from '../role';


@Injectable()
export class PermissionService extends CrudService<IPermission> {

    constructor(
        @InjectRepository(Permission)
        repository: Repository<Permission>,
    ) {
        super(repository);
    }

    async beforeSave(entity: DeepPartial<any>, req): Promise<Permission> {
        if (entity?.roles) {
            entity.roles = req.roles.map((id) => {
                return new Role({ id });
            });
        }
        return entity as Permission;
    }

}
