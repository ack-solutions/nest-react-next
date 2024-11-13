import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { IPermission } from '@libs/types';
import { CrudService } from '@libs/nest-core';

@Injectable()
export class PermissionService extends CrudService<IPermission> {
  constructor(
    @InjectRepository(Permission)
    repository: Repository<Permission>
  ) {
    super(repository);
  }
}
