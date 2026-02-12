import { PermissionService as NestAuthPermissionService } from '@ackplus/nest-auth';
import { Injectable } from '@nestjs/common';

import {
    CreatePermissionDto,
    GetPermissionsQueryDto,
    UpdatePermissionDto,
} from './dto/permission.dto';

@Injectable()
export class PermissionService {
    constructor(private nestAuthPermissionService: NestAuthPermissionService) { }

    async getPermissions(query: GetPermissionsQueryDto) {
        const permissions = await this.nestAuthPermissionService.getPermissions(
            {
                search: query.search,
                category: query.category,
                guard: query.guard,
                limit: query.limit,
            },
        );

        return {
            items: permissions,
            total: permissions.length,
        };
    }

    async getPermissionById(id: string) {
        return this.nestAuthPermissionService.getPermissionById(id);
    }

    async getPermissionByName(name: string, guard?: string) {
        return this.nestAuthPermissionService.getPermissionByName(name, guard);
    }

    async getPermissionsByGuard(guard: string) {
        return this.nestAuthPermissionService.getPermissionsByGuard(guard);
    }

    async getCategories() {
        return this.nestAuthPermissionService.getCategories();
    }

    async getGuards() {
        return this.nestAuthPermissionService.getGuards();
    }

    async createPermission(data: CreatePermissionDto) {
        return this.nestAuthPermissionService.createPermission(data);
    }

    async createPermissions(permissions: CreatePermissionDto[]) {
        return this.nestAuthPermissionService.createPermissions(permissions);
    }

    async updatePermission(id: string, data: UpdatePermissionDto) {
        return this.nestAuthPermissionService.updatePermission(id, data);
    }

    async deletePermission(id: string) {
        return this.nestAuthPermissionService.deletePermission(id);
    }

    async searchPermissions(query: string, guard?: string, limit?: number) {
        return this.nestAuthPermissionService.searchPermissions(
            query,
            guard,
            limit,
        );
    }
}
