import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { IRole } from '@mlm/types';
import { CrudService } from '@mlm/nest-core';


@Injectable()
export class RoleService extends CrudService<IRole> {
  constructor(
    @InjectRepository(Role)
    repository: Repository<Role>
  ) {
    super(repository);
  }
}
