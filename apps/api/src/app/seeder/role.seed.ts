import { RoleService as NestAuthRoleService } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';

import { Seeder } from '../libs/nest-seeder';


@Injectable()
export class RoleSeeder implements Seeder {

    constructor(
        private nestAuthRoleService: NestAuthRoleService,
    ) { }

    async seed() {
        const organizationRoles = [
            {
                name: RoleNameEnum.SUPER_ADMIN,
                isSystemRole: true,
                guardName: RoleGuardEnum.ADMIN,
            },
            {
                name: RoleNameEnum.ADMIN,
                isSystemRole: true,
                guardName: RoleGuardEnum.ADMIN,
            },
            {
                name: RoleNameEnum.MANGER,
                isSystemRole: false,
                organization: 'default',
                guardName: RoleGuardEnum.ADMIN,
            },
        ];

        for (const role of organizationRoles) {
            try {
                await this.nestAuthRoleService.createRole(role.name, role.guardName, 'default', role.isSystemRole, []);
            } catch (error) {
                console.log('Role error', error);
            }
        }
    }

    async drop() {
        const roles = await this.nestAuthRoleService.getRoles();
        for (const role of roles) {
            await this.nestAuthRoleService.deleteRole(role.id);
        }
    }

}
