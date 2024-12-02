
import { Repository } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { find, keyBy, uniqBy } from 'lodash';
import { Role } from '../role/role.entity';
import { IUser, RoleNameEnum, UserStatusEnum } from '@libs/types';
import { DataFactory, Seeder } from '@api/app/core/nest-seeder';
import { hashPassword } from '@api/app/utils';


@Injectable()
export class UserSeeder implements Seeder {
    constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    ) { }

    async seed({ dummyData }) {
        let users = [];

        const oldUsers = await this.userRepository.find();
        const userByEmail = keyBy(oldUsers, 'email')


        const roles = await this.roleRepository.find();
        const adminRole = find(roles, { name: RoleNameEnum.ADMIN });
        const userRole = find(roles, { name: RoleNameEnum.USER });

        const defaultUsers: IUser[] = [
            {
                firstName: 'Admin',
                lastName: 'Test',
                email: 'admin@gmail.com',
                roles: [adminRole],
                passwordHash: hashPassword('Test@123'),
                isSuperAdmin: true,
                status: UserStatusEnum.ACTIVE,
            },
            {
                firstName: 'Admin2',
                lastName: 'Test',
                email: 'admin2@gmail.com',
                roles: [adminRole],
                passwordHash: hashPassword('Test@123'),
                isSuperAdmin: false,
                status: UserStatusEnum.ACTIVE,
            },
            {
                firstName: 'User',
                lastName: 'Test',
                email: 'user@gmail.com',
                roles: [userRole],
                passwordHash: hashPassword('Test@123'),
                status: UserStatusEnum.ACTIVE,
            },
        ]

        users = defaultUsers?.map((user) => {
            const factoryUser = new User(DataFactory.createForClass(User).generate(1)[0]);
            return { ...factoryUser, ...user }
        })

        const dummyUsers = []
        if (dummyData) {
            const Users = await DataFactory.createForClass(User).generate(10)
            for (let index = 0; index < Users.length; index++) {
                const dummyUser: any = Users[index];
                dummyUser.passwordHash = hashPassword('Test@123');
                dummyUser.roles = [userRole];
                dummyUsers.push(new User(dummyUser));
            }
            users = uniqBy([...users, ...dummyUsers], (user) => user.email);
        }

        // Filter old user
        users = users.filter(({ email }) => {
            return !userByEmail[email];
        })
        return this.userRepository.save(users);
    }

    async drop() {
        return this.userRepository.query(`TRUNCATE TABLE "${this.userRepository.metadata.tableName}" CASCADE`);
    }
}