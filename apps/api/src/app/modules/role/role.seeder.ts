import { Seeder } from '@api/app/core/nest-seeder';
import { RoleNameEnum } from '@libs/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keyBy } from 'lodash';
import { Repository } from 'typeorm';

import { Role } from './role.entity';


@Injectable()
export class RoleSeeder implements Seeder {
    constructor(
        @InjectRepository(Role)
        private repo: Repository<Role>,
    ) { }

    async seed() {

        const oldRoles = await this.repo.find();
        const roleByName = keyBy(oldRoles, 'name')

        const systemRoles = Object.values(RoleNameEnum).map((name) => {
            if (roleByName[name]) {
                return null;
            }
            return new Role({
                name: name,
                isSystemRole: true,
            },)
        }).filter(Boolean);

        await this.repo.save(systemRoles);
    }

    async drop() {
        return await this.repo.query(
            `TRUNCATE TABLE "${this.repo.metadata.tableName}" CASCADE`
        );
    }
}
