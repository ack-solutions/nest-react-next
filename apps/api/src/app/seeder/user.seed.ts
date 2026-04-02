import { NestAuthRole, NestAuthUser, TenantService, UserService } from '@ackplus/nest-auth';
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
    ) { }

    async seed() {
        const existingUser = await this.userRepository.find({
            relations: ['authUser'],
        });

        const roles = await NestAuthRole.find({
            where: {
                guard: RoleGuardEnum.ADMIN,
            },
        });
        this.existingUserByEmail = keyBy(existingUser, 'authUser.email');

        const portalUsers = [
            {
                firstName: 'Chetan',
                lastName: 'Khandla',
                email: 'chetan@ackplus.com',
                password: 'Admin@123',
                isSuperUser: true,
                roles: [RoleNameEnum.SUPER_ADMIN],
            },
            {
                firstName: 'Ajay',
                lastName: 'Khandla',
                email: 'ajay@ackplus.com',
                password: 'Admin@123',
                isSuperUser: true,
                roles: [RoleNameEnum.ADMIN],
            },
            {
                firstName: 'Kishan',
                lastName: 'Khandla',
                email: 'kishan.ackplus@gmail.com',
                password: 'Admin@123',
                roles: [RoleNameEnum.ADMIN],
            },
            {
                firstName: 'Manager',
                lastName: 'Ack',
                email: 'manager@gmail.com',
                password: 'Admin@123',
                roles: [RoleNameEnum.MANAGER],
            },
        ];

        await this.createUser(portalUsers, roles, RoleGuardEnum.ADMIN);
    }
    async createUser(users: any[], roles: NestAuthRole[], guard: RoleGuardEnum) {
        const roleByName = keyBy(roles, 'name');

        for (let index = 0; index < users.length; index++) {
            const user = users[index];

            if (this.existingUserByEmail[user.email]) {
                continue;
            }

            let authUser;
            try {
                authUser = await this.userService.createUser({
                    email: user.email,
                });
            } catch (_error) {
                authUser = await this.userService.getUserByEmail(user.email, user.tenantId);
            }

            const rolesIds = user.roles.map((role: string) => roleByName[role]?.id);
            await authUser.setPassword(user.password);
            await authUser.assignRoles(rolesIds, guard);
            await authUser.findOrCreateIdentity('email', user.email);
            await authUser.save();

            const userData = this.userRepository.create({
                ...user,
                authUserId: authUser.id,
            });

            await this.userRepository.insert(userData);
        }
    }

    async drop() {
        await User.getRepository().query(
            `TRUNCATE TABLE "${User.getRepository().metadata.tableName}" CASCADE`,
        );
        await NestAuthUser.getRepository().query(
            `TRUNCATE TABLE "${NestAuthUser.getRepository().metadata.tableName}" CASCADE`,
        );
    }

}
