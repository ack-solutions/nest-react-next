import { NestAuthPermission, PermissionService as NestAuthPermissionService } from '@ackplus/nest-auth';
import { RoleGuardEnum, PermissionsEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';

import { Seeder } from '@ackplus/nest-seeder';


@Injectable()
export class PermissionSeeder implements Seeder {

    constructor(
        private nestAuthPermissionService: NestAuthPermissionService,
    ) { }

    async seed() {
        const permissions: { category: string, permissions: string[] }[] = [
            {
                category: 'Users',
                permissions: [
                    PermissionsEnum.ACCESS_USERS,
                    PermissionsEnum.CREATE_USERS,
                    PermissionsEnum.UPDATE_USERS,
                    PermissionsEnum.DELETE_USERS,
                    PermissionsEnum.RESET_PASSWORD_USERS,
                ],
            },
            {
                category: 'Reports',
                permissions: [
                    PermissionsEnum.ACCESS_REPORTS,
                    PermissionsEnum.EXPORT_REPORTS,
                ],
            },
            {
                category: 'Roles',
                permissions: [
                    PermissionsEnum.ACCESS_ROLES,
                    PermissionsEnum.CREATE_ROLES,
                    PermissionsEnum.UPDATE_ROLES,
                    PermissionsEnum.ASSIGN_ROLES,
                    PermissionsEnum.DELETE_ROLES,
                ],
            },
            {
                category: 'Pages',
                permissions: [
                    PermissionsEnum.ACCESS_PAGES,
                    PermissionsEnum.CREATE_PAGES,
                    PermissionsEnum.UPDATE_PAGES,
                    PermissionsEnum.DELETE_PAGES,
                ],
            },
            {
                category: 'Email Templates',
                permissions: [
                    PermissionsEnum.ACCESS_EMAIL_TEMPLATES,
                    PermissionsEnum.CREATE_EMAIL_TEMPLATES,
                    PermissionsEnum.UPDATE_EMAIL_TEMPLATES,
                    PermissionsEnum.DELETE_EMAIL_TEMPLATES,
                    PermissionsEnum.ACCESS_TEMPLATES,
                    PermissionsEnum.CREATE_TEMPLATES,
                    PermissionsEnum.UPDATE_TEMPLATES,
                    PermissionsEnum.DELETE_TEMPLATES,
                    PermissionsEnum.ACCESS_TEMPLATE_LAYOUTS,
                    PermissionsEnum.CREATE_TEMPLATE_LAYOUTS,
                    PermissionsEnum.UPDATE_TEMPLATE_LAYOUTS,
                    PermissionsEnum.DELETE_TEMPLATE_LAYOUTS,
                ],
            },
            {
                category: 'Settings',
                permissions: [
                    PermissionsEnum.ACCESS_SETTINGS,
                    PermissionsEnum.UPDATE_SETTINGS,
                ],
            },
        ];

        const flatPermissions: {
            name: string;
            description?: string;
            category?: string;
            metadata?: Record<string, any>;
        }[] = permissions.flatMap(({ permissions, category }) => permissions.map((permission) => ({
            name: permission,
            category,
            guard: RoleGuardEnum.ADMIN,
        })));

        await this.nestAuthPermissionService.createPermissions(flatPermissions);

    }

    async drop() {
        return NestAuthPermission.getRepository().query(
            `TRUNCATE TABLE "${NestAuthPermission.getRepository().metadata.tableName}" CASCADE`,
        );
    }

}
