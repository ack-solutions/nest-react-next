import { NestAuthRole, RoleService as NestAuthRoleService } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum, PermissionsEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';

import { IAppConfig } from '../config/app';
import { Seeder } from '@ackplus/nest-seeder';


@Injectable()
export class RoleSeeder implements Seeder {

    constructor(
        private nestAuthRoleService: NestAuthRoleService,
    ) { }

    async seed() {
        const adminPermissions = Object.values(PermissionsEnum);


        const organizationRoles = [
            {
                name: RoleNameEnum.SUPER_ADMIN,
                isSystemRole: true,
                guardName: RoleGuardEnum.ADMIN,
                permissions: adminPermissions,
            },
            {
                name: RoleNameEnum.ADMIN,
                isSystemRole: true,
                guardName: RoleGuardEnum.ADMIN,
                permissions: adminPermissions,
            },
            {
                name: RoleNameEnum.MANAGER,
                isSystemRole: false,
                guardName: RoleGuardEnum.ADMIN,
                permissions: [PermissionsEnum.ACCESS_USERS, PermissionsEnum.ACCESS_REPORTS],
            },
            {
                name: RoleNameEnum.USER,
                isSystemRole: true,
                guardName: RoleGuardEnum.WEB,
                permissions: [],
            },
        ];


        for (const role of organizationRoles) {
            try {
                await this.nestAuthRoleService.createRole(role.name, role.guardName, null, role.isSystemRole, role.permissions);
            } catch (_error) {
                // do nothing
            }
        }
    }

    async drop() {
        return NestAuthRole.getRepository().query(
            `TRUNCATE TABLE "${NestAuthRole.getRepository().metadata.tableName}" CASCADE`,
        );
    }

}
