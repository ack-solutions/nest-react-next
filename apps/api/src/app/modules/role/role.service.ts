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

    async getRoles(options?: FindManyOptions<NestAuthRole>) {
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
        // const systemRoles = await this.roleService.getSystemRolesByGuard(guard, query);
        // console.log(systemRoles);

        const constRoles = await this.roleService.getRolesByGuard(guard, null, query);
        const tenantRoles = await this.roleService.getRolesByTenant(null, false, query);
        console.log(constRoles, tenantRoles);
        return [...constRoles, ...tenantRoles];
    }

    async createRole(body: CreateRoleDTO) {
        console.log(body);
        return this.roleService.createRole(body.name, body.guard, null, false, body.permissions);
    }

    async updateRole(id: string, body: UpdateRoleDTO) {
        return this.roleService.updateRole(id, body);
    }

    async deleteRole(id: string) {
        return this.roleService.deleteRole(id);
    }

}
