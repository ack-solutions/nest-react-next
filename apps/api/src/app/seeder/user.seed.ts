import { TenantService, UserService } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';

import { BaseRepository } from '../core/typeorm/base-repository';
import { Seeder } from '../libs/nest-seeder';
import { User } from '../modules/user/user.entity';


@Injectable()
export class UserSeeder implements Seeder {

    existingUserByEmail: any;

    constructor(
        private userService: UserService,
        @InjectRepository(User)
        private userRepository: BaseRepository<User>,

        private tenantService: TenantService,
    ) { }

    async seed() {
        const existingUser = await this.userRepository.find();
        await User.loadAuthUser(existingUser);
        this.existingUserByEmail = keyBy(existingUser, 'authUser.email');

        let tenant;
        try {
            tenant = await this.tenantService.createTenant({
                name: 'Default',
                domain: 'default',
            });
        } catch (_error) {
            tenant = await this.tenantService.getTenantByDomain('default');
        }

        const portalUsers = [
            {
                firstName: 'Chetan',
                lastName: 'Khandla',
                email: 'chetan@ackplus.com',
                password: 'Admin@123',
                isSuperUser: true,
                roles: [RoleNameEnum.SUPER_ADMIN],
                tenantId: tenant.id,
            },
            {
                firstName: 'Ajay',
                lastName: 'Khandla',
                email: 'ajay@ackplus.com',
                password: 'Admin@123',
                isSuperUser: true,
                roles: [RoleNameEnum.ADMIN],
                tenantId: tenant.id,
            },
            {
                firstName: 'Kishan',
                lastName: 'Khandla',
                email: 'kishan.ackplus@gmail.com',
                password: 'Admin@123',
                roles: [RoleNameEnum.ADMIN],
                tenantId: tenant.id,
            },
            {
                firstName: 'Manager',
                lastName: 'Ack',
                email: 'manager@gmail.com',
                password: 'Admin@123',
                roles: [RoleNameEnum.MANAGER],
                tenantId: tenant.id,
            },
        ];

        await this.createUser(portalUsers, RoleGuardEnum.ADMIN);
    }
    async createUser(users: any[], guard: RoleGuardEnum) {
        for (let index = 0; index < users.length; index++) {
            const user = users[index];

            if (this.existingUserByEmail[user.email]) {
                continue;
            }

            let authUser;
            try {
                authUser = await this.userService.createUser({
                    email: user.email,
                    tenantId: user.tenantId,
                });
            } catch (_error) {
                authUser = await this.userService.getUserByEmail(user.email);
            }

            await authUser.setPassword(user.password);
            await authUser.assignRoles(user.roles, guard);
            await authUser.findOrCreateIdentity('email', user.email);
            await authUser.save();

            const userData = this.userRepository.create({
                ...user,
                authUserId: authUser.id,
            });

            await this.userRepository.insert(userData);
        }
    }

    drop() {
        return this.userRepository.query(
            `TRUNCATE TABLE "${this.userRepository.metadata.tableName}" CASCADE`,
        );
    }

}
