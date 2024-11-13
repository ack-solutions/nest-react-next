import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleNameEnum } from '@libs/types';
import { Seeder } from '@libs/nest-core';



@Injectable()
export class RoleSeeder implements Seeder {
  constructor(
    @InjectRepository(Role)
    private repo: Repository<Role>,
  ) { }

  async seed() {
    const adminRoles = [
      {
        name: RoleNameEnum.ADMIN,
        isSystemRole: true,
      },
    ]
    const organizationRoles = [
      {
        name: RoleNameEnum.MANGER,
        isSystemRole: true,
        // organizationId
      },
      {
        name: RoleNameEnum.CUSTOMER,
        isSystemRole: false,
        // organizationId
      },
    ]
    let roles: any = [...adminRoles, ...organizationRoles]
    roles = roles?.map((role) => new Role(role))
    await this.repo.save(roles);
  }

  async drop() {
    return await this.repo.query(
      `TRUNCATE TABLE "${this.repo.metadata.tableName}" CASCADE`
    );
  }
}
