import { RoleService as NestAuthRoleService, TenantService as NestAuthTenantService } from '@ackplus/nest-auth';
import { Role } from '@ackplus/nest-auth';
import { IAppConfig } from '@api/app/config/app';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindManyOptions } from 'typeorm';

import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';


@Injectable()
export class RoleService {


    constructor(
        private readonly roleService: NestAuthRoleService,
        private readonly configService: ConfigService,
        private readonly tenantService: NestAuthTenantService,
    ) {
    }

    async getRoles(options?: FindManyOptions<Role>) {
        return this.roleService.getRoles(options);
    }

    async getRoleById(id: string) {
        const role = await this.roleService.getRoleById(id);
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async getRoleByGuard(guard: string, query) {
        const defaultTenantName = this.configService.get<IAppConfig>('app').defaultTenantName;
        const tenant = await this.tenantService.getTenantByDomain(defaultTenantName);

        const systemRoles = await this.roleService.getSystemRolesByGuard(guard, query);

        const constRoles = await this.roleService.getRolesByGuard(guard, tenant.id, query);

        return [...systemRoles, ...constRoles];
    }

    async createRole(body: CreateRoleDTO) {
        const defaultTenantName = this.configService.get<IAppConfig>('app').defaultTenantName;
        const tenant = await this.tenantService.getTenantByDomain(defaultTenantName);

        return this.roleService.createRole(body.name, body.guard, tenant.id, false, body.permissions);
    }

    async updateRole(id: string, body: UpdateRoleDTO) {
        return this.roleService.updateRole(id, body);
    }

    async deleteRole(id: string) {
        return this.roleService.deleteRole(id);
    }

}
