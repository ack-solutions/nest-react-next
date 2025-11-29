import { RoleService as NestAuthRoleService, TenantService } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum, PermissionsEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IAppConfig } from '../config/app';
import { Seeder } from '@ackplus/nest-seeder';


@Injectable()
export class RoleSeeder implements Seeder {

    constructor(
        private nestAuthRoleService: NestAuthRoleService,
        private tenantService: TenantService,
        private configService: ConfigService,
    ) { }

    async seed() {
        const defaultTenantName = this.configService.get<IAppConfig>('app').defaultTenantName;

        const tenant = await this.tenantService.getTenantByDomain(defaultTenantName);

        if (!tenant) {
            throw new Error('Tenant not found');
        }


        const adminPermissions = [
            // Users
            PermissionsEnum.ACCESS_USERS,
            PermissionsEnum.CREATE_USERS,
            PermissionsEnum.UPDATE_USERS,
            PermissionsEnum.DELETE_USERS,
            PermissionsEnum.RESET_PASSWORD_USERS,

            // Reports
            PermissionsEnum.ACCESS_REPORTS,
            PermissionsEnum.EXPORT_REPORTS,

            // Roles
            PermissionsEnum.ACCESS_ROLES,
            PermissionsEnum.CREATE_ROLES,
            PermissionsEnum.UPDATE_ROLES,
            PermissionsEnum.ASSIGN_ROLES,
            PermissionsEnum.DELETE_ROLES,

            // Pages
            PermissionsEnum.ACCESS_PAGES,
            PermissionsEnum.CREATE_PAGES,
            PermissionsEnum.UPDATE_PAGES,
            PermissionsEnum.DELETE_PAGES,

            // Email Templates
            PermissionsEnum.ACCESS_EMAIL_TEMPLATES,
            PermissionsEnum.CREATE_EMAIL_TEMPLATES,
            PermissionsEnum.UPDATE_EMAIL_TEMPLATES,
            PermissionsEnum.DELETE_EMAIL_TEMPLATES,

            // Settings
            PermissionsEnum.ACCESS_SETTINGS,
            PermissionsEnum.UPDATE_SETTINGS,
        ];

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
        ];

        for (const role of organizationRoles) {
            try {
                await this.nestAuthRoleService.createRole(role.name, role.guardName, tenant.id, role.isSystemRole, role.permissions);
            } catch (_error) {
                // do nothing
            }
        }
    }

    async drop() {
        const roles = await this.nestAuthRoleService.getRoles();
        for (const role of roles) {
            if (role.isSystem) {
                await this.nestAuthRoleService.deleteSystemRole(role.id);
            } else {
                await this.nestAuthRoleService.deleteRole(role.id);
            }
        }
    }

}
