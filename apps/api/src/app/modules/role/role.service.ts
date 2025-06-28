import { RoleService as NestAuthRoleService } from '@ackplus/nest-auth';
import { Role } from '@ackplus/nest-auth';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';


@Injectable()
export class RoleService {


    constructor(
        private readonly roleService: NestAuthRoleService,
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

    async getRoleByGuard(guard: string, request?: any) {
        const systemRoles = await this.roleService.getSystemRolesByGuard(guard);

        const constRoles = await this.roleService.getRolesByGuard(guard, 'default');

        return [...systemRoles, ...constRoles];
    }

    async createRole(body: CreateRoleDTO) {
        return this.roleService.createRole(body.name, body.guard, 'default', false, body.permissions);
    }

    async updateRole(id: string, body: UpdateRoleDTO) {
        return this.roleService.updateRole(id, body);
    }

    async deleteRole(id: string) {
        return this.roleService.deleteRole(id);
    }

}
