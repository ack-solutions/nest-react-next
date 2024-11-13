
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { capitalize, find } from 'lodash';
import { Role } from '../role/role.entity';
import { RoleNameEnum } from '@libs/types';
import { Seeder } from '@libs/nest-core';



@Injectable()
export class PermissionSeeder implements Seeder {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async seed() {

    await this.permissionRepository.query(`TRUNCATE TABLE "${this.permissionRepository.metadata.tableName}" CASCADE`);

    const roles = await this.roleRepository.find();
    const adminRole = find(roles, { name: RoleNameEnum.ADMIN });

    // Super Admin Permissions
    const permissions = [
      ...generateCrudPermissions('user', [adminRole]),
      ...generateCrudPermissions('role', [adminRole]),
      ...generateCrudPermissions('permissions', [adminRole]),
    ];

    return await this.permissionRepository.save(permissions);
  }

  async drop() {
    return await this.permissionRepository.query(`TRUNCATE TABLE "${this.permissionRepository.metadata.tableName}" CASCADE`);
  }
}

function generateCrudPermissions(name, roles = [], createOnly: Array<'list' | 'show' | 'update' | 'delete'> = []) {
  const permissionsNames = [
    `${name} list`,
    `${name} create`,
    `${name} show`,
    `${name} update`,
    `${name} delete`,
    // `${name} reorder`,
    // `${name} trash delete`,
    // `${name} trash restore`,
  ];

  const permissions = permissionsNames.map((name) => {
    if (createOnly?.length > 0 && createOnly.filter((item) => name.endsWith(item))?.length >= 0) {
      return;
    }
    return new Permission({ name, roles: roles })
  }).filter((item) => item)

  return permissions;
}