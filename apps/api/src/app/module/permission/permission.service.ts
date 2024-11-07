import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { IPermission } from '@mlm/types';
import { CrudService } from '@mlm/nest-core';

@Injectable()
export class PermissionService extends CrudService<IPermission> {
  constructor(
    @InjectRepository(Permission)
    repository: Repository<Permission>
  ) {
    super(repository);
  }
}
