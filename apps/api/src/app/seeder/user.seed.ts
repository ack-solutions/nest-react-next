import { TenantService, UserService } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';

import { IAppConfig } from '../config/app';
import { BaseRepository } from '../core/typeorm/base-repository';
import { Seeder } from '@ackplus/nest-seeder';
import { User } from '../modules/user/user.entity';


@Injectable()
export class UserSeeder implements Seeder {

    existingUserByEmail: any;

    constructor(
        private userService: UserService,
        @InjectRepository(User)
        private userRepository: BaseRepository<User>,

        private tenantService: TenantService,

        private configService: ConfigService,
    ) { }

    async seed() {
        const existingUser = await this.userRepository.find({
            relations: ['authUser', 'authUser.roles'],
        });
        this.existingUserByEmail = keyBy(existingUser, 'authUser.email');

        const defaultTenantName = this.configService.get<IAppConfig>('app').defaultTenantName;

        const tenant = await this.tenantService.getTenantByDomain(defaultTenantName);
        if (!tenant) {
            throw new Error('Tenant not found');
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
                authUser = await this.userService.getUserByEmail(user.email, user.tenantId);
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
