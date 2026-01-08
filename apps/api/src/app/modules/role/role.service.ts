import { RoleService as NestAuthRoleService } from '@ackplus/nest-auth';
import { NestAuthRole } from '@ackplus/nest-auth';
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
    ) {
    }

    async getAllRoles(options?: {
        guard?: string; tenantId?: string; onlyTenantRoles?: boolean; onlySystemRoles?: boolean;
    }) {
        return this.roleService.getRoles(options);
    }

    async getRoleById(id: string) {
        const role = await this.roleService.getRoleById(id);
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async getRoleByGuard(guard: string) {
        const constRoles = await this.roleService.getRoles({ guard: guard });
        return constRoles;
    }

    async createRole(body: CreateRoleDTO) {
        return this.roleService.createRole(body.name, body.guard, null, false, body.permissions);
    }

    async updateRole(id: string, body: UpdateRoleDTO) {
        return this.roleService.updateRole(id, body);
    }

    async deleteRole(id: string) {
        return this.roleService.deleteRole(id);
    }

}
