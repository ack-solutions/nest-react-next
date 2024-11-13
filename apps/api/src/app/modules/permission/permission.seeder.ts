
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { find } from 'lodash';
import { Role } from '../role/role.entity';
import { RoleNameEnum } from '@libs/types';
import { Seeder } from '../../core/nest-seeder';

type Action = 'list' | 'create' | 'show' | 'update' | 'delete' | 'reorder' | 'trash delete' | 'trash restore';

// Define the permissions for a single entity
interface EntityPermission {
  entity: string;  // The name of the entity, e.g., 'user', 'role', etc.
  actions?: Action[];  // Optional array of actions for the entity
}

// Define the permissions map for each role
type RolePermissionsMap = {
  [role in RoleNameEnum]?: EntityPermission[];
};

@Injectable()
export class PermissionSeeder implements Seeder {

  defaultActions = ['list', 'create', 'show', 'update', 'delete', 'trash-delete', 'trash-restore'];

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) { }

  async seed() {
    // Remove Old Permissions 
    await this.drop()

    const roles = await this.roleRepository.find();

    const rolePermissions: RolePermissionsMap = {
      [RoleNameEnum.ADMIN]: [
        { entity: 'user' },
        { entity: 'role' },
        { entity: 'permissions' },
      ],
      // Additional roles can be added here
    };

    const permissions = [];
    for (const [roleName, entities] of Object.entries(rolePermissions)) {
      const role = find(roles, { name: roleName });
      if (role) {
        for (const { entity, actions } of entities) {
          const entityActions = actions ?? this.defaultActions;
          permissions.push(...this.generatePermissionsForEntity(entity, entityActions, [role]));
        }
      }
    }

    return await this.permissionRepository.save(permissions);
  }

  async drop() {
    return await this.permissionRepository.query(`TRUNCATE TABLE "${this.permissionRepository.metadata.tableName}" CASCADE`);
  }

  private generatePermissionsForEntity(entity: string, actions: string[], roles: Role[]): Permission[] {
    return actions.map((action) => {
      const permissionName = `${entity} ${action}`;
      return new Permission({ name: permissionName, roles });
    });
  }
}

