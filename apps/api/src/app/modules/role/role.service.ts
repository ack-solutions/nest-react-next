import { CrudService } from '@api/app/core/crud';
import { IRole } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';


@Injectable()
export class RoleService extends CrudService<IRole> {
    constructor(
    @InjectRepository(Role)
        repository: Repository<Role>
    ) {
        super(repository);
    }
}
